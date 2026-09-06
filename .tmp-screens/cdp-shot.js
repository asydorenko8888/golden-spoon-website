const http = require("http");
const crypto = require("crypto");
const fs = require("fs");

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
  const fin = buf[0] & 0x80;
  const opcode = buf[0] & 0x0f;
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
  return { fin, opcode, payload, rest: buf.slice(off + len) };
}

function encodeFrame(data) {
  const payload = Buffer.from(data);
  const mask = crypto.randomBytes(4);
  let header;
  if (payload.length < 126) {
    header = Buffer.alloc(6);
    header[0] = 0x81;
    header[1] = 0x80 | payload.length;
    mask.copy(header, 2);
  } else if (payload.length < 65536) {
    header = Buffer.alloc(8);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
    mask.copy(header, 4);
  } else {
    throw new Error("too big");
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
      let assembled = Buffer.alloc(0);
      let assembledOpcode = 0;
      socket.on("data", (chunk) => {
        buf = Buffer.concat([buf, chunk]);
        while (true) {
          const frame = decodeFrame(buf);
          if (!frame) break;
          buf = frame.rest;
          if (frame.opcode === 1 || frame.opcode === 2) {
            assembled = frame.payload;
            assembledOpcode = frame.opcode;
          } else if (frame.opcode === 0) {
            assembled = Buffer.concat([assembled, frame.payload]);
          } else {
            continue;
          }
          if (!frame.fin) continue;
          if (assembledOpcode === 1 || assembledOpcode === 2) {
            try {
              const msg = JSON.parse(assembled.toString());
              if (msg.id && pending.has(msg.id)) {
                pending.get(msg.id)(msg);
                pending.delete(msg.id);
              }
            } catch (e) {}
          }
          assembled = Buffer.alloc(0);
        }
      });
      function call(method, params = {}) {
        return new Promise((res) => {
          const mid = ++id;
          pending.set(mid, res);
          socket.write(encodeFrame(JSON.stringify({ id: mid, method, params })));
        });
      }
      resolve({ call, socket });
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
  await call("Page.navigate", { url: "http://localhost:3000/?v=exp6" });
  await new Promise((r) => setTimeout(r, 2500));
  await call("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: 1440,
    screenHeight: 900,
  });
  await new Promise((r) => setTimeout(r, 1500));
  const ev = await call("Runtime.evaluate", {
    expression: `(() => {
      const exp = [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Experience');
      const sec = exp ? exp.closest('section') : null;
      const r = sec ? sec.getBoundingClientRect() : null;
      const links = sec ? [...sec.querySelectorAll('a')].map(a => a.textContent.trim()) : [];
      const svgs = sec ? sec.querySelectorAll('svg').length : 0;
      return JSON.stringify({
        inner: [window.innerWidth, window.innerHeight],
        scrollH: document.scrollingElement.scrollHeight,
        exp: r && { y: r.top + window.scrollY, h: r.height, w: r.width },
        hero: document.querySelector('[data-measure=hero]')?.getBoundingClientRect().height,
        feature: document.querySelector('[data-measure=feature]')?.getBoundingClientRect().height,
        header: document.querySelector('[data-measure=header]')?.getBoundingClientRect().height,
        links,
        svgs,
        copy: sec?.querySelectorAll('p')[sec.querySelectorAll('p').length-1]?.textContent.slice(0,80),
      });
    })()`,
    returnByValue: true,
  });
  console.log("eval raw", JSON.stringify(ev).slice(0, 800));
  const info = JSON.parse(ev.result?.value ?? ev.result?.result?.value);
  console.log(info);
  await call("Runtime.evaluate", {
    expression: `window.scrollTo(0, ${Math.max(0, (info.exp?.y || 900) - 8)})`,
  });
  await new Promise((r) => setTimeout(r, 600));
  const shot = await call("Page.captureScreenshot", {
    format: "jpeg",
    quality: 55,
    fromSurface: true,
  });
  fs.writeFileSync(
    "/Users/Andrey/Documents/golden-spoon-website/.tmp-screens/experience-live.jpg",
    Buffer.from(shot.result.data, "base64"),
  );
  console.log("wrote experience-live.jpg");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
