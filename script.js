/**
 * Portfolio — theme, navigation, scroll reveal, contact form
 * Vanilla JS; no framework dependencies.
 */

(function () {
  "use strict";

  var THEME_KEY = "portfolio-theme";
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector("[data-action=\"nav-toggle\"]");
  var siteNav = document.getElementById("site-nav");
  var themeToggle = document.querySelector("[data-action=\"theme-toggle\"]");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    var root = document.documentElement;
    if (theme !== "light" && theme !== "dark") {
      theme = prefersDark.matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      setTheme(prefersDark.matches ? "dark" : "light");
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        setTheme(next);
      });
    }

    prefersDark.addEventListener("change", function (e) {
      if (!getStoredTheme()) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
  }

  function closeNav() {
    if (!header || !navToggle || !siteNav) return;
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function openNav() {
    if (!header || !navToggle || !siteNav) return;
    header.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }

  function initNav() {
    if (!navToggle || !siteNav || !header) return;

    navToggle.addEventListener("click", function () {
      if (header.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    siteNav.querySelectorAll("a[href^=\"#\"]").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
          closeNav();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function initSkillMeters() {
    var cards = document.querySelectorAll(".skill-card");
    if (!cards.length || !("IntersectionObserver" in window)) {
      cards.forEach(function (c) {
        c.classList.add("is-visible");
      });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach(function (c) {
        c.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach(function (c) {
      io.observe(c);
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (form.elements.namedItem("name") || {}).value || "";
      var email = (form.elements.namedItem("email") || {}).value || "";
      var subject = (form.elements.namedItem("subject") || {}).value || "";
      var message = (form.elements.namedItem("message") || {}).value || "";

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var to = "villaluzmt05@gmail.com";
      var body =
        encodeURIComponent(
          message +
            "\n\n—\n" +
            "From: " +
            name +
            " <" +
            email +
            ">"
        );
      var mailto =
        "mailto:" +
        to +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        body;

      window.location.href = mailto;

      if (status) {
        status.textContent =
          "Your email client should open. If it does not, copy the address above.";
        status.classList.add("is-success");
      }
    });
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initMetricCounters() {
    var nodes = document.querySelectorAll("[data-counter]");
    if (!nodes.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setFinal(el, target, suffix) {
      el.textContent = String(target) + suffix;
    }

    function runCount(el) {
      var raw = el.getAttribute("data-counter");
      var target = parseInt(raw, 10);
      var suffix = el.getAttribute("data-counter-suffix");
      if (suffix === null || suffix === undefined) suffix = "";
      if (isNaN(target)) return;

      if (reduced || !("IntersectionObserver" in window)) {
        setFinal(el, target, suffix);
        return;
      }

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);

            var startTime = null;
            var duration = 850;

            function easeOutCubic(t) {
              return 1 - Math.pow(1 - t, 3);
            }

            function step(ts) {
              if (startTime === null) startTime = ts;
              var p = Math.min((ts - startTime) / duration, 1);
              var eased = easeOutCubic(p);
              var val = Math.round(eased * target);
              el.textContent = String(val) + suffix;
              if (p < 1) {
                requestAnimationFrame(step);
              } else {
                setFinal(el, target, suffix);
              }
            }

            requestAnimationFrame(step);
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -5% 0px" }
      );

      io.observe(el);
    }

    nodes.forEach(runCount);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNav();
    initReveal();
    initSkillMeters();
    initMetricCounters();
    initContactForm();
    initYear();
  });
})();
