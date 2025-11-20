// Js/navbar.js – Google Auto Translation Compatible Version (FINAL)

document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return console.error("Navbar container not found.");

  // Inject Navbar HTML
  navbarContainer.innerHTML = `
    <header class="navbar">
      <div class="container">
        <div class="nav-left">
          <div class="logo">🌿Kisaan Saathiii🌿</div>
        </div>

        <div class="nav-right" id="navRightGroup">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="weather.html">Weather</a></li>
            <li><a href="advisory.html">Advisory</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="insurance.html">Crop Insurance</a></li>
            <li><a href="mrp.html">MRP Rates</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="login.html" class="login-btn">Login / Signup</a></li>
          </ul>

          <!-- ⭐ GOOGLE TRANSLATE DROPDOWN ⭐ -->
          <div id="google_element" style="margin-left:12px;"></div>
        </div>

        <div class="menu-icon" id="menuIcon" aria-label="Toggle menu" role="button" tabindex="0">
          <span class="hamburger">☰</span>
          <span class="close" style="display:none;">✕</span>
        </div>
      </div>
    </header>
  `;

  // Dispatch navbar load event
  document.dispatchEvent(new Event("navbarLoaded"));

  // ========== Responsive Mobile Menu ==========
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
    if (navRight.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  if (menuIcon && navRight) {
    menuIcon.addEventListener("click", toggleMenu);

    // Keyboard accessibility: Enter / Space triggers toggle
    menuIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  // Close menu on any navbar link click
  navRight.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  // Close when clicking outside menu
  document.addEventListener("click", (e) => {
    if (!navRight.classList.contains("is-open")) return;
    const clickedInside = navRight.contains(e.target) || menuIcon.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // Close on touch outside (mobile)
  document.addEventListener(
    "touchstart",
    (e) => {
      if (!navRight.classList.contains("is-open")) return;
      const clickedInside = navRight.contains(e.target) || menuIcon.contains(e.target);
      if (!clickedInside) closeMenu();
    },
    { passive: true }
  );

  // Close after scroll stop (debounced)
  let scrollTimer = null;
  function onScrollClose() {
    if (!navRight.classList.contains("is-open")) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      closeMenu();
      scrollTimer = null;
    }, 120);
  }

  window.addEventListener("scroll", onScrollClose, { passive: true });
  window.addEventListener("touchmove", onScrollClose, { passive: true });

  // Close on resize (prevents stuck menu)
  window.addEventListener("resize", () => closeMenu());

  // Highlight active nav item
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
