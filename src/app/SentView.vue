<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goInbox() {
  router.push("/");
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="sent-toolbar main-toolbar">
        <h1 class="sent-title">Sent</h1>
      </div>
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <h2 class="empty-state-title">No sent messages</h2>
        <p class="empty-state-text">Messages you send will appear here.</p>
        <button class="btn btn-compose focus-ring" @click="goInbox">
          <span class="btn-compose-icon">+</span>
          <span>Compose</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sent-title {
  font-size: 22px;
  font-weight: 400;
  color: var(--font-color-primary);
  line-height: 1.3;
  margin-left: var(--space-sm);
}
</style>
