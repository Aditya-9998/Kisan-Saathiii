// Js/advisory.js — PART 1 of 3
// (Imports + popup system + helpers + soils rendering + soil selection + season listeners)

// --- Data imports (adjust paths relative to Js/advisory.js) ---
import { soils, seasonsInfo, getSoilRegions } from '../data/soils.js';
import { crops } from '../data/crops.js';
import { getEquipmentForCrop } from '../data/equipment.js';
import { fertilizers } from '../data/fertilizers.js';

/* ==========================================================
   SMART POPUP / INFO BOX (single DOM node #info-popup)
   - auto positions to the right/left and avoids overflow
   - used for soil region info, fertilizer tooltip, equipment tooltip
   - hide logic handled by global mouseover (keeps things simple)
========================================================== */
function showSmartPopup(target, html) {
    const popup = document.getElementById("info-popup");
    if (!popup || !target) return;

    popup.innerHTML = html;
    popup.style.display = "block";
    popup.style.opacity = "1";

    // force layout read to get bounding rects
    const iconRect = target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    // default position: to the right of icon, vertically aligned to icon top
    let left = iconRect.right + 10 + window.scrollX;
    let top = iconRect.top + window.scrollY - 6;

    // if overflow right -> place on left of icon
    if (left + popupRect.width > window.innerWidth - 12 + window.scrollX) {
        left = iconRect.left - popupRect.width - 10 + window.scrollX;
    }

    // keep inside left boundary
    if (left < 8 + window.scrollX) left = 8 + window.scrollX;

    // if overflows bottom -> lift popup above the icon
    if (top + popupRect.height > window.scrollY + window.innerHeight - 12) {
        top = iconRect.top + window.scrollY - popupRect.height - 8;
    }

    popup.style.left = `${Math.round(left)}px`;
    popup.style.top = `${Math.round(top)}px`;
}

function hideSmartPopup() {
    const popup = document.getElementById("info-popup");
    if (!popup) return;
    popup.style.display = "none";
    popup.style.opacity = "0";
}

// hide popup whenever mouse moves to a non-info icon element
document.addEventListener("mouseover", (e) => {
    const t = e.target;
    if (!t) return;
    if (
        t.classList && (
            t.classList.contains("info-icon") ||
            t.classList.contains("info-icon-fert") ||
            t.classList.contains("info-icon-equip")
        )
    ) {
        // keep it (the icon's own mouseenter handler will open it)
        return;
    }
    hideSmartPopup();
});

/* ==========================================================
   Helpers
========================================================== */
const roundKg = v => Math.round((v ?? 0) * 10) / 10;
const cap = s => s ? ("" + s).charAt(0).toUpperCase() + ("" + s).slice(1) : "";

const getL = (obj = {}, prop) => {
    // flexible language accessor: supports string or {en:..., hi:...}
    if (!obj || typeof obj !== "object") return "";
    const value = obj[prop];
    if (value === undefined || value === null) return "";
    if (typeof value === "object" && !Array.isArray(value)) {
        return value.en || value.hi || "";
    }
    return String(value);
};

const getArrayL = (obj = {}, prop) => {
    const value = obj[prop];
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return value.en || value.hi || [];
    return [];
};

// unit conversions (ACRE-centric internal)
const ACER_PER_BIGHA = 1 / 1.613;   // ~0.62 acres per bigha
const ACER_PER_KATHA = ACER_PER_BIGHA / 20;
const ACER_PER_DHUR = ACER_PER_KATHA / 20;
const unitToAcre = {
    acre: 1,
    hectare: 2.47105,
    bigha: ACER_PER_BIGHA,
    katha: ACER_PER_KATHA,
    dhur: ACER_PER_DHUR
};

/* ==========================================================
   Main DOM references (initialized on DOMContentLoaded)
========================================================== */
let soilListEl, cropGridEl, fertSectionEl, fertDisplaySectionEl, equipSectionEl;
let modal, modalBody, closeModalBtn, mainAdvisoryContainer;

