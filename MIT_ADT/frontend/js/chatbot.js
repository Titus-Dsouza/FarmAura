"use strict";

const chatbotApp = window.KisanSaathi;
const chatLauncher = document.querySelector("[data-chat-launcher]");
const chatPanel = document.getElementById("chat-panel");
const chatMessages = document.querySelector("[data-chat-messages]");
let welcomeShown = false;
const chatStatus = document.querySelector("[data-chat-status]");

function appendChatMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `chat-message chat-message-${sender}`;
  const label = document.createElement("span");
  label.className = "chat-sender";
  label.textContent = sender === "user" ? "You" : "SOILY · Demo";
  const content = document.createElement("p");
  content.textContent = text;
  message.append(label, content);
  chatMessages?.append(message);
  chatMessages?.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
}

function openChat() {
  if (!chatPanel || !chatLauncher) return;
  chatPanel.hidden = false;
  chatLauncher.setAttribute("aria-expanded", "true");
  if (!welcomeShown) {
    appendChatMessage("Hello, I’m SOILY, FarmAura’s soil and farming assistant. I can explain the demo crop guides and calculations, and help you think through soil and farming questions. These are scripted demo replies—not live AI, soil tests, weather, or verified scheme advice. What would you like to explore?", "assistant");
    welcomeShown = true;
  }
  document.getElementById("chat-input")?.focus();
}

function closeChat() {
  if (!chatPanel || !chatLauncher) return;
  chatPanel.hidden = true;
  chatLauncher.setAttribute("aria-expanded", "false");
  chatLauncher.focus();
}

async function sendChatMessage(message) {
  const clean = message.trim();
  if (!clean || clean.length > 400) return;
  appendChatMessage(clean, "user");
  const form = document.querySelector("[data-chat-form]");
  const send = form?.querySelector("button[type='submit']");
  chatbotApp.setBusy(send, true, "…");
  if (chatStatus) chatStatus.hidden = false;
  try {
    const reply = await chatbotApp.api.askAssistant(clean);
    appendChatMessage(reply.text, "assistant");
  } catch {
    appendChatMessage("SOILY couldn’t prepare a response just now. Please try again or use the page’s farming tools. This demo does not connect to a live AI service.", "assistant");
  } finally {
    if (chatStatus) chatStatus.hidden = true;
    chatbotApp.setBusy(send, false);
  }
}

chatLauncher?.addEventListener("click", () => {
  if (chatPanel?.hidden) openChat();
  else closeChat();
});

document.querySelector("[data-chat-close]")?.addEventListener("click", closeChat);

document.querySelector("[data-chat-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.message;
  if (!event.currentTarget.reportValidity()) return;
  const message = input.value;
  input.value = "";
  sendChatMessage(message);
});

document.querySelectorAll("[data-chat-suggestion]").forEach((button) => {
  button.addEventListener("click", () => {
    if (chatPanel?.hidden) openChat();
    sendChatMessage(button.dataset.chatSuggestion || "");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatPanel && !chatPanel.hidden) closeChat();
});
