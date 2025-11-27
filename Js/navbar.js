// Js/navbar.js — plain script (non-module)
document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return console.error("Navbar container not found.");

  navbarContainer.innerHTML = `
    <header class="navbar">
      <div class="container">
        <div class="nav-left">
          <div class="logo">🌿Kisaan Saathiii🌿</div>
        </div>

        <div class="nav-right" id="navRightGroup">
          <div id="google_element" class="translate-box"></div>

          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="advisory.html">Advisory</a></li>
            <li><a href="weather.html">Weather</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="mrp.html">MRP Rates</a></li>
            <li><a href="insurance.html">Crop Insurance</a></li>
            <li><a href="about.html">About</a></li>

            <!-- LOGIN / HEY USER -->
            <li>
              <a id="login-btn" href="login.html" class="login-btn">Login / Signup</a>
            </li>
            <li>
              <a id="user-name" href="profile.html" style="display:none;">Hey User</a>
            </li>
          </ul>
        </div>

        <div class="menu-icon" id="menuIcon" aria-label="Toggle menu" role="button" tabindex="0">
          <span class="hamburger">☰</span>
          <span class="close" style="display:none;">✕</span>
        </div>
      </div>
    </header>
  `;

  // Tell other scripts navbar is ready
  document.dispatchEvent(new Event("navbarLoaded"));

  // Mobile menu behavior (kept as you had it)
  const navRight = document.getElementById("navRightGroup");
  const menuIcon = document.getElementById("menuIcon");
  const hamburger = menuIcon?.querySelector(".hamburger");
  const closeIcon = menuIcon?.querySelector(".close");

  function openMenu() {
    navRight.classList.add("is-open");
    if (hamburger) hamburger.style.display = "none";
    if (closeIcon) closeIcon.style.display = "inline-block";
    document.documentElement.style.overflow = "hidden";
  }

  function closeMenu() {
    navRight.classList.remove("is-open");
    if (hamburger) hamburger.style.display = "inline-block";
    if (closeIcon) closeIcon.style.display = "none";
    document.documentElement.style.overflow = "";
  }

  function toggleMenu() {
    navRight.classList.contains("is-open") ? closeMenu() : openMenu();
  }

  if (menuIcon && navRight) {
    menuIcon.addEventListener("click", toggleMenu);
    menuIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  navRight.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (e) => {
    if (!navRight.classList.contains("is-open")) return;
    const inside = navRight.contains(e.target) || menuIcon.contains(e.target);
    if (!inside) closeMenu();
  });

  document.addEventListener("touchstart", (e) => {
    if (!navRight.classList.contains("is-open")) return;
    const inside = navRight.contains(e.target) || menuIcon.contains(e.target);
    if (!inside) closeMenu();
  }, { passive: true });

  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    if (!navRight.classList.contains("is-open")) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => closeMenu(), 120);
  });

  window.addEventListener("resize", () => closeMenu());

  try {
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-right a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  } catch (err) {
    console.warn("Active link highlight failed:", err);
  }
});
