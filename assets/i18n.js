(function () {
  var LANGS = ["en", "ja", "ko"];
  var STORAGE = "kmp-lang";
  var dicts = {};
  var current = "en";

  function prefix() {
    var path = location.pathname;
    if (/\/(how-to|privacy|terms|location|delete-account)\//.test(path)) return "../";
    return "";
  }

  function fill(value) {
    var root = prefix();
    return String(value)
      .replaceAll("{home}", root + "index.html")
      .replaceAll("{howto}", root + "how-to/")
      .replaceAll("{plans}", root + "index.html#plans")
      .replaceAll("{privacy}", root + "privacy/")
      .replaceAll("{terms}", root + "terms/")
      .replaceAll("{location}", root + "location/")
      .replaceAll("{delete}", root + "delete-account/")
      .replaceAll("{email}", "mailto:help@trade-arena.net");
  }

  function lookup(dict, key) {
    if (dict && typeof dict[key] === "string") return dict[key];
    var cur = dict;
    var parts = key.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (!cur || typeof cur !== "object" || !(parts[i] in cur)) return null;
      cur = cur[parts[i]];
    }
    return typeof cur === "string" ? cur : null;
  }

  function snap(el, attr, value) {
    var name = "data-snap-" + attr;
    if (!el.hasAttribute(name)) el.setAttribute(name, value);
    return el.getAttribute(name);
  }

  function textOf(dict, key, fallback) {
    var value = fallback;
    if (current !== "en") {
      var translated = lookup(dict, key);
      if (translated != null) value = translated;
    }
    return fill(value);
  }

  function apply(dict) {
    document.documentElement.lang = current;
    document.documentElement.setAttribute("data-font", current === "en" ? "" : current);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var fallback = snap(el, "text", el.textContent);
      el.textContent = textOf(dict, el.getAttribute("data-i18n"), fallback);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var fallback = snap(el, "html", el.innerHTML);
      el.innerHTML = textOf(dict, el.getAttribute("data-i18n-html"), fallback);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var fallback = snap(el, "aria", el.getAttribute("aria-label") || "");
      el.setAttribute("aria-label", textOf(dict, el.getAttribute("data-i18n-aria"), fallback));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var fallback = snap(el, "ph", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", textOf(dict, el.getAttribute("data-i18n-placeholder"), fallback));
    });

    var page = document.body.getAttribute("data-page");
    var title = document.querySelector("title");
    var desc = document.querySelector('meta[name="description"]');
    if (title) {
      var titleFallback = snap(document.documentElement, "title", title.textContent);
      var titleKey = page ? "meta." + page + ".title" : "";
      title.textContent = titleKey ? textOf(dict, titleKey, titleFallback) : titleFallback;
    }
    if (desc) {
      var descFallback = snap(document.documentElement, "desc", desc.getAttribute("content") || "");
      var descKey = page ? "meta." + page + ".description" : "";
      desc.setAttribute("content", descKey ? textOf(dict, descKey, descFallback) : descFallback);
    }

    var ld = document.querySelector('script[type="application/ld+json"]');
    if (ld && page === "home") {
      try {
        var data = JSON.parse(ld.textContent);
        var ldFallback = snap(ld, "ld", data.description || "");
        data.description = textOf(dict, "meta.home.ld", ldFallback);
        ld.textContent = JSON.stringify(data);
      } catch (err) {}
    }

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === current ? "true" : "false");
    });

    ensureFont(current);
    document.body.classList.add("i18n-ready");
    window.KMP = { lang: current, t: function (key) { return textOf(dicts[current] || {}, key, ""); }, ready: true };
    document.dispatchEvent(new CustomEvent("kmp-lang"));
  }

  function ensureFont(lang) {
    var id = "kmp-font";
    var link = document.getElementById(id);
    var href = lang === "ko"
      ? "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
      : lang === "ja"
        ? "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
        : "";
    if (!href) {
      if (link) link.remove();
      return;
    }
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  }

  function detect() {
    var q = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(q) >= 0) return q;
    try {
      var saved = localStorage.getItem(STORAGE);
      if (LANGS.indexOf(saved) >= 0) return saved;
    } catch (err) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    nav = String(nav).toLowerCase();
    if (nav.indexOf("ko") === 0) return "ko";
    if (nav.indexOf("ja") === 0) return "ja";
    return "en";
  }

  function mountSwitch() {
    document.querySelectorAll("[data-lang-switch]").forEach(function (host) {
      if (host.childElementCount) return;
      host.setAttribute("role", "group");
      var label = "Language";
      host.setAttribute("aria-label", label);
      host.setAttribute("data-i18n-aria", "nav.lang");
      [
        ["en", "English"],
        ["ja", "日本語"],
        ["ko", "한국어"]
      ].forEach(function (pair) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-set-lang", pair[0]);
        btn.setAttribute("lang", pair[0]);
        btn.textContent = pair[1];
        btn.addEventListener("click", function () {
          choose(pair[0]);
        });
        host.appendChild(btn);
      });
    });
  }

  function choose(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem(STORAGE, lang); } catch (err) {}
    var url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    if (lang === "en") apply({});
    else load(lang).then(function (dict) { apply(dict || {}); });
  }

  function load(lang) {
    if (dicts[lang]) return Promise.resolve(dicts[lang]);
    var script = document.querySelector("script[src*='i18n.js']");
    var url = new URL("i18n/" + lang + ".json", script.src);
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    }).then(function (json) {
      dicts[lang] = json;
      return json;
    }).catch(function () {
      return {};
    });
  }

  mountSwitch();
  current = detect();
  if (current === "en") apply({});
  else load(current).then(function (dict) { apply(dict || {}); });
})();
