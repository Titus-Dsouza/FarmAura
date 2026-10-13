"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation menu" : "Close navigation menu"
  );
  navigation?.classList.toggle("is-open", !isExpanded);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const year = document.getElementById("current-year");
if (year) year.textContent = String(new Date().getFullYear());

const heroImage = document.querySelector(".hero-image");
const heroImageFrame = heroImage?.closest(".hero-image-frame");

function showHeroImageFallback() {
  if (!heroImage || !heroImageFrame || heroImageFrame.classList.contains("has-image-fallback")) return;
  heroImageFrame.classList.add("has-image-fallback");
  heroImage.hidden = true;
  heroImageFrame.setAttribute("role", "img");
  heroImageFrame.setAttribute("aria-label", heroImage.alt);
}

heroImage?.addEventListener("error", showHeroImageFallback);
if (heroImage?.complete && heroImage.naturalWidth === 0) showHeroImageFallback();
