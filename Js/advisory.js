import { soils, getSoilRegions } from '../data/soils.js';
import { crops } from '../data/crops.js';
import { getEquipmentForCrop } from '../data/equipment.js';
import { fertilizers } from '../data/fertilizers.js';

function showSmartPopup(target, html) {
    const popup = document.getElementById("info-popup");
    if (!popup) return;

    popup.innerHTML = html;
    popup.style.display = "block";

    const iconRect = target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    let left = iconRect.right + 8;
    let top = iconRect.top + window.scrollY - 5;

    if (left + popupRect.width > window.innerWidth - 10) {
        left = iconRect.left - popupRect.width - 8;
    }

    if (left < 8) left = 8;

    if (top + popupRect.height > window.innerHeight + window.scrollY - 12) {
        top = iconRect.top + window.scrollY - popupRect.height - 8;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
}

document.addEventListener("mouseover", (e) => {
    if (!(
        e.target.classList.contains("info-icon") ||
        e.target.classList.contains("info-icon-fert") ||
        e.target.classList.contains("info-icon-equip")
    )) {
        document.getElementById("info-popup").style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let selectedSoilId = "alluvial";
    let selectedSeason = "kharif";
    let selectedCropKey = null;

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

    const roundKg = v => Math.round(v * 10) / 10;

    const getL = (obj, prop) => {
        const value = obj[prop];
        return (typeof value === "object" && value !== null)
            ? (value.en || value.hi || "")
            : (value || "");
    };

    const getArrayL = (obj, prop) => {
        const value = obj[prop];
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            return value.en || value.hi || [];
        }
        return Array.isArray(value) ? value : [];
    };

    const soilListEl = document.getElementById("soil-horizontal-list");
    const cropGridEl = document.getElementById("crop-recommendation-grid");
    const fertSectionEl = document.getElementById("section-fertilizer");
    const fertDisplaySectionEl = document.getElementById("section-fertilizer-display");
    const equipSectionEl = document.getElementById("section-equipment");

    function renderSoils() {
        if (!soilListEl) return;
        soilListEl.innerHTML = "";

        soils.forEach(s => {
            if (s.id === "alluvial") selectedSoilId = s.id;

            const soilCard = document.createElement("div");
            soilCard.className = `soil-card-horizontal ${s.id === selectedSoilId ? "active" : ""}`;
            soilCard.dataset.soil = s.id;

            if (s.bgImage) {
                const img = s.bgImage.split("\\").pop().split("/").pop();
                soilCard.style.backgroundImage = `
                    linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),
                    url('../images/${img}')
                `;
            }

            const soilName = `${s.hindi} (${s.name})`;
            const regions = getSoilRegions(s.id);

            soilCard.innerHTML = `
                <div class="soil-name">${soilName}</div>
                <i class="fas fa-info-circle info-icon"></i>
            `;

            soilCard.addEventListener("click", (e) => {
                if (e.target.classList.contains("info-icon")) return;
                selectSoil(s.id);
            });

            soilCard.querySelector(".info-icon")
                .addEventListener("mouseenter", (ev) => {
                    showSmartPopup(ev.currentTarget, `
                        <strong>${soilName}</strong><br>
                        ${regions.split(";").join("<br>")}
                    `);
                });

            soilListEl.appendChild(soilCard);
        });
    }

    function selectSoil(id) {
        selectedSoilId = id;
        selectedCropKey = null;

        document.querySelectorAll(".soil-card-horizontal")
            .forEach(el => el.classList.remove("active"));

        document.querySelector(`.soil-card-horizontal[data-soil="${id}"]`)
            ?.classList.add("active");

        document.getElementById("section-crops")?.classList.remove("disabled");
        fertSectionEl.classList.add("disabled");
        fertDisplaySectionEl.classList.add("disabled");
        equipSectionEl.classList.add("disabled");

        updateCropList();
        updateFertilizerSection();
        updateFertilizerDisplaySection();
        updateEquipmentSection();
    }

    function attachSeasonListeners() {
        document.querySelectorAll("#season-tabs .season-tab")
            .forEach(tab => {
                tab.addEventListener("click", () => {
                    document.querySelectorAll("#season-tabs .season-tab")
                        .forEach(t => t.classList.remove("active"));

                    tab.classList.add("active");
                    selectedSeason = tab.dataset.season;
                    selectedCropKey = null;

                    fertSectionEl.classList.add("disabled");
                    fertDisplaySectionEl.classList.add("disabled");
                    equipSectionEl.classList.add("disabled");

                    updateCropList();
                    updateFertilizerSection();
                    updateFertilizerDisplaySection();
                    updateEquipmentSection();
                });
            });
    }
    function updateCropList() {
        if (!cropGridEl) return;
        cropGridEl.innerHTML = "";

        const list = Object.entries(crops).filter(([key, c]) =>
            Array.isArray(c.seasons) &&
            c.seasons.includes(selectedSeason) &&
            Array.isArray(c.soils) &&
            c.soils.includes(selectedSoilId)
        );

        if (!list.length) {
            cropGridEl.innerHTML = `
                <div class="empty-message" style="padding:20px;text-align:center;">
                    ❌ No crops found.
                </div>`;
            return;
        }

        list.forEach(([key, crop]) => {
            const img = crop.picture?.split("\\").pop().split("/").pop() || "placeholder.png";

            const card = document.createElement("div");
            card.className = "crop-card four-per-row";
            card.dataset.key = key;

            card.innerHTML = `
                <div class="crop-image-container">
                    <img src="../images/${img}" class="crop-image">
                </div>

                <div class="crop-details-content">
                    <h4>${crop.hindiName} (${crop.name})</h4>
                    <span class="tag profitable">${crop.profitable ? "Profitable" : "Varies"}</span>
                </div>

                <div class="card-actions">
                    <button class="details-btn">Details</button>
                    <button class="select-btn-crop" data-key="${key}"
                        style="background:${key === selectedCropKey ? "#00bcd4" : "#4CAF50"};">
                        Select
                    </button>
                </div>
            `;

            card.querySelector(".details-btn").addEventListener("click", () => openModal(key));

            card.querySelector(".select-btn-crop").addEventListener("click", (e) => {
                selectedCropKey = key;

                document.querySelectorAll(".select-btn-crop")
                    .forEach(btn => btn.style.background = "#4CAF50");

                e.target.style.background = "#00bcd4";

                fertSectionEl.classList.remove("disabled");
                fertDisplaySectionEl.classList.remove("disabled");
                equipSectionEl.classList.remove("disabled");

                updateFertilizerSection();
                updateFertilizerDisplaySection();
                updateEquipmentSection();
            });

            cropGridEl.appendChild(card);
        });
    }

    function updateFertilizerSection() {
        const calcUI = document.getElementById("fertilizer-calculator-ui");
        const fertDetailsEl = document.getElementById("selected-crop-fert-details");

        if (!selectedCropKey) {
            calcUI.innerHTML = "<p>Select crop.</p>";
            fertDetailsEl.innerHTML = "";
            return;
        }

        const crop = crops[selectedCropKey];

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

        function calc() {
            const fert = crop.fertilizersPerAcre || {};
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
                    Apply NPK as per soil test.
                </div>
            </div>
        `;
    }

    function updateFertilizerDisplaySection() {
        const gridBox = document.getElementById("fertilizer-display-grid");
        if (!selectedCropKey) {
            gridBox.innerHTML = "<p>Select crop</p>";
            return;
        }

        const crop = crops[selectedCropKey];
        const names = new Set();

        (crop.fertilizersList || []).forEach(f => names.add(f.name));

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
            const img = f.image?.split("\\").pop().split("/").pop();

            const div = document.createElement("div");
            div.className = "fertilizer-card";

            div.innerHTML = `
                <div class="card-top-bar">
                    <img src="../images/${img}">
                    <i class="fas fa-info-circle info-icon-fert"
                       data-usage="${getL(f, 'application')}"
                       data-dosage="${getL(f, 'dosageNotes')}"
                       data-safety="${getL(f, 'safetyNotes')}">
                    </i>
                </div>

                <h4>${f.hindi} (${f.name})</h4>
                <p>${getL(f, 'primaryUse')}</p>
            `;

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
            const img = e.image?.split("\\").pop().split("/").pop();

            const div = document.createElement("div");
            div.className = "equipment-card";

            div.innerHTML = `
                <div class="card-top-bar">
                    <img src="../images/${img}" class="equip-image">
                    <i class="fas fa-info-circle info-icon-equip"
                       data-usage="${e.uses}"
                       data-safety="${e.safety}">
                    </i>
                </div>

                <h4>${e.hindi} (${e.name})</h4>
            `;

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

    function openModal(key) {
        const crop = crops[key];
        const modal = document.getElementById("process-modal");
        const modalBody = document.getElementById("modal-body");

        modalBody.innerHTML = `
            <h2>${crop.hindiName} (${crop.name})</h2>
            <hr>
            <ul>
                ${crop.process.map(p =>
            `<li><b>${getL(p, "step")}:</b> ${getL(p, "detail")}</li>`
        ).join("")}
            </ul>
        `;

        modal.style.display = "flex";
    }

    document.querySelector(".close-btn")
        ?.addEventListener("click", () => {
            document.getElementById("process-modal").style.display = "none";
        });

    document.getElementById("process-modal")
        ?.addEventListener("click", (e) => {
            if (e.target.id === "process-modal") {
                e.target.style.display = "none";
            }
        });

    function init() {
        renderSoils();
        attachSeasonListeners();
        updateCropList();

        fertSectionEl.classList.add("disabled");
        fertDisplaySectionEl.classList.add("disabled");
        equipSectionEl.classList.add("disabled");

        console.log("Advisory system ready.");
    }

    init();
});

