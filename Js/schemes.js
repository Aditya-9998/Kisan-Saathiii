// js/schemes.js
(function () {
    const schemesData = [
        {
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            text: "Crop insurance scheme for farmers to protect against crop failure due to natural calamities.",
            link: "https://pmfby.gov.in/",
            langKeyTitle: "schemes.pmfby.title",
            langKeyText: "schemes.pmfby.text"
        },
        {
            title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            text: "A central sector scheme providing income support to all landholding farmer families.",
            link: "https://pmkisan.gov.in/",
            langKeyTitle: "schemes.pmkisan.title",
            langKeyText: "schemes.pmkisan.text"
        },
        {
            title: "Kisan Credit Card (KCC)",
            text: "Provides timely and adequate credit support to farmers for their agricultural needs.",
            link: "https://www.india.gov.in/scheme-kisan-credit-card-kcc-scheme",
            langKeyTitle: "schemes.kcc.title",
            langKeyText: "schemes.kcc.text"
        },
        {
            title: "e-NAM (National Agriculture Market)",
            text: "An online trading portal for agricultural commodities to ensure fair prices for farmers.",
            link: "https://www.enam.gov.in/web/",
            langKeyTitle: "schemes.enam.title",
            langKeyText: "schemes.enam.text"
        }
    ];

    const schemesContainer = document.querySelector(".schemes-carousel");
    const dotsContainer = document.querySelector(".carousel-dots");
    let currentSchemeIndex = 0;
    let carouselInterval = null;

    // Helper function to safely get translations
    function getSchemeTranslation(key, translations) {
        if (!translations || !key) return null;
        const keys = key.split(".");
        let res = translations;
        for (const k of keys) {
            if (res && typeof res === "object" && Object.prototype.hasOwnProperty.call(res, k)) {
                res = res[k];
            } else {
                return null; // Return null if key is not found
            }
        }
        return typeof res === "string" ? res : null;
    }

    function renderScheme(translations) {
        if (!schemesContainer) return;

        const scheme = schemesData[currentSchemeIndex];

        // Try to get translation, otherwise use default English text
        const titleToShow = getSchemeTranslation(scheme.langKeyTitle, translations) || scheme.title;
        const textToShow = getSchemeTranslation(scheme.langKeyText, translations) || scheme.text;

        schemesContainer.innerHTML = ""; // Clear previous content
        const schemeCard = document.createElement("a");
        schemeCard.href = scheme.link;
        schemeCard.target = "_blank";
        schemeCard.classList.add("scheme-card", "active"); // Add 'active' class to show it

        schemeCard.innerHTML = `
            <h3 class="scheme-title">${titleToShow}</h3>
            <p class="scheme-text">${textToShow}</p>
        `;
        schemesContainer.appendChild(schemeCard);

        // Update dots active state
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll(".dot");
            dots.forEach((dot, index) => dot.classList.toggle("active", index === currentSchemeIndex));
        }
    }

    function startCarousel(translations) {
        if (carouselInterval) clearInterval(carouselInterval);
        
        renderScheme(translations); // Render the first scheme immediately
        
        carouselInterval = setInterval(() => {
            currentSchemeIndex = (currentSchemeIndex + 1) % schemesData.length;
            renderScheme(translations);
        }, 2000); // Change slide every 5 seconds
    }

    // This event listener will re-start the carousel with the new language
    document.addEventListener("translationsLoaded", (event) => {
        const { translations } = event.detail || {};
        startCarousel(translations || {});
    });

    // This runs when the page is first loaded
    document.addEventListener("DOMContentLoaded", () => {
        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = schemesData.map((_, idx) => 
                `<span class="dot ${idx === 0 ? "active" : ""}" data-index="${idx}"></span>`
            ).join("");

            dotsContainer.addEventListener("click", (e) => {
                if (e.target && e.target.classList.contains("dot")) {
                    currentSchemeIndex = Number(e.target.dataset.index);
                    // Restart carousel with current language to show selected slide
                    startCarousel(window.currentTranslations || {});
                }
            });
        }

        // --- FIX IS HERE ---
        // Immediately start the carousel with default English text.
        // Don't wait for the 'translationsLoaded' event.
        startCarousel({});
        // -----------------
    });

})();