(function () {
  "use strict";

  /* ----- Nav scroll state ----- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Mobile menu ----- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      nav.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- Reveal on scroll ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- Scroll-spy for positions chip nav ----- */
  var chips = document.querySelectorAll(".chip[href^='#']");
  if (chips.length && "IntersectionObserver" in window) {
    var sections = [];
    chips.forEach(function (chip) {
      var target = document.querySelector(chip.getAttribute("href"));
      if (target) sections.push({ chip: chip, section: target });
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sections.forEach(function (pair) {
            var active = pair.section === entry.target;
            pair.chip.classList.toggle("active", active);
            if (active) pair.chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (pair) { spy.observe(pair.section); });
  }

  /* ----- Contact form (Formspree) ----- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fname = document.getElementById("fname").value.trim();
      var lname = document.getElementById("lname").value.trim();
      var email = document.getElementById("femail").value.trim();
      var msg = document.getElementById("fmessage").value.trim();
      var status = document.getElementById("formStatus");
      var btn = document.getElementById("submitBtn");

      if (!fname || !email || !msg) {
        status.className = "form-status error";
        status.textContent = "Please fill in your first name, email, and message.";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending…";
      status.className = "form-status";
      status.textContent = "";

      fetch("https://formspree.io/f/xeevonay", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name: fname + " " + lname, email: email, message: msg })
      }).then(function (res) {
        if (res.ok) {
          status.className = "form-status success";
          status.textContent = "Thanks! Cheryl's team will be in touch soon.";
          form.reset();
          btn.textContent = "Sent!";
        } else {
          throw new Error("bad response");
        }
      }).catch(function () {
        status.className = "form-status error";
        status.textContent = "Something went wrong. Please email us directly at servingdro@gmail.com.";
        btn.disabled = false;
        btn.textContent = "Send Message";
      });
    });
  }

  /* ----- Footer year ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
