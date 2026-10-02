// One-page homepage: highlight the menu item for the section in view, and close the
// mobile menu after picking a section.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll("#navbar .nav-link[data-section]"));
  if (!links.length) return;

  var sections = links
    .map(function (link) {
      return document.getElementById(link.getAttribute("data-section"));
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      var on = link.getAttribute("data-section") === id;
      link.parentElement.classList.toggle("active", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  // The current section is the last one whose top has passed just below the navbar.
  function update() {
    var offset = 90;
    var current = sections.length ? sections[0].id : null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top - offset <= 0) current = section.id;
    });
    // At the very bottom, the last section wins even if it is short.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  }

  // Only a handful of sections, so measuring them on every scroll event is cheap.
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("hashchange", update);
  update();

  var toggler = document.querySelector(".navbar-toggler-main");
  var menu = document.getElementById("navbarNav");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (toggler && menu && menu.classList.contains("show")) toggler.click();
    });
  });
})();
