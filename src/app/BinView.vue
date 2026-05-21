<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { mockSnoozedMessages } from "../utils/mockData";

const router = useRouter();
const snoozedMessages = computed(() => mockSnoozedMessages);

function openThread(id: string) {
  router.push(`/thread/${id}`);
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="bin-toolbar main-toolbar">
        <h1 class="bin-title">Bin</h1>
      </div>

      <section class="inbox-list fade-in" aria-label="Bin messages">
        <div
          v-for="msg in snoozedMessages"
          :key="msg.id"
          class="list-row hover-row"
          :class="msg.unread ? 'list-row-unread' : 'list-row-read'"
          @click="openThread(msg.id)"
        >
          <div class="row-cell row-cell-star">
            <button class="star-btn focus-ring" aria-label="Snooze" aria-disabled="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
            </button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.from }}</div>
          <div class="row-cell row-cell-content">
            <span class="subject">{{ msg.subject }}</span>
            <span class="snippet hide-mobile"> — {{ msg.snippet }}</span>
          </div>
          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>

        <div v-if="snoozedMessages.length === 0" class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            />
          </svg>
          <h2 class="empty-state-title">No snoozed messages</h2>
          <p class="empty-state-text">Snooze messages to find them here.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.bin-title {
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
</style>
