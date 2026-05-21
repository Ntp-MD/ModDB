<script setup lang="ts">
import { computed } from "vue";
import { mockPeople } from "../utils/mockData";
import PersonCard from "../components/PersonCard.vue";

const people = computed(() => mockPeople);
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <h1 class="contacts-title">Contacts</h1>

      <div v-if="people.length > 0" class="contacts-grid fade-in">
        <PersonCard v-for="person in people" :key="person.id" :person="person" />
      </div>

      <div v-else class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h2 class="empty-state-title">No contacts yet</h2>
        <p class="empty-state-text">No contacts available.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.contacts-title {
  font-size: 22px;
  font-weight: 400;
  color: var(--font-color-primary);
  line-height: 1.3;
  margin-left: var(--space-sm);
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
  padding: var(--space-sm);
}
</style>
