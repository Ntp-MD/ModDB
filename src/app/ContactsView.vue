<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getPeople, addPerson, updatePerson, deletePerson, generatePersonId, generateInitials, refreshData } from "../utils/supabase-data";
import PersonCard from "../components/PersonCard.vue";
import type { Person } from "../utils/types";

const people = ref<Person[]>([]);
const loading = ref(true);

onMounted(async () => {
  people.value = getPeople();
  await refreshData();
  people.value = getPeople();
  loading.value = false;
});

const showModal = ref(false);
const isEditing = ref(false);
const form = reactive({
  id: "",
  name: "",
  email: "",
  role: "",
  company: "",
  label: "blue" as Person["label"],
  starred: false,
  unread: false,
  lastContact: new Date().toLocaleDateString(),
  snippet: "",
  messages: [] as Person["messages"],
  social: { facebook: "", instagram: "", linkedin: "" },
});

function openAdd() {
  isEditing.value = false;
  Object.assign(form, {
    id: "",
    name: "",
    email: "",
    role: "",
    company: "",
    label: "blue",
    starred: false,
    unread: false,
    lastContact: new Date().toLocaleDateString(),
    snippet: "",
    messages: [],
    social: { facebook: "", instagram: "", linkedin: "" },
  });
  showModal.value = true;
}

function openEdit(person: Person) {
  isEditing.value = true;
  Object.assign(form, {
    ...person,
    social: { facebook: person.social?.facebook || "", instagram: person.social?.instagram || "", linkedin: person.social?.linkedin || "" },
  });
  showModal.value = true;
}

async function handleSubmit() {
  try {
    const social = {
      ...(form.social.facebook ? { facebook: form.social.facebook } : {}),
      ...(form.social.instagram ? { instagram: form.social.instagram } : {}),
      ...(form.social.linkedin ? { linkedin: form.social.linkedin } : {}),
    };

    if (isEditing.value) {
      await updatePerson(form.id, { name: form.name, email: form.email, role: form.role, company: form.company, label: form.label, social });
    } else {
      const newPerson: Person = {
        id: generatePersonId(),
        name: form.name,
        email: form.email,
        role: form.role,
        company: form.company,
        label: form.label,
        starred: false,
        unread: false,
        lastContact: new Date().toLocaleDateString(),
        snippet: "",
        messages: [],
        initials: generateInitials(form.name),
        social,
      };
      await addPerson(newPerson);
    }
    await refreshData();
    people.value = getPeople();
    showModal.value = false;
  } catch (error) {
    console.error("Error saving contact:", error);
    alert("Failed to save contact. Check console for details.");
  }
}

async function handleDelete(id: string) {
  if (confirm("Delete this contact?")) {
    try {
      await deletePerson(id);
      await refreshData();
      people.value = getPeople();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact. Check console for details.");
    }
  }
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="contacts-header main-toolbar">
        <h1 class="page-title">Contacts</h1>
        <button class="btn btn-add focus-ring" @click="openAdd">+ Add Contact</button>
      </div>

      <div v-if="loading" class="empty-state">
        <p class="empty-state-text">Loading contacts...</p>
      </div>

      <div v-else-if="people.length > 0" class="contacts-grid fade-in">
        <PersonCard v-for="person in people" :key="person.id" :person="person" @edit="openEdit" @delete="handleDelete" />
      </div>

      <div v-else class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h2 class="empty-state-title">No contacts yet</h2>
        <button class="btn btn-add focus-ring" @click="openAdd">+ Add Contact</button>
      </div>
    </div>
  </main>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
      <h2 class="modal-title">{{ isEditing ? "Edit Contact" : "Add Contact" }}</h2>
      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Name *</label>
          <input v-model="form.name" type="text" required placeholder="Full name" />
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input v-model="form.email" type="email" required placeholder="email@example.com" />
        </div>
        <div class="form-group">
          <label>Role</label>
          <input v-model="form.role" type="text" placeholder="Job title" />
        </div>
        <div class="form-group">
          <label>Company</label>
          <input v-model="form.company" type="text" placeholder="Company name" />
        </div>
        <div class="form-group">
          <label>Label</label>
          <select v-model="form.label">
            <option value="blue">DMS</option>
            <option value="yellow">PlusVenture</option>
            <option value="green">Sales</option>
            <option value="red">HR</option>
            <option value="purple">EX</option>
          </select>
        </div>
        <div class="form-group">
          <label>Facebook</label>
          <input v-model="form.social.facebook" type="url" placeholder="https://facebook.com/..." />
        </div>
        <div class="form-group">
          <label>Instagram</label>
          <input v-model="form.social.instagram" type="url" placeholder="https://instagram.com/..." />
        </div>
        <div class="form-group">
          <label>LinkedIn</label>
          <input v-model="form.social.linkedin" type="url" placeholder="https://linkedin.com/in/..." />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-cancel focus-ring" @click="showModal = false">Cancel</button>
          <button type="submit" class="btn btn-save focus-ring">{{ isEditing ? "Save" : "Add" }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
  padding: var(--space-sm);
}

.person-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
}

.btn-add {
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  padding: 0 var(--space-md);
  height: 36px;
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-modal);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: var(--font-xs);
  color: var(--font-color-secondary);
  font-weight: 500;
}

.form-group input,
.form-group select {
  height: 36px;
  padding: 0 var(--space-sm);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-color-input);
  color: var(--font-color-primary);
  font-size: var(--font-sm);
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--accent-primary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-lg);
  padding: 0 var(--space-md);
  height: 36px;
  font-size: var(--font-sm);
  cursor: pointer;
  color: var(--font-color-secondary);
}

.btn-save {
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  padding: 0 var(--space-md);
  height: 36px;
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
}
</style>
