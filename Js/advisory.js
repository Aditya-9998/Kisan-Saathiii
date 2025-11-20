// =============================================================
//  KISAAN SAATHII – SMART ADVISORY (FINAL CLEAN VERSION)
//  PART 1 / 3  → Imports + Popup System + Soil + Season + Crops
// =============================================================

// -------- Import Data --------
import { soils, getSoilRegions } from "../data/soils.js";
import { crops } from "../data/crops.js";
import { fertilizers } from "../data/fertilizers.js";
import { getEquipmentForCrop } from "../data/equipment.js";


// =============================================================
// SMART POPUP SYSTEM
// =============================================================
function showSmartPopup(target, html) {
    const popup = document.getElementById("info-popup");
    if (!popup) return;

    popup.innerHTML = html;
    popup.style.display = "block";

    const rect = target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    let left = rect.right + 10;
    let top = rect.top + window.scrollY - 5;

    if (left + popupRect.width > window.innerWidth - 10) {
        left = rect.left - popupRect.width - 10;
    }

    if (top + popupRect.height > window.innerHeight + window.scrollY - 10) {
        top = rect.top + window.scrollY - popupRect.height - 10;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
}

document.addEventListener("mouseover", (e) => {
    if (
        !e.target.classList.contains("info-icon") &&
        !e.target.classList.contains("info-icon-fert") &&
        !e.target.classList.contains("info-icon-equip")
    ) {
        const popup = document.getElementById("info-popup");
        if (popup) popup.style.display = "none";
    }
});


// =============================================================
// GLOBAL STATE
// =============================================================
let selectedSoilId = "alluvial";
let selectedSeason = "kharif";
let selectedCropKey = null;


// =============================================================
// UNIT CONVERSION
// =============================================================
const ACER_PER_BIGHA = 1 / 1.613;
const ACER_PER_KATHA = ACER_PER_BIGHA / 20;
const ACER_PER_DHUR = ACER_PER_KATHA / 20;

const unitToAcre = {
    acre: 1,
    hectare: 2.47105,
    bigha: ACER_PER_BIGHA,
    katha: ACER_PER_KATHA,
    dhur: ACER_PER_DHUR
};

const roundKg = (v) => Math.round(v * 10) / 10;

const getL = (obj, prop) => {
    const val = obj[prop];
    return typeof val === "object" && val !== null
        ? val.en || val.hi || ""
        : val || "";
};


// =============================================================
// DOM REFERENCES
// =============================================================
const soilListEl = document.getElementById("soil-horizontal-list");
const cropGridEl = document.getElementById("crop-recommendation-grid");
const fertSectionEl = document.getElementById("section-fertilizer");
const fertDisplaySectionEl = document.getElementById("section-fertilizer-display");
const equipSectionEl = document.getElementById("section-equipment");
const modal = document.getElementById("process-modal");
const modalBody = document.getElementById("modal-body");


// =============================================================
// 1) RENDER SOILS
// =============================================================
function renderSoils() {
    soilListEl.innerHTML = "";

    soils.forEach((s) => {
        const isActive = s.id === selectedSoilId ? "active" : "";
        const card = document.createElement("div");
        card.className = `soil-card-horizontal ${isActive}`;
        card.dataset.soil = s.id;

        const imgName = s.bgImage.split("\\").pop().split("/").pop();

        card.style.backgroundImage = `
            linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),
            url('../images/${imgName}')
        `;

        const soilName = `${s.hindi} (${s.name})`;
        const regions = getSoilRegions(s.id);

        card.innerHTML = `
            <div class="soil-name">${soilName}</div>
            <i class="fas fa-info-circle info-icon"></i>
        `;

        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("info-icon")) return;
            selectSoil(s.id);
        });

        card.querySelector(".info-icon").addEventListener("mouseenter", (ev) => {
            showSmartPopup(ev.target, `
                <strong>${soilName}</strong><br>${regions.split(";").join("<br>")}
            `);
        });

        soilListEl.appendChild(card);
    });
}


