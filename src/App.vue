<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import ToastContainer from "./components/ToastContainer.vue";
</script>

<template>
  <div class="app-shell">
    <TopBar />
    <SideBar />
    <router-view />
    <ToastContainer />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  background: var(--bg-color-page);
}
</style>
