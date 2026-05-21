<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "../hooks/useToast";
import { mockPeople, addPerson, updatePerson, deletePerson, generateInitials } from "../utils/mockData";
import type { Person } from "../utils/types";
import PersonCard from "../components/PersonCard.vue";

const { showToast } = useToast();
const people = computed(() => mockPeople);
const showModal = ref(false);
const editingId = ref<string | null>(null);

const formData = ref({
  name: "",
  email: "",
  role: "",
  company: "ITOPPLUS",
  label: "blue" as "red" | "yellow" | "green" | "blue" | "purple",
  facebook: "",
  instagram: "",
  linkedin: "",
});

const labelMap: Record<string, string> = {
  blue: "DMS",
  yellow: "PlusVenture",
  green: "Sales",
  red: "HR",
  purple: "EX",
};

const messageFormData = ref({
  subject: "",
  body: "",
  timestamp: "Just now",
});

const editingMessageIndex = ref<number | null>(null);

const isEditing = computed(() => editingId.value !== null);

const labelItems = computed(() => {
  return [
    { id: "blue", label: "DMS", color: "blue" },
    { id: "yellow", label: "PlusVenture", color: "yellow" },
    { id: "green", label: "Sales", color: "green" },
    { id: "red", label: "HR", color: "red" },
    { id: "purple", label: "EX", color: "purple" },
  ];
});

function openModal() {
  formData.value = {
    name: "",
    email: "",
    role: "",
    company: "ITOPPLUS",
    label: (labelItems.value[0]?.id || "blue") as "red" | "yellow" | "green" | "blue" | "purple",
    facebook: "",
    instagram: "",
    linkedin: "",
  };
  messageFormData.value = {
    subject: "",
    body: "",
    timestamp: "Just now",
  };
  editingId.value = null;
  editingMessageIndex.value = null;
  showModal.value = true;
}

function openEditModal(id: string) {
  const person = people.value.find((p) => p.id === id);
  if (person) {
    formData.value = {
      name: person.name,
      email: person.email,
      role: person.role,
      company: person.company,
      label: person.label,
      facebook: person.social?.facebook || "",
      instagram: person.social?.instagram || "",
      linkedin: person.social?.linkedin || "",
    };
    messageFormData.value = {
      subject: "",
      body: "",
      timestamp: "Just now",
    };
    editingId.value = id;
    editingMessageIndex.value = null;
    showModal.value = true;
  }
}

function closeModal() {
  showModal.value = false;
  editingId.value = null;
  editingMessageIndex.value = null;
}

function generateId(): string {
  return `${Date.now()}`;
}

function handleSubmit() {
  if (!formData.value.name || !formData.value.email) {
    showToast("Please fill required fields");
    return;
  }

  const personData: Person = {
    id: isEditing.value ? editingId.value! : generateId(),
    name: formData.value.name,
    email: formData.value.email,
    role: formData.value.role || "Unknown",
    company: formData.value.company || "Unknown",
    label: formData.value.label,
    labelText: labelMap[formData.value.label] || "Personal",
    starred: false,
    unread: false,
    lastContact: "Just now",
    snippet: "New contact added",
    messages: [],
    social: {
      facebook: formData.value.facebook || undefined,
      instagram: formData.value.instagram || undefined,
      linkedin: formData.value.linkedin || undefined,
    },
  };

  if (isEditing.value) {
    const existingPerson = people.value.find((p) => p.id === editingId.value);
    if (existingPerson) {
      updatePerson(editingId.value!, {
        ...personData,
        messages: existingPerson.messages,
        starred: existingPerson.starred,
        unread: existingPerson.unread,
        lastContact: existingPerson.lastContact,
        snippet: existingPerson.snippet,
      });
      showToast("Contact updated");
    }
  } else {
    addPerson(personData);
    showToast("Contact added");
  }

  closeModal();
}

function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this contact?")) {
    deletePerson(id);
    showToast("Contact deleted");
  }
}

function handleEdit(id: string) {
  openEditModal(id);
}

function getCurrentPerson(): Person | undefined {
  if (isEditing.value && editingId.value) {
    return people.value.find((p) => p.id === editingId.value);
  }
  return undefined;
}