// =============================================================
// 2) SELECT SOIL
// =============================================================
function selectSoil(id) {
    selectedSoilId = id;
    selectedCropKey = null;

    document.querySelectorAll(".soil-card-horizontal")
        .forEach((el) => el.classList.remove("active"));

    document
        .querySelector(`.soil-card-horizontal[data-soil="${id}"]`)
        .classList.add("active");

    document.getElementById("section-crops")?.classList.remove("disabled");
    fertSectionEl.classList.add("disabled");
    fertDisplaySectionEl.classList.add("disabled");
    equipSectionEl.classList.add("disabled");

    updateCropList();

    document
        .getElementById("section-crops")
        .scrollIntoView({ behavior: "smooth" });
}


// =============================================================
// 3) SEASON TABS
// =============================================================
function attachSeasonListeners() {
    document.querySelectorAll("#season-tabs .season-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll("#season-tabs .season-tab")
                .forEach((t) => t.classList.remove("active"));

            tab.classList.add("active");
            selectedSeason = tab.dataset.season;
            selectedCropKey = null;

            fertSectionEl.classList.add("disabled");
            fertDisplaySectionEl.classList.add("disabled");
            equipSectionEl.classList.add("disabled");

            updateCropList();
        });
    });
}


// =============================================================
// 4) UPDATE CROP LIST
// =============================================================
function updateCropList() {
    cropGridEl.innerHTML = "";

    const filtered = Object.entries(crops).filter(([key, c]) =>
        c.seasons.includes(selectedSeason) &&
        c.soils.includes(selectedSoilId)
    );

    if (!filtered.length) {
        cropGridEl.innerHTML = `
            <div class="empty-message" style="text-align:center;padding:20px;">
                ❌ No crops found.
            </div>`;
        return;
    }

    filtered.forEach(([key, crop]) => {
        const img = crop.picture.split("\\").pop().split("/").pop();
        const isSelected = key === selectedCropKey;

        const card = document.createElement("div");
        card.className = "crop-card four-per-row";

        card.innerHTML = `
            <div class="crop-image-container">
                <img src="../images/${img}" class="crop-image" />
            </div>

            <div class="crop-details-content">
                <h4>${crop.hindiName} (${crop.name})</h4>
                <span class="tag profitable">${crop.profitable ? "Profitable" : "Varies"}</span>
            </div>

            <div class="card-actions">
                <button class="details-btn" data-key="${key}">Details</button>
                <button class="select-btn-crop"
                    data-key="${key}"
                    style="background:${isSelected ? "#00bcd4" : "#4CAF50"};">
                    Select
                </button>
            </div>
        `;

        card.querySelector(".details-btn").addEventListener("click", () => {
            openModal(key);
        });

        card.querySelector(".select-btn-crop").addEventListener("click", (ev) => {
            selectedCropKey = key;

            document
                .querySelectorAll(".select-btn-crop")
                .forEach((btn) => (btn.style.background = "#4CAF50"));

            ev.target.style.background = "#00bcd4";

            fertSectionEl.classList.remove("disabled");
            fertDisplaySectionEl.classList.remove("disabled");
            equipSectionEl.classList.remove("disabled");

            updateFertilizerSection();
            updateFertilizerDisplaySection();
            updateEquipmentSection();

            document
                .getElementById("section-fertilizer")
                .scrollIntoView({ behavior: "smooth" });
        });

        cropGridEl.appendChild(card);
    });
}


