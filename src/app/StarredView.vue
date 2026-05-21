<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCachedMessages, refreshData } from "../utils/supabase-data";
import { supabase } from "../utils/supabase";

const router = useRouter();
const starredMessages = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  starredMessages.value = getCachedMessages().filter((m) => m.starred);
  await refreshData();
  starredMessages.value = getCachedMessages().filter((m) => m.starred);
  loading.value = false;
});

function openThread(id: string) {
  router.push(`/thread/${id}`);
}

async function toggleStar(msg: any) {
  msg.starred = !msg.starred;
  const { error } = await supabase.from("messages").update({ starred: msg.starred }).eq("id", msg.id);
  if (!error) {
    await refreshData();
    starredMessages.value = getCachedMessages().filter((m) => m.starred);
  }
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="starred-toolbar main-toolbar">
        <h1 class="page-title">Starred</h1>
      </div>

      <section class="inbox-list fade-in" aria-label="Starred messages">
        <div
          v-for="msg in starredMessages"
          :key="msg.id"
          class="list-row hover-row"
          :class="msg.unread ? 'list-row-unread' : 'list-row-read'"
          @click="openThread(msg.id)"
        >
          <div class="row-cell row-cell-star" @click.stop>
            <button class="star-btn star-btn-active focus-ring" :aria-label="msg.starred ? 'Unstar' : 'Star'" @click="toggleStar(msg)">★</button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.from }}</div>
          <div class="row-cell row-cell-content">
            <span class="subject">{{ msg.subject }}</span>
            <span class="snippet hide-mobile"> — {{ msg.snippet }}</span>
          </div>
          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>

        <div v-if="starredMessages.length === 0" class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h2 class="empty-state-title">No starred messages</h2>
          <p class="empty-state-text">Star messages to find them here.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