function handleAddMessage() {
  if (!messageFormData.value.subject || !messageFormData.value.body) {
    showToast("Please fill message subject and body");
    return;
  }

  const person = getCurrentPerson();
  if (person) {
    const newMessage: import("../utils/types").Message = {
      id: `msg_${Date.now()}`,
      from: person.name,
      fromInitials: person.initials || generateInitials(person.name),
      to: "me@example.com",
      subject: messageFormData.value.subject,
      snippet: messageFormData.value.body.substring(0, 100) + (messageFormData.value.body.length > 100 ? "..." : ""),
      body: messageFormData.value.body,
      timestamp: messageFormData.value.timestamp,
      unread: true,
      starred: false,
      label: person.label,
      labelText: labelMap[person.label] || "Personal",
    };

    person.messages.push(newMessage);
    updatePerson(person.id, { messages: person.messages });
    showToast("Message added");
    messageFormData.value = { subject: "", body: "", timestamp: "Just now" };
  }
}

function handleEditMessage(index: number) {
  const person = getCurrentPerson();
  if (person && person.messages[index]) {
    messageFormData.value = {
      subject: person.messages[index].subject,
      body: person.messages[index].body,
      timestamp: person.messages[index].timestamp,
    };
    editingMessageIndex.value = index;
  }
}

function handleUpdateMessage() {
  const person = getCurrentPerson();
  if (person && editingMessageIndex.value !== null) {
    person.messages[editingMessageIndex.value].subject = messageFormData.value.subject;
    person.messages[editingMessageIndex.value].body = messageFormData.value.body;
    person.messages[editingMessageIndex.value].snippet =
      messageFormData.value.body.substring(0, 100) + (messageFormData.value.body.length > 100 ? "..." : "");
    person.messages[editingMessageIndex.value].timestamp = messageFormData.value.timestamp;
    updatePerson(person.id, { messages: person.messages });
    showToast("Message updated");
    messageFormData.value = { subject: "", body: "", timestamp: "Just now" };
    editingMessageIndex.value = null;
  }
}

function handleDeleteMessage(index: number) {
  const person = getCurrentPerson();
  if (person && confirm("Delete this message?")) {
    person.messages.splice(index, 1);
    updatePerson(person.id, { messages: person.messages });
    showToast("Message deleted");
  }
}

function handleCancelMessage() {
  messageFormData.value = { subject: "", body: "", timestamp: "Just now" };
  editingMessageIndex.value = null;
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="contacts-toolbar main-toolbar">
        <h1 class="contacts-title">Contacts</h1>
        <button class="btn btn-compose focus-ring" @click="openModal">
          <span class="btn-compose-icon">+</span>
          <span>Add Person</span>
        </button>
      </div>

      <div class="person-grid fade-in">
        <PersonCard v-for="person in people" :key="person.id" :person="person" @delete="handleDelete" @edit="handleEdit" />
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

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-dialog fade-in">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? "Edit Contact" : "Add Contact" }}</h2>
          <button class="btn-icon-only focus-ring" aria-label="Close" @click="closeModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Name *</label>
            <input v-model="formData.name" type="text" class="form-input focus-ring" placeholder="Full name" />
          </div>

          <div class="form-field">
            <label class="form-label">Email *</label>
            <input v-model="formData.email" type="email" class="form-input focus-ring" placeholder="email@example.com" />
          </div>

          <div class="form-field">
            <label class="form-label">Role</label>
            <input v-model="formData.role" type="text" class="form-input focus-ring" placeholder="Job title" />
          </div>

          <div class="form-field">
            <label class="form-label">Company</label>
            <input v-model="formData.company" type="text" class="form-input focus-ring" placeholder="Company name" />
          </div>

          <div class="form-field">
            <label class="form-label">Label</label>
            <select v-model="formData.label" class="form-input focus-ring">
              <option v-for="item in labelItems" :key="item.id" :value="item.id">{{ item.label }}</option>
            </select>
          </div>

          <div class="form-section-title">Social Media</div>
          <div class="form-field">
            <label class="form-label">Facebook</label>
            <input v-model="formData.facebook" type="text" class="form-input focus-ring" placeholder="https://facebook.com/username" />
          </div>
          <div class="form-field">
            <label class="form-label">Instagram</label>
            <input v-model="formData.instagram" type="text" class="form-input focus-ring" placeholder="https://instagram.com/username" />
          </div>
          <div class="form-field">
            <label class="form-label">LinkedIn</label>
            <input v-model="formData.linkedin" type="text" class="form-input focus-ring" placeholder="https://linkedin.com/in/username" />
          </div>

          <div v-if="isEditing" class="messages-section">
            <div class="messages-header">
              <h3 class="messages-title">Messages</h3>
              <button class="btn btn-ghost focus-ring btn-sm" @click="handleCancelMessage" v-if="editingMessageIndex !== null">Cancel</button>
            </div>

            <div class="messages-list">
              <div v-for="(msg, index) in getCurrentPerson()?.messages" :key="msg.id" class="message-item">
                <div class="message-content">
                  <span class="message-subject">{{ msg.subject }}</span>
                  <span class="message-timestamp">{{ msg.timestamp }}</span>
                </div>
                <div class="message-actions">
                  <button class="btn-icon-only focus-ring" aria-label="Edit message" @click="handleEditMessage(index)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                  <button class="btn-icon-only focus-ring" aria-label="Delete message" @click="handleDeleteMessage(index)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="!getCurrentPerson()?.messages || getCurrentPerson()?.messages.length === 0" class="empty-messages">No messages yet</div>
            </div>

            <div class="message-form">
              <div class="form-field">
                <label class="form-label">{{ editingMessageIndex !== null ? "Edit Message" : "Add Message" }}</label>
                <input v-model="messageFormData.subject" type="text" class="form-input focus-ring" placeholder="Subject" />
              </div>
              <div class="form-field">
                <textarea v-model="messageFormData.body" class="form-input focus-ring form-textarea" placeholder="Message body" rows="3" />
              </div>
              <div class="form-field">
                <input
                  v-model="messageFormData.timestamp"
                  type="text"
                  class="form-input focus-ring"
                  placeholder="Timestamp (e.g., Just now, May 21)"
                />
              </div>
              <button class="btn btn-primary focus-ring btn-sm" @click="editingMessageIndex !== null ? handleUpdateMessage() : handleAddMessage()">
                {{ editingMessageIndex !== null ? "Update Message" : "Add Message" }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost focus-ring" @click="closeModal">Cancel</button>
          <button class="btn btn-primary focus-ring" @click="handleSubmit">{{ isEditing ? "Update" : "Add" }}</button>
        </div>
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-md);
}

