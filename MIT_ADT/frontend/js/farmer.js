"use strict";

const app = window.KisanSaathi;
let crops = [];
let offers = [];
let schemes = [];

function makeLoadError(message, retry) {
  const box = document.createElement("div");
  box.className = "empty-state";
  const title = document.createElement("strong");
  title.textContent = "Could not load this demo section";
  const detail = document.createElement("p");
  detail.textContent = message;
  const button = document.createElement("button");
  button.className = "button button-outline";
  button.type = "button";
  button.textContent = "Try again";
  button.addEventListener("click", retry);
  box.append(title, detail, button);
  return box;
}

function cardIcon(name) {
  return ({ Wheat: "✳", Tomato: "●", Onion: "◉", Soybean: "♧" })[name] || "⌁";
}

function renderCropGuides(list = crops) {
  const grid = document.getElementById("crop-guides");
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><strong>No crop guides match.</strong><p>Choose another crop filter to see sample guides.</p></div>';
    return;
  }
  const saved = app.store.read("saved-guides", []);
  grid.innerHTML = list.map((crop) => {
    const isSaved = saved.includes(crop.id);
    return `<article class="crop-card">
      <div class="crop-card-top"><span class="crop-symbol" aria-hidden="true">${cardIcon(app.escapeHtml(crop.name))}</span><span class="status-pill">${app.escapeHtml(crop.season)} season</span></div>
      <div class="crop-card-title"><div><h3>${app.escapeHtml(crop.name)}</h3><p>${app.escapeHtml(crop.stage)}</p></div><span class="crop-stage-dot" aria-hidden="true"></span></div>
      <p class="crop-guide-copy">${app.escapeHtml(crop.guide)}</p>
      <div class="crop-card-footer"><span>Sample crop guide</span><button class="text-button" type="button" data-save-guide="${app.escapeHtml(crop.id)}" aria-pressed="${isSaved}">${isSaved ? "Saved ✓" : "Save guide"}</button></div>
    </article>`;
  }).join("");
}

function renderOffers() {
  const grid = document.getElementById("offer-list");
  if (!grid) return;
  const cropFilter = document.getElementById("offer-crop-filter")?.value || "all";
  const sort = document.getElementById("offer-sort")?.value || "price-desc";
  const saved = app.store.read("saved-offers", []);
  const filtered = offers.filter((offer) => cropFilter === "all" || offer.crop === cropFilter);
  filtered.sort((a, b) => sort === "price-asc" ? a.price - b.price
    : sort === "quantity-desc" ? b.quantity - a.quantity
      : b.price - a.price);
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state"><strong>No offers for this crop in the demo.</strong><p>Try a different filter. Sample records only.</p></div>';
    return;
  }
  const best = Math.max(...filtered.map((offer) => offer.price));
  grid.innerHTML = filtered.map((offer) => `<article class="offer-card">
    <div class="offer-card-top"><span class="offer-crop">${app.escapeHtml(offer.crop)}</span>${offer.price === best ? '<span class="status-pill status-best">Highest listed in demo</span>' : ""}</div>
    <h3>${app.escapeHtml(offer.buyer)}</h3><p class="offer-location"><span aria-hidden="true">⌖</span> ${app.escapeHtml(offer.location)} · ${app.escapeHtml(offer.updated)}</p>
    <div class="offer-price"><strong>₹${Number(offer.price).toLocaleString("en-IN")}</strong><span>/ quintal</span></div>
    <dl class="offer-facts"><div><dt>Quantity</dt><dd>${Number(offer.quantity).toLocaleString("en-IN")} quintals</dd></div><div><dt>Quality</dt><dd>${app.escapeHtml(offer.quality)}</dd></div><div><dt>Payment</dt><dd>${app.escapeHtml(offer.payment)}</dd></div><div><dt>Transport</dt><dd>${app.escapeHtml(offer.transport)}</dd></div></dl>
    <button class="button ${saved.includes(offer.id) ? "button-outline" : "button-soft"} offer-save" type="button" data-save-offer="${app.escapeHtml(offer.id)}" aria-pressed="${saved.includes(offer.id)}">${saved.includes(offer.id) ? "Saved for later ✓" : "Save offer"}</button>
  </article>`).join("");
}

function renderSchemes() {
  const grid = document.getElementById("scheme-list");
  if (!grid) return;
  grid.innerHTML = schemes.map((scheme) => `<article class="scheme-card">
    <div class="scheme-top"><span class="scheme-icon" aria-hidden="true">▤</span><span class="status-pill status-unverified">Unverified demo</span></div>
    <p class="scheme-type">${app.escapeHtml(scheme.type)}</p><h3>${app.escapeHtml(scheme.title)}</h3><p>${app.escapeHtml(scheme.summary)}</p>
    <details class="scheme-details"><summary>View example details</summary><dl><div><dt>Eligibility</dt><dd>${app.escapeHtml(scheme.eligibility)}</dd></div><div><dt>Documents</dt><dd>${app.escapeHtml(scheme.documents)}</dd></div><div><dt>Example next steps</dt><dd>${app.escapeHtml(scheme.steps)}</dd></div><div><dt>Source</dt><dd>${app.escapeHtml(scheme.source)}</dd></div><div><dt>Verification</dt><dd>${app.escapeHtml(scheme.verified)}</dd></div></dl></details>
  </article>`).join("");
}

