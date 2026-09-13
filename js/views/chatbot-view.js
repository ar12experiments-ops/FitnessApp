/**
 * Chatbot View Component: TransformNXT Health Coach
 * Conversational interface for Indian fitness, nutrition, and bio-impedance telemetry.
 */

import { getChatbotResponse } from "../engines/chatbot-engine.js";

export class ChatbotView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-chatbot");
    this.messages = [
      {
        sender: "bot",
        time: "Just now",
        text: `**Namaste! I am your TransformNXT Evidence-Based Coach.**\n\nI answer detailed questions on Indian nutrition (ICMR-NIN guidelines, vegetarian protein swaps, staple grains), exercise science (Zone 2 cardio, progressive overload), and smart scale bio-impedance metrics (visceral fat, Asian-Indian BMI). How can I assist your health journey today?`
      }
    ];
  }

  async render() {
    this.container.innerHTML = `
      <div style="max-width: 960px; margin: 0 auto;">
        
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <span class="telemetry-badge badge-orange"><span class="beacon-dot orange"></span> AI HEALTH COMPANION</span>
              <span class="brand-tag">ZERO HALLUCINATION &bull; ICMR-NIN & ACSM GROUNDED</span>
            </div>
            <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em;">Ask Health & Fitness Coach</h1>
          </div>
          <span class="telemetry-badge badge-optimal">REAL-TIME VALIDATED ADVICE</span>
        </div>

        <div class="chat-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; background: var(--accent-orange-subtle); border: 1px solid var(--accent-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent-orange);">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              </div>
              <div>
                <strong style="font-size: 0.9375rem; color: var(--text-primary);">TransformNXT Clinical Assistant</strong>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">Grounded in ICMR-NIN 2024 & RepDB datasets</div>
              </div>
            </div>
            <button class="btn-glass btn-sm" id="btn-clear-chat" style="padding: 4px 10px; font-size: 0.75rem;">Clear Chat</button>
          </div>

          <!-- Chat Message Stream -->
          <div class="chat-messages" id="chat-stream">
            ${this.renderMessages()}
          </div>

          <!-- Quick Suggestions Chips -->
          <div class="chat-quick-prompts">
            <button class="prompt-chip" data-prompt="How do I get enough protein on an Indian vegetarian diet?">Vegetarian Protein</button>
            <button class="prompt-chip" data-prompt="How do I reduce visceral fat with Zone 2 cardio?">Reduce Visceral Fat</button>
            <button class="prompt-chip" data-prompt="What does the Thin-Fat phenotype mean for South Asians?">Thin-Fat Phenotype</button>
            <button class="prompt-chip" data-prompt="Roti vs Rice: which is better for fat loss?">Roti vs. Rice</button>
            <button class="prompt-chip" data-prompt="How much cooking oil or desi ghee should I eat daily?">Oil & Desi Ghee</button>
            <button class="prompt-chip" data-prompt="Why is Asian Indian BMI different from Western BMI?">Asian-Indian BMI</button>
          </div>

          <!-- Chat Input Row -->
          <form class="chat-input-row" id="chat-input-form">
            <input 
              type="text" 
              class="form-input" 
              id="chat-user-text" 
              placeholder="Ask anything about Indian diets, macros, exercises, smart scale metrics..." 
              autocomplete="off"
              required 
            />
            <button type="submit" class="btn-orange" style="padding: 10px 24px; white-space: nowrap;">
              Send
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </form>
        </div>

      </div>
    `;

    this.attachEvents();
    this.scrollToBottom();
  }

  renderMessages() {
    return this.messages.map(m => {
      // Basic markdown formatting for bullets and bold text
      let formattedText = m.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n\*/g, '<br>&bull;')
        .replace(/\n\d\./g, '<br>&bull;');

      return `
        <div class="chat-msg ${m.sender}">
          <div class="chat-bubble">
            ${formattedText}
          </div>
          <span style="font-size: 0.6875rem; color: var(--text-muted); align-self: ${m.sender === 'user' ? 'flex-end' : 'flex-start'};">
            ${m.time}
          </span>
        </div>
      `;
    }).join("");
  }

  scrollToBottom() {
    const stream = document.getElementById("chat-stream");
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }
  }

  attachEvents() {
    // Quick prompt chips
    this.container.querySelectorAll(".prompt-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.dataset.prompt;
        this.handleUserSubmit(text);
      });
    });

    // Form submit
    const form = document.getElementById("chat-input-form");
    const input = document.getElementById("chat-user-text");
    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = "";
        this.handleUserSubmit(text);
      });
    }

    // Clear chat
    document.getElementById("btn-clear-chat")?.addEventListener("click", () => {
      this.messages = [this.messages[0]];
      this.render();
    });
  }

  handleUserSubmit(userText) {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    this.messages.push({
      sender: "user",
      time: timeNow,
      text: userText
    });
    this.render();

    // Bot response
    setTimeout(() => {
      const botReply = getChatbotResponse(userText);
      this.messages.push({
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: botReply
      });
      this.render();
    }, 300);
  }
}
