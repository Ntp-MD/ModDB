<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "../hooks/useToast";
import { getAllMessages, mockPeople } from "../utils/mockData";

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();
const replyText = ref("");
const replyFocused = ref(false);

const message = computed(() => getAllMessages().find((m) => m.id === route.params.id));

const person = computed(() => {
  if (!message.value) return null;
  return mockPeople.find((p) => p.messages.some((m) => m.id === message.value?.id));
});

function goBack() {
  router.back();
}

function deleteMessage() {
  showToast("Conversation moved to Trash", "Undo");
  router.push("/");
}

function archiveMessage() {
  showToast("Conversation archived", "Undo");
  router.push("/");
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div v-if="message">
        <div class="thread-toolbar main-toolbar">
          <button class="btn-icon-only focus-ring" aria-label="Back to Inbox" @click="goBack">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>

          <h1 class="thread-subject">{{ message.subject }}</h1>

          <div class="thread-toolbar-actions">
            <button class="btn-icon-only focus-ring" aria-label="Archive" @click="archiveMessage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
                />
              </svg>
            </button>
            <button class="btn-icon-only focus-ring" aria-label="Delete" @click="deleteMessage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
            <button class="btn-icon-only focus-ring" aria-label="Mark as unread">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
                />
              </svg>
            </button>
            <button class="btn-icon-only focus-ring" aria-label="Snooze">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
            </button>
            <button class="btn-icon-only focus-ring" aria-label="More actions">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="thread fade-in">
          <div class="thread-message">
            <div class="thread-msg-header">
              <div class="thread-avatar" aria-hidden="true">
                {{ message.fromInitials }}
              </div>
              <div class="thread-meta">
                <div class="thread-meta-row">
                  <span class="thread-from">{{ message.from }}</span>
                  <span class="thread-timestamp">{{ message.timestamp }}</span>
                </div>
                <div class="thread-to">to {{ message.to }}</div>
              </div>
              <div class="thread-msg-actions">
                <button class="btn-icon-only focus-ring" aria-label="Reply">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                  </svg>
                </button>
                <button class="btn-icon-only focus-ring" aria-label="More">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="thread-body">
              <p v-for="(line, i) in message.body.split('\n')" :key="i" class="thread-body-line">
                {{ line }}
              </p>
              <div v-if="person && person.social" class="thread-social-links">
                <a v-if="person.social.facebook" :href="person.social.facebook" target="_blank" class="thread-social-link" aria-label="Facebook">
                  <img src="https://cdn-icons-png.flaticon.com/128/5968/5968764.png" alt="Facebook" class="thread-social-icon" />
                </a>
                <a v-if="person.social.instagram" :href="person.social.instagram" target="_blank" class="thread-social-link" aria-label="Instagram">
                  <img src="https://cdn-icons-png.flaticon.com/128/3955/3955024.png" alt="Instagram" class="thread-social-icon" />
                </a>
                <a :href="`mailto:${person.email}`" class="thread-social-link" aria-label="Email">
                  <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" alt="Email" class="thread-social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="thread-reply-area" :class="{ 'thread-reply-area-focused': replyFocused }">
          <div class="thread-reply-inner">
            <div class="thread-reply-avatar" aria-hidden="true">ME</div>
            <div class="thread-reply-field">
              <div v-if="!replyFocused && !replyText" class="thread-reply-btns">
                <button class="thread-reply-trigger focus-ring" @click="replyFocused = true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                  </svg>
                  Reply
                </button>
                <button class="thread-reply-trigger focus-ring">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 15l-7-7 7-7v4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11v4z" />
                  </svg>
                  Forward
                </button>
              </div>
              <textarea
                v-else
                v-model="replyText"
                class="thread-reply-textarea focus-ring"
                placeholder="Reply"
                rows="4"
                @focus="replyFocused = true"
                @blur="replyFocused = replyText.length > 0"
              />
              <div v-if="replyFocused || replyText" class="thread-reply-footer">
                <button class="compose-send-btn focus-ring">
                  Send
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
                <button class="compose-footer-btn focus-ring" aria-label="Attach files">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
                    />
                  </svg>
                </button>
                <button class="compose-footer-btn focus-ring" aria-label="Insert link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <h2 class="empty-state-title">Message not found</h2>
        <p class="empty-state-text">This message may have been deleted.</p>
        <button class="btn btn-primary focus-ring" @click="goBack">Go Back</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.thread-subject {
  font-size: 22px;
  font-weight: 400;
  color: var(--font-color-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: var(--space-sm);
}

.thread-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: auto;
  flex-shrink: 0;
}

.thread-message {
  background: var(--bg-color-surface);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-sm);
}

.thread-msg-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.thread-avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: var(--radius-circle);
  background: var(--accent-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-sm);
  font-weight: 600;
  flex-shrink: 0;
}

.thread-meta {
  flex: 1;
  min-width: 0;
}

.thread-meta-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
}

.thread-from {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--font-color-primary);
}

.thread-to {
  font-size: var(--font-xs);
  color: var(--font-color-muted);
  margin-top: 2px;
}

.thread-social-links {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.thread-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border-radius: var(--radius-circle);
  transition: opacity var(--transition-fast);
}

.thread-social-link:hover {
  opacity: 0.7;
}

.thread-social-icon {
  width: 100%;
  height: 100%;
}

.thread-timestamp {
  font-size: var(--font-xs);
  color: var(--font-color-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.thread-msg-actions {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.thread-body {
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  line-height: 1.6;
  padding-left: calc(var(--avatar-size) + var(--space-md));
}

.thread-body-line {
  min-height: 20px;
}

.thread-social-links {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-color-subtle);
}

.thread-reply-area {
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-color-surface);
  padding: var(--space-md);
  margin-top: var(--space-sm);
  transition: box-shadow var(--transition-fast);
}

.thread-reply-area-focused {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.06);
}

.thread-reply-inner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.thread-reply-avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: var(--radius-circle);
  background: var(--accent-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-sm);
  font-weight: 600;
  flex-shrink: 0;
}

.thread-reply-field {
  flex: 1;
  min-width: 0;
}

.thread-reply-btns {
  display: flex;
  gap: var(--space-sm);
}

.thread-reply-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-xl);
  background: transparent;
  color: var(--font-color-secondary);
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.thread-reply-trigger:hover {
  background: var(--bg-color-row-hover);
}

.thread-reply-textarea {
  width: 100%;
  min-height: 80px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  resize: none;
  background: transparent;
  line-height: 1.5;
}

.thread-reply-footer {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding-top: var(--space-sm);
}

.compose-send-btn {
  display: inline-flex;
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

.compose-footer-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--font-color-muted);
  cursor: pointer;
  border-radius: var(--radius-circle);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.compose-footer-btn:hover {
  background: var(--bg-color-row-hover);
  color: var(--font-color-primary);
}

/* Thread Container */
.thread {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  text-align: center;
  color: var(--font-color-muted);
}

.empty-state-title {
  font-size: var(--font-lg);
  font-weight: 500;
  color: var(--font-color-primary);
}

.empty-state-text {
  font-size: var(--font-sm);
  color: var(--font-color-secondary);
}
</style>
