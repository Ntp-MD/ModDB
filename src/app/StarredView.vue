<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getAllMessages, mockPeople, updatePerson } from "../utils/mockData";

const router = useRouter();
const starredMessages = computed(() => getAllMessages().filter((m) => m.starred));

function openThread(id: string) {
  router.push(`/thread/${id}`);
}

function toggleStar(msg: any) {
  const person = mockPeople.find((p) => p.messages.some((m) => m.id === msg.id));
  if (person) {
    const messageIndex = person.messages.findIndex((m) => m.id === msg.id);
    if (messageIndex !== -1) {
      person.messages[messageIndex].starred = !person.messages[messageIndex].starred;
      updatePerson(person.id, { messages: person.messages });
    }
  }
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="starred-toolbar main-toolbar">
        <h1 class="starred-title">Starred</h1>
      </div>

      <section class="inbox-list fade-in" aria-label="Starred messages">
        <div
          v-for="msg in starredMessages"
          :key="msg.id"
          class="list-row hover-row"
          :class="msg.unread ? 'list-row-unread' : 'list-row-read'"
          @click="openThread(msg.id)"
        >
          <div class="row-cell row-cell-star" @click.stop>
            <button class="star-btn star-btn-active focus-ring" :aria-label="msg.starred ? 'Unstar' : 'Star'" @click="toggleStar(msg)">★</button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.from }}</div>
          <div class="row-cell row-cell-content">
            <span class="subject">{{ msg.subject }}</span>
            <span class="snippet hide-mobile"> — {{ msg.snippet }}</span>
          </div>
          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>

        <div v-if="starredMessages.length === 0" class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h2 class="empty-state-title">No starred messages</h2>
          <p class="empty-state-text">Star messages to find them here.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.starred-title {
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
