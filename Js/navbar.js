// Js/navbar.js — FINAL VERSION (Google Translate included + Clean)

document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return console.error("Navbar container not found.");

  navbarContainer.innerHTML = `
    <header class="navbar">
      <div class="container">

        <!-- LEFT SIDE LOGO -->
        <div class="nav-left">
          <div class="logo">🌿 Kisaan Saathiii 🌿</div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="nav-right" id="navRightGroup">

          <!-- TRANSLATE DROPDOWN -->
          <div class="translate-icon-box">
            <span class="translate-icon">文A</span>
            <div id="google_element" class="translate-popup"></div>
          </div>

          <!-- LINKS -->
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="advisory.html">Advisory</a></li>
            <li><a href="weather.html">Weather</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="mrp.html">MRP Rates</a></li>
            <li><a href="insurance.html">Crop Insurance</a></li>
            <li><a href="about.html">About</a></li>

            <li><a id="login-btn" class="login-btn" href="login.html">Login / Signup</a></li>
            <li><a id="user-name" href="profile.html" style="display:none;">Hey User</a></li>
          </ul>
        </div>

        <!-- MOBILE MENU ICON -->
        <div class="menu-icon" id="menuIcon" role="button" tabindex="0">
          <span class="hamburger">☰</span>
          <span class="close" style="display:none;">✕</span>
        </div>

      </div>
    </header>
  `;

  // Tell other scripts navbar is ready
  document.dispatchEvent(new Event("navbarLoaded"));

  /* -----------------------
     GOOGLE TRANSLATE LOADER
  ------------------------*/
  function loadGoogleTranslate() {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
  }

  // Callback required by Google
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,hi,bn,mr,pa",
      },
      "google_element"
    );
  };

  loadGoogleTranslate();

  /* -----------------------
     MOBILE NAVIGATION
  ------------------------*/

  const navRight = document.getElementById("navRightGroup");
  const menuIcon = document.getElementById("menuIcon");
  const hamburger = menuIcon.querySelector(".hamburger");
  const closeIcon = menuIcon.querySelector(".close");

  function openMenu() {
    navRight.classList.add("is-open");
    hamburger.style.display = "none";
    closeIcon.style.display = "inline-block";
    document.documentElement.style.overflow = "hidden";
  }

  function closeMenu() {
    navRight.classList.remove("is-open");
    hamburger.style.display = "inline-block";
    closeIcon.style.display = "none";
    document.documentElement.style.overflow = "";
  }

  menuIcon.addEventListener("click", () => {
    navRight.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  navRight.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!navRight.classList.contains("is-open")) return;
    if (!navRight.contains(e.target) && !menuIcon.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", closeMenu);

  /* -----------------------
     ACTIVE LINK HIGHLIGHT
  ------------------------*/
  const current = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-right a").forEach((a) => {
    if (a.getAttribute("href") === current) {
      a.classList.add("active");
    }
  });
});
