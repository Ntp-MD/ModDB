<script setup lang="ts">
import { useToast } from "../hooks/useToast";

const { toasts, dismissToast } = useToast();
</script>

<template>
  <div class="toast-container" role="status" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast fade-in"
    >
      <span>{{ toast.message }}</span>
      <button
        v-if="toast.action"
        class="toast-action focus-ring"
        @click="dismissToast(toast.id)"
      >
        {{ toast.action }}
      </button>
      <button
        v-else
        class="toast-action focus-ring"
        @click="dismissToast(toast.id)"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>
