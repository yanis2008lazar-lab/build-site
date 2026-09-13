(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  var lastState = false;
  function onScroll() {
    var scrolled = window.scrollY > 12;
    if (scrolled !== lastState) {
      header.classList.toggle("is-scrolled", scrolled);
      lastState = scrolled;
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }
  function openMenu() {
    mobileMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  navToggle.addEventListener("click", function () {
    var isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = ["idea", "ideas", "architecture", "inside", "about"];
  var navLinks = document.querySelectorAll(".nav-desktop a[href^='#']");
  if ("IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navIo.observe(el);
    });
  }

  /* ---------- Only one architecture part open at a time (optional, gentle UX) ---------- */
  var archParts = document.querySelectorAll(".arch-part");
  archParts.forEach(function (part) {
    part.addEventListener("toggle", function () {
      if (part.open) {
        archParts.forEach(function (other) {
          if (other !== part) other.open = false;
        });
      }
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Lemon Squeezy checkout: load only on first buy-button click ---------- */
  var lemonLoaded = false;
  var lemonLoading = false;

  function openLemonCheckout(url) {
    if (window.LemonSqueezy && window.LemonSqueezy.Url) {
      window.LemonSqueezy.Url.Open(url);
    }
  }

  function loadLemonScript(onReady) {
    if (lemonLoaded) { onReady(); return; }
    if (lemonLoading) {
      var wait = setInterval(function () {
        if (lemonLoaded) { clearInterval(wait); onReady(); }
      }, 50);
      return;
    }
    lemonLoading = true;
    var script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.onload = function () {
      lemonLoaded = true;
      if (typeof window.createLemonSqueezy === "function") {
        window.createLemonSqueezy();
      }
      onReady();
    };
    document.body.appendChild(script);
  }

  document.querySelectorAll(".lemonsqueezy-button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var href = btn.href;
      loadLemonScript(function () {
        openLemonCheckout(href);
      });
    });
  });
})();
