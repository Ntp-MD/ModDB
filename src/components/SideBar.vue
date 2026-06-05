<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebar } from "../hooks/useSidebar";
import { useSearch } from "../hooks/useSearch";
import {
  getPeople,
  getCachedMessages,
  resetToDefaultData,
  getLabelColor,
  getAllLabels,
  saveLabelMap,
  saveLabelMapToDB,
  saveCustomLabelsToDB,
  deleteLabelFromDB,
  customLabels,
  labelMap,
} from "../utils/supabase-data";
import { MY_EMAIL } from "../utils/supabase";
import inboxIcon from "../assets/icons/inbox.png";
import starIcon from "../assets/icons/star.png";
import snoozeIcon from "../assets/icons/bin.png";
import sendIcon from "../assets/icons/send.png";
import draftIcon from "../assets/icons/draft.png";
import contactIcon from "../assets/icons/contact.png";

const route = useRoute();
const router = useRouter();
const { sidebarOpen, closeSidebar } = useSidebar();
const { activeLabel, setActiveLabel, clearSearch } = useSearch();

const isLabelModalOpen = ref(false);
const isEditMode = ref(false);
const editLabelId = ref("");
const labelName = ref("");
const labelColor = ref("blue");
const customColor = ref("#0b57d0");
const isCustomColor = ref(false);

const labelItems = computed(() => {
  return getAllLabels();
});

const navItems = computed(() => {
  const allMessages = getCachedMessages();
  const allPeople = getPeople();
  const personMap = new Map(allPeople.map((p) => [p.id, p]));

  const inboxCount = allMessages.filter((msg) => {
    const person = personMap.get(msg.person_id || "");
    return !person || person.status !== "bin";
  }).length;

  const starredCount = allMessages.filter((msg) => {
    const person = personMap.get(msg.person_id || "");
    return msg.starred || (person && (person.status === "starred" || person.starred));
  }).length;

  const sentCount = allMessages.filter((msg) => msg.msg_to === MY_EMAIL).length;

  const binCount = allMessages.filter((msg) => {
    const person = personMap.get(msg.person_id || "");
    return person && person.status === "bin";
  }).length;

  const contactsCount = allPeople.length;

  return [
    { id: "inbox", label: "Inbox", route: "/", icon: "inbox", count: inboxCount },
    { id: "starred", label: "Starred", route: "/starred", icon: "star", count: starredCount },
    { id: "sent", label: "Sent", route: "/sent", icon: "send", count: sentCount },
    { id: "drafts", label: "Drafts", route: "/drafts", icon: "draft", count: 0 },
    { id: "bin", label: "Bin", route: "/bin", icon: "snoozed", count: binCount },
    { id: "people", label: "Contacts", route: "/contacts", icon: "people", count: contactsCount },
  ];
});

function handleLabelClick(labelId: string) {
  if (activeLabel.value === labelId) {
    clearSearch();
  } else {
    setActiveLabel(labelId);
    if (route.path !== "/") {
      router.push("/");
    }
  }
  closeSidebar();
}

function handleResetData() {
  if (confirm("Are you sure you want to reset all data to default? This will delete all your changes.")) {
    resetToDefaultData();
  }
}

function openCreateLabel() {
  isEditMode.value = false;
  editLabelId.value = "";
  labelName.value = "";
  labelColor.value = "blue";
  customColor.value = "#0b57d0";
  isCustomColor.value = false;
  isLabelModalOpen.value = true;
}

function openEditLabelModal(id: string) {
  const presetColors = ["blue", "yellow", "green", "red", "purple"];
  const isPreset = presetColors.includes(id);

  if (isPreset) {
    isEditMode.value = true;
    editLabelId.value = id;
    labelName.value = labelMap.value[id] || "";
    labelColor.value = id;
    isCustomColor.value = false;
  } else {
    const label = customLabels.value.find((l) => l.id === id);
    if (!label) return;
    isEditMode.value = true;
    editLabelId.value = id;
    labelName.value = label.label;
    if (presetColors.includes(label.color)) {
      labelColor.value = label.color;
      isCustomColor.value = false;
    } else {
      customColor.value = label.color;
      isCustomColor.value = true;
    }
  }
  isLabelModalOpen.value = true;
}

function closeLabelModal() {
  isLabelModalOpen.value = false;
  isEditMode.value = false;
  editLabelId.value = "";
}

