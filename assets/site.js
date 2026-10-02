// Light/dark toggle (honors prefers-color-scheme until the visitor picks one)
// and the mobile nav menu. The initial theme is set by a tiny inline script in
// each page's <head> to avoid a flash of the wrong theme.
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("title", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  apply(root.getAttribute("data-theme") || (mq && mq.matches ? "dark" : "light"));

  if (mq && mq.addEventListener) {
    mq.addEventListener("change", function (e) {
      if (!stored()) apply(e.matches ? "dark" : "light");
    });
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  var navBtn = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (navBtn && links) {
    navBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Build the mailto link at runtime so the address is not in the HTML source.
  var mail = document.querySelectorAll("[data-mail]");
  for (var i = 0; i < mail.length; i++) {
    mail[i].setAttribute("href", "mailto:" + ["adzcai", "g.harvard.edu"].join("@"));
  }
})();