function populateCropFilters() {
  const names = [...new Set([...offers.map((offer) => offer.crop), ...crops.map((crop) => crop.name)])].sort();
  ["crop-guide-filter", "offer-crop-filter"].forEach((id) => {
    const select = document.getElementById(id);
    if (!select) return;
    names.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.append(option);
    });
  });
}

function renderActivity(items) {
  const list = document.getElementById("recent-activity");
  if (!list) return;
  list.innerHTML = items.map((item) => `<article class="activity-item"><span class="activity-dot" aria-hidden="true"></span><div><strong>${app.escapeHtml(item.title)}</strong><p>${app.escapeHtml(item.detail)}</p></div><time>${app.escapeHtml(item.date)}</time></article>`).join("");
}

async function recordCalculation(title, detail) {
  const calculations = app.store.read("recent-calculations", []);
  calculations.unshift({
    id: `calculation-${Date.now()}`,
    title,
    detail,
    date: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  });
  app.store.write("recent-calculations", calculations.slice(0, 5));
  try {
    const baseline = await app.api.recentActivity();
    renderActivity([...calculations.slice(0, 5), ...baseline].slice(0, 5));
  } catch {
    renderActivity(calculations.slice(0, 5));
  }
}

function showCalculationResult(target, content) {
  const panel = document.getElementById(target);
  panel.innerHTML = content;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function loadDashboard() {
  const grid = document.getElementById("crop-guides");
  try {
    [crops, offers, schemes] = await Promise.all([
      app.api.crops(), app.api.offers(), app.api.schemes()
    ]);
    const profile = await app.api.profile();
    document.querySelectorAll("[data-profile-name]").forEach((node) => { node.textContent = profile.name; });
    document.querySelectorAll("[data-profile-location]").forEach((node) => { node.textContent = profile.district; });
    document.querySelectorAll("[data-profile-initials]").forEach((node) => { node.textContent = profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); });
    document.getElementById("profile-crop-count").textContent = String(profile.crops.length).padStart(2, "0");
    document.getElementById("saved-guide-count").textContent = String(app.store.read("saved-guides", []).length).padStart(2, "0");
    populateCropFilters();
    renderCropGuides();
    renderOffers();
    renderSchemes();
    const recent = await app.api.recentActivity();
    renderActivity([...app.store.read("recent-calculations", []), ...recent].slice(0, 5));
  } catch {
    if (grid) grid.replaceChildren(makeLoadError("The local sample data could not be displayed.", loadDashboard));
    app.showToast("A demo section could not load. Try again.", "error");
  }
}

document.getElementById("crop-guide-filter")?.addEventListener("change", (event) => {
  renderCropGuides(event.currentTarget.value === "all" ? crops : crops.filter((crop) => crop.name === event.currentTarget.value));
});
document.getElementById("offer-crop-filter")?.addEventListener("change", renderOffers);
document.getElementById("offer-sort")?.addEventListener("change", renderOffers);

document.addEventListener("click", (event) => {
  const saveGuide = event.target.closest("[data-save-guide]");
  if (saveGuide) {
    const id = saveGuide.dataset.saveGuide;
    const saved = app.store.read("saved-guides", []);
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    app.store.write("saved-guides", next);
    renderCropGuides();
    document.getElementById("saved-guide-count").textContent = String(next.length).padStart(2, "0");
    app.showToast(next.includes(id) ? "Crop guide saved on this device." : "Crop guide removed from saved items.");
  }
  const saveOffer = event.target.closest("[data-save-offer]");
  if (saveOffer) {
    const id = saveOffer.dataset.saveOffer;
    const saved = app.store.read("saved-offers", []);
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    app.store.write("saved-offers", next);
    renderOffers();
    app.showToast(next.includes(id) ? "Offer saved on this device." : "Offer removed from saved items.");
  }
});

document.getElementById("irrigation-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const area = Number(values.get("area"));
  const depth = Number(values.get("depth"));
  const liters = area * depth * 4046.8564224;
  const cubicMeters = liters / 1000;
  showCalculationResult("irrigation-result", `<strong>Illustrative water volume</strong><span class="result-number">${liters.toLocaleString("en-IN", { maximumFractionDigits: 0 })} L</span><span>${cubicMeters.toLocaleString("en-IN", { maximumFractionDigits: 2 })} m³ for ${area.toLocaleString("en-IN")} acre(s) at ${depth.toLocaleString("en-IN")} mm</span><small>Conversion: 1 mm over 1 acre ≈ 4,047 L. This is not a crop-specific irrigation recommendation.</small>`);
  recordCalculation("Field water estimate", `${values.get("crop")} · ${area} acre(s) · user-supplied ${depth} mm`);
});

document.getElementById("fertilizer-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const area = Number(values.get("area"));
  const rate = Number(values.get("rate"));
  const total = area * rate;
  showCalculationResult("fertilizer-result", `<strong>Illustrative ${app.escapeHtml(values.get("material").toLowerCase())} quantity</strong><span class="result-number">${total.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kg</span><span>${area.toLocaleString("en-IN")} acre(s) × ${rate.toLocaleString("en-IN")} kg / acre</span><small>Based on the rate you supplied (${app.escapeHtml(values.get("source"))}). This tool does not set or verify application rates.</small>`);
  recordCalculation("Soil input estimate", `${values.get("crop")} · ${area} acre(s) · user-supplied rate`);
});

document.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = String(new Date().getFullYear()); });
loadDashboard();