async function saveLabel() {
  const trimmedName = labelName.value.trim();
  if (!trimmedName) return;
  if (trimmedName.length > 50) {
    return;
  }
  labelName.value = trimmedName;
  const color = isCustomColor.value ? customColor.value : labelColor.value;
  const presetColors = ["blue", "yellow", "green", "red", "purple"];

  if (isEditMode.value && editLabelId.value) {
    const isPreset = presetColors.includes(editLabelId.value);

    if (isPreset) {
      labelMap.value[editLabelId.value] = labelName.value;
      saveLabelMap(labelMap.value);
      await saveLabelMapToDB(labelMap.value);
    } else {
      const index = customLabels.value.findIndex((l) => l.id === editLabelId.value);
      if (index !== -1) {
        customLabels.value[index] = {
          id: editLabelId.value,
          label: labelName.value,
          color,
        };
      }
      localStorage.setItem("customLabels", JSON.stringify(customLabels.value));
      await saveCustomLabelsToDB(customLabels.value);
    }
  } else {
    const id = `custom_${Date.now()}`;
    customLabels.value.push({
      id,
      label: labelName.value,
      color,
    });
    localStorage.setItem("customLabels", JSON.stringify(customLabels.value));
    await saveCustomLabelsToDB(customLabels.value);
  }

  closeLabelModal();
}

async function deleteLabel(id: string) {
  if (!confirm("Delete this label?")) return;
  customLabels.value = customLabels.value.filter((l) => l.id !== id);
  localStorage.setItem("customLabels", JSON.stringify(customLabels.value));
  await deleteLabelFromDB(id);
  if (activeLabel.value === id) {
    clearSearch();
  }
}
</script>

<template>
  <div class="sidebar-overlay" :class="{ 'sidebar-overlay-active': sidebarOpen }" aria-hidden="true" @click="closeSidebar" />

  <nav class="sidebar sidebar-collapse" :class="{ 'sidebar-open': sidebarOpen }" aria-label="Main navigation">
    <div class="sidebar-compose">
      <div class="compose-wrapper">
        <button class="btn-compose focus-ring" @click="handleResetData" aria-label="Reset data">
          <span class="compose-btn-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </svg>
          </span>
          Compose
        </button>
      </div>
    </div>

    <ul class="sidebar-nav" role="list">
      <li v-for="item in navItems" :key="item.id">
        <router-link :to="item.route" class="nav-item" :class="{ 'nav-item-active': route.path === item.route }" @click="closeSidebar">
          <span class="nav-icon" aria-hidden="true">
            <img v-if="item.icon === 'inbox'" :src="inboxIcon" alt="Inbox" width="20" height="20" />
            <img v-else-if="item.icon === 'star'" :src="starIcon" alt="Starred" width="20" height="20" />
            <img v-else-if="item.icon === 'send'" :src="sendIcon" alt="Sent" width="20" height="20" />
            <img v-else-if="item.icon === 'snoozed'" :src="snoozeIcon" alt="Snoozed" width="20" height="20" />
            <img v-else-if="item.icon === 'draft'" :src="draftIcon" alt="Drafts" width="20" height="20" />
            <img v-else-if="item.icon === 'people'" :src="contactIcon" alt="Contacts" width="20" height="20" />
          </span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.count && item.count > 0" class="nav-count nav-label">{{ item.count }}</span>
        </router-link>
      </li>
    </ul>

    <div class="sidebar-divider" />

    <div class="sidebar-section">
      <p class="nav-section-title nav-label">Labels</p>
      <ul role="list">
        <li>
          <button class="nav-item nav-item-add-label focus-ring" @click="openCreateLabel" aria-label="Create new label">
            <span class="nav-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </span>
            <span class="nav-label">Create new label</span>
          </button>
        </li>
        <li v-for="lbl in labelItems" :key="lbl.id">
          <span
            class="nav-item"
            :class="{ 'nav-item-active': activeLabel === lbl.id }"
            @click="handleLabelClick(lbl.id)"
            role="button"
            tabindex="0"
            @keydown.enter="handleLabelClick(lbl.id)"
          >
            <span class="nav-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" :style="{ color: getLabelColor(lbl.color) }">
                <path
                  d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"
                />
              </svg>
            </span>
            <span class="nav-label">{{ lbl.label }}</span>
            <div class="label-actions">
              <button class="btn-icon-only focus-ring" aria-label="Edit label" @click.stop="openEditLabelModal(lbl.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
              <button
                v-if="lbl.id.startsWith('custom_')"
                class="btn-icon-only focus-ring"
                aria-label="Delete label"
                @click.stop="deleteLabel(lbl.id)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          </span>
        </li>
      </ul>
    </div>
  </nav>

  <div v-if="isLabelModalOpen" class="dialog-overlay" @click.self="closeLabelModal">
    <div class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ isEditMode ? "Edit label" : "Create new label" }}</h2>
        <button class="btn-icon-only focus-ring" aria-label="Close" @click="closeLabelModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <div class="dialog-body">
        <div class="form-group">
          <label class="form-label">Label name</label>
          <input v-model="labelName" type="text" class="form-input focus-ring" placeholder="Enter label name" />
        </div>
        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-mode-toggle">
            <button class="color-mode-btn focus-ring" :class="{ 'color-mode-btn-active': !isCustomColor }" @click="isCustomColor = false">
              Preset
            </button>
            <button class="color-mode-btn focus-ring" :class="{ 'color-mode-btn-active': isCustomColor }" @click="isCustomColor = true">
              Custom
            </button>
          </div>
          <div v-if="!isCustomColor" class="color-picker">
            <button
              v-for="color in ['blue', 'yellow', 'green', 'red', 'purple']"
              :key="color"
              class="color-option focus-ring"
              :class="{ 'color-option-active': labelColor === color }"
              :style="{ background: `var(--label-${color})` }"
              @click="labelColor = color"
              :aria-label="color"
            />
          </div>
          <div v-else class="custom-color-picker">
            <input v-model="customColor" type="color" class="color-input focus-ring" aria-label="Choose custom color" />
            <span class="color-value">{{ customColor }}</span>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn btn-secondary focus-ring" @click="closeLabelModal">Cancel</button>
        <button class="btn btn-primary focus-ring" @click="saveLabel">{{ isEditMode ? "Save" : "Create" }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Sidebar Container ─── */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-color-page);
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform var(--transition-normal);
  z-index: var(--z-sidebar);
  transform: translateX(-100%);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-right: var(--space-md);
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-color-overlay);
  z-index: calc(var(--z-sidebar) - 1);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-normal);
}

