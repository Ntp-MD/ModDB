<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";
import { useSearch } from "../hooks/useSearch";

const { sidebarOpen, toggleSidebar } = useSidebar();
const { searchQuery, activeLabel } = useSearch();
const searchFocused = ref(false);
const filterOpen = ref(false);
const settingsOpen = ref(false);

const filterOptions = [
  { id: "all", label: "All mail" },
  { id: "unread", label: "Unread" },
  { id: "starred", label: "Starred" },
  { id: "has-attachment", label: "Has attachment" },
];

function toggleFilter() {
  filterOpen.value = !filterOpen.value;
}

function closeFilter() {
  filterOpen.value = false;
}

function selectFilter(filterId: string) {
  if (filterId === "all") {
    activeLabel.value = null;
  }
  closeFilter();
}

function toggleSettings() {
  settingsOpen.value = !settingsOpen.value;
}

function closeSettings() {
  settingsOpen.value = false;
}
</script>

<template>
  <header class="topbar">
    <button class="btn-icon-only focus-ring topbar-menu-btn" aria-label="Main menu" :aria-expanded="sidebarOpen" @click="toggleSidebar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </button>

    <a href="/" class="topbar-logo" aria-label="ModDB">
      <img src="https://cdn-icons-png.flaticon.com/128/5968/5968534.png" alt="Gmail" width="40" height="28" />
      <span class="topbar-logo-text">Mail</span>
    </a>

    <div class="topbar-search" :class="{ 'topbar-search-focused': searchFocused }">
      <div class="search-bar-wrap">
        <button class="search-icon-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
        <input
          v-model="searchQuery"
          type="text"
          class="search-bar focus-ring"
          placeholder="Search mail"
          aria-label="Search mail"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
        <button v-if="searchQuery" class="search-clear-btn btn-icon-only focus-ring" aria-label="Clear search" @click="searchQuery = ''">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <button
          class="search-filter-btn btn-icon-only focus-ring"
          aria-label="Show search options"
          :aria-expanded="filterOpen"
          aria-haspopup="listbox"
          @click="toggleFilter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 4h18v2.5L13 14v7l-2-1v-6L3 6.5V4z" />
          </svg>
        </button>
        <div v-if="filterOpen" class="search-filter-dropdown">
          <div v-for="option in filterOptions" :key="option.id" class="filter-option" @click="selectFilter(option.id)">
            {{ option.label }}
          </div>
        </div>
      </div>
    </div>

    <div class="topbar-actions">
      <button class="btn-icon-only focus-ring" aria-label="Help">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
          />
        </svg>
      </button>
      <button class="btn-icon-only focus-ring" aria-label="Settings" :aria-expanded="settingsOpen" aria-haspopup="dialog" @click="toggleSettings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
          />
        </svg>
      </button>
      <button class="btn-icon-only focus-ring topbar-apps-btn" aria-label="Google apps">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM6 20c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
          />
        </svg>
      </button>
      <div class="avatar-initials topbar-avatar focus-ring" tabindex="0" role="button" aria-label="Google Account: Me">ME</div>
    </div>
  </header>

  <div v-if="settingsOpen" class="modal-overlay" @click.self="closeSettings">
    <div class="settings-dialog">
      <div class="settings-header">
        <h2 class="settings-title">Settings</h2>
        <button class="btn-icon-only focus-ring" aria-label="Close" @click="closeSettings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <div class="settings-body">
        <div class="settings-section">
          <h3 class="settings-section-title">General</h3>
          <div class="settings-item">
            <span class="settings-label">Density</span>
            <select class="settings-select focus-ring">
              <option>Comfortable</option>
              <option>Compact</option>
            </select>
          </div>
          <div class="settings-item">
            <span class="settings-label">Theme</span>
            <select class="settings-select focus-ring">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>
        <div class="settings-section">
          <h3 class="settings-section-title">Notifications</h3>
          <div class="settings-item">
            <span class="settings-label">Desktop notifications</span>
            <label class="settings-toggle">
              <input type="checkbox" class="settings-toggle-input" />
              <span class="settings-toggle-slider"></span>
            </label>
          </div>
          <div class="settings-item">
            <span class="settings-label">Sound</span>
            <label class="settings-toggle">
              <input type="checkbox" class="settings-toggle-input" />
              <span class="settings-toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="settings-footer">
        <button class="btn btn-primary focus-ring" @click="closeSettings">Done</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar-menu-btn {
  color: var(--font-color-muted);
}

.topbar-logo {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  text-decoration: none;
}

.topbar-logo img {
  object-fit: contain;
}

.topbar-logo-text {
  font-size: var(--font-xl);
  font-weight: 400;
  color: #5f6368;
  letter-spacing: -0.5px;
  line-height: 1;
}

.topbar-search {
  display: none;
  flex: 1;
  justify-content: center;
  min-width: 0;
  margin: 0 var(--space-md);
}

@media (min-width: 600px) {
  .topbar-search {
    display: flex;
    max-width: 720px;
  }
}

.search-bar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--bg-color-search);
  border-radius: var(--radius-lg);
  height: 48px;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.topbar-search-focused .search-bar-wrap {
  background: var(--bg-color-surface);
  box-shadow: var(--shadow-search-focus);
}

.search-icon-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #444746;
  cursor: pointer;
  border-radius: var(--radius-circle);
}

.search-bar {
  flex: 1;
  height: 48px;
  background: transparent;
  border: none;
  color: var(--font-color-primary);
  font-size: var(--font-md);
  padding: 0;
  outline: none;
  min-width: 0;
}

.search-bar:focus {
  background: transparent;
  box-shadow: none;
  outline: none;
}

.search-clear-btn {
  width: 36px;
  height: 36px;
  color: var(--font-color-muted);
}

.search-filter-btn {
  width: 48px;
  height: 48px;
  color: #444746;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  flex-shrink: 0;
}

.search-filter-dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  right: 0;
  background: var(--bg-color-surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-dropdown);
  min-width: 180px;
  z-index: var(--z-dropdown);
  overflow: hidden;
}

.filter-option {
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  font-size: var(--font-sm);
  color: var(--font-color-primary);
  transition: background var(--transition-fast);
}

.filter-option:hover {
  background: var(--bg-color-row-hover);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  margin-left: auto;
}

.topbar-apps-btn {
  color: var(--font-color-muted);
}

.topbar-avatar {
  cursor: pointer;
  border: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.settings-dialog {
  background: var(--bg-color-surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-dialog);
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-color-subtle);
}

.settings-title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--font-color-primary);
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

.settings-section {
  margin-bottom: var(--space-lg);
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section-title {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--font-color-secondary);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.25px;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
}

.settings-label {
  font-size: var(--font-sm);
  color: var(--font-color-primary);
}

.settings-select {
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-color-surface);
  color: var(--font-color-primary);
  font-size: var(--font-sm);
  cursor: pointer;
}

.settings-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.settings-toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.settings-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color-subtle);
  transition: background-color var(--transition-fast);
  border-radius: 24px;
}

.settings-toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: transform var(--transition-fast);
  border-radius: 50%;
}

.settings-toggle-input:checked + .settings-toggle-slider {
  background-color: var(--accent-primary);
}

.settings-toggle-input:checked + .settings-toggle-slider:before {
  transform: translateX(20px);
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-color-subtle);
}
</style>
