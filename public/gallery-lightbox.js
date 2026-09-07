(function () {
  function isOpen() {
    return /^#gallery-image-\d+$/.test(window.location.hash);
  }

  function close() {
    window.location.hash = "gallery";
  }

  function sync() {
    document.body.style.overflow = isOpen() ? "hidden" : "";
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      close();
    }
  });

  window.addEventListener("hashchange", sync);
  sync();
})();
