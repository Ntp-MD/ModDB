<script setup lang="ts">
import { computed } from "vue";
import type { Person } from "../utils/types";
import { generateInitials, mockPeople, updatePerson } from "../utils/mockData";

const props = defineProps<{ person: Person }>();
const emit = defineEmits<{ (e: "delete", id: string): void; (e: "edit", id: string): void }>();

const initials = computed(() => props.person.initials || generateInitials(props.person.name));

function toggleStar() {
  const person = mockPeople.find((p) => p.id === props.person.id);
  if (person) {
    person.starred = !person.starred;
    updatePerson(person.id, { starred: person.starred });
  }
}
</script>

<template>
  <article class="card card-person hover-row fade-in">
    <div class="card-person-header">
      <div class="avatar-initials avatar-initials-lg" :data-label="person.label" aria-hidden="true">
        {{ initials }}
      </div>
      <button
        class="star-btn focus-ring"
        :class="{ 'star-btn-active': person.starred }"
        :aria-label="person.starred ? 'Unstar' : 'Star'"
        @click.stop="toggleStar"
      >
        {{ person.starred ? "★" : "☆" }}
      </button>
    </div>

    <div class="card-person-body">
      <h3 class="card-person-name">{{ person.name }}</h3>
      <p class="card-person-role">{{ person.role }}</p>
      <p class="card-person-company">{{ person.company }}</p>
      <div v-if="person.social" class="card-social-links">
        <a v-if="person.social.facebook" :href="person.social.facebook" target="_blank" class="social-link social-facebook" aria-label="Facebook"
          >FB</a
        >
        <a v-if="person.social.instagram" :href="person.social.instagram" target="_blank" class="social-link social-instagram" aria-label="Instagram"
          >IG</a
        >
        <a v-if="person.social.linkedin" :href="person.social.linkedin" target="_blank" class="social-link social-linkedin" aria-label="LinkedIn"
          >IN</a
        >
      </div>
    </div>

    <div class="card-person-footer">
      <span class="badge" :class="`badge-label-${person.label}`">{{ person.labelText }}</span>
      <div class="card-person-actions">
        <button class="btn btn-ghost focus-ring card-person-btn" @click.stop="emit('edit', person.id)">Edit</button>
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

.card-social-links {
  display: flex;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 10px;
  font-weight: 600;
  border-radius: var(--radius-circle);
  color: var(--font-color-white);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.social-link:hover {
  opacity: 0.8;
}

.social-facebook {
  background: #1877f2;
}

.social-instagram {
  background: #e4405f;
}

.social-twitter {
  background: #1da1f2;
}

.social-linkedin {
  background: #0077b5;
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

/* Person Grid */
.person-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
}

@media (min-width: 600px) {
  .person-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }
}

@media (min-width: 1024px) {
  .person-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
