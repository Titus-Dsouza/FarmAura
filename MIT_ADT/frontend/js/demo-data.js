"use strict";

window.KisanSaathi = window.KisanSaathi || {};

window.KisanSaathi.demoData = {
  profile: {
    name: "Ananya",
    email: "ananya@example.demo",
    role: "farmer",
    district: "Nashik, Maharashtra",
    language: "en",
    crops: ["Wheat", "Tomato", "Onion"]
  },
  crops: [
    {
      id: "wheat",
      name: "Wheat",
      season: "Rabi",
      stage: "Grain filling",
      sown: "2026-01-08",
      days: 148,
      guide: "Check that grains are firm and straw has turned golden before harvest. Avoid harvesting while the crop is wet; dry grain safely before storage."
    },
    {
      id: "tomato",
      name: "Tomato",
      season: "Kharif",
      stage: "Flowering",
      sown: "2026-07-12",
      days: 105,
      guide: "Harvest fruit at the maturity stage suited to its intended use. Handle gently and keep damaged fruit separate to reduce spoilage."
    },
    {
      id: "onion",
      name: "Onion",
      season: "Rabi",
      stage: "Bulb development",
      sown: "2025-12-18",
      days: 120,
      guide: "Watch for natural neck fall and mature outer skins. Cure bulbs in a dry, well-ventilated place before storing."
    },
    {
      id: "soybean",
      name: "Soybean",
      season: "Kharif",
      stage: "Pod filling",
      sown: "2026-06-28",
      days: 100,
      guide: "Check pods and plant maturity across the field rather than relying on one plant. Keep harvested seed dry and protected from pests."
    }
  ],
  buyerOffers: [
    { id: "offer-101", buyer: "Sahyadri Grains Co-op", crop: "Wheat", price: 2520, unit: "quintal", quantity: 40, location: "Nashik", quality: "FAQ grade", payment: "Within 3 days", transport: "Buyer pickup available", updated: "Demo record" },
    { id: "offer-102", buyer: "Green Basket Produce", crop: "Wheat", price: 2460, unit: "quintal", quantity: 20, location: "Pune", quality: "Clean, dry grain", payment: "On delivery", transport: "Seller arranges transport", updated: "Demo record" },
    { id: "offer-103", buyer: "Deccan Harvest Hub", crop: "Tomato", price: 1800, unit: "quintal", quantity: 10, location: "Nashik", quality: "Grade A, firm fruit", payment: "Within 2 days", transport: "Collection point", updated: "Demo record" },
    { id: "offer-104", buyer: "Western Crop Exchange", crop: "Onion", price: 2150, unit: "quintal", quantity: 25, location: "Ahmednagar", quality: "Cured, medium bulbs", payment: "On delivery", transport: "Seller arranges transport", updated: "Demo record" },
    { id: "offer-105", buyer: "Sahyadri Grains Co-op", crop: "Soybean", price: 4380, unit: "quintal", quantity: 15, location: "Nashik", quality: "Clean, sorted", payment: "Within 3 days", transport: "Buyer pickup available", updated: "Demo record" }
  ],
  farmerListings: [
    { id: "listing-201", farmer: "Demo farmer A", crop: "Wheat", quantity: 32, price: 2410, location: "Nashik", quality: "Clean and dry", harvest: "Ready in 2 weeks" },
    { id: "listing-202", farmer: "Demo farmer B", crop: "Wheat", quantity: 18, price: 2480, location: "Pune", quality: "FAQ grade", harvest: "Ready now" },
    { id: "listing-203", farmer: "Demo farmer C", crop: "Tomato", quantity: 12, price: 1650, location: "Nashik", quality: "Firm, mixed size", harvest: "Ready now" },
    { id: "listing-204", farmer: "Demo farmer D", crop: "Onion", quantity: 28, price: 2050, location: "Ahmednagar", quality: "Cured, medium bulbs", harvest: "Ready in 1 week" },
    { id: "listing-205", farmer: "Demo farmer E", crop: "Soybean", quantity: 20, price: 4210, location: "Pune", quality: "Clean and sorted", harvest: "Ready now" }
  ],
  schemes: [
    { id: "scheme-301", title: "Example: Seasonal input support", type: "Agriculture support", summary: "A sample information card showing how a seasonal input-support programme could be presented.", eligibility: "Eligibility varies by programme and location.", documents: "Identity, land and bank records may be requested by the relevant programme.", steps: "Check the official programme page, confirm current eligibility locally, then follow its application instructions.", source: "Official source link will be added after verification.", verified: "Not verified — demo content" },
    { id: "scheme-302", title: "Example: Small-farm equipment loan", type: "Agricultural finance", summary: "A sample information card illustrating where farmers could compare equipment-finance details.", eligibility: "Lender requirements and approval decisions vary.", documents: "Requirements depend on the selected lender.", steps: "Compare terms with a regulated lender and review repayment conditions before applying.", source: "Official lender source will be added after verification.", verified: "Not verified — demo content" },
    { id: "scheme-303", title: "Example: Water conservation assistance", type: "Water management", summary: "An illustrative entry for a local water-conservation support programme.", eligibility: "Availability depends on location and current programme rules.", documents: "Confirm required documents with the relevant government office.", steps: "Ask the local agriculture or water-resources office for current programme details.", source: "Official source link will be added after verification.", verified: "Not verified — demo content" }
  ],
  recentActivity: [
    { id: "activity-1", title: "Wheat harvest guide", detail: "Saved crop guide", date: "Today" },
    { id: "activity-2", title: "Field water estimate", detail: "Illustrative calculation", date: "Yesterday" },
    { id: "activity-3", title: "Seasonal input support", detail: "Demo scheme card viewed", date: "2 days ago" }
  ],
  assistantReplies: {
    soil: "Soil condition can vary across a field, and I can’t see or test your soil. For more relevant general guidance, share your crop, location, soil type if known, and any recent soil-test results. A local soil test or agricultural expert is the right source for field-specific nutrient advice.",
    irrigation: "I can help with a simple water-volume calculation. One millimetre of water over one acre is about 4,047 litres. This is a unit conversion only—not a crop irrigation recommendation. Check crop, soil, weather and local guidance before deciding when or how much to irrigate.",
    fertilizer: "For a transparent estimate, use the application rate from a soil test or a qualified local recommendation. The calculator multiplies your supplied rate by field area; it does not choose a recommended rate.",
    cropCare: "Crop care depends on the crop, growth stage, location and what you observe. Share those details and describe when the issue began. I can offer general considerations, but I can’t diagnose a crop or verify field conditions; for concerning symptoms, ask a local agricultural expert.",
    harvest: "Harvest timing depends on crop variety, local conditions and maturity. Use the crop guide as a checklist, inspect several parts of the field, and ask a local agricultural expert if you see concerning symptoms.",
    offers: "The offers on this demo are illustrative records, not current market prices or real buyer commitments. Compare quantity, grade, payment and transport conditions as well as the listed price.",
    schemes: "Scheme cards in this demo are placeholders, not verified government programmes. Check current eligibility, deadlines and application steps on an official government source or with your local agriculture office.",
    general: "I’m SOILY, FarmAura’s soil and farming assistant. This demo can explain its sample crop guides, calculators, illustrative offers and scheme placeholders. Replies are scripted; there is no connected AI service, soil test, live weather or verified scheme information. Tell me your crop and what you’re trying to do, and I’ll point you to the relevant demo tool."
  }
};
