<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../hooks/useToast";
import { supabase, MY_EMAIL } from "../utils/supabase";
import { generateMessageId } from "../utils/supabase-data";

const router = useRouter();
const { showToast } = useToast();

const to = ref("");
const subject = ref("");
const body = ref("");
const minimized = ref(false);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function send() {
  if (!to.value || !subject.value || !body.value) {
    showToast("Please fill all fields");
    return;
  }
  if (!EMAIL_RE.test(to.value)) {
    showToast("Invalid recipient email address");
    return;
  }

  const newMessage = {
    id: await generateMessageId(),
    msg_from: MY_EMAIL,
    from_initials: "ME",
    msg_to: to.value,
    subject: subject.value,
    snippet: body.value.substring(0, 100) + (body.value.length > 100 ? "..." : ""),
    body: body.value,
    timestamp: "Just now",
    unread: false,
    starred: false,
  };

  const { error } = await supabase.from("messages").insert(newMessage);
  if (error) {
    showToast("Failed to send message");
    return;
  }
  showToast("Message sent");
  to.value = "";
  subject.value = "";
  body.value = "";
  router.push("/");
}

async function saveDraft() {
  if (!to.value && !subject.value && !body.value) {
    discard();
    return;
  }

  const draftMessage = {
    id: await generateMessageId(),
    msg_from: MY_EMAIL,
    from_initials: "ME",
    msg_to: to.value || "",
    subject: subject.value || "(No subject)",
    snippet: body.value.substring(0, 100) + (body.value.length > 100 ? "..." : ""),
    body: body.value,
    timestamp: "Draft",
    unread: false,
    starred: false,
  };

  const { error } = await supabase.from("messages").insert(draftMessage);
  if (error) {
    showToast("Failed to save draft");
    return;
  }
  showToast("Draft saved");
  router.back();
}

function discard() {
  if (to.value || subject.value || body.value) {
    if (confirm("Discard this message?")) {
      router.back();
    }
  } else {
    router.back();
  }
}

function toggleMinimize() {
  minimized.value = !minimized.value;
}
</script>

<template>
  <div class="compose-window" :class="{ 'compose-window-minimized': minimized }">
    <div class="compose-header" @click="toggleMinimize">
      <span class="compose-header-title">New Message</span>
      <div class="compose-header-actions" @click.stop>
        <button class="btn-icon-only focus-ring" :aria-label="minimized ? 'Maximize' : 'Minimize'" @click="toggleMinimize">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="minimized" d="M19 11H5v2h14z" />
            <path v-else d="M19 11H5v2h14z" />
          </svg>
        </button>
        <button class="btn-icon-only focus-ring" aria-label="Full screen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        </button>
        <button class="btn-icon-only focus-ring" aria-label="Close" @click="saveDraft">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>

    <div v-show="!minimized" class="compose-body">
      <div class="compose-field">
        <input v-model="to" type="email" class="compose-input focus-ring" placeholder="To" aria-label="To" />
      </div>
      <div class="compose-field">
        <input v-model="subject" type="text" class="compose-input focus-ring" placeholder="Subject" aria-label="Subject" />
      </div>
      <div class="compose-message-area">
        <textarea v-model="body" class="compose-textarea focus-ring" placeholder="" aria-label="Message body" />
      </div>
      <div class="compose-footer">
        <button class="compose-send-btn focus-ring" @click="send">
          Send
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        <div class="compose-footer-actions">
          <button class="btn-icon-only focus-ring" aria-label="Formatting options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M4.5 11h-2V9H1v6h1.5v-2.5h2V15H6V9H4.5v2zm2.5-.5h1.5V15H10v-4.5h1.5V9H7v1.5zm5.5 0H14V15h1.5v-4.5H17V9h-4.5v1.5zm9-1.5H18v6h1.5v-2h1.5c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5zm0 2.5H19.5v-1H22v1z"
              />
            </svg>
          </button>
          <button class="btn-icon-only focus-ring" aria-label="Attach files">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
              />
            </svg>
          </button>
          <button class="btn-icon-only focus-ring" aria-label="Insert link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
              />
            </svg>
          </button>
          <button class="btn-icon-only focus-ring" aria-label="Insert emoji">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
              />
            </svg>
          </button>
          <button class="btn-icon-only focus-ring" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </button>
        </div>
        <button class="btn-icon-only focus-ring" aria-label="Discard draft" @click="discard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compose-window {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  max-width: 100%;
  background: var(--bg-color-surface);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  box-shadow: var(--shadow-dialog);
  z-index: var(--z-dialog);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.compose-window-minimized {
  height: auto;
}

.compose-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-sm) 0 var(--space-md);
  height: 40px;
  background: #404040;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.compose-header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.compose-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.compose-field {
  border-bottom: 1px solid var(--border-color-subtle);
}

.compose-input {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-md);
  background: transparent;
  border: none;
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  font-family: inherit;
  outline: none;
}

.compose-input::placeholder {
  color: var(--font-color-muted);
}

.compose-message-area {
  flex: 1;
  min-height: 200px;
}

.compose-textarea {
  width: 100%;
  height: 200px;
  min-height: 200px;
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.5;
}

.compose-footer {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  gap: var(--space-sm);
  border-top: 1px solid var(--border-color-subtle);
}

.compose-send-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0 var(--space-md);
  height: 36px;
  background: var(--accent-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
  flex-shrink: 0;
}

.compose-send-btn:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.compose-footer-actions {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
}

@media (min-width: 600px) {
  .compose-window {
    width: 500px;
    max-width: calc(100vw - 2 * var(--space-md));
    right: var(--space-lg);
  }
}
</style>
