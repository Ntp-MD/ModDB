<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getDraftMessages } from "../utils/mockData";

const router = useRouter();
const draftMessages = computed(() => getDraftMessages());

function openThread(id: string) {
  router.push(`/thread/${id}`);
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="drafts-toolbar main-toolbar">
        <h1 class="drafts-title">Drafts</h1>
      </div>

      <section class="inbox-list fade-in" aria-label="Draft messages">
        <div v-for="msg in draftMessages" :key="msg.id" class="list-row hover-row" @click="openThread(msg.id)">
          <div class="row-cell row-cell-star">
            <button class="star-btn focus-ring" aria-label="Draft" aria-disabled="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5h-2v-2h2v2zm0-4h-2V6h2v4.5z" />
              </svg>
            </button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.to }}</div>
          <div class="row-cell row-cell-content">
            <span class="subject">{{ msg.subject }}</span>
            <span class="snippet hide-mobile"> — {{ msg.snippet }}</span>
          </div>
          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>

        <div v-if="draftMessages.length === 0" class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5h-2v-2h2v2zm0-4h-2V6h2v4.5z" />
          </svg>
          <h2 class="empty-state-title">No drafts</h2>
          <p class="empty-state-text">Draft messages will appear here.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.drafts-title {
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
