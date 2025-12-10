// lenis-tumblr.js (Buttery Edition)
// Silent, Tumblr-safe smooth scroll for aesthetic themes.

/*
------------------------------------------------------------
  Smooth Scroll Script for Tumblr, Buttery Edition
  Â© 2025 Nonatized
  All rights reserved.

  Usage: For personal themes, freebies (with credit), and
  aesthetic Tumblr layouts. Redistribution or resale of this
  script is not permitted.

  Author: Nonatized (Nona)
  Site: nonatized.space
  Tumblr: nnspacestream.tumblr.com
------------------------------------------------------------
*/
(function () {
  // Disable in Tumblr dashboard/customize
  var href = location.href || "";
  if (
    href.includes("www.tumblr.com/blog/") ||
    href.includes("tumblr.com/customize") ||
    window !== window.parent
  ) {
    return;
  }

  // Load scripts sequentially
  var loadScriptsSequential = function (arr, cb) {
    var i = 0;
    var next = function () {
      if (i >= arr.length) {
        if (typeof cb === "function") cb();
        return;
      }
      var url = arr[i++];
      if (!url) return next();

      var s = document.createElement("script");
      s.src = url;
      s.async = false;
      s.onload = function () { next(); };
      s.onerror = function () { next(); };
      document.head.appendChild(s);
    };
    next();
  };

  var onReady = function (cb) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb);
    } else cb();
  };

  onReady(function () {
    var libs = [
      "https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js",
      "https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js",
      "https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/CustomEase.min.js",
      "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1/bundled/lenis.min.js"
    ];

    loadScriptsSequential(libs, function () {

      // --- LENIS INIT ------------------------------------------------------
      if (typeof Lenis === "function") {
        try {
          var lenis = new Lenis({
            smooth: true,
            lerp: 0.09,
            duration: 1.0,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.3,
            normalizeWheel: true
          });

          var raf = function (t) {
            lenis.raf(t);
            requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);

        } catch (e) {}
      }

      // --- SIDEBAR ANIMATION ---------------------------------------------
      if (typeof gsap !== "undefined") {
        try {
          if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
          }

          // Sidebar fade-in
          gsap.from(".sidebar-title", {
            opacity: 0,
            y: 20,
            duration: 1.0,
            ease: "power3.out"
          });

          // Description softer reveal
          gsap.from(".sidebar-description", {
            opacity: 0,
            y: 12,
            duration: 1.0,
            delay: 0.1,
            ease: "power2.out"
          });

          // Optional: animate toggle button too
          gsap.from(".description-toggle", {
            opacity: 0,
            y: 8,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.15
          });

        } catch (e) {}
      }
    });
  });
})();
