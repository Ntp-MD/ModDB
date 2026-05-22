<script setup lang="ts">
import { computed } from "vue";
import type { Person } from "../utils/types";
import { generateInitials, updatePerson, getLabelText } from "../utils/supabase-data";

const props = defineProps<{ person: Person }>();
const emit = defineEmits<{ edit: [person: Person]; delete: [id: string] }>();

const initials = computed(() => props.person.initials || generateInitials(props.person.name));
const labelText = computed(() => props.person.labelText || getLabelText(props.person.label));

function toggleStar() {
  updatePerson(props.person.id, { starred: !props.person.starred });
}
</script>

<template>
  <article class="card card-person fade-in">
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
        ★
      </button>
    </div>

    <div class="card-person-body">
      <h3 class="card-person-name">{{ person.name }}</h3>
      <p class="card-person-role">{{ person.role || "No title" }}</p>
      <p class="card-person-company">{{ person.company || "No company" }}</p>
      <div v-if="person.social" class="card-social-links">
        <a v-if="person.social.facebook" :href="person.social.facebook" target="_blank" class="social-link social-facebook" aria-label="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"
            />
          </svg>
        </a>
        <a v-if="person.social.instagram" :href="person.social.instagram" target="_blank" class="social-link social-instagram" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 2.191 4.919 5.4C21.89 8.9 21.9 9.28 21.9 12.484s-.012 3.584-.07 4.85c-.149 3.204-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-2.199-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.85c.149-3.204 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.2-4.358-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
            />
          </svg>
        </a>
        <a v-if="person.social.linkedin" :href="person.social.linkedin" target="_blank" class="social-link social-linkedin" aria-label="LinkedIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            />
          </svg>
        </a>
      </div>
    </div>

    <div class="card-person-footer">
      <span v-if="person.label" class="badge" :class="`badge-label-${person.label}`">{{ labelText }}</span>
      <div class="card-person-actions">
        <button class="card-person-btn btn-icon-only focus-ring" aria-label="Edit" @click.stop="emit('edit', person)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </button>
        <button class="card-person-btn btn-icon-only focus-ring" aria-label="Delete" @click.stop="emit('delete', person.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
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
  background: var(--bg-color-surface);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-md);
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
  cursor: default;
  position: relative;
  overflow: hidden;
}

.card-person::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: transparent;
  transition: background var(--transition-fast);
}

.card-person:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.card-person:hover::before {
  background: var(--accent-primary);
}

.card-person-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-initials-lg {
  width: 64px;
  height: 64px;
  font-size: var(--font-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-circle);
  color: var(--font-color-white);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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
.avatar-initials-lg[data-label="purple"] {
  background: var(--label-purple);
}

.star-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  background: transparent;
  border: none;
  font-size: 20px;
  color: var(--font-color-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
}

.star-btn:hover {
  background: var(--bg-color-row-hover);
  color: var(--font-color-primary);
}

.star-btn-active {
  color: #f9ab00;
}

.card-person-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: var(--space-xs);
}

.card-person-name {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--font-color-primary);
  line-height: 1.2;
}

.card-person-role {
  font-size: var(--font-sm);
  color: var(--font-color-secondary);
  font-weight: 500;
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
  width: 28px;
  height: 28px;
  border-radius: var(--radius-circle);
  color: var(--font-color-white);
  text-decoration: none;
  transition:
    transform var(--transition-fast),
    opacity var(--transition-fast);
}

.social-link:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

.social-facebook {
  background: #1877f2;
}

.social-instagram {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
}

.social-linkedin {
  background: #0077b5;
}

.card-person-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-sm);
  border-top: 1px solid var(--border-color-subtle);
  padding-top: var(--space-sm);
}

.card-person-actions {
  display: flex;
  gap: 4px;
}

.card-person-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-circle);
  background: transparent;
  border: none;
  color: var(--font-color-muted);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.card-person-btn:hover {
  background: var(--bg-color-row-hover);
  color: var(--font-color-primary);
}
</style>
