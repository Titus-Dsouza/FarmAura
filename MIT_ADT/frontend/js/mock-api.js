"use strict";

window.KisanSaathi = window.KisanSaathi || {};

const demo = window.KisanSaathi.demoData;
const pause = (value) => new Promise((resolve) => window.setTimeout(() => resolve(value), 180));

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
    return pause(demo.farmerListings.map((listing) => ({ ...listing })));
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
        : text.includes("harvest") || text.includes("crop") || text.includes("decay") ? "harvest"
          : text.includes("offer") || text.includes("price") || text.includes("buyer") ? "offers"
            : text.includes("scheme") || text.includes("loan") ? "schemes"
              : "general";
    return pause({ text: demo.assistantReplies[key], mode: "demo" });
  }
};
