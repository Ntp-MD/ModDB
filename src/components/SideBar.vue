<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSidebar } from "../hooks/useSidebar";

const route = useRoute();
const { sidebarOpen, closeSidebar } = useSidebar();

const navItems = [
  { id: "inbox", label: "Inbox", route: "/", icon: "inbox", count: 3 },
  { id: "starred", label: "Starred", route: "/starred", icon: "star", count: 0 },
  { id: "snoozed", label: "Snoozed", route: "/snoozed", icon: "snoozed", count: 0 },
  { id: "sent", label: "Sent", route: "/sent", icon: "send", count: 0 },
  { id: "drafts", label: "Drafts", route: "/drafts", icon: "draft", count: 2 },
  { id: "people", label: "Contacts", route: "/people", icon: "people", count: 0 },
];

const labelItems = [
  { id: "design", label: "Design", color: "blue" },
  { id: "engineering", label: "Engineering", color: "green" },
  { id: "marketing", label: "Marketing", color: "yellow" },
  { id: "sales", label: "Sales", color: "red" },
];
</script>

<template>
  <div class="sidebar-overlay" :class="{ 'sidebar-overlay-active': sidebarOpen }" aria-hidden="true" @click="closeSidebar" />

  <nav class="sidebar sidebar-collapse" :class="{ 'sidebar-open': sidebarOpen }" aria-label="Main navigation">
    <div class="sidebar-compose">
      <router-link to="/compose" class="compose-btn focus-ring" @click="closeSidebar" aria-label="Compose">
        <span class="compose-btn-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </span>
        <span class="compose-btn-label nav-label">Compose</span>
      </router-link>
    </div>

    <ul class="sidebar-nav" role="list">
      <li v-for="item in navItems" :key="item.id">
        <router-link :to="item.route" class="nav-item" :class="{ 'nav-item-active': route.path === item.route }" @click="closeSidebar">
          <span class="nav-icon" aria-hidden="true">
            <svg v-if="item.icon === 'inbox'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
              />
            </svg>
            <svg v-else-if="item.icon === 'star'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <svg v-else-if="item.icon === 'snoozed'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
              />
            </svg>
            <svg v-else-if="item.icon === 'send'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            <svg v-else-if="item.icon === 'draft'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5h-2v-2h2v2zm0-4h-2V6h2v4.5z" />
            </svg>
            <svg v-else-if="item.icon === 'people'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              />
            </svg>
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
          <span class="nav-item">
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
  padding: var(--space-sm) var(--space-md) var(--space-sm);
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
}

.compose-btn:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  text-decoration: none;
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
    overflow: hidden;
  }

  .compose-btn-label {
    display: none;
  }

  .sidebar-compose {
    display: flex;
    justify-content: center;
    padding: var(--space-sm) var(--space-sm);
  }
}
</style>
