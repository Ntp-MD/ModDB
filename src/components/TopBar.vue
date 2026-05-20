<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";

const { toggleSidebar } = useSidebar();
const searchQuery = ref("");
const searchFocused = ref(false);
</script>

<template>
  <header class="topbar">
    <button class="btn-icon-only focus-ring topbar-menu-btn" aria-label="Main menu" @click="toggleSidebar">
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
        <button class="search-filter-btn btn-icon-only focus-ring" aria-label="Show search options">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 4h18v2.5L13 14v7l-2-1v-6L3 6.5V4z" />
          </svg>
        </button>
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
      <button class="btn-icon-only focus-ring" aria-label="Settings">
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
  margin-right: var(--space-sm);
}

.topbar-logo img {
  object-fit: contain;
}

.topbar-logo-text {
  font-size: 22px;
  font-weight: 400;
  color: #5f6368;
  letter-spacing: -0.5px;
  line-height: 1;
}

.topbar-search {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  max-width: 720px;
  margin: 0 var(--space-md);
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
</style>
