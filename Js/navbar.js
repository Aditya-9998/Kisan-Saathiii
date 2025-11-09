// ✅ Js/navbar.js

document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return console.error("Navbar container not found.");

  // ✅ Inject Navbar HTML
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

          <!-- ✅ Language Switcher -->
          <div class="language-switcher">
            <button id="lang-en" class="lang-btn" data-lang="en" data-lang-btn="en">English</button>
            <button id="lang-hi" class="lang-btn" data-lang="hi" data-lang-btn="hi">हिन्दी</button>
          </div>
        </div>

        <div class="menu-icon" id="menuIcon">
          <span class="hamburger">☰</span>
          <span class="close" style="display:none;">✕</span>
        </div>
      </div>
    </header>
  `;

  // === Utility: Highlight Active Language Button ===
  function updateActiveLangBtn(lang) {
    document.querySelectorAll(".language-switcher .lang-btn").forEach((btn) => {
      const isActive =
        btn.getAttribute("data-lang") === lang ||
        btn.getAttribute("data-lang-btn") === lang;
      btn.classList.toggle("active", isActive);
    });
  }

  // === Utility: Apply Language Safely ===
  function applyLanguage(lang) {
    if (typeof window.changeLanguage === "function") {
      window.changeLanguage(lang);
      updateActiveLangBtn(lang);
      localStorage.setItem("language", lang);
    } else {
      // Retry if language.js not yet ready
      setTimeout(() => applyLanguage(lang), 150);
    }
  }

  // === Button Events ===
  const btnEn = document.getElementById("lang-en");
  const btnHi = document.getElementById("lang-hi");

  if (btnEn) btnEn.addEventListener("click", () => applyLanguage("en"));
  if (btnHi) btnHi.addEventListener("click", () => applyLanguage("hi"));

  // === Initialize Language ===
  const savedLang = localStorage.getItem("language") || "en";
  updateActiveLangBtn(savedLang);
  setTimeout(() => applyLanguage(savedLang), 300);

  // === Dispatch event so language.js knows navbar is loaded ===
  document.dispatchEvent(new Event("navbarLoaded"));

  // === Mobile Menu Toggle ===
  const navRight = document.getElementById("navRightGroup");
  const menuIcon = document.getElementById("menuIcon");
  if (menuIcon && navRight) {
    const hamburger = menuIcon.querySelector(".hamburger");
    const closeIcon = menuIcon.querySelector(".close");

    menuIcon.addEventListener("click", () => {
      navRight.classList.toggle("is-open");
      const isOpen = navRight.classList.contains("is-open");
      hamburger.style.display = isOpen ? "none" : "inline-block";
      closeIcon.style.display = isOpen ? "inline-block" : "none";
    });
  }

  // === Highlight Active Nav Link ===
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
