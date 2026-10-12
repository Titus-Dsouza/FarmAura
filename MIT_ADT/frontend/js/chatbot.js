"use strict";

const chatbotApp = window.KisanSaathi;
const chatLauncher = document.querySelector("[data-chat-launcher]");
const chatPanel = document.getElementById("chat-panel");
const chatMessages = document.querySelector("[data-chat-messages]");
let welcomeShown = false;

function appendChatMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `chat-message chat-message-${sender}`;
  const label = document.createElement("span");
  label.className = "chat-sender";
  label.textContent = sender === "user" ? "You" : "Saathi · Demo";
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
    appendChatMessage("Hello! I can explain demo crop guidance, calculations, sample offers and placeholder scheme cards. What would you like to know?", "assistant");
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
  try {
    const reply = await chatbotApp.api.askAssistant(clean);
    appendChatMessage(reply.text, "assistant");
  } catch {
    appendChatMessage("The scripted demo response is unavailable right now. Try again or use the page's guidance cards.", "assistant");
  } finally {
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
