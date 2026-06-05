<script setup lang="ts">
import { useToast } from "../hooks/useToast";

const { toasts, dismissToast } = useToast();
</script>

<template>
  <div class="toast-container" role="region" aria-live="assertive" aria-atomic="true" aria-label="Notifications">
    <div v-for="toast in toasts" :key="toast.id" class="toast fade-in" role="alert">
      <span>{{ toast.message }}</span>
      <button
        v-if="toast.action && toast.action !== 'Error'"
        class="toast-action focus-ring"
        :aria-label="toast.action"
        @click="dismissToast(toast.id)"
      >
        {{ toast.action }}
      </button>
      <button v-else class="toast-action focus-ring" aria-label="Dismiss notification" @click="dismissToast(toast.id)">Dismiss</button>
    </div>
  </div>
</template>