// =============================================================
// 5) FERTILIZER CALCULATOR
// =============================================================
function updateFertilizerSection() {
    const calcUI = document.getElementById("fertilizer-calculator-ui");
    const fertDetailsEl = document.getElementById("selected-crop-fert-details");

    if (!selectedCropKey) {
        calcUI.innerHTML = "<p>Select a crop first.</p>";
        fertDetailsEl.innerHTML = "";
        return;
    }

    const crop = crops[selectedCropKey];

    calcUI.innerHTML = `
        <h3><i class="fas fa-calculator"></i> Fertilizer Calculator</h3>

        <div class="fertilizer-calc">
            <label>Area:
                <input type="number" id="field-size" value="1" min="0.1" step="0.1">
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

    const sizeInput = document.getElementById("field-size");
    const unitInput = document.getElementById("field-unit");

    function calculate() {
        const perAcre = crop.fertilizersPerAcre || {};
        const size = parseFloat(sizeInput.value) || 1;
        const area = size * (unitToAcre[unitInput.value] || 1);

        document.getElementById("fert-result").innerHTML = `
            <p><strong>${crop.hindiName}</strong></p>
            <ul>
                ${perAcre.urea ? `<li>Urea: <b>${roundKg(perAcre.urea * area)} kg</b></li>` : ""}
                ${perAcre.dap ? `<li>DAP: <b>${roundKg(perAcre.dap * area)} kg</b></li>` : ""}
                ${perAcre.mop ? `<li>MOP: <b>${roundKg(perAcre.mop * area)} kg</b></li>` : ""}
            </ul>
        `;
    }

    sizeInput.addEventListener("input", calculate);
    unitInput.addEventListener("change", calculate);
    calculate();

    fertDetailsEl.innerHTML = `
        <h3>General Guide</h3>
        <div class="fert-grid-view">
            <div class="fert-detail-card">
                Apply NPK based on soil testing.
            </div>
        </div>
    `;
}


// =============================================================
// 6) FERTILIZER DISPLAY
// =============================================================
function updateFertilizerDisplaySection() {
    const display = document.getElementById("fertilizer-display-grid");

    if (!selectedCropKey) {
        display.innerHTML = "<p>Select a crop first.</p>";
        return;
    }

    const crop = crops[selectedCropKey];
    const fertNames = new Set();

    (crop.fertilizersList || []).forEach(f => fertNames.add(f.name));

    const per = crop.fertilizersPerAcre || {};
    if (per.urea) fertNames.add("Urea");
    if (per.dap) fertNames.add("Di-Ammonium Phosphate (DAP)");
    if (per.mop) fertNames.add("Muriate of Potash (MOP)");

    const list = fertilizers.filter(f => fertNames.has(f.name));

    display.innerHTML = `
        <h3>Recommended Fertilizers</h3>
        <div class="fertilizer-cards-grid"></div>
    `;

    const grid = display.querySelector(".fertilizer-cards-grid");

    list.forEach(f => {
        const img = f.image.split("\\").pop().split("/").pop();

        const div = document.createElement("div");
        div.className = "fertilizer-card";

        div.innerHTML = `
            <div class="card-top-bar">
                <img src="../images/${img}">
                <i class="fas fa-info-circle info-icon-fert"
                   data-usage="${getL(f, "application")}"
                   data-dosage="${getL(f, "dosageNotes")}"
                   data-safety="${getL(f, "safetyNotes")}"></i>
            </div>

            <h4>${f.hindi} (${f.name})</h4>
            <p>${getL(f, "primaryUse")}</p>
        `;

        div.querySelector(".info-icon-fert").addEventListener("mouseenter", (ev) => {
            showSmartPopup(ev.target, `
                <strong>${f.hindi}</strong><hr>
                <b>Use:</b> ${getL(f, "application")}<br>
                <b>Dosage:</b> ${getL(f, "dosageNotes")}<br>
                <b>Safety:</b> ${getL(f, "safetyNotes")}
            `);
        });

        grid.appendChild(div);
    });
}


// =============================================================
// 7) EQUIPMENT
// =============================================================
function updateEquipmentSection() {
    const wrap = document.getElementById("equipment-recommendations");

    if (!selectedCropKey) {
        wrap.innerHTML = "<p>Select crop</p>";
        return;
    }

    const crop = crops[selectedCropKey];
    const list = getEquipmentForCrop(crop.name);

    wrap.innerHTML = `
        <h3>Recommended Equipment</h3>
        <div class="equipment-grid"></div>
    `;

    const grid = wrap.querySelector(".equipment-grid");

    list.forEach(e => {
        const img = e.image.split("\\").pop().split("/").pop();

        const div = document.createElement("div");
        div.className = "equipment-card";

        div.innerHTML = `
            <div class="card-top-bar">
                <img src="../images/${img}" class="equip-image">
                <i class="fas fa-info-circle info-icon-equip"
                   data-usage="${e.uses}"
                   data-safety="${e.safety}"></i>
            </div>

            <h4>${e.hindi} (${e.name})</h4>
        `;

        div.querySelector(".info-icon-equip").addEventListener("mouseenter", (ev) => {
            showSmartPopup(ev.target, `
                <strong>${e.hindi}</strong><hr>
                <b>Use:</b> ${e.uses}<br>
                <b>Safety:</b> ${e.safety}
            `);
        });

        grid.appendChild(div);
    });
}


// =============================================================
// 8) OPEN MODAL — WITH SCROLL LOCK
// =============================================================
function openModal(key) {
    const crop = crops[key];
    if (!crop) return;

    const safeEquipment = Array.isArray(crop.equipment)
        ? crop.equipment
        : [];

    modalBody.innerHTML = `
        <h2>${crop.hindiName} (${crop.name})</h2>
        <hr>

        <h3>Full Process</h3>
        <ul>
            ${crop.process
                .map(
                    (p) =>
                        `<li><b>${getL(p, "step")}:</b> ${getL(
                            p,
                            "detail"
                        )}</li>`
                )
                .join("")}
        </ul>

        <h3>Fertilizers</h3>
        <ul>
            ${(crop.fertilizersList || [])
                .map(
                    (f) =>
                        `<li><b>${getL(f, "name") ||
                            f.name}:</b> ${getL(f, "recommendation")}</li>`
                )
                .join("")}
        </ul>

        <h3>Pests</h3>
        <ul>
            ${(crop.pesticides || [])
                .map(
                    (p) =>
                        `<li><b>${p.active}:</b> ${getL(p, "use")}</li>`
                )
                .join("")}
        </ul>

        <h3>Equipment</h3>
        <p>${safeEquipment.length ? safeEquipment.join(", ") : "N/A"}</p>

        <h3>Economics</h3>
        <ul>
            <li><strong>Cost:</strong> ₹${crop.economics?.costPerAcre ||
                "Varies"}</li>
            <li><strong>Yield:</strong> ${crop.economics?.expectedYield ||
                "Varies"}</li>
            <li><strong>Market Price:</strong> ${crop.economics?.marketPrice ||
                "Varies"}</li>
            <li><strong>ROI:</strong> ${crop.economics?.roi || "Varies"}</li>
        </ul>
    `;

    modal.style.display = "flex";

    // 🔥 SCROLL LOCK ENABLE
    document.body.classList.add("modal-open");
}


// =============================================================
// 9) CLOSE MODAL BUTTON — REMOVE SCROLL LOCK
// =============================================================
document
    .querySelector(".close-btn")
    ?.addEventListener("click", () => {
        modal.style.display = "none";

        // 🔥 SCROLL LOCK DISABLE
        document.body.classList.remove("modal-open");
    });


// =============================================================
// 10) CLOSE MODAL ON BACKDROP — REMOVE SCROLL LOCK
// =============================================================
modal?.addEventListener("click", (e) => {
    if (e.target.id === "process-modal") {
        modal.style.display = "none";

        //  SCROLL LOCK DISABLE
        document.body.classList.remove("modal-open");
    }
});


// =============================================================
// 11) INIT APPLICATION
// =============================================================
function init() {
    renderSoils();
    attachSeasonListeners();
    updateCropList();

    fertSectionEl.classList.add("disabled");
    fertDisplaySectionEl.classList.add("disabled");
    equipSectionEl.classList.add("disabled");

    console.log("Kisaan Saathii Advisory Initialized Successfully");
}

init();
