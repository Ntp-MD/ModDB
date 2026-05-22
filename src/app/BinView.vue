<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCachedMessages, getLabelText, getPeople, refreshData, deletePerson } from "../utils/supabase-data";
import type { Message } from "../utils/types";
import { supabase } from "../utils/supabase";

const router = useRouter();
const binMessages = ref<any[]>([]);
const people = ref<any[]>([]);
const loading = ref(true);
const selectedIds = ref<Set<string>>(new Set());

const allSelected = computed(() => binMessages.value.length > 0 && selectedIds.value.size === binMessages.value.length);
const someSelected = computed(() => selectedIds.value.size > 0 && selectedIds.value.size < binMessages.value.length);

function filterBin() {
  const personMap = new Map(people.value.map((p) => [p.id, p]));
  return getCachedMessages().filter((m) => {
    const person = personMap.get(m.person_id || "");
    return person && person.status === "bin";
  });
}

onMounted(async () => {
  people.value = getPeople();
  binMessages.value = filterBin();
  await refreshData();
  people.value = getPeople();
  binMessages.value = filterBin();
  loading.value = false;
});

function openThread(id: string) {
  router.push(`/thread/${id}`);
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(binMessages.value.map((m) => m.id));
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

async function restoreToInbox(msg: Message) {
  const person = people.value.find((p) => p.id === msg.person_id);
  if (person) {
    const social = person.social || {};
    social.status = "inbox";
    const { error } = await supabase.from("people").update({ social }).eq("id", person.id);
    if (!error) {
      await refreshData();
      people.value = getPeople();
      binMessages.value = filterBin();
    }
  }
}

async function bulkRestore() {
  for (const id of selectedIds.value) {
    const msg = binMessages.value.find((m) => m.id === id);
    if (msg && msg.person_id) {
      const person = people.value.find((p) => p.id === msg.person_id);
      if (person) {
        const social = person.social || {};
        social.status = "inbox";
        await supabase.from("people").update({ social }).eq("id", person.id);
      }
    }
  }
  await refreshData();
  people.value = getPeople();
  binMessages.value = filterBin();
  selectedIds.value = new Set();
}

async function bulkDeletePermanently() {
  if (!confirm("Are you sure you want to permanently delete these conversations? This action cannot be undone.")) {
    return;
  }
  for (const id of selectedIds.value) {
    const msg = binMessages.value.find((m) => m.id === id);
    if (msg && msg.person_id) {
      await deletePerson(msg.person_id);
    }
  }
  await refreshData();
  people.value = getPeople();
  binMessages.value = filterBin();
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
          <button v-if="selectedIds.size > 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Restore selected" @click="bulkRestore">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
              />
            </svg>
          </button>
          <button
            v-if="selectedIds.size > 0"
            class="btn-icon-only focus-ring inbox-toolbar-btn"
            aria-label="Delete permanently"
            @click="bulkDeletePermanently"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
          <h1 v-if="selectedIds.size === 0" class="page-title">Bin</h1>
        </div>
        <div class="inbox-toolbar-right"></div>
      </div>

      <section v-if="loading" aria-label="Loading">
        <div class="empty-state">
          <p class="empty-state-text">Loading bin...</p>
        </div>
      </section>

      <section v-else class="inbox-list fade-in" aria-label="Bin messages">
        <div
          v-for="msg in binMessages"
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
            <button class="star-btn focus-ring" aria-label="Restore to inbox" @click="restoreToInbox(msg)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
                />
              </svg>
            </button>
          </div>
          <div class="row-cell row-cell-from">{{ msg.msg_from }}</div>
          <div class="row-cell row-cell-content">
            <span v-if="msg.label" class="badge hide-mobile" :class="`badge-label-${msg.label}`">{{ msg.labelText || getLabelText(msg.label) }}</span>
            <span class="subject">{{ msg.subject }}</span>
            <span class="snippet hide-mobile"> — {{ msg.snippet }}</span>
          </div>
          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>

        <div v-if="binMessages.length === 0" class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
          <h2 class="empty-state-title">Bin is empty</h2>
          <p class="empty-state-text">Deleted conversations will appear here.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
