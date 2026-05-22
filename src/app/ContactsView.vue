<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import {
  getPeople,
  addPerson,
  updatePerson,
  deletePerson,
  generatePersonId,
  generateInitials,
  refreshData,
  getLabelText,
  getLabelColor,
  getAllLabels,
} from "../utils/supabase-data";
import PersonCard from "../components/PersonCard.vue";
import { useSearch } from "../hooks/useSearch";
import { useToast } from "../hooks/useToast";
import type { Person } from "../utils/types";

const people = ref<Person[]>([]);
const loading = ref(true);
const viewMode = ref<"grid" | "list">("grid");
const { searchQuery } = useSearch();
const { showToast } = useToast();

const departmentLabels = computed(() => {
  const allLabels = getAllLabels();
  const labelMap: Record<string, string> = {};
  allLabels.forEach((lbl) => {
    labelMap[lbl.id] = lbl.label;
  });
  return labelMap;
});

onMounted(async () => {
  people.value = getPeople();
  await refreshData();
  people.value = getPeople();
  loading.value = false;
});

const filteredPeople = computed(() => {
  let result = people.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.role?.toLowerCase().includes(query) ||
        p.company?.toLowerCase().includes(query),
    );
  }
  return result;
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
  status: "inbox" as Person["status"],
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
    status: "inbox",
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
    status: person.status || "inbox",
    social: { facebook: person.social?.facebook || "", instagram: person.social?.instagram || "", linkedin: person.social?.linkedin || "" },
  });
  showModal.value = true;
}

