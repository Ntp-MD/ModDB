<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebar } from "../hooks/useSidebar";
import { useSearch } from "../hooks/useSearch";
import { mockPeople } from "../utils/mockData";
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

const composeMenuOpen = ref(false);

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
    // Navigate to inbox to show filtered results
    if (route.path !== "/") {
      router.push("/");
    }
  }
  closeSidebar();
}

function toggleComposeMenu() {
  composeMenuOpen.value = !composeMenuOpen.value;
}

function handleComposeMessage() {
  composeMenuOpen.value = false;
  router.push("/compose");
  closeSidebar();
}

function handleAddPerson() {
  composeMenuOpen.value = false;
  router.push("/people");
  closeSidebar();
}
</script>

<template>
  <div class="sidebar-overlay" :class="{ 'sidebar-overlay-active': sidebarOpen }" aria-hidden="true" @click="closeSidebar" />

  <nav class="sidebar sidebar-collapse" :class="{ 'sidebar-open': sidebarOpen }" aria-label="Main navigation">
    <div class="sidebar-compose">
      <div class="compose-wrapper">
        <button class="compose-btn focus-ring" @click="toggleComposeMenu" aria-label="Compose">
          <span class="compose-btn-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </span>
          <span class="compose-btn-label nav-label">Compose</span>
        </button>

        <div v-if="composeMenuOpen" class="compose-menu fade-in">
          <button class="compose-menu-item focus-ring" @click="handleComposeMessage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
              />
            </svg>
            <span>Compose Message</span>
          </button>
          <button class="compose-menu-item focus-ring" @click="handleAddPerson">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            <span>Add Person</span>
          </button>
        </div>
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
