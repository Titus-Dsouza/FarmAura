"use strict";

window.KisanSaathi = window.KisanSaathi || {};

const demo = window.KisanSaathi.demoData;
const pause = (value) => new Promise((resolve) => window.setTimeout(() => resolve(value), 180));
const ks = window.KisanSaathi;
const listingStorageKey = "farmer-goods";

function getOwnListings() {
  const profile = ks.getDemoProfile();
  return ks.store.read(listingStorageKey, [])
    .filter((listing) => listing.ownerEmail === profile.email)
    .map((listing) => ({ ...listing }));
}

function saveOwnListings(listings) {
  if (!ks.store.write(listingStorageKey, listings)) {
    throw new Error("Could not save this listing in browser storage.");
  }
}

function validateListing(listing) {
  const validUnits = ["kg", "quintal", "tonne"];
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(listing?.availabilityDate || "");
  const validDate = dateParts &&
    new Date(Date.UTC(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3])))
      .toISOString().slice(0, 10) === listing.availabilityDate;
  if (!listing || typeof listing !== "object" ||
      !String(listing.crop || "").trim() || String(listing.crop).length > 80 ||
      !Number.isFinite(Number(listing.quantity)) || Number(listing.quantity) <= 0 ||
      !validUnits.includes(listing.unit) ||
      !Number.isFinite(Number(listing.price)) || Number(listing.price) <= 0 ||
      !String(listing.location || "").trim() || String(listing.location).length > 80 ||
      String(listing.description || "").length > 500 ||
      !validDate) {
    throw new Error("Enter a product, positive quantity and price, valid unit, location, and availability date.");
  }
}

window.KisanSaathi.mockApi = {
  async getProfile() {
    return pause({ ...demo.profile, crops: [...demo.profile.crops] });
  },
  async getCrops() {
    return pause(demo.crops.map((crop) => ({ ...crop })));
  },
  async getOffers() {
    return pause(demo.buyerOffers.map((offer) => ({ ...offer })));
  },
  async getListings() {
    const ownListings = getOwnListings().map((listing) => ({
      ...listing,
      harvest: listing.availabilityDate,
      quality: listing.description || "Farmer-provided demo listing"
    }));
    return pause([
      ...demo.farmerListings.map((listing) => ({ ...listing })),
      ...ownListings
    ]);
  },
  async getMyListings() {
    return pause(getOwnListings());
  },
  async createMyListing(input) {
    validateListing(input);
    const profile = ks.getDemoProfile();
    const listings = ks.store.read(listingStorageKey, []);
    const listing = {
      ...input,
      id: `farmer-listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      farmer: profile.name,
      ownerEmail: profile.email,
      createdAt: new Date().toISOString()
    };
    listings.unshift(listing);
    saveOwnListings(listings);
    return pause({ ...listing });
  },
  async updateMyListing(id, input) {
    validateListing(input);
    const profile = ks.getDemoProfile();
    const listings = ks.store.read(listingStorageKey, []);
    const index = listings.findIndex((listing) => listing.id === id && listing.ownerEmail === profile.email);
    if (index < 0) throw new Error("This demo listing could not be found.");
    listings[index] = { ...listings[index], ...input };
    saveOwnListings(listings);
    return pause({ ...listings[index] });
  },
  async deleteMyListing(id) {
    const profile = ks.getDemoProfile();
    const listings = ks.store.read(listingStorageKey, []);
    const next = listings.filter((listing) => listing.id !== id || listing.ownerEmail !== profile.email);
    if (next.length === listings.length) throw new Error("This demo listing could not be found.");
    saveOwnListings(next);
    return pause({ id });
  },
  async getSchemes() {
    return pause(demo.schemes.map((scheme) => ({ ...scheme })));
  },
  async getRecentActivity() {
    return pause(demo.recentActivity.map((activity) => ({ ...activity })));
  },
  async askAssistant(message) {
    const text = message.toLowerCase();
    const key = text.includes("water") || text.includes("irrigat") ? "irrigation"
      : text.includes("fertil") || text.includes("manure") ? "fertilizer"
        : text.includes("soil") || text.includes("nutrient") ? "soil"
          : text.includes("pest") || text.includes("symptom") || text.includes("leaf") ? "cropCare"
        : text.includes("harvest") || text.includes("crop") || text.includes("decay") ? "harvest"
          : text.includes("offer") || text.includes("price") || text.includes("buyer") ? "offers"
            : text.includes("scheme") || text.includes("loan") ? "schemes"
              : "general";
    return pause({ text: demo.assistantReplies[key], mode: "demo" });
  }
};
