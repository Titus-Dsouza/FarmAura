"use strict";

window.KisanSaathi = window.KisanSaathi || {};

const config = window.KisanSaathi.config;
const mockApi = window.KisanSaathi.mockApi;

async function request(path, options = {}) {
  if (!config.apiBaseUrl) {
    throw new Error("API mode requires an API base URL in config.js.");
  }
  const response = await fetch(new URL(path, config.apiBaseUrl), {
    headers: { Accept: "application/json", ...options.headers },
    ...options
  });
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }
  return response.json();
}

function fromMode(mockMethod, apiPath) {
  return (...args) => config.dataMode === "demo"
    ? mockApi[mockMethod](...args)
    : request(apiPath);
}

window.KisanSaathi.api = {
  mode: config.dataMode,
  profile: fromMode("getProfile", "/api/profile/"),
  crops: fromMode("getCrops", "/api/crops/"),
  offers: fromMode("getOffers", "/api/buyer-offers/"),
  schemes: fromMode("getSchemes", "/api/schemes/"),
  listings: () => config.dataMode === "demo"
    ? mockApi.getListings()
    : Promise.reject(new Error("Seller listings are not defined in the current API contract.")),
  farmerListings: {
    list: () => config.dataMode === "demo"
      ? mockApi.getMyListings()
      : Promise.reject(new Error("Farmer listing management is not defined in the current API contract.")),
    create: (listing) => config.dataMode === "demo"
      ? mockApi.createMyListing(listing)
      : Promise.reject(new Error("Farmer listing management is not defined in the current API contract.")),
    update: (id, listing) => config.dataMode === "demo"
      ? mockApi.updateMyListing(id, listing)
      : Promise.reject(new Error("Farmer listing management is not defined in the current API contract.")),
    delete: (id) => config.dataMode === "demo"
      ? mockApi.deleteMyListing(id)
      : Promise.reject(new Error("Farmer listing management is not defined in the current API contract."))
  },
  recentActivity: () => config.dataMode === "demo"
    ? mockApi.getRecentActivity()
    : Promise.resolve([]),
  askAssistant: async (message) => {
    if (config.dataMode === "demo") return mockApi.askAssistant(message);
    const result = await request("/api/assistant/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    return { text: result.reply || result.message || "The assistant returned no response.", mode: "api" };
  }
};
