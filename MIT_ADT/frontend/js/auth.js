"use strict";

function selectAuthTab(tabName) {
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    const selected = tab.id === `${tabName}-tab`;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    panel.hidden = panel.id !== `${tabName}-panel`;
  });
}

document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => selectAuthTab(tab.id.replace("-tab", "")));
});

document.getElementById("demo-login-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const role = new FormData(event.currentTarget).get("demo-role");
  const profile = window.KisanSaathi.requireDemoProfile(role);
  window.location.href = profile.role === "seller" ? "seller-dashboard.html" : "farmer-dashboard.html";
});

document.getElementById("demo-signup-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const profile = {
    ...window.KisanSaathi.demoData.profile,
    name: String(values.get("name")).trim(),
    role: String(values.get("role")),
    email: "",
    district: "Add your location in settings",
    crops: []
  };
  if (!window.KisanSaathi.setDemoProfile(profile)) {
    window.KisanSaathi.showToast("This browser could not save a local demo profile. You can still explore the sample dashboards.", "error");
  }
  window.location.href = profile.role === "seller" ? "seller-dashboard.html" : "farmer-dashboard.html";
});
