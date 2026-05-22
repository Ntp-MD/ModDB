<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCachedMessages, refreshData, getPeople, updatePerson } from "../utils/supabase-data";
import type { Message } from "../utils/types";
import { supabase } from "../utils/supabase";

const router = useRouter();
const starredMessages = ref<any[]>([]);
const people = ref<any[]>([]);
const loading = ref(true);
const selectedIds = ref<Set<string>>(new Set());

const allSelected = computed(() => starredMessages.value.length > 0 && selectedIds.value.size === starredMessages.value.length);
const someSelected = computed(() => selectedIds.value.size > 0 && selectedIds.value.size < starredMessages.value.length);

function filterStarred() {
  const personMap = new Map(people.value.map((p) => [p.id, p]));
  return getCachedMessages().filter((m) => {
    const person = personMap.get(m.person_id || "");
    return m.starred || (person && (person.status === "starred" || person.starred));
  });
}

onMounted(async () => {
  people.value = getPeople();
  starredMessages.value = filterStarred();
  await refreshData();
  people.value = getPeople();
  starredMessages.value = filterStarred();
  loading.value = false;
});

function openThread(id: string) {
  router.push(`/thread/${id}`);
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(starredMessages.value.map((m) => m.id));
  }
}

function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  selectedIds.value = new Set(selectedIds.value);
}

async function toggleStar(msg: Message) {
  const person = people.value.find((p) => p.id === msg.person_id);

  // If person is starred, update person status instead of message
  if (person && (person.status === "starred" || person.starred)) {
    const social = person.social || {};
    social.status = social.status === "starred" ? undefined : "starred";
    const { error } = await supabase.from("people").update({ social }).eq("id", person.id);
    if (!error) {
      await refreshData();
      people.value = getPeople();
      starredMessages.value = filterStarred();
    }
  } else {
    // Otherwise, toggle message starred status
    msg.starred = !msg.starred;
    const { error } = await supabase.from("messages").update({ starred: msg.starred }).eq("id", msg.id);
    if (!error) {
      await refreshData();
      starredMessages.value = filterStarred();
    }
  }
}

async function bulkUnstar() {
  for (const id of selectedIds.value) {
    const msg = starredMessages.value.find((m) => m.id === id);
    if (msg) {
      const person = people.value.find((p) => p.id === msg.person_id);
      if (person && (person.status === "starred" || person.starred)) {
        const social = person.social || {};
        social.status = undefined;
        await supabase.from("people").update({ social }).eq("id", person.id);
      } else {
        await supabase.from("messages").update({ starred: false }).eq("id", id);
      }
    }
  }
  await refreshData();
  people.value = getPeople();
  starredMessages.value = filterStarred();
  selectedIds.value = new Set();
}

async function bulkDelete() {
  for (const id of selectedIds.value) {
    const msg = starredMessages.value.find((m) => m.id === id);
    if (msg && msg.person_id) {
      await updatePerson(msg.person_id, { status: "bin" });
    }
  }
  await refreshData();
  people.value = getPeople();
  starredMessages.value = filterStarred();
  selectedIds.value = new Set();
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="main-toolbar">
        <div class="inbox-toolbar-left">
          <div class="inbox-select-all" @click.stop>
            <input
              type="checkbox"
              class="row-checkbox focus-ring"
              :checked="allSelected"
              :indeterminate="someSelected"
              aria-label="Select all conversations"
              @change="toggleSelectAll"
            />
          </div>
          <button v-if="selectedIds.size > 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Unstar selected" @click="bulkUnstar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
              />
            </svg>
          </button>
          <button v-if="selectedIds.size > 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Delete selected" @click="bulkDelete">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
          <h1 v-if="selectedIds.size === 0" class="page-title">Starred</h1>
        </div>
        <div class="inbox-toolbar-right"></div>
      </div>

      <section class="inbox-list fade-in" aria-label="Starred messages">
        <div
          v-for="msg in starredMessages"
          :key="msg.id"
          class="list-row hover-row"
          :class="{
            'list-row-unread': msg.unread,
            'list-row-read': !msg.unread,
            'list-row-selected': selectedIds.has(msg.id),
          }"
          @click="openThread(msg.id)"
        >
          <div class="row-cell row-cell-checkbox" @click.stop>
            <input
              type="checkbox"
              class="row-checkbox focus-ring"
              :checked="selectedIds.has(msg.id)"
              :aria-label="`Select message from ${msg.msg_from}`"
              @change="toggleSelect(msg.id)"
            />
          </div>
          <div class="row-cell row-cell-star" @click.stop>
            <button class="star-btn star-btn-active focus-ring" :aria-label="msg.starred ? 'Unstar' : 'Star'" @click="toggleStar(msg)">★</button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.msg_from }}</div>
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
