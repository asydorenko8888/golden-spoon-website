const http = require("http");
const crypto = require("crypto");

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      })
      .on("error", reject);
  });
}

function decodeFrame(buf) {
  if (buf.length < 2) return null;
  const masked = buf[1] & 0x80;
  let len = buf[1] & 0x7f;
  let off = 2;
  if (len === 126) {
    if (buf.length < 4) return null;
    len = buf.readUInt16BE(2);
    off = 4;
  } else if (len === 127) {
    if (buf.length < 10) return null;
    len = Number(buf.readBigUInt64BE(2));
    off = 10;
  }
  let mask;
  if (masked) {
    if (buf.length < off + 4) return null;
    mask = buf.slice(off, off + 4);
    off += 4;
  }
  if (buf.length < off + len) return null;
  let payload = buf.slice(off, off + len);
  if (mask) {
    payload = Buffer.from(payload);
    for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];
  }
  return { opcode: buf[0] & 0x0f, payload, rest: buf.slice(off + len) };
}

function encodeFrame(data) {
  const payload = Buffer.from(data);
  const mask = crypto.randomBytes(4);
  const header = Buffer.alloc(payload.length < 126 ? 6 : 8);
  header[0] = 0x81;
  if (payload.length < 126) {
    header[1] = 0x80 | payload.length;
    mask.copy(header, 2);
  } else {
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
    mask.copy(header, 4);
  }
  const body = Buffer.from(payload);
  for (let i = 0; i < body.length; i++) body[i] ^= mask[i % 4];
  return Buffer.concat([header, body]);
}

function wsConnect(wsUrl) {
  return new Promise((resolve, reject) => {
    const u = new URL(wsUrl);
    const key = crypto.randomBytes(16).toString("base64");
    const req = http.request({
      host: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
        "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Key": key,
      },
    });
    req.on("upgrade", (res, socket) => {
      let buf = Buffer.alloc(0);
      let id = 0;
      const pending = new Map();
      socket.on("data", (chunk) => {
        buf = Buffer.concat([buf, chunk]);
        while (true) {
          const frame = decodeFrame(buf);
          if (!frame) break;
          buf = frame.rest;
          if (frame.opcode === 1) {
            const msg = JSON.parse(frame.payload.toString());
            if (msg.id && pending.has(msg.id)) {
              pending.get(msg.id)(msg);
              pending.delete(msg.id);
            }
          }
        }
      });
      function call(method, params = {}) {
        return new Promise((res) => {
          const mid = ++id;
          pending.set(mid, res);
          socket.write(encodeFrame(JSON.stringify({ id: mid, method, params })));
        });
      }
      resolve({ call });
    });
    req.on("error", reject);
    req.end();
  });
}

(async () => {
  const tabs = JSON.parse(await httpGet("http://127.0.0.1:9224/json"));
  const { call } = await wsConnect(tabs[0].webSocketDebuggerUrl);
  await call("Page.enable");
  await call("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: 1440,
    screenHeight: 900,
  });
  await call("Page.navigate", { url: "http://localhost:3000/?v=expfit1" });
  await new Promise((r) => setTimeout(r, 2500));
  await call("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: 1440,
    screenHeight: 900,
  });
  await new Promise((r) => setTimeout(r, 800));
  const ev = await call("Runtime.evaluate", {
    expression: `(() => {
      const expH = [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Experience');
      const sec = expH.closest('section');
      window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY);
      const header = document.querySelector('[data-measure=header]');
      const img = sec.querySelector('[data-image-slot=home-experience]');
      const next = sec.nextElementSibling;
      const sb = sec.getBoundingClientRect();
      const hb = header.getBoundingClientRect();
      const ib = img.getBoundingClientRect();
      const nb = next ? next.getBoundingClientRect() : null;
      return JSON.stringify({
        inner: [window.innerWidth, window.innerHeight],
        headerH: hb.height,
        expH: sb.height,
        expected: window.innerHeight - hb.height,
        imgTopBelowHeader: ib.top - hb.bottom,
        imgBottom: ib.bottom,
        expBottom: sb.bottom,
        nextVisible: nb ? Math.max(0, Math.min(nb.bottom, window.innerHeight) - Math.max(nb.top, 0)) : 0,
        links: [...sec.querySelectorAll('a')].length,
        featureIcons: [...sec.querySelectorAll('svg')].length,
      });
    })()`,
    returnByValue: true,
  });
  console.log(JSON.parse(ev.result.result.value));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
