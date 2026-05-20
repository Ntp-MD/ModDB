<script setup lang="ts">
import type { Person } from "../utils/types";

const props = defineProps<{ person: Person }>();
const emit = defineEmits<{ (e: "delete", id: string): void }>();
</script>

<template>
  <article class="card card-person hover-row fade-in">
    <div class="card-person-header">
      <div class="avatar-initials avatar-initials-lg" :data-label="person.label" aria-hidden="true">
        {{ person.initials }}
      </div>
      <button class="star-btn focus-ring" :class="{ 'star-btn-active': person.starred }" :aria-label="person.starred ? 'Unstar' : 'Star'">
        {{ person.starred ? "★" : "☆" }}
      </button>
    </div>

    <div class="card-person-body">
      <h3 class="card-person-name">{{ person.name }}</h3>
      <p class="card-person-role">{{ person.role }}</p>
      <p class="card-person-company">{{ person.company }}</p>
    </div>

    <div class="card-person-footer">
      <span class="badge" :class="`badge-label-${person.label}`">{{ person.labelText }}</span>
      <div class="card-person-actions">
        <button class="btn btn-ghost focus-ring card-person-btn">Edit</button>
        <button class="btn btn-danger focus-ring card-person-btn" @click.stop="emit('delete', person.id)">Delete</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-person {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  cursor: default;
}

.card-person-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.avatar-initials-lg {
  width: var(--avatar-size-lg);
  height: var(--avatar-size-lg);
  font-size: var(--font-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-circle);
  color: var(--font-color-white);
}

.avatar-initials-lg[data-label="red"] {
  background: var(--label-red);
}
.avatar-initials-lg[data-label="yellow"] {
  background: var(--label-yellow);
}
.avatar-initials-lg[data-label="green"] {
  background: var(--label-green);
}
.avatar-initials-lg[data-label="blue"] {
  background: var(--label-blue);
}

.card-person-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-person-name {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--font-color-primary);
}

.card-person-role {
  font-size: var(--font-sm);
  color: var(--font-color-secondary);
}

.card-person-company {
  font-size: var(--font-xs);
  color: var(--font-color-muted);
}

.card-person-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-xs);
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.card-person-actions {
  display: flex;
  gap: var(--space-xs);
}

.card-person-btn {
  font-size: var(--font-xs);
  padding: 2px var(--space-sm);
  height: 28px;
  min-width: 44px;
}
</style>
