(function () {
  "use strict";

  /* Mobile menu: instant toggle, no transition, above all page content */
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Scroll-spy via IntersectionObserver */
  var spySections = ["home", "story", "menu", "community", "gallery", "visit", "faq", "contact"];
  var navLinks = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    navLinks[link.getAttribute("href").slice(1)] = link;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        Object.keys(navLinks).forEach(function (id) { navLinks[id].classList.remove("is-active"); });
        var link = navLinks[entry.target.id];
        if (link) link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  spySections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* Hero carousel */
  var carousel = document.getElementById("heroCarousel");
  if (carousel) {
    var slides = carousel.querySelectorAll(".carousel-slide");
    var dots = carousel.querySelectorAll(".dot");
    var current = 0, timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
    }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { show(current + 1); }, 6000); }
    var prev = carousel.querySelector(".carousel-btn.prev");
    var next = carousel.querySelector(".carousel-btn.next");
    if (prev) prev.addEventListener("click", function () { show(current - 1); restart(); });
    if (next) next.addEventListener("click", function () { show(current + 1); restart(); });
    dots.forEach(function (dot, i) { dot.addEventListener("click", function () { show(i); restart(); }); });
    restart();
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* Gallery lightbox */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbIndex = 0;
  function openLb(index) {
    lbIndex = (index + items.length) % items.length;
    lbImg.src = items[lbIndex].getAttribute("data-full");
    lbImg.alt = items[lbIndex].getAttribute("data-alt");
    lbCap.textContent = items[lbIndex].getAttribute("data-alt");
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lbImg.src = "";
  }
  items.forEach(function (item, i) { item.addEventListener("click", function () { openLb(i); }); });
  var lbClose = lightbox.querySelector(".lb-close");
  var lbPrev = lightbox.querySelector(".lb-prev");
  var lbNext = lightbox.querySelector(".lb-next");
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lbPrev) lbPrev.addEventListener("click", function (e) { e.stopPropagation(); openLb(lbIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function (e) { e.stopPropagation(); openLb(lbIndex + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(lbIndex - 1);
    if (e.key === "ArrowRight") openLb(lbIndex + 1);
  });

  /* Order form: opens the visitor's email app addressed to the cafe */
  var form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = "Order enquiry — Common Ground Bakery & Cafe";
      var body = "Name: " + (data.get("name") || "") + "\n"
        + "Contact: " + (data.get("contact") || "") + "\n"
        + "Order enquiry: " + (data.get("order") || "") + "\n"
        + "Stopping by: " + (data.get("when") || "");
      window.location.href = "mailto:commongroundci61734@gmail.com"
        + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(body);
    });
  }
})();
