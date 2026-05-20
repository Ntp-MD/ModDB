<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import ToastContainer from "./components/ToastContainer.vue";
</script>

<template>
  <div class="app-shell">
    <TopBar />
    <div class="app-content">
      <SideBar />
      <router-view />
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
</style>
