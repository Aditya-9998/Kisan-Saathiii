document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return console.error("Navbar container not found.");

  navbarContainer.innerHTML = `
    <header class="navbar">
      <div class="container">
        <!-- Left Section -->
        <div class="nav-left">
          <div class="logo">🌿Kisaan Saathiii🌿</div>
        </div>

        <!-- Right Section -->
        <div class="nav-right" id="navRightGroup">
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
          <!-- Language moved inside nav-right for mobile -->
          <div class="language-switcher mobile-lang">
            <select id="languageSelect">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        <!-- Menu Icon -->
        <div class="menu-icon" id="menuIcon">
          <span class="hamburger">☰</span>
          <span class="close" style="display:none;">✕</span>
        </div>
      </div>
    </header>
  `;

  // === Language Switching ===
  const langSelect = document.getElementById("languageSelect");
  async function fetchTranslations(lang) {
    try {
      const res = await fetch(`data/${lang}.json`);
      const json = await res.json();
      return json.navbar;
    } catch {
      return null;
    }
  }

  async function loadLang(lang) {
    const data = await fetchTranslations(lang);
    if (data) {
      document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (data[key]) el.innerHTML = data[key];
      });
    }
  }

  const savedLang = localStorage.getItem("preferredLang") || "en";
  langSelect.value = savedLang;
  loadLang(savedLang);
  langSelect.addEventListener("change", () => {
    const lang = langSelect.value;
    localStorage.setItem("preferredLang", lang);
    loadLang(lang);
  });

  // === Active Link Highlight ===
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-right a").forEach(a => {
    if (a.getAttribute("href") === currentPath || (currentPath === "" && a.getAttribute("href") === "index.html")) {
      a.classList.add("active");
    }
  });

  // === Mobile Toggle ===
  const navRight = document.getElementById("navRightGroup");
  const menuIcon = document.getElementById("menuIcon");
  const hamburger = menuIcon.querySelector(".hamburger");
  const closeIcon = menuIcon.querySelector(".close");

  menuIcon.addEventListener("click", () => {
    navRight.classList.toggle("is-open");
    const isOpen = navRight.classList.contains("is-open");
    hamburger.style.display = isOpen ? "none" : "inline-block";
    closeIcon.style.display = isOpen ? "inline-block" : "none";
  });
});