.sidebar-overlay-active {
  opacity: 1;
  pointer-events: auto;
}

/* ─── Responsive ─── */
@media (min-width: 600px) {
  .sidebar {
    transform: translateX(0);
    width: var(--sidebar-width-mini);
    top: var(--topbar-height);
    height: calc(100vh - var(--topbar-height));
  }

  .sidebar .nav-label,
  .sidebar .compose-btn-label {
    display: none;
  }
}

@media (min-width: 1024px) {
  .sidebar {
    width: var(--sidebar-width);
  }

  .sidebar .nav-label,
  .sidebar .compose-btn-label {
    display: inline;
  }
}

@media (min-width: 600px) and (max-height: 500px) {
  .sidebar {
    top: 48px;
    height: calc(100vh - 48px);
  }
}

/* ─── Compose Section ─── */
.sidebar-compose {
  place-content: center;
  padding: 0 var(--space-sm);
  min-height: 70px;
}

.compose-wrapper {
  position: relative;
}

.compose-menu {
  position: absolute;
  top: calc(100% + var(--space-xs));
  left: 0;
  right: 0;
  background: var(--bg-color-surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-dialog);
  overflow: hidden;
  z-index: var(--z-dropdown);
}

.compose-menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  transition: background var(--transition-fast);
}

.compose-menu-item:hover {
  background: var(--bg-color-row-hover);
}

.nav-item-reset {
  color: var(--accent-danger);
}

.nav-item-reset:hover {
  background: var(--bg-color-row-hover);
  color: var(--accent-danger);
}

.compose-menu-item svg {
  flex-shrink: 0;
}

.compose-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-nav {
  padding: 0;
}

.sidebar-divider {
  height: 1px;
  background: var(--border-color-subtle);
  margin: var(--space-xs) var(--space-md);
}

.sidebar-section {
  margin-top: var(--space-xs);
}

.nav-count {
  margin-left: auto;
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--font-color-primary);
}

.compose-btn {
  width: 100%;
}

@media (min-width: 600px) and (max-width: 1023px) {
  .compose-btn {
    padding: 16px;
    gap: 0;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-md);
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .compose-btn {
    width: 100%;
  }
}

/* Nav Pill */
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0 var(--space-md) 0 var(--space-md);
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  color: var(--font-color-primary);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
  height: 32px;
  min-height: 32px;
  text-decoration: none;
}

.nav-item:hover {
  background: var(--bg-color-row-hover);
  text-decoration: none;
}

.nav-item-active {
  background: var(--bg-color-nav-active);
  color: var(--font-color-link);
  font-weight: 600;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon img {
  object-fit: contain;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
}

.nav-section-title {
  font-size: var(--font-xs);
  font-weight: 500;
  color: var(--font-color-muted);
  padding: var(--space-xs) var(--space-md);
  letter-spacing: 0.25px;
  text-transform: uppercase;
}

.label-actions {
  margin-left: auto;
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.nav-item:hover .label-actions {
  opacity: 1;
}

.nav-item-add-label {
  border: 1px dashed var(--border-color-subtle);
}

.color-picker {
  display: flex;
  gap: var(--space-sm);
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);
  border: 2px solid transparent;
  cursor: pointer;
}

.color-option:hover {
  transform: scale(1.1);
  transition: transform var(--transition-fast);
}

.color-option-active {
  border-color: var(--font-color-primary);
}

.color-mode-toggle {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.color-mode-btn {
  flex: 1;
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-color-page);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: 500;
  color: var(--font-color-secondary);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.color-mode-btn:hover {
  background: var(--bg-color-row-hover);
}

.color-mode-btn-active {
  background: var(--bg-color-nav-active);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.custom-color-picker {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.color-input {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  cursor: pointer;
  padding: 2px;
  background: var(--bg-color-surface);
}

.color-input:hover {
  border-color: var(--accent-primary);
}

.color-value {
  font-size: var(--font-sm);
  color: var(--font-color-secondary);
  font-family: monospace;
}
</style>
