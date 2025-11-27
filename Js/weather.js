// Js/weather.js (MODULAR, cleaned & improved)
// - Uses Open-Meteo for weather + geocoding
// - Language switches, speech, offline caching
// - Sliders simple auto-rotate
// - Expects navbar + user_status loaded separately

const texts = {
  hi: {
    subtitle: "गाँव वालों के लिए आसान 14 दिन का मौसम",
    placeholder: "अपना गाँव / शहर का नाम लिखें",
    useLocation: "📍 अपने स्थान से मौसम देखें",
    statusIdle: "ऊपर गाँव का नाम लिखें या लोकेशन से देखें।",
    searching: "रुकिए... मौसम खोजा जा रहा है...",
    usingLocation: "लोकेशन लिया जा रहा है...",
    notFound: "गाँव/शहर नहीं मिला, सही नाम लिखें।",
    geoError: "लोकेशन नहीं मिल पाई। कृपया नाम से खोजें।",
    forecastTitle: "14 दिन का मौसम",
    farmingTipTitle: "किसान सलाह",
    offlineNote: "आखिरी देखा हुआ मौसम सेव है।",
    speakTodayLabel: "🔊 आज का मौसम सुनें",
    speakSummaryLabel: "🗣️ 14 दिन का मौसम सुनें",
    rainAlertHeavy: "⚠️ तेज बारिश या आंधी की संभावना है।",
    rainAlertNormal: "☔ आज बारिश की अच्छी संभावना है।",
    tipHotDry: "आज गर्मी ज्यादा है और बारिश कम है। सिंचाई का ध्यान रखें।",
    tipRainy: "बढ़िया बारिश है। पानी निकासी रखें।",
    tipNormal: "मौसम सामान्य है।",
    conditionName: {
      clear: "खुला आसमान",
      cloudy: "बादल",
      rain: "बारिश",
      storm: "आंधी",
      snow: "बर्फ",
      drizzle: "हल्की फुहार",
      fog: "कोहरा"
    }
  },
  en: {
    subtitle: "Simple 14-day weather for village people",
    placeholder: "Type village / city name",
    useLocation: "📍 Use my location",
    statusIdle: "Type village name above or use location.",
    searching: "Please wait... fetching weather...",
    usingLocation: "Getting your location...",
    notFound: "Place not found. Please check the spelling.",
    geoError: "Could not get your location. Please search by name.",
    forecastTitle: "14-Day Forecast",
    farmingTipTitle: "Farming Tip",
    offlineNote: "Last seen weather is saved.",
    speakTodayLabel: "🔊 Speak Today",
    speakSummaryLabel: "🗣️ Speak 14 Days",
    rainAlertHeavy: "⚠️ Heavy rain or storm expected.",
    rainAlertNormal: "☔ Good chance of rain today.",
    tipHotDry: "It is hot and dry. Water your crops on time.",
    tipRainy: "Good rain today. Check drainage.",
    tipNormal: "Weather is normal.",
    conditionName: {
      clear: "clear sky",
      cloudy: "cloudy",
      rain: "rainy",
      storm: "stormy",
      snow: "snowy",
      drizzle: "light drizzle",
      fog: "fog"
    }
  },
  bho: {}, // Using hi defaults for regional langs
  mai: {}
};

// fallback copy for bho/mai
texts.bho = Object.assign({}, texts.hi);
texts.mai = Object.assign({}, texts.hi);

let currentLang = "hi";
let lastWeather = null;
let lastMeta = null;

// helpers
const $ = (id) => document.getElementById(id);
const setText = (id, text) => { const el = $(id); if(el) el.textContent = text; };

function mapWeatherCode(code) {
  if (code === 0) return "clear";
  if ([1,2,3].includes(code)) return "cloudy";
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return "rain";
  if ([95,96,99].includes(code)) return "storm";
  if ([71,73,75,77,85,86].includes(code)) return "snow";
  if ([45,48].includes(code)) return "fog";
  if ([56,57].includes(code)) return "drizzle";
  return "cloudy";
}

function getLabelFor(type){
  return (texts[currentLang].conditionName[type] || type);
}

function applyCardStyle(type){
  const card = $("currentCard");
  card.classList.remove("weather-sunny","weather-rain","weather-cloudy","weather-fog","weather-storm");
  if(type==="clear") card.classList.add("weather-sunny");
  else if(type==="rain"||type==="drizzle") card.classList.add("weather-rain");
  else if(type==="storm") card.classList.add("weather-storm");
  else if(type==="fog"||type==="snow") card.classList.add("weather-fog");
  else card.classList.add("weather-cloudy");
}

