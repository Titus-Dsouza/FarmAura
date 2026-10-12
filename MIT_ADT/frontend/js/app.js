"use strict";

window.KisanSaathi = window.KisanSaathi || {};

const store = {
  read(key, fallback) {
    try {
      const value = localStorage.getItem(`${window.KisanSaathi.config.storagePrefix}:${key}`);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(`${window.KisanSaathi.config.storagePrefix}:${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(`${window.KisanSaathi.config.storagePrefix}:${key}`);
    } catch {
      return false;
    }
    return true;
  }
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

function showToast(message, kind = "success") {
  let region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-relevant", "additions");
    document.body.append(region);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${kind}`;
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 3800);
}

function setBusy(button, busy, busyLabel = "Please wait…") {
  if (!(button instanceof HTMLButtonElement)) return;
  if (busy) {
    button.dataset.originalLabel = button.textContent.trim();
    button.textContent = busyLabel;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  } else {
    button.textContent = button.dataset.originalLabel || button.textContent;
    button.disabled = false;
    button.removeAttribute("aria-busy");
    delete button.dataset.originalLabel;
  }
}

function getDemoProfile() {
  return store.read("profile", { ...window.KisanSaathi.demoData.profile });
}

function setDemoProfile(profile) {
  return store.write("profile", profile);
}

function requireDemoProfile(role) {
  const profile = getDemoProfile();
  if (role) profile.role = role;
  store.write("profile", profile);
  return profile;
}

function applyTheme() {
  const theme = store.read("theme", "light");
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    const label = button.querySelector("[data-theme-label]");
    if (label) label.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  });
}

function toggleTheme() {
  const next = store.read("theme", "light") === "dark" ? "light" : "dark";
  store.write("theme", next);
  applyTheme();
  showToast(`${next === "dark" ? "Dark" : "Light"} theme enabled.`);
}

function wireCommonControls() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });
  document.querySelectorAll("[data-sign-out]").forEach((button) => {
    button.addEventListener("click", () => {
      store.remove("profile");
      window.location.href = "index.html";
    });
  });
  document.querySelectorAll("[data-mobile-toggle]").forEach((button) => {
    const nav = document.getElementById(button.getAttribute("aria-controls"));
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
      nav?.classList.toggle("is-open", !expanded);
    });
    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  });
  applyTheme();
}

window.KisanSaathi.store = store;
window.KisanSaathi.escapeHtml = escapeHtml;
window.KisanSaathi.showToast = showToast;
window.KisanSaathi.setBusy = setBusy;
window.KisanSaathi.getDemoProfile = getDemoProfile;
window.KisanSaathi.setDemoProfile = setDemoProfile;
window.KisanSaathi.requireDemoProfile = requireDemoProfile;
window.KisanSaathi.applyTheme = applyTheme;
window.KisanSaathi.wireCommonControls = wireCommonControls;

document.addEventListener("DOMContentLoaded", wireCommonControls);
