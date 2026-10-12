"use strict";

const settingsApp = window.KisanSaathi;
const profileForm = document.getElementById("profile-form");
const languageSelect = document.getElementById("language-setting");

function fillProfileForm(profile) {
  if (!profileForm) return;
  profileForm.elements.name.value = profile.name || "";
  profileForm.elements.email.value = profile.email || "";
  profileForm.elements.role.value = profile.role || "farmer";
  profileForm.elements.district.value = profile.district || "";
  profileForm.elements.crops.value = (profile.crops || []).join(", ");
  if (languageSelect) languageSelect.value = profile.language || "en";
}

profileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!profileForm.reportValidity()) return;
  const values = new FormData(profileForm);
  const profile = {
    ...settingsApp.getDemoProfile(),
    name: String(values.get("name")).trim(),
    email: String(values.get("email")).trim(),
    role: String(values.get("role")),
    district: String(values.get("district")).trim() || "Location not set",
    crops: String(values.get("crops")).split(",").map((crop) => crop.trim()).filter(Boolean).slice(0, 12),
    language: languageSelect?.value || "en"
  };
  if (!settingsApp.setDemoProfile(profile)) {
    settingsApp.showToast("Could not save these settings in browser storage.", "error");
    return;
  }
  document.querySelectorAll("[data-profile-initials]").forEach((node) => {
    node.textContent = profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  });
  settingsApp.showToast("Demo profile saved on this device.");
});

languageSelect?.addEventListener("change", () => {
  const profile = settingsApp.getDemoProfile();
  profile.language = languageSelect.value;
  if (!settingsApp.setDemoProfile(profile)) {
    settingsApp.showToast("Could not save the language preference in browser storage.", "error");
    return;
  }
  settingsApp.showToast("Language preference saved for the demo. Most interface copy is currently in English.");
});

const voiceButton = document.getElementById("voice-start");
const voiceStatus = document.getElementById("voice-status");
const voiceResult = document.getElementById("voice-result");
let recognition;

function navigateVoiceCommand(command) {
  const normalized = command.toLowerCase();
  if (normalized.includes("irrigat") || normalized.includes("water")) {
    window.location.href = "farmer-dashboard.html#calculators";
  } else if (normalized.includes("offer") || normalized.includes("price") || normalized.includes("buyer")) {
    window.location.href = "farmer-dashboard.html#offers";
  } else if (normalized.includes("scheme") || normalized.includes("loan")) {
    window.location.href = "farmer-dashboard.html#schemes";
  } else if (normalized.includes("crop") || normalized.includes("harvest")) {
    window.location.href = "farmer-dashboard.html#crop-guidance";
  } else {
    voiceResult.textContent = `Heard: “${command}”. Try “open irrigation”, “compare offers” or “show schemes”.`;
    settingsApp.showToast("Command not recognized. Try one of the suggested commands.", "error");
  }
}

function getSpeechLanguage() {
  const language = languageSelect?.value || "en";
  return ({ hi: "hi-IN", mr: "mr-IN", bn: "bn-IN" })[language] || "en-IN";
}

function setupSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    voiceStatus.textContent = "Speech recognition is not supported in this browser. Use the text links below.";
    voiceButton.disabled = true;
    voiceButton.title = "Speech recognition is not supported by this browser";
    return;
  }
  recognition = new Recognition();
  recognition.lang = getSpeechLanguage();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => { voiceStatus.textContent = "Listening… speak a short command."; };
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    voiceResult.textContent = `Heard: “${transcript}”`;
    navigateVoiceCommand(transcript);
  };
  recognition.onerror = (event) => {
    voiceStatus.textContent = event.error === "not-allowed"
      ? "Microphone permission was not granted. Use the text links below."
      : "Voice input ended. You can try again or use the text links.";
  };
  recognition.onend = () => {
    if (voiceStatus.textContent.startsWith("Listening")) voiceStatus.textContent = "Microphone is off.";
  };
}

voiceButton?.addEventListener("click", () => {
  if (!recognition) return;
  recognition.lang = getSpeechLanguage();
  try {
    recognition.start();
  } catch {
    voiceStatus.textContent = "Voice input is already active. Wait a moment and try again.";
  }
});

document.querySelectorAll("[data-voice-command]").forEach((button) => {
  button.addEventListener("click", () => navigateVoiceCommand(button.dataset.voiceCommand || ""));
});

settingsApp.api.profile().then(fillProfileForm).catch(() => {
  fillProfileForm(settingsApp.getDemoProfile());
  settingsApp.showToast("Showing a local sample profile.", "error");
});

document.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = String(new Date().getFullYear()); });
setupSpeechRecognition();
