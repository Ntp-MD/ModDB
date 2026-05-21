<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { mockPeople, updatePerson } from "../utils/mockData";
import type { Message } from "../utils/types";

const router = useRouter();

const messages = ref<Message[]>([]);

function reloadMessages() {
  messages.value = [];
  mockPeople.forEach((person) => {
    if (person.email === "me@example.com") {
      messages.value = person.messages.filter((msg) => msg.from === "me@example.com");
    }
  });
}

reloadMessages();

function openThread(id: string) {
  router.push(`/thread/${id}`);
}

function goInbox() {
  router.push("/");
}

function toggleStar(msg: Message) {
  msg.starred = !msg.starred;
  const person = mockPeople.find((p) => p.messages.some((m) => m.id === msg.id));
  if (person) {
    const messageIndex = person.messages.findIndex((m) => m.id === msg.id);
    if (messageIndex !== -1) {
      person.messages[messageIndex].starred = msg.starred;
      updatePerson(person.id, { messages: person.messages });
      reloadMessages();
    }
  }
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="sent-toolbar main-toolbar">
        <h1 class="sent-title">Sent</h1>
      </div>

      <section v-if="messages.length > 0" class="inbox-list fade-in" aria-label="Sent messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="list-row hover-row"
          :class="msg.unread ? 'list-row-unread' : 'list-row-read'"
          @click="openThread(msg.id)"
        >
          <div class="row-cell row-cell-star" @click.stop>
            <button
              class="star-btn focus-ring"
              :class="{ 'star-btn-active': msg.starred }"
              :aria-label="msg.starred ? 'Unstar' : 'Star'"
              @click="toggleStar(msg)"
            >
              <svg v-if="msg.starred" width="18" height="18" viewBox="0 0 24 24" fill="#f9ab00">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
                />
              </svg>
            </button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.to }}</div>
          <div class="row-cell row-cell-content">
            <span v-if="msg.label" class="badge hide-mobile" :class="`badge-label-${msg.label}`">{{ msg.labelText }}</span>
            <span class="subject">{{ msg.subject }}</span>
            <span class="snippet hide-mobile"> — {{ msg.snippet }}</span>
          </div>
          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>
      </section>

      <div v-else class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <h2 class="empty-state-title">No sent messages</h2>
        <p class="empty-state-text">Messages you send will appear here.</p>
        <button class="btn btn-compose focus-ring" @click="goInbox">
          <span class="btn-compose-icon">+</span>
          <span>Compose</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sent-title {
  font-size: 22px;
  font-weight: 400;
  color: var(--font-color-primary);
  line-height: 1.3;
  margin-left: var(--space-sm);
}

.inbox-list {
  background: var(--bg-color-surface);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-top: var(--space-xs);
}

/* List / Table Row */
.list-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  position: relative;
  background: var(--bg-color-surface);
  border-bottom: 1px solid var(--border-color-subtle);
  padding: 0 var(--space-md);
  height: var(--row-height-comfortable);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.list-row:hover {
  background: var(--bg-color-row-hover);
}

.list-row-unread {
  background: var(--bg-color-unread);
  font-weight: 600;
  color: var(--font-color-primary);
}

.list-row-read {
  background: var(--bg-color-surface);
  font-weight: 400;
  color: var(--font-color-secondary);
}

/* Row Cells */
.row-cell {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 100%;
  gap: var(--space-xs);
}

.row-cell-star {
  width: 28px;
  justify-content: center;
}

.row-cell-from {
  font-weight: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-cell-content {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-cell-content .subject {
  font-weight: inherit;
}

.row-cell-content .snippet {
  color: var(--font-color-secondary);
  font-weight: 400;
}

.row-cell-timestamp {
  width: 80px;
  justify-content: flex-end;
  font-size: var(--font-xs);
  color: var(--font-color-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Star Toggle */
.star-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--font-color-muted);
  cursor: pointer;
  font-size: 18px;
  transition: color var(--transition-fast);
}

.star-btn:hover {
  color: var(--font-color-secondary);
}

.star-btn-active {
  color: #f9ab00;
}

/* Badge / Label */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-xs);
  font-size: var(--font-xs);
  font-weight: 500;
  letter-spacing: 0.25px;
}

.badge-label-red {
  background: var(--label-red);
  color: var(--font-color-white);
}

.badge-label-yellow {
  background: var(--label-yellow);
  color: var(--font-color-white);
}

.badge-label-green {
  background: var(--label-green);
  color: var(--font-color-white);
}

.badge-label-blue {
  background: var(--label-blue);
  color: var(--font-color-white);
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
