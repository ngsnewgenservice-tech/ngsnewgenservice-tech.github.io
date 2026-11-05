(function () {
  var cfg = window.POLYSUBS_CONFIG || {};
  var I = window.POLYSUBS_I18N;
  var codes = Object.keys(I.langs);

  function store(get, val) {
    try {
      if (get) return localStorage.getItem("polysubs_lang");
      localStorage.setItem("polysubs_lang", val);
    } catch (e) { return null; }
  }

  function pickInitial() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && I.strings[q]) return q;
    var saved = store(true);
    if (saved && I.strings[saved]) return saved;
    var nav = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < nav.length; i++) {
      var base = String(nav[i]).toLowerCase().split("-")[0];
      if (I.strings[base]) return base;
    }
    return "en";
  }

  function apply(code) {
    var t = I.strings[code], en = I.strings.en;
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      var v = t[k] || en[k];
      if (v) el.textContent = v;
    });
    // Install buttons: real link once published, otherwise "coming soon".
    document.querySelectorAll(".js-install").forEach(function (el) {
      if (cfg.chromeStoreUrl) {
        el.href = cfg.chromeStoreUrl;
        el.target = "_blank";
        el.rel = "noopener";
      } else if (cfg.downloadUrl) {
        if (el.dataset.i18n === "cta_install") el.textContent = t.cta_download || en.cta_download;
        el.href = cfg.downloadUrl;
        el.setAttribute("download", "");
      } else {
        el.textContent = t.cta_soon || en.cta_soon;
        el.classList.add("disabled");
        el.removeAttribute("href");
      }
    });
    document.querySelectorAll(".js-howto").forEach(function (el) { el.hidden = !!cfg.chromeStoreUrl || !cfg.downloadUrl; });
    document.querySelector("#lang").value = code;
  }

  var sel = document.querySelector("#lang");
  codes.forEach(function (c) {
    var o = document.createElement("option");
    o.value = c;
    o.textContent = I.langs[c];
    sel.appendChild(o);
  });
  sel.addEventListener("change", function () { store(false, sel.value); apply(sel.value); });

  document.querySelectorAll(".js-mail").forEach(function (a) {
    a.href = "mailto:" + cfg.contactEmail;
  });

  apply(pickInitial());
})();
