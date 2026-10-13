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

let myListings = [];
let editingListingId = null;

function displayDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function renderMyListings() {
  const grid = document.getElementById("my-farmer-listings");
  if (!grid) return;
  if (!myListings.length) {
    grid.innerHTML = '<div class="empty-state"><strong>You have no saved demo listings yet.</strong><p>Use the form above to add a listing example. It will remain on this device.</p></div>';
    return;
  }
  grid.innerHTML = myListings.map((listing) => `<article class="listing-card farmer-owned-listing">
    <div class="listing-card-top"><span class="listing-crop-symbol" aria-hidden="true">▤</span><span class="status-pill status-demo">Your demo listing</span></div>
    <h3>${app.escapeHtml(listing.crop)}</h3>
    <p class="offer-location">${app.escapeHtml(listing.farmer)} · ${app.escapeHtml(listing.location)}</p>
    <div class="listing-price"><strong>₹${Number(listing.price).toLocaleString("en-IN")}</strong><span>/ ${app.escapeHtml(listing.unit)}</span></div>
    <div class="listing-availability"><span>Available quantity</span><strong>${Number(listing.quantity).toLocaleString("en-IN")} ${app.escapeHtml(listing.unit)}</strong></div>
    <details class="listing-details"><summary>View listing details</summary><dl><div><dt>Availability</dt><dd>${app.escapeHtml(displayDate(listing.availabilityDate))}</dd></div><div><dt>Description</dt><dd>${app.escapeHtml(listing.description || "No description provided")}</dd></div><div><dt>Notice</dt><dd>Saved on this device only; not published to retailers</dd></div></dl></details>
    <div class="farmer-listing-actions"><button class="button button-outline" type="button" data-edit-farmer-listing="${app.escapeHtml(listing.id)}">Edit</button><button class="button button-outline" type="button" data-delete-farmer-listing="${app.escapeHtml(listing.id)}">Remove</button></div>
  </article>`).join("");
}

function showSellGoodsFeedback(message, kind = "success") {
  const feedback = document.getElementById("sell-goods-feedback");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.dataset.kind = kind;
}

function resetSellGoodsForm() {
  const form = document.getElementById("sell-goods-form");
  if (!form) return;
  form.reset();
  editingListingId = null;
  document.getElementById("sell-goods-submit").textContent = "Save demo listing";
  document.getElementById("sell-goods-cancel").hidden = true;
  document.getElementById("sell-goods-title").textContent = "Sell Goods";
}

function startEditingListing(listing) {
  const form = document.getElementById("sell-goods-form");
  if (!form) return;
  editingListingId = listing.id;
  Object.entries({
    crop: listing.crop,
    quantity: listing.quantity,
    unit: listing.unit,
    price: listing.price,
    location: listing.location,
    availabilityDate: listing.availabilityDate,
    description: listing.description || ""
  }).forEach(([name, value]) => { form.elements.namedItem(name).value = value; });
  document.getElementById("sell-goods-submit").textContent = "Save changes";
  document.getElementById("sell-goods-cancel").hidden = false;
  document.getElementById("sell-goods-title").textContent = "Edit Sell Goods listing";
  showSellGoodsFeedback("Editing your local demo listing.");
  document.getElementById("sell-goods").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadMyListings() {
  const grid = document.getElementById("my-farmer-listings");
  if (!grid) return;
  try {
    myListings = await app.api.farmerListings.list();
    renderMyListings();
  } catch (error) {
    grid.innerHTML = `<div class="empty-state"><strong>Could not load your listings.</strong><p>${app.escapeHtml(error.message)}</p></div>`;
    app.showToast("Your demo listings could not be loaded.", "error");
  }
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
  const editListing = event.target.closest("[data-edit-farmer-listing]");
  if (editListing) {
    const listing = myListings.find((item) => item.id === editListing.dataset.editFarmerListing);
    if (listing) startEditingListing(listing);
  }
  const deleteListing = event.target.closest("[data-delete-farmer-listing]");
  if (deleteListing) {
    const listing = myListings.find((item) => item.id === deleteListing.dataset.deleteFarmerListing);
    if (!listing || !window.confirm(`Remove your ${listing.crop} demo listing from this device?`)) return;
    app.api.farmerListings.delete(listing.id).then(() => {
      myListings = myListings.filter((item) => item.id !== listing.id);
      renderMyListings();
      showSellGoodsFeedback("Your demo listing was removed from this device.");
      app.showToast("Demo listing removed.");
    }).catch((error) => {
      showSellGoodsFeedback(error.message, "error");
      app.showToast("Could not remove this demo listing.", "error");
    });
  }
});

document.getElementById("sell-goods-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) {
    showSellGoodsFeedback("Check the required fields and enter a quantity and price greater than zero.", "error");
    return;
  }
  const values = new FormData(form);
  const listing = {
    crop: String(values.get("crop")).trim(),
    quantity: Number(values.get("quantity")),
    unit: String(values.get("unit")),
    price: Number(values.get("price")),
    location: String(values.get("location")).trim(),
    availabilityDate: String(values.get("availabilityDate")),
    description: String(values.get("description") || "").trim()
  };
  const submit = document.getElementById("sell-goods-submit");
  let savedListing;
  app.setBusy(submit, true, "Saving…");
  try {
    savedListing = editingListingId
      ? await app.api.farmerListings.update(editingListingId, listing)
      : await app.api.farmerListings.create(listing);
  } catch (error) {
    showSellGoodsFeedback(error.message || "The demo listing could not be saved.", "error");
    app.showToast("Could not save the demo listing.", "error");
  } finally {
    app.setBusy(submit, false);
  }
  if (!savedListing) return;
  if (editingListingId) {
    myListings = myListings.map((item) => item.id === savedListing.id ? savedListing : item);
  } else {
    myListings.unshift(savedListing);
  }
  renderMyListings();
  resetSellGoodsForm();
  showSellGoodsFeedback("Demo listing saved on this device. It has not been published to retailers.");
  app.showToast("Demo listing saved on this device.");
});

document.getElementById("sell-goods-cancel")?.addEventListener("click", () => {
  resetSellGoodsForm();
  showSellGoodsFeedback("Edit cancelled.");
});

document.getElementById("sell-goods-form")?.addEventListener("input", () => {
  const feedback = document.getElementById("sell-goods-feedback");
  if (feedback) {
    feedback.textContent = "";
    feedback.dataset.kind = "success";
  }
});

document.getElementById("sell-goods-form")?.addEventListener("invalid", (event) => {
  const messages = {
    crop: "Enter a crop or product name.",
    quantity: "Quantity must be greater than zero.",
    unit: "Choose kg, quintal, or tonne.",
    price: "Expected price must be greater than zero.",
    location: "Enter a location.",
    availabilityDate: "Choose a harvest or availability date."
  };
  showSellGoodsFeedback(messages[event.target.name] || "Check this field and try again.", "error");
}, true);

const sellGoodsForm = document.getElementById("sell-goods-form");
const chatWidget = document.querySelector("[data-chat-widget]");
sellGoodsForm?.addEventListener("focusin", () => chatWidget?.classList.add("is-form-active"));
sellGoodsForm?.addEventListener("focusout", () => {
  window.setTimeout(() => {
    if (!sellGoodsForm.contains(document.activeElement)) chatWidget?.classList.remove("is-form-active");
  });
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
loadMyListings();
