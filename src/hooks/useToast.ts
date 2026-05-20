import { ref } from "vue";

interface Toast {
  id: number;
  message: string;
  action?: string;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
  function showToast(message: string, action?: string) {
    const id = nextId++;
    toasts.value.push({ id, message, action });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 4000);
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { toasts, showToast, dismissToast };
}
