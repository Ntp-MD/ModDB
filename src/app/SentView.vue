<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getCachedMessages, getLabelText, getLabelColor } from "../utils/supabase-data";
import type { Message } from "../utils/types";

const router = useRouter();

const messages = ref<Message[]>([]);

function reloadMessages() {
  const allMessages = getCachedMessages();
  messages.value = allMessages.filter((msg: Message) => msg.msg_to === "me@example.com");
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
  // For now, just update the local state
  // In a real app, you'd update the database
  reloadMessages();
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="sent-toolbar main-toolbar">
        <h1 class="page-title">Sent</h1>
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
          <div class="row-cell row-cell-from">{{ msg.msg_to }}</div>
          <div class="row-cell row-cell-content">
            <span v-if="msg.label" class="badge hide-mobile" :style="{ background: getLabelColor(msg.label) }">{{
              msg.labelText || getLabelText(msg.label)
            }}</span>
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

<style scoped></style>