/* ==========================================================
   Startup: main advisory flow
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // DOM refs
    soilListEl = document.getElementById("soil-horizontal-list");
    cropGridEl = document.getElementById("crop-recommendation-grid");
    fertSectionEl = document.getElementById("section-fertilizer");
    fertDisplaySectionEl = document.getElementById("section-fertilizer-display");
    equipSectionEl = document.getElementById("section-equipment");
    modal = document.getElementById("process-modal");
    modalBody = document.getElementById("modal-body");
    closeModalBtn = document.querySelector(".close-btn");
    mainAdvisoryContainer = document.getElementById("advisory-main-content");

    // wire modal close
    closeModalBtn?.addEventListener("click", () => { modal.style.display = "none"; });
    modal?.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.style.display = "none"; });

    // initialize UI pieces (other update functions live in later parts)
    renderSoils();
    attachSeasonListeners();
    // updateCropList() will be called by renderSoils via select defaults
});


/* ==========================================================
   1) Render soils horizontally (images, info icon, click)
   - Converts absolute windows paths to relative ../images/xxx if needed
   - Uses a soft default selection (alluvial if present)
========================================================== */
function renderSoils() {
    if (!soilListEl) return;

    soilListEl.innerHTML = ""; // clear

    // default selection fallback
    let defaultSoilId = (soils.find(s => s.id === "alluvial") || soils[0] || {}).id;
    if (!defaultSoilId && soils.length) defaultSoilId = soils[0].id;

    // keep a module-level selected id (initially default)
    if (typeof window.__advisory_selected_soil === "undefined") {
        window.__advisory_selected_soil = defaultSoilId;
    }

    soils.forEach(s => {
        const isActive = s.id === window.__advisory_selected_soil ? "active" : "";
        const soilCard = document.createElement("div");
        soilCard.className = `soil-card-horizontal ${isActive}`;
        soilCard.dataset.soil = s.id;

        // build sanitized image filename relative to ../images/
        let bgUrl = "";
        if (s.bgImage) {
            // if s.bgImage is an absolute Windows path C:\... or contains folder segments, extract filename
            const raw = String(s.bgImage);
            const filename = raw.split("\\").pop().split("/").pop();
            bgUrl = `../images/${filename}`;
            // If you are serving from server root you might prefer `/images/${filename}`
        }

        if (bgUrl) {
            soilCard.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.38)), url('${bgUrl}')`;
            soilCard.style.backgroundSize = "cover";
            soilCard.style.backgroundPosition = "center";
            // ensure text contrast
            soilCard.style.color = "#fff";
        }

        const soilName = `${s.hindi ? s.hindi + " " : ""}(${s.name || s.id})`;
        const regions = (typeof getSoilRegions === "function") ? (getSoilRegions(s.id) || "") : "";

        soilCard.innerHTML = `
      <div class="soil-name">${soilName}</div>
      <i class="fas fa-info-circle info-icon" title="View Regions"></i>
    `;

        // clicking card selects soil (but not when clicking the info icon)
        soilCard.addEventListener("click", (e) => {
            if (e.target && e.target.classList && e.target.classList.contains("info-icon")) return;
            selectSoil(s.id);
        });

        // info icon -> show smart popup with region list
        const infoIcon = soilCard.querySelector(".info-icon");
        if (infoIcon) {
            infoIcon.addEventListener("mouseenter", (ev) => {
                const html = `<strong>${soilName}</strong><br>${String(regions).split(";").map(r => r.trim()).filter(Boolean).join("<br>")}`;
                showSmartPopup(ev.currentTarget, html);
            });
            // mouseleave handled by global mouseover/hide logic
        }

        soilListEl.appendChild(soilCard);
    });

    // ensure at least one is active and initialize crop list (calls updateCropList in Part 2)
    const activeEl = document.querySelector(".soil-card-horizontal.active");
    if (activeEl) {
        // set global selected so other functions can read it
        window.__advisory_selected_soil = activeEl.dataset.soil;
    } else if (soils[0]) {
        window.__advisory_selected_soil = soils[0].id;
        document.querySelector(`.soil-card-horizontal[data-soil="${soils[0].id}"]`)?.classList.add("active");
    }

    // call the crop list update from Part 2 — safe to call even if function will be declared later
    if (typeof updateCropList === "function") updateCropList();
}

/* ==========================================================
   2) selectSoil(id)
   - updates active class
   - resets crop selection
   - enables crops section
   - scrolls smoothly to crops section so user sees the next step
========================================================== */
function selectSoil(id) {
    window.__advisory_selected_soil = id;
    window.__advisory_selected_crop = null; // reset current crop

    // toggle active class
    document.querySelectorAll(".soil-card-horizontal").forEach(el => el.classList.remove("active"));
    const el = document.querySelector(`.soil-card-horizontal[data-soil="${id}"]`);
    if (el) el.classList.add("active");

    // enable crop section and reset downstream sections
    document.getElementById("section-crops")?.classList.remove("disabled");
    fertSectionEl?.classList.add("disabled");
    fertDisplaySectionEl?.classList.add("disabled");
    equipSectionEl?.classList.add("disabled");

    // update crop list (function implemented in Part 2)
    if (typeof updateCropList === "function") updateCropList();
    if (typeof updateFertilizerSection === "function") updateFertilizerSection();
    if (typeof updateFertilizerDisplaySection === "function") updateFertilizerDisplaySection();
    if (typeof updateEquipmentSection === "function") updateEquipmentSection();

    // smooth scroll to crops section for better UX
    const cropsSection = document.getElementById("section-crops");
    if (cropsSection) {
        cropsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/* ==========================================================
   3) Season tab listeners
   - toggles selectedSeason and refreshes crop list
========================================================== */
function attachSeasonListeners() {
    document.querySelectorAll("#season-tabs .season-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll("#season-tabs .season-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            window.__advisory_selected_season = tab.dataset.season || "kharif";
            window.__advisory_selected_crop = null;

            // disable downstream sections until crop chosen
            fertSectionEl?.classList.add("disabled");
            fertDisplaySectionEl?.classList.add("disabled");
            equipSectionEl?.classList.add("disabled");

            if (typeof updateCropList === "function") updateCropList();
            if (typeof updateFertilizerSection === "function") updateFertilizerSection();
            if (typeof updateFertilizerDisplaySection === "function") updateFertilizerDisplaySection();
            if (typeof updateEquipmentSection === "function") updateEquipmentSection();
        });
    });
}

// --- End of PART 1 ---
// PART 2 will contain crop rendering, fertilizer calculator and display logic.
// PART 3 will contain equipment, modal & initialization polish.
/* ==========================================================
   PART 2 — Crop List, Fertilizer Calculator, Fertilizer Display
========================================================== */

/* 
  Shared Global State:
  window.__advisory_selected_soil
  window.__advisory_selected_season
  window.__advisory_selected_crop
*/

/* ==========================================================
   4) Render Crop List
========================================================== */
function updateCropList() {
    if (!cropGridEl) return;
    cropGridEl.innerHTML = "";

    const soil = window.__advisory_selected_soil || "alluvial";
    const season = window.__advisory_selected_season || "kharif";

    // filter crops by soil + season
    const list = Object.entries(crops).filter(([key, c]) =>
        Array.isArray(c.seasons) &&
        c.seasons.includes(season) &&
        Array.isArray(c.soils) &&
        c.soils.includes(soil)
    );

    if (!list.length) {
        cropGridEl.innerHTML = `
      <div class="empty-message" style="padding:20px;text-align:center;">
        ❌ No crops found.
      </div>`;
        return;
    }

    list.forEach(([key, crop]) => {
        const imgName = (crop.picture || "").split("\\").pop().split("/").pop();

        const card = document.createElement("div");
        card.className = "crop-card four-per-row";
        card.dataset.key = key;

        const isSelected = (window.__advisory_selected_crop === key);

        card.innerHTML = `
      <div class="crop-image-container">
        <img src="../images/${imgName}" class="crop-image">
      </div>

      <div class="crop-details-content">
        <h4>${crop.hindiName} (${crop.name})</h4>
        <span class="tag profitable">${crop.profitable ? "Profitable" : "Varies"}</span>
      </div>

      <div class="card-actions">
        <button class="details-btn">Details</button>
        <button class="select-btn-crop" 
            data-key="${key}"
            style="background:${isSelected ? "#00bcd4" : "#4CAF50"};">
          Select
        </button>
      </div>
    `;

        // modal
        card.querySelector(".details-btn").addEventListener("click", () => openModal(key));

        // select crop
        card.querySelector(".select-btn-crop").addEventListener("click", (ev) => {
            window.__advisory_selected_crop = key;

            document.querySelectorAll(".select-btn-crop")
                .forEach(btn => btn.style.background = "#4CAF50");

            ev.target.style.background = "#00bcd4";

            fertSectionEl?.classList.remove("disabled");
            fertDisplaySectionEl?.classList.remove("disabled");
            equipSectionEl?.classList.remove("disabled");

            updateFertilizerSection();
            updateFertilizerDisplaySection();
            updateEquipmentSection();

            // ➤ Scroll user down to fertilizer calculator automatically
            fertSectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        cropGridEl.appendChild(card);
    });
}


/* ==========================================================
   5) Fertilizer Calculator for Selected Crop
========================================================== */
function updateFertilizerSection() {
    const calcUI = document.getElementById("fertilizer-calculator-ui");
    const fertDetailsEl = document.getElementById("selected-crop-fert-details");

    if (!window.__advisory_selected_crop) {
        calcUI.innerHTML = "<p>Select crop.</p>";
        fertDetailsEl.innerHTML = "";
        return;
    }

    const crop = crops[window.__advisory_selected_crop];

    calcUI.innerHTML = `
    <h3><i class="fas fa-calculator"></i> Fertilizer Calculator</h3>

    <div class="fertilizer-calc">
      <label>Area:
        <input type="number" id="field-size" value="1" min="0.1">
      </label>

      <select id="field-unit">
        <option value="acre">Acre</option>
        <option value="hectare">Hectare</option>
        <option value="bigha">Bigha</option>
        <option value="katha">Katha</option>
        <option value="dhur">Dhur</option>
      </select>
    </div>

    <div id="fert-result" class="fert-box"></div>
  `;

    const fieldSize = document.getElementById("field-size");
    const fieldUnit = document.getElementById("field-unit");

    const fert = crop.fertilizersPerAcre || {};

    function calc() {
        const area = (parseFloat(fieldSize.value) || 1) * (unitToAcre[fieldUnit.value] || 1);

        document.getElementById("fert-result").innerHTML = `
      <p><strong>${crop.hindiName}</strong></p>
      <ul>
        ${fert.urea ? `<li>Urea: <b>${roundKg(fert.urea * area)} kg</b></li>` : ""}
        ${fert.dap ? `<li>DAP: <b>${roundKg(fert.dap * area)} kg</b></li>` : ""}
        ${fert.mop ? `<li>MOP: <b>${roundKg(fert.mop * area)} kg</b></li>` : ""}
      </ul>
    `;
    }

    fieldSize.addEventListener("input", calc);
    fieldUnit.addEventListener("change", calc);
    calc();

    fertDetailsEl.innerHTML = `
    <h3>General Guide</h3>
    <div class="fert-grid-view">
      <div class="fert-detail-card">
        Use NPK based on soil test.
      </div>
    </div>
  `;
}


/* ==========================================================
   6) Fertilizer Display Cards + Popups (Correct Data)
========================================================== */
function updateFertilizerDisplaySection() {
    const gridBox = document.getElementById("fertilizer-display-grid");
    if (!window.__advisory_selected_crop) {
        gridBox.innerHTML = "<p>Select crop</p>";
        return;
    }

    const crop = crops[window.__advisory_selected_crop];
    const names = new Set();

    // From fertilizersList[] names
    (crop.fertilizersList || []).forEach(f => names.add(f.name));

    // From fertilizersPerAcre
    const per = crop.fertilizersPerAcre || {};
    if (per.urea) names.add("Urea");
    if (per.dap) names.add("Di-Ammonium Phosphate (DAP)");
    if (per.mop) names.add("Muriate of Potash (MOP)");

    const list = fertilizers.filter(f => names.has(f.name));

    gridBox.innerHTML = `
    <h3>Recommended Fertilizers</h3>
    <div class="fertilizer-cards-grid"></div>
  `;

    const grid = gridBox.querySelector(".fertilizer-cards-grid");

    list.forEach(f => {
        const imgName = (f.image || "").split("\\").pop().split("/").pop();

        const div = document.createElement("div");
        div.className = "fertilizer-card";

        div.innerHTML = `
      <div class="card-top-bar">
        <img src="../images/${imgName}">
        <i class="fas fa-info-circle info-icon-fert"
           data-usage="${getL(f, 'application')}"
           data-dosage="${getL(f, 'dosageNotes')}"
           data-safety="${getL(f, 'safetyNotes')}">
        </i>
      </div>

      <h4>${f.hindi} (${f.name})</h4>
      <p>${getL(f, 'primaryUse')}</p>
    `;

        // popup fix — now shows correct values
        div.querySelector(".info-icon-fert").addEventListener("mouseenter", (ev) => {
            showSmartPopup(ev.currentTarget, `
        <strong>${f.hindi}</strong><hr>
        <b>Use:</b> ${getL(f, 'application')}<br>
        <b>Dosage:</b> ${getL(f, 'dosageNotes')}<br>
        <b>Safety:</b> ${getL(f, 'safetyNotes')}
      `);
        });

        grid.appendChild(div);
    });
}
/* ==========================================================
   PART 3 — Equipment Section, Modal, Final Init
========================================================== */

/* ==========================================================
   7) Equipment Section (Correct Layout + Popup Fix)
========================================================== */
function updateEquipmentSection() {
    const wrap = document.getElementById("equipment-recommendations");
    if (!window.__advisory_selected_crop) {
        wrap.innerHTML = "<p>Select crop</p>";
        return;
    }

    const crop = crops[window.__advisory_selected_crop];
    const list = getEquipmentForCrop(crop.name);

    wrap.innerHTML = `
    <h3>Recommended Equipment</h3>
    <div class="equipment-grid"></div>
  `;

    const grid = wrap.querySelector(".equipment-grid");

    list.forEach(e => {
        const imgName = (e.image || "").split("\\").pop().split("/").pop();

        const div = document.createElement("div");
        div.className = "equipment-card";

        div.innerHTML = `
      <div class="card-top-bar">
        <img src="../images/${imgName}" class="equip-image">
        <i class="fas fa-info-circle info-icon-equip"
           data-usage="${e.uses}"
           data-safety="${e.safety}">
        </i>
      </div>
      <h4>${e.hindi} (${e.name})</h4>
    `;

        // FIXED: beige popup with correct values
        div.querySelector(".info-icon-equip").addEventListener("mouseenter", (ev) => {
            showSmartPopup(ev.currentTarget, `
        <strong>${e.hindi}</strong><hr>
        <b>Use:</b> ${e.uses}<br>
        <b>Safety:</b> ${e.safety}
      `);
        });

        grid.appendChild(div);
    });
}


/* ==========================================================
   8) Crop Process Modal
========================================================== */
function openModal(key) {
    const crop = crops[key];
    if (!crop) return;

    modalBody.innerHTML = `
    <h2>${crop.hindiName} (${crop.name})</h2>
    <hr>

    <h3>Full Process</h3>
    <ul>
      ${crop.process
            .map(p => `<li><b>${getL(p, "step")}:</b> ${getL(p, "detail")}</li>`)
            .join("")}
    </ul>

    <h3>Fertilizers</h3>
    <ul>
      ${(crop.fertilizersList || [])
            .map(f => `<li><b>${getL(f, "name") || f.name}:</b> ${getL(f, "recommendation")}</li>`)
            .join("")}
    </ul>

    <h3>Pests</h3>
    <ul>
      ${(crop.pesticides || [])
            .map(p => `<li><b>${p.active}:</b> ${getL(p, "use")}</li>`)
            .join("")}
    </ul>

    <h3>Equipment</h3>
    <p>${(crop.equipment || []).join(", ")}</p>

    <h3>Economics</h3>
    <ul>
      <li><strong>Cost:</strong> ₹${crop.economics?.costPerAcre || "Varies"}</li>
      <li><strong>Yield:</strong> ${crop.economics?.expectedYield || "Varies"}</li>
      <li><strong>Market Price:</strong> ${crop.economics?.marketPrice || "Varies"}</li>
      <li><strong>ROI:</strong> ${crop.economics?.roi || "Varies"}</li>
    </ul>
  `;

    modal.style.display = "flex";
}


/* ==========================================================
   9) Final Initialization
========================================================== */
function advisoryInit() {
    // Everything starts from soil
    renderSoils();
    attachSeasonListeners();

    fertSectionEl.classList.add("disabled");
    fertDisplaySectionEl.classList.add("disabled");
    equipSectionEl.classList.add("disabled");

    console.log("Kisan Saathii Advisory System Loaded (All 3 Parts Ready)");
}

// Call init when DOM is ready (Part 1 DOMContentLoaded triggers earlier)
setTimeout(advisoryInit, 100);
