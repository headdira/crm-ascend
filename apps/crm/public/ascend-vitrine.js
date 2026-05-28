/**
 * Script de vitrine Ascend — API Scripts Nuvemshop (IIFE, sem jQuery).
 * Cadastre este arquivo no Partner Portal (location: store) e associe por loja via POST /scripts.
 * query_params: { "configUrl": "https://SEU-CRM/api/builder/storefront-config?submission_id=..." }
 */
(function () {
  "use strict";

  function queryParam(name) {
    try {
      var script = document.currentScript;
      if (script && script.src) {
        var value = new URL(script.src, window.location.href).searchParams.get(name);
        if (value) return value;
      }
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  var configUrl = queryParam("configUrl");
  if (!configUrl) return;

  fetch(configUrl, { credentials: "omit", mode: "cors" })
    .then(function (res) {
      if (!res.ok) throw new Error("config " + res.status);
      return res.json();
    })
    .then(function (cfg) {
      if (!cfg || !cfg.logo) return;

      var primary = cfg.primaryColor || "#d4af37";
      var secondary = cfg.secondaryColor || "#0a0a0a";
      var banners =
        cfg.bannersDesktop && cfg.bannersDesktop.length
          ? cfg.bannersDesktop
          : cfg.bannersMobile || [];

      var styleEl = document.getElementById("ascend-vitrine-style");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "ascend-vitrine-style";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent =
        ":root{--ascend-primary:" +
        primary +
        ";--ascend-secondary:" +
        secondary +
        "}" +
        ".btn-primary,button[type=submit],a.btn-primary,.btn.btn-primary{background-color:" +
        primary +
        "!important;border-color:" +
        primary +
        "!important}";

      var root = document.getElementById("ascend-vitrine-root");
      if (!root) {
        root = document.createElement("div");
        root.id = "ascend-vitrine-root";
        root.setAttribute("data-ascend-vitrine", "1");
        var mount =
          document.querySelector("main") ||
          document.querySelector("#content") ||
          document.querySelector(".js-home-main") ||
          document.body;
        mount.insertBefore(root, mount.firstChild);
      }

      root.innerHTML = "";
      root.style.cssText =
        "width:100%;box-sizing:border-box;background:" +
        secondary +
        ";padding:12px 16px;margin:0 0 16px;text-align:center";

      var logoImg = document.createElement("img");
      logoImg.src = cfg.logo;
      logoImg.alt = cfg.storeName || "Logo";
      logoImg.style.cssText = "max-height:80px;max-width:220px;object-fit:contain";
      root.appendChild(logoImg);

      if (cfg.storeName) {
        var title = document.createElement("div");
        title.textContent = cfg.storeName;
        title.style.cssText =
          "color:" + primary + ";font-weight:700;font-size:1.25rem;margin-top:8px";
        root.appendChild(title);
      }

      for (var i = 0; i < banners.length; i++) {
        var banner = document.createElement("img");
        banner.src = banners[i];
        banner.alt = "Banner " + (i + 1);
        banner.style.cssText =
          "width:100%;max-height:420px;object-fit:cover;display:block;margin-top:10px;border-radius:4px";
        root.appendChild(banner);
      }
    })
    .catch(function () {
      /* falha silenciosa na vitrine — não quebrar a loja */
    });
})();