function openDuplicate(person: Person) {
  isEditing.value = false;
  Object.assign(form, {
    id: "",
    name: person.name,
    email: "", // Clear email to avoid duplicate constraint
    role: person.role,
    company: person.company,
    label: person.label,
    status: person.status || "inbox",
    starred: false,
    unread: false,
    lastContact: new Date().toLocaleDateString(),
    snippet: person.snippet || "",
    messages: [],
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
      await updatePerson(form.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        company: form.company,
        label: form.label,
        status: form.status,
        social,
      });
    } else {
      const newPerson: Person = {
        id: await generatePersonId(),
        name: form.name,
        email: form.email,
        role: form.role,
        company: form.company,
        label: form.label,
        status: form.status || "inbox",
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
    showToast("Failed to save contact", "Error");
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
      showToast("Failed to delete contact", "Error");
    }
  }
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="contacts-header main-toolbar">
        <div class="toolbar-left">
          <h1 class="page-title">Contacts</h1>
          <span class="contacts-count">({{ filteredPeople.length }} contacts)</span>
        </div>
        <div class="toolbar-actions">
          <div class="view-toggle">
            <button
              class="view-toggle-btn focus-ring"
              :class="{ 'view-toggle-btn-active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 11h5V5H4v6zm0 8h5v-6H4v6zm7 0h5v-6h-5v6zm7 0h5v-6h-5v6zm-7-8h5V5h-5v6zm7-8v6h5V5h-5z" />
              </svg>
            </button>
            <button
              class="view-toggle-btn focus-ring"
              :class="{ 'view-toggle-btn-active': viewMode === 'list' }"
              @click="viewMode = 'list'"
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
              </svg>
            </button>
          </div>
          <button class="btn btn-add focus-ring" @click="openAdd">+ Add Contact</button>
        </div>
      </div>

      <div v-if="loading" class="empty-state">
        <p class="empty-state-text">Loading contacts...</p>
      </div>

      <div v-else-if="filteredPeople.length > 0">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="contacts-grid fade-in">
          <PersonCard
            v-for="person in filteredPeople"
            :key="person.id"
            :person="person"
            @edit="openEdit"
            @delete="handleDelete"
            @duplicate="openDuplicate"
          />
        </div>

        <!-- List View -->
        <div v-else class="contacts-list fade-in">
          <table class="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role & Company</th>
                <th>Department</th>
                <th>Socials</th>
                <th class="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="person in filteredPeople" :key="person.id" class="table-row hover-row">
                <td class="cell-profile">
                  <div class="avatar-initials avatar-initials-sm" :style="{ background: getLabelColor(person.label) }">
                    {{ person.initials || generateInitials(person.name) }}
                  </div>
                  <span class="profile-name">{{ person.name }}</span>
                </td>
                <td class="cell-email">{{ person.email }}</td>
                <td class="cell-work">
                  <span class="role-text">{{ person.role || "—" }}</span>
                  <span v-if="person.company" class="company-text"> at {{ person.company }}</span>
                </td>
                <td class="cell-dept">
                  <span v-if="person.label" class="badge" :style="{ background: getLabelColor(person.label) }">
                    {{ person.labelText || getLabelText(person.label) }}
                  </span>
                </td>
                <td class="cell-social">
                  <div v-if="person.social" class="social-links-compact">
                    <a
                      v-if="person.social.facebook"
                      :href="person.social.facebook"
                      target="_blank"
                      class="social-icon social-facebook"
                      aria-label="Facebook"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"
                        />
                      </svg>
                    </a>
                    <a
                      v-if="person.social.instagram"
                      :href="person.social.instagram"
                      target="_blank"
                      class="social-icon social-instagram"
                      aria-label="Instagram"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 2.191 4.919 5.4C21.89 8.9 21.9 9.28 21.9 12.484s-.012 3.584-.07 4.85c-.149 3.204-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-2.199-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.85c.149-3.204 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.2-4.358-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
                        />
                      </svg>
                    </a>
                    <a
                      v-if="person.social.linkedin"
                      :href="person.social.linkedin"
                      target="_blank"
                      class="social-icon social-linkedin"
                      aria-label="LinkedIn"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        />
                      </svg>
                    </a>
                  </div>
                </td>
                <td class="cell-actions">
                  <button class="action-btn focus-ring" aria-label="Duplicate" @click.stop="openDuplicate(person)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                      />
                    </svg>
                  </button>
                  <button class="action-btn focus-ring" aria-label="Edit" @click.stop="openEdit(person)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                  <button class="action-btn focus-ring" aria-label="Delete" @click.stop="handleDelete(person.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h2 class="empty-state-title">{{ searchQuery ? "No matching contacts" : "No contacts yet" }}</h2>
        <p class="empty-state-text">{{ searchQuery ? "Try searching with different terms" : "Get started by adding your first team contact." }}</p>
        <button class="btn btn-add focus-ring" @click="openAdd">+ Add Contact</button>
      </div>
    </div>
  </main>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal fade-in">
      <div class="modal-header">
        <h2 class="modal-title-custom">{{ isEditing ? "Edit Contact" : "Add Contact" }}</h2>
        <button class="btn-icon-only focus-ring close-modal-btn" aria-label="Close" @click="showModal = false">✕</button>
      </div>
      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-grid">
          <!-- Column 1: Personal Info -->
          <div class="form-section">
            <h3 class="form-section-title">Personal Details</h3>
            <div class="form-group-custom">
              <label>Name <span class="required">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Full name" class="form-input-custom" />
            </div>
            <div class="form-group-custom">
              <label>Email <span class="required">*</span></label>
              <input v-model="form.email" type="email" required placeholder="email@example.com" class="form-input-custom" />
            </div>
            <div class="form-group-row-custom">
              <div class="form-group-custom">
                <label>Department</label>
                <select v-model="form.label" class="form-select-custom">
                  <option v-for="(label, id) in departmentLabels" :key="id" :value="id">{{ label }}</option>
                </select>
              </div>
              <div class="form-group-custom">
                <label>Status</label>
                <select v-model="form.status" class="form-select-custom">
                  <option value="inbox">Inbox</option>
                  <option value="starred">Starred</option>
                  <option value="bin">Bin</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Column 2: Work & Social Links -->
          <div class="form-section">
            <h3 class="form-section-title">Work & Social Links</h3>
            <div class="form-group-row-custom">
              <div class="form-group-custom">
                <label>Role</label>
                <input v-model="form.role" type="text" placeholder="Job title" class="form-input-custom" />
              </div>
              <div class="form-group-custom">
                <label>Company</label>
                <input v-model="form.company" type="text" placeholder="Company name" class="form-input-custom" />
              </div>
            </div>
            <div class="form-group-custom">
              <label>Facebook</label>
              <input v-model="form.social.facebook" type="url" placeholder="https://facebook.com/..." class="form-input-custom" />
            </div>
            <div class="form-group-custom">
              <label>Instagram</label>
              <input v-model="form.social.instagram" type="url" placeholder="https://instagram.com/..." class="form-input-custom" />
            </div>
            <div class="form-group-custom">
              <label>LinkedIn</label>
              <input v-model="form.social.linkedin" type="url" placeholder="https://linkedin.com/in/..." class="form-input-custom" />
            </div>
          </div>
        </div>

        <div class="modal-actions-custom">
          <button type="button" class="btn-cancel-custom focus-ring" @click="showModal = false">Cancel</button>
          <button type="submit" class="btn-save-custom focus-ring">{{ isEditing ? "Save" : "Add" }}</button>
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
  margin-top: var(--space-sm);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.contacts-count {
  font-size: var(--font-sm);
  color: var(--font-color-muted);
  font-weight: 500;
  margin-top: 4px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.view-toggle {
  display: flex;
  background: var(--bg-color-page);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.view-toggle-btn {
  border: none;
  background: transparent;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-xs);
  color: var(--font-color-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.view-toggle-btn:hover {
  background: var(--bg-color-row-hover);
  color: var(--font-color-primary);
}

.view-toggle-btn-active {
  background: var(--bg-color-surface);
  color: var(--accent-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-add {
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0 var(--space-md);
  height: 36px;
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.btn-add:hover {
  background: #004dc0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* ─── Contacts Table List View ─── */
.contacts-list {
  background: var(--bg-color-surface);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-top: var(--space-sm);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.contacts-table th,
.contacts-table td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-color-subtle);
}

.contacts-table th {
  background: var(--bg-color-page);
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--font-color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions-header {
  text-align: right;
}

.table-row {
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--bg-color-row-hover);
}

.cell-profile {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.profile-name {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--font-color-primary);
}

.avatar-initials-sm {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--font-color-white);
}

.avatar-initials-sm[data-label="red"] {
  background: var(--label-red);
}
.avatar-initials-sm[data-label="yellow"] {
  background: var(--label-yellow);
}
.avatar-initials-sm[data-label="green"] {
  background: var(--label-green);
}
.avatar-initials-sm[data-label="blue"] {
  background: var(--label-blue);
}
.avatar-initials-sm[data-label="purple"] {
  background: var(--label-purple);
}

.cell-email {
  font-size: var(--font-sm);
  color: var(--font-color-secondary);
}

.cell-work {
  font-size: var(--font-sm);
}

.role-text {
  font-weight: 500;
  color: var(--font-color-primary);
}

.company-text {
  color: var(--font-color-muted);
}

.cell-dept {
  font-size: var(--font-xs);
}

.social-links-compact {
  display: flex;
  gap: 6px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-circle);
  color: var(--font-color-white);
  transition:
    transform var(--transition-fast),
    opacity var(--transition-fast);
}

.social-icon:hover {
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

.cell-actions {
  text-align: right;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
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
  margin-left: 2px;
}

.action-btn:hover {
  background: var(--bg-color-row-hover-strong);
  color: var(--font-color-primary);
}

/* ─── Redesigned Premium Modal ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--bg-color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  width: 90%;
  max-width: 800px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  border: 1px solid var(--border-color-subtle);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color-subtle);
  padding-bottom: var(--space-sm);
}

.modal-title-custom {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--font-color-primary);
}

.close-modal-btn {
  font-size: var(--font-md);
  color: var(--font-color-muted);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.close-modal-btn:hover {
  background: var(--bg-color-row-hover);
  color: var(--font-color-primary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 650px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-section-title {
  font-size: var(--font-xs);
  font-weight: 700;
  color: var(--accent-primary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-color-subtle);
  padding-bottom: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.form-group-custom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group-custom label {
  font-size: var(--font-xs);
  color: var(--font-color-secondary);
  font-weight: 600;
}

.required {
  color: var(--accent-danger);
}

.form-input-custom,
.form-select-custom {
  height: 38px;
  padding: 0 var(--space-sm);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-color-surface);
  color: var(--font-color-primary);
  font-size: var(--font-sm);
  outline: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.form-input-custom:focus,
.form-select-custom:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-light);
}

.form-group-row-custom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.modal-actions-custom {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  border-top: 1px solid var(--border-color-subtle);
  padding-top: var(--space-md);
  margin-top: var(--space-sm);
}

.btn-cancel-custom {
  background: transparent;
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-lg);
  height: 38px;
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  color: var(--font-color-secondary);
  transition: background var(--transition-fast);
}

.btn-cancel-custom:hover {
  background: var(--bg-color-row-hover);
}

.btn-save-custom {
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0 var(--space-lg);
  height: 38px;
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.btn-save-custom:hover {
  background: #004dc0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
