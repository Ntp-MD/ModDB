<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import ToastContainer from "./components/ToastContainer.vue";
import { initializeData } from "./utils/supabase-data";

const appReady = ref(false);

onMounted(async () => {
  await initializeData();
  appReady.value = true;
});
</script>

<template>
  <div class="app-shell">
    <TopBar />
    <div class="app-content">
      <SideBar />
      <div v-if="!appReady" class="app-loading" role="status" aria-label="Loading">
        <div class="app-loading-spinner" aria-hidden="true"></div>
        <span class="app-loading-text">Loading…</span>
      </div>
      <router-view v-else />
    </div>
    <ToastContainer />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-color-page);
}

.app-content {
  display: flex;
  flex: 1;
}

.app-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  color: var(--font-color-muted);
}

.app-loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-color-subtle);
  border-top-color: var(--accent-primary);
  border-radius: var(--radius-circle);
  animation: spin 0.7s linear infinite;
}

.app-loading-text {
  font-size: var(--font-sm);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
