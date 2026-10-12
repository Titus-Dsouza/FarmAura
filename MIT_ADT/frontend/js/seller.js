"use strict";

const app = window.KisanSaathi;
let listings = [];

function renderListings() {
  const grid = document.getElementById("farmer-listings");
  if (!grid) return;
  const filter = document.getElementById("listing-crop-filter")?.value || "all";
  const sort = document.getElementById("listing-sort")?.value || "price-asc";
  const filtered = listings.filter((listing) => filter === "all" || listing.crop === filter);
  filtered.sort((a, b) => sort === "price-desc" ? b.price - a.price
    : sort === "quantity-desc" ? b.quantity - a.quantity
      : a.price - b.price);
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state"><strong>No example listings match.</strong><p>Choose a different crop filter to view the demo records.</p></div>';
    return;
  }
  grid.innerHTML = filtered.map((listing) => `<article class="listing-card">
    <div class="listing-card-top"><span class="listing-crop-symbol" aria-hidden="true">⌁</span><span class="status-pill status-demo">Demo listing</span></div>
    <h3>${app.escapeHtml(listing.crop)}</h3><p class="offer-location">${app.escapeHtml(listing.farmer)} · ${app.escapeHtml(listing.location)}</p>
    <div class="listing-price"><strong>₹${Number(listing.price).toLocaleString("en-IN")}</strong><span>/ quintal asking price</span></div>
    <div class="listing-availability"><span>Available quantity</span><strong>${Number(listing.quantity).toLocaleString("en-IN")} quintals</strong></div>
    <details class="listing-details"><summary>View listing details</summary><dl><div><dt>Quality</dt><dd>${app.escapeHtml(listing.quality)}</dd></div><div><dt>Harvest</dt><dd>${app.escapeHtml(listing.harvest)}</dd></div><div><dt>Location</dt><dd>${app.escapeHtml(listing.location)}</dd></div><div><dt>Notice</dt><dd>Illustrative record, not real inventory</dd></div></dl></details>
  </article>`).join("");
}

function renderRequests() {
  const list = document.getElementById("my-requests");
  if (!list) return;
  const requests = app.store.read("purchase-requests", []);
  if (!requests.length) {
    list.innerHTML = '<div class="empty-state"><strong>No demo requests yet.</strong><p>Submit the sample form above to try matching listings.</p></div>';
    return;
  }
  list.innerHTML = requests.map((request) => `<article class="request-item"><div><span class="status-pill status-demo">Local demo request</span><h3>${app.escapeHtml(request.crop)} · ${Number(request.quantity).toLocaleString("en-IN")} quintals</h3><p>Up to ₹${Number(request.maxPrice).toLocaleString("en-IN")} / quintal · ${app.escapeHtml(request.location)}</p><small>Created ${app.escapeHtml(request.createdAt)} · Not sent to a seller</small></div><button class="icon-button remove-request" type="button" data-remove-request="${app.escapeHtml(request.id)}" aria-label="Remove ${app.escapeHtml(request.crop)} demo request">×</button></article>`).join("");
}

function populateListingFilters() {
  const select = document.getElementById("listing-crop-filter");
  [...new Set(listings.map((listing) => listing.crop))].sort().forEach((crop) => {
    const option = document.createElement("option");
    option.value = crop;
    option.textContent = crop;
    select.append(option);
  });
}

function renderMatches(matches, request) {
  const target = document.getElementById("request-results");
  target.hidden = false;
  if (!matches.length) {
    target.innerHTML = `<div class="section-title-row"><div><p class="eyebrow">Matching sample listings</p><h2>No matches for these filters</h2><p class="section-subtitle">No ${app.escapeHtml(request.crop)} demo listing meets both your quantity and price limits. Try adjusting the request.</p></div></div><div class="empty-state"><strong>Nothing matched this time.</strong><p>These are only a few illustrative records, not a live marketplace.</p></div>`;
    return;
  }
  target.innerHTML = `<div class="section-title-row"><div><p class="eyebrow">Matching sample listings</p><h2>${matches.length} illustrative match${matches.length === 1 ? "" : "es"}</h2><p class="section-subtitle">Crop: ${app.escapeHtml(request.crop)} · Up to ${Number(request.maxPrice).toLocaleString("en-IN")} / quintal</p></div><a class="text-link" href="#available-listings">View all listings ↓</a></div><div class="listing-grid">${matches.map((listing) => `<article class="listing-card match-card"><div class="listing-card-top"><span class="listing-crop-symbol" aria-hidden="true">⌁</span><span class="status-pill status-best">Matches demo request</span></div><h3>${app.escapeHtml(listing.crop)}</h3><p class="offer-location">${app.escapeHtml(listing.farmer)} · ${app.escapeHtml(listing.location)}</p><div class="listing-price"><strong>₹${Number(listing.price).toLocaleString("en-IN")}</strong><span>/ quintal asking price</span></div><div class="listing-availability"><span>Available quantity</span><strong>${Number(listing.quantity).toLocaleString("en-IN")} quintals</strong></div><p class="match-quality">${app.escapeHtml(listing.quality)} · ${app.escapeHtml(listing.harvest)}</p><small>Example listing only — no contact or transaction is available.</small></article>`).join("")}</div>`;
}

document.getElementById("listing-crop-filter")?.addEventListener("change", renderListings);
document.getElementById("listing-sort")?.addEventListener("change", renderListings);

document.getElementById("purchase-request-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const request = {
    id: `request-${Date.now()}`,
    crop: String(values.get("crop")),
    quantity: Number(values.get("quantity")),
    maxPrice: Number(values.get("maxPrice")),
    location: String(values.get("location")).trim(),
    requirements: String(values.get("requirements") || "").trim(),
    createdAt: new Date().toLocaleString()
  };
  const matches = listings.filter((listing) =>
    listing.crop === request.crop &&
    listing.quantity >= request.quantity &&
    listing.price <= request.maxPrice
  );
  const requests = app.store.read("purchase-requests", []);
  requests.unshift(request);
  if (!app.store.write("purchase-requests", requests)) {
    app.showToast("Could not save this request in browser storage. The sample matches are still shown.", "error");
  } else {
    app.showToast(`${matches.length} sample listing${matches.length === 1 ? "" : "s"} matched. Nothing was sent.`);
  }
  renderMatches(matches, request);
  renderRequests();
  document.getElementById("request-results").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-request]");
  if (!remove) return;
  const id = remove.dataset.removeRequest;
  const requests = app.store.read("purchase-requests", []).filter((request) => request.id !== id);
  app.store.write("purchase-requests", requests);
  renderRequests();
  app.showToast("Local demo request removed.");
});

async function loadSellerDashboard() {
  try {
    listings = await app.api.listings();
    populateListingFilters();
    renderListings();
    renderRequests();
  } catch {
    const grid = document.getElementById("farmer-listings");
    grid.innerHTML = '<div class="empty-state"><strong>Could not load sample listings.</strong><p>Refresh the page to try again.</p></div>';
    app.showToast("Sample listings could not be loaded.", "error");
  }
}

document.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = String(new Date().getFullYear()); });
loadSellerDashboard();