.modal-dialog {
  background: var(--bg-color-surface);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-dialog);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-bottom: 1px solid var(--border-color-subtle);
  flex-shrink: 0;
}

.modal-title {
  font-size: var(--font-lg);
  font-weight: 500;
  color: var(--font-color-primary);
}

.modal-body {
  padding: var(--space-md);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-top: 1px solid var(--border-color-subtle);
  flex-shrink: 0;
}

@media (min-width: 600px) {
  .modal-dialog {
    max-width: 480px;
    max-height: 90vh;
    border-radius: var(--radius-lg);
    height: auto;
  }
}

@media (min-width: 1024px) {
  .modal-dialog {
    max-width: 520px;
  }
}

.form-field {
  margin-bottom: var(--space-md);
}

.form-field:last-child {
  margin-bottom: 0;
}

.form-section-title {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--font-color-secondary);
  margin: var(--space-md) 0 var(--space-sm) 0;
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--border-color-subtle);
}

.form-label {
  display: block;
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--font-color-secondary);
  margin-bottom: var(--space-xs);
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-md);
  background: var(--bg-color-primary);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  border-color: var(--accent-primary);
}

.form-input::placeholder {
  color: var(--font-color-muted);
}

.form-textarea {
  height: auto;
  min-height: 80px;
  resize: vertical;
  padding: var(--space-sm) var(--space-md);
}

.messages-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-color-subtle);
}

.messages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.messages-title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--font-color-primary);
}

.messages-list {
  margin-bottom: var(--space-md);
  max-height: 200px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm);
  background: var(--bg-color-primary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
}

.message-content {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
}

.message-subject {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--font-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-timestamp {
  font-size: var(--font-xs);
  color: var(--font-color-muted);
  white-space: nowrap;
}

.message-actions {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.empty-messages {
  font-size: var(--font-sm);
  color: var(--font-color-muted);
  text-align: center;
  padding: var(--space-md);
}

.message-form {
  padding: var(--space-md);
  background: var(--bg-color-primary);
  border-radius: var(--radius-sm);
}

.btn-sm {
  padding: 0 var(--space-sm);
  height: 32px;
  font-size: var(--font-sm);
}
</style>
