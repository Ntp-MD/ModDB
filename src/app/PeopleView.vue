<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "../hooks/useToast";
import { mockPeople } from "../utils/mockData";
import PersonCard from "../components/PersonCard.vue";

const { showToast } = useToast();
const people = ref([...mockPeople]);

function handleDelete(id: string) {
  people.value = people.value.filter((p) => p.id !== id);
  showToast("Contact deleted", "Undo");
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="people-toolbar main-toolbar">
        <h1 class="people-title">People</h1>
        <button class="btn btn-compose focus-ring">
          <span class="btn-compose-icon">+</span>
          <span>Add Person</span>
        </button>
      </div>

      <div class="person-grid fade-in">
        <PersonCard v-for="person in people" :key="person.id" :person="person" @delete="handleDelete" />
      </div>

      <div v-if="people.length === 0" class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h2 class="empty-state-title">No contacts yet</h2>
        <p class="empty-state-text">Add your first contact to get started.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.people-title {
  font-size: 22px;
  font-weight: 400;
  color: var(--font-color-primary);
  line-height: 1.3;
  margin-left: var(--space-sm);
}
</style>
