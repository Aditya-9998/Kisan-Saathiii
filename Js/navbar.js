/* File: /js/navbar.js (updated & rectified) */
document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) {
    console.error("Navbar container '#navbar' not found.");
    return;
  }

  // create header
  const header = document.createElement("header");
  header.className = "navbar";

  header.innerHTML = `
    <div class="container">
      
      <!-- Left Section: Logo + Language -->
      <div class="nav-left">
        <div class="logo" style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:1.4rem; color:#1e7d3b;">
          <span>🌿Kisaan Saathiii🌿</span>
        </div>

        <div class="language-switcher" style="margin-left:12px;">
          <select id="languageSelect" aria-label="Language" style="padding:4px 8px; border-radius:6px; border:1px solid #1e7d3b;">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>

      <!-- Right Section: Navigation -->
      <div class="nav-right" id="navRightGroup">
        <nav class="nav-links" role="navigation" aria-label="Main Navigation">
          <ul>
            <li><a href="index.html" data-key="home">होम</a></li>
            <li><a href="weather.html" data-key="weather">मौसम</a></li>
            <li><a href="advisory.html" data-key="advisory">सलाह</a></li>
            <li><a href="news.html" data-key="news">समाचार</a></li>
            <li><a href="insurance.html" data-key="insurance">फसल बीमा</a></li>
            <li><a href="mrp.html" data-key="mrpRate">एमआरपी दर</a></li>
            <li><a href="about.html" data-key="about">परिचय</a></li>
            <li><a href="login.html" class="login-btn" data-key="loginSignup">लॉगिन / साइन अप</a></li>
          </ul>
        </nav>
      </div>

      <!-- Mobile Menu Icon -->
      <label for="menu-toggle" class="menu-icon" id="menuIcon" title="Toggle menu">
        <span class="hamburger">☰</span><span class="close" style="display:none">✕</span>
      </label>
      <input type="checkbox" id="menu-toggle" style="display:none" />
    </div>
  `;

  navbarContainer.appendChild(header);

  // === Language translation logic ===
  const langSelect = document.getElementById("languageSelect");
  async function fetchTranslations(lang) {
    try {
      const r = await fetch(`data/${lang}.json`);
      if (!r.ok) throw new Error("No lang file");
      const j = await r.json();
      return j.navbar || null;
    } catch (err) {
      return null;
    }
  }
  function applyTranslations(navData) {
    if (!navData) return;
    header.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      if (navData[key]) el.innerHTML = navData[key];
    });
  }
  async function loadAndTranslate(lang) {
    const data = await fetchTranslations(lang);
    applyTranslations(data);
  }
  const savedLang = localStorage.getItem("preferredLang") || "en";
  if (langSelect) {
    langSelect.value = savedLang;
    loadAndTranslate(savedLang);
    langSelect.addEventListener("change", () => {
      const v = langSelect.value;
      localStorage.setItem("preferredLang", v);
      loadAndTranslate(v);
    });
  }

  // === Active link highlight ===
  const currentPath = window.location.pathname.split("/").pop();
  header.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // === Mobile toggle ===
  const menuToggle = document.getElementById("menu-toggle");
  const navRightGroup = document.getElementById("navRightGroup");
  const menuIcon = document.getElementById("menuIcon");
  if (menuToggle && navRightGroup && menuIcon) {
    menuToggle.addEventListener("change", () => {
      if (menuToggle.checked) {
        document.body.classList.add("menu-open");
        navRightGroup.classList.add("is-open");
        menuIcon.querySelector(".hamburger").style.display = "none";
        menuIcon.querySelector(".close").style.display = "inline-block";
      } else {
        document.body.classList.remove("menu-open");
        navRightGroup.classList.remove("is-open");
        menuIcon.querySelector(".hamburger").style.display = "inline-block";
        menuIcon.querySelector(".close").style.display = "none";
      }
    });
    menuIcon.addEventListener("click", () => {
      menuToggle.checked = !menuToggle.checked;
      menuToggle.dispatchEvent(new Event("change"));
    });
  }
});
