<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebar } from "../hooks/useSidebar";
import { useSearch } from "../hooks/useSearch";
import { mockPeople, resetToDefaultData } from "../utils/mockData";
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

const navItems = computed(() => {
  const allMessages = mockPeople.flatMap((person) => person.messages);
  const unreadCount = allMessages.filter((msg) => msg.unread).length;
  const starredCount = allMessages.filter((msg) => msg.starred).length;
  const sentCount = allMessages.filter((msg) => msg.from === "me@example.com").length;
  const draftCount = allMessages.filter((msg) => msg.timestamp === "Draft").length;
  const binCount = mockPeople.filter((p) => p.email !== "me@example.com").length;
  const contactsCount = mockPeople.length;

  return [
    { id: "inbox", label: "Inbox", route: "/", icon: "inbox", count: unreadCount },
    { id: "starred", label: "Starred", route: "/starred", icon: "star", count: starredCount },
    { id: "sent", label: "Sent", route: "/sent", icon: "send", count: sentCount },
    { id: "drafts", label: "Drafts", route: "/drafts", icon: "draft", count: draftCount },
    { id: "bin", label: "Bin", route: "/snoozed", icon: "snoozed", count: binCount },
    { id: "people", label: "Contacts", route: "/people", icon: "people", count: contactsCount },
  ];
});

const labelItems = computed(() => {
  return [
    { id: "blue", label: "DMS", color: "blue" },
    { id: "yellow", label: "PlusVenture", color: "yellow" },
    { id: "green", label: "Sales", color: "green" },
    { id: "red", label: "HR", color: "red" },
    { id: "purple", label: "EX", color: "purple" },
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
</script>

<template>
  <div class="sidebar-overlay" :class="{ 'sidebar-overlay-active': sidebarOpen }" aria-hidden="true" @click="closeSidebar" />

  <nav class="sidebar sidebar-collapse" :class="{ 'sidebar-open': sidebarOpen }" aria-label="Main navigation">
    <div class="sidebar-compose">
      <div class="compose-wrapper">
        <button class="compose-btn focus-ring" @click="handleResetData" aria-label="Reset data">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" :style="{ color: `var(--label-${lbl.color})` }">
                <path
                  d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"
                />
              </svg>
            </span>
            <span class="nav-label">{{ lbl.label }}</span>
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-compose {
  place-content: center;
  padding: 0 var(--space-sm);
  min-height: 70px;
}

.compose-wrapper {
  position: relative;
}

.compose-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-md);
  padding: 16px var(--space-lg);
  background: var(--bg-color-compose);
  color: var(--font-color-compose);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow var(--transition-fast);
  white-space: nowrap;
  width: 100%;
}

.compose-btn:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  text-decoration: none;
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

@media (max-width: 599px) {
  .compose-btn {
    width: 100%;
  }
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

  .compose-btn-label {
    display: none;
  }

  .nav-label {
    display: none;
  }
}

@media (min-width: 1024px) {
  .compose-btn {
    width: 100%;
  }

  .compose-btn-label {
    display: inline;
  }

  .nav-label {
    display: inline;
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
  margin-right: var(--space-sm);
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
  padding: var(--space-md) var(--space-md) var(--space-xs);
  letter-spacing: 0.25px;
  text-transform: uppercase;
}
</style>
