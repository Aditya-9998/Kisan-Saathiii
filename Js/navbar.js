// Js/navbar.js  (replace your existing file with this)

document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return console.error("Navbar container not found.");

  // Inject Navbar HTML (same as before)
  navbarContainer.innerHTML = `
    <header class="navbar">
      <div class="container">
        <div class="nav-left">
          <div class="logo" data-lang-key="navbar.logo" data-no-translate>🌿Kisaan Saathiii🌿</div>
        </div>

        <div class="nav-right" id="navRightGroup">
          <ul>
            <li><a href="index.html" data-lang-key="navbar.home">Home</a></li>
            <li><a href="weather.html" data-lang-key="navbar.weather">Weather</a></li>
            <li><a href="advisory.html" data-lang-key="navbar.advisory">Advisory</a></li>
            <li><a href="news.html" data-lang-key="navbar.news">News</a></li>
            <li><a href="insurance.html" data-lang-key="navbar.insurance">Crop Insurance</a></li>
            <li><a href="mrp.html" data-lang-key="navbar.mrpRate">MRP Rates</a></li>
            <li><a href="about.html" data-lang-key="navbar.about">About</a></li>
            <li><a href="login.html" class="login-btn" data-lang-key="navbar.loginSignup">Login / Signup</a></li>
          </ul>

          <!-- Language Switcher -->
          <div class="language-switcher">
            <button id="lang-en" class="lang-btn" data-lang="en" data-lang-btn="en">English</button>
            <button id="lang-hi" class="lang-btn" data-lang="hi" data-lang-btn="hi">हिन्दी</button>
          </div>
        </div>

        <div class="menu-icon" id="menuIcon" aria-label="Toggle menu" role="button" tabindex="0">
          <span class="hamburger">☰</span>
          <span class="close" style="display:none;">✕</span>
        </div>
      </div>
    </header>
  `;

  // ---- Language helpers (unchanged) ----
  function updateActiveLangBtn(lang) {
    document.querySelectorAll(".language-switcher .lang-btn").forEach((btn) => {
      const isActive =
        btn.getAttribute("data-lang") === lang ||
        btn.getAttribute("data-lang-btn") === lang;
      btn.classList.toggle("active", isActive);
    });
  }

  function applyLanguage(lang) {
    if (typeof window.changeLanguage === "function") {
      window.changeLanguage(lang);
      updateActiveLangBtn(lang);
      localStorage.setItem("language", lang);
    } else {
      setTimeout(() => applyLanguage(lang), 150);
    }
  }

  const btnEn = document.getElementById("lang-en");
  const btnHi = document.getElementById("lang-hi");
  if (btnEn) btnEn.addEventListener("click", () => applyLanguage("en"));
  if (btnHi) btnHi.addEventListener("click", () => applyLanguage("hi"));

  const savedLang = localStorage.getItem("language") || "en";
  updateActiveLangBtn(savedLang);
  setTimeout(() => applyLanguage(savedLang), 300);

  // Signal navbar loaded
  document.dispatchEvent(new Event("navbarLoaded"));

  // ---- Menu toggle + auto-close behavior ----
  const navRight = document.getElementById("navRightGroup");
  const menuIcon = document.getElementById("menuIcon");
  const hamburger = menuIcon?.querySelector(".hamburger");
  const closeIcon = menuIcon?.querySelector(".close");

  function openMenu() {
    navRight.classList.add("is-open");
    if (hamburger) hamburger.style.display = "none";
    if (closeIcon) closeIcon.style.display = "inline-block";
    // prevent background scrolling on mobile when menu open (optional)
    document.documentElement.style.overflow = "hidden";
  }

  function closeMenu() {
    navRight.classList.remove("is-open");
    if (hamburger) hamburger.style.display = "inline-block";
    if (closeIcon) closeIcon.style.display = "none";
    document.documentElement.style.overflow = ""; // restore
  }

  function toggleMenu() {
    if (navRight.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  if (menuIcon && navRight) {
    menuIcon.addEventListener("click", toggleMenu);
    // keyboard accessibility: Enter / Space to toggle
    menuIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  // Close on clicking any nav link (includes login)
  navRight.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      // if link has target _blank or external, still close menu
      // allow natural navigation to proceed
      closeMenu();
    });
  });

  // Close when clicking outside the navRight area
  document.addEventListener("click", (e) => {
    if (!navRight.classList.contains("is-open")) return;
    const insideNav = navRight.contains(e.target) || menuIcon.contains(e.target);
    if (!insideNav) closeMenu();
  });

  // Close on touchstart outside as well (mobile)
  document.addEventListener(
    "touchstart",
    (e) => {
      if (!navRight.classList.contains("is-open")) return;
      const insideNav = navRight.contains(e.target) || menuIcon.contains(e.target);
      if (!insideNav) closeMenu();
    },
    { passive: true }
  );

  // Close on scroll (debounced)
  let scrollTimer = null;
  function onScrollClose() {
    if (!navRight.classList.contains("is-open")) return;
    if (scrollTimer !== null) {
      clearTimeout(scrollTimer);
    }
    // close after short inactivity while scrolling (so small scrolls won't immediately close)
    scrollTimer = setTimeout(() => {
      closeMenu();
      scrollTimer = null;
    }, 120); // 120ms debounce - tweak if you want faster/slower
  }
  window.addEventListener("scroll", onScrollClose, { passive: true });
  window.addEventListener("touchmove", onScrollClose, { passive: true });
  window.addEventListener("resize", () => {
    // close on resize to avoid stuck open states
    closeMenu();
  });

  // Highlight active nav link (unchanged)
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-right a").forEach((a) => {
    if (
      a.getAttribute("href") === currentPath ||
      (currentPath === "" && a.getAttribute("href") === "index.html")
    ) {
      a.classList.add("active");
    }
  });
});