// render
function renderWeather(data, meta){
  lastWeather = data; lastMeta = meta;
  const t = texts[currentLang];

  const current = data.current_weather;
  const daily = data.daily;

  $("currentCard").style.display = "block";
  $("forecastCard").style.display = "block";
  $("tipCard").style.display = "block";

  const place = meta.placeName || "Your Place";
  setText("locationName", place);
  const d = new Date(daily.time[0]);
  setText("currentDate", d.toLocaleDateString(currentLang==="en"?"en-IN":"hi-IN", { weekday:"short", day:"numeric", month:"short"}));
  setText("currentTemp", Math.round(current.temperature)+"°C");
  const type = mapWeatherCode(daily.weathercode[0]);
  setText("conditionText", getLabelFor(type));
  setText("rangeText", Math.round(daily.temperature_2m_max[0])+"° / "+Math.round(daily.temperature_2m_min[0])+"°");

  const sunrise = (daily.sunrise && daily.sunrise[0]) ? daily.sunrise[0].split("T")[1].slice(0,5) : "";
  const sunset = (daily.sunset && daily.sunset[0]) ? daily.sunset[0].split("T")[1].slice(0,5) : "";
  setText("sunText", (currentLang==="en" ? "Sunrise " : "सूर्योदय ") + sunrise + ", " + (currentLang==="en" ? "Sunset " : "सूर्यास्त ") + sunset);

  applyCardStyle(type);

  // alert
  const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
  const alertBox = $("alertBox");
  if(rainProb >= 80 || type === "storm") {
    alertBox.style.display = "block"; alertBox.textContent = t.rainAlertHeavy;
  } else if(rainProb >= 50){
    alertBox.style.display = "block"; alertBox.textContent = t.rainAlertNormal;
  } else {
    alertBox.style.display = "none"; alertBox.textContent = "";
  }

  // forecast list
  const list = $("forecastList");
  list.innerHTML = "";
  for(let i=0;i<daily.time.length;i++){
    const dateLabel = i===0 ? (currentLang==="en"?"Today":"आज") : daily.time[i].slice(8,10) + "-" + daily.time[i].slice(5,7);
    const maxT = Math.round(daily.temperature_2m_max[i]);
    const minT = Math.round(daily.temperature_2m_min[i]);
    const wType = mapWeatherCode(daily.weathercode[i]);
    const wLabel = getLabelFor(wType);
    const rain = daily.precipitation_probability_max[i] ?? 0;

    const item = document.createElement("div");
    item.className = "day-item";
    item.innerHTML = `<div class="day-left"><div class="day-date">${dateLabel}</div><div class="day-cond">${wLabel}</div></div>
      <div><div class="day-temp">${maxT}° / ${minT}°</div><div class="day-rain">${currentLang==="en"?"Rain:":"बारिश:"} ${rain}%</div></div>`;
    list.appendChild(item);
  }

  // tip
  let tip = t.tipNormal;
  if(Math.round(daily.temperature_2m_max[0]) >= 35 && rainProb < 40) tip = t.tipHotDry;
  else if(rainProb >= 60) tip = t.tipRainy;
  setText("tipText", tip);
  setText("offlineNote", t.offlineNote);

  // clear status
  setText("statusText", "");
  // save offline
  try{ localStorage.setItem("villageWeatherData", JSON.stringify({data,meta,at:Date.now()})); }catch(e){}
}

// fetch helpers
async function fetchWeatherByCoords(lat, lon, placeName=""){
  const t = texts[currentLang];
  setText("statusText", t.searching);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&current_weather=true&timezone=auto&forecast_days=14`;
  try{
    const r = await fetch(url);
    const data = await r.json();
    renderWeather(data, { placeName, lat, lon });
  }catch(e){
    setText("statusText", "Error fetching.");
    console.error(e);
  }
}

async function fetchWeatherByName(name){
  const t = texts[currentLang];
  setText("statusText", t.searching);
  try{
    const geoResp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`);
    const geo = await geoResp.json();
    if(!geo.results || !geo.results.length){ setText("statusText", t.notFound); return; }
    const p = geo.results[0];
    await fetchWeatherByCoords(p.latitude, p.longitude, `${p.name}, ${p.country}`);
  }catch(e){
    setText("statusText", texts[currentLang].notFound);
  }
}

