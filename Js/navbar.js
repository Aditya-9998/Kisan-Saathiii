// Js/navbar.js

document.addEventListener("DOMContentLoaded", () => {
    // Nav bar content create karne ke liye t() function ki zaroorat nahi hai, 
    // kyunki language.js baad mein translation handle karega.

    // Create header (using the standard English text, which will be replaced by language.js)
    const header = document.createElement("header");
    header.classList.add("navbar");
    header.innerHTML = `
        <div class="logo-and-language">
            <div class="logo">🌿किसान Saathiii🌿</div>
            <div class="language-switcher">
                <select id="language-select">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>
        </div>
        <input type="checkbox" id="menu-toggle">
        <label for="menu-toggle" class="menu-icon">
            <span class="hamburger">&#9776;</span>
            <span class="close">✕</span>
        </label>
        <nav class="nav-links">
            <ul>
                <li><a href="index.html" data-lang-key="navbar.home">Home</a></li>
                <li><a href="weather.html" data-lang-key="navbar.weather">Weather</a></li>
                <li><a href="advisory.html" data-lang-key="navbar.advisory">Advisory</a></li>
                <li><a href="news.html" data-lang-key="navbar.news">News</a></li>
                <li><a href="insurance.html" data-lang-key="navbar.insurance">Insurance</a></li>
                <li><a href="mrp-rate.html" data-lang-key="navbar.mrpRate">MRP Rate</a></li>
                <li><a href="about.html" data-lang-key="navbar.about">About</a></li>
                <li><a href="login.html" data-lang-key="navbar.loginSignup" id="auth-link">Login / Sign Up</a></li>
            </ul>
        </nav>
    `;
    
    // Inject the created header into the container
    const navbarElement = document.getElementById("navbar");
    if (navbarElement) {
        navbarElement.appendChild(header);
    } else {
        document.body.prepend(header);
    }

    // Highlight active page
    const links = header.querySelectorAll("a");
    links.forEach(link => {
        const currentPath = window.location.pathname.split('/').pop();
        const linkPath = link.getAttribute("href");
        if (currentPath === linkPath || (currentPath === "" && linkPath === "index.html")) {
            link.classList.add("active");
        }
    });

    // NOTE: Language change handler ko language.js mein shift kiya gaya hai.
});