function useMyLocation(){
  const t = texts[currentLang];
  if(!navigator.geolocation){ setText("statusText", t.geoError); return; }
  setText("statusText", t.usingLocation);
  navigator.geolocation.getCurrentPosition(async (pos)=>{
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    let place = "";
    try{
      const geoResp = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`);
      const geo = await geoResp.json();
      if(geo.results && geo.results.length) place = `${geo.results[0].name}, ${geo.results[0].country}`;
    }catch(e){}
    fetchWeatherByCoords(lat, lon, place);
  }, ()=>{ setText("statusText", texts[currentLang].geoError); });
}

// speech
function speak(text){
  if(!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = currentLang==="en"?"en-IN":"hi-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function speakToday(){
  if(!lastWeather || !lastMeta) return;
  const daily = lastWeather.daily;
  const loc = lastMeta.placeName || (currentLang==="en"?"your area":"आपका क्षेत्र");
  const max = Math.round(daily.temperature_2m_max[0]), min = Math.round(daily.temperature_2m_min[0]);
  const rain = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
  const type = getLabelFor(mapWeatherCode(daily.weathercode[0]));
  const text = currentLang==="en" ? `In ${loc} today's max ${max} and min ${min} degrees. Weather ${type}. Chance of rain ${rain} percent.` :
    `${loc} में आज अधिकतम ${max} और न्यूनतम ${min} डिग्री, मौसम ${type}, बारिश की संभावना ${rain}%।`;
  speak(text);
}

function speakSummary(){
  if(!lastWeather || !lastMeta) return;
  const daily = lastWeather.daily;
  const maxArr = daily.temperature_2m_max.map(v=>Math.round(v));
  const minArr = daily.temperature_2m_min.map(v=>Math.round(v));
  const loc = lastMeta.placeName || (currentLang==="en"?"your area":"आपका क्षेत्र");
  const text = currentLang==="en" ? `14-day summary for ${loc}. First day max ${maxArr[0]} min ${minArr[0]}. Last day max ${maxArr[maxArr.length-1]} min ${minArr[minArr.length-1]}.` :
    `${loc} के लिए 14 दिन का सार: पहले दिन अधिकतम ${maxArr[0]} और न्यूनतम ${minArr[0]}। आखिरी दिन अधिकतम ${maxArr[maxArr.length-1]} और न्यूनतम ${minArr[minArr.length-1]}।`;
  speak(text);
}

// sliders (simple)
function autoSlider(sliderId, nameId){
  const slider = document.getElementById(sliderId);
  if(!slider) return;
  const imgs = Array.from(slider.querySelectorAll("img"));
  if(imgs.length===0) return;
  let idx = 0;
  imgs.forEach((im,i)=> i===0?im.classList.add("active"):im.classList.remove("active"));
  const nameBox = document.getElementById(nameId);
  if(nameBox) nameBox.innerText = imgs[0].dataset.name || "";
  setInterval(()=>{
    imgs[idx].classList.remove("active");
    idx = (idx+1)%imgs.length;
    imgs[idx].classList.add("active");
    if(nameBox) nameBox.innerText = imgs[idx].dataset.name || "";
  }, 2200);
}

// init
window.addEventListener("DOMContentLoaded", ()=>{
  // set defaults
  currentLang = "hi";
  $("languageSelect").value = "hi";
  setText("subtitle", texts.hi.subtitle);
  setText("statusText", texts.hi.statusIdle);
  setText("btnSpeakToday", texts.hi.speakTodayLabel);
  setText("btnSpeakSummary", texts.hi.speakSummaryLabel);
  setText("forecastTitle", texts.hi.forecastTitle);
  setText("tipTitle", texts.hi.farmingTipTitle);
  setText("offlineNote", texts.hi.offlineNote);

  // event handlers
  $("languageSelect").addEventListener("change", (e)=>{
    currentLang = e.target.value;
    const t = texts[currentLang] || texts.hi;
    setText("subtitle", t.subtitle);
    $("placeInput").placeholder = t.placeholder;
    setText("btnSpeakToday", t.speakTodayLabel);
    setText("btnSpeakSummary", t.speakSummaryLabel);
    setText("forecastTitle", t.forecastTitle);
    setText("tipTitle", t.farmingTipTitle);
    setText("offlineNote", t.offlineNote);
  });

  $("btnSearch").addEventListener("click", ()=>{
    const v = $("placeInput").value.trim();
    if(!v) return;
    fetchWeatherByName(v);
  });

  $("placeInput").addEventListener("keydown", (e)=>{ if(e.key==="Enter") $("btnSearch").click(); });

  $("btnLocation").addEventListener("click", useMyLocation);
  $("btnSpeakToday").addEventListener("click", speakToday);
  $("btnSpeakSummary").addEventListener("click", speakSummary);

  // load offline if exists
  try{
    const raw = localStorage.getItem("villageWeatherData");
    if(raw){ const parsed = JSON.parse(raw); if(parsed && parsed.data && parsed.meta) renderWeather(parsed.data, parsed.meta); }
  }catch(e){}

  // start sliders (IDs from HTML)
  autoSlider("slider-pesticide", "name-pesticide");
});
