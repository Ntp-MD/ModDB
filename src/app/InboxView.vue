<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../hooks/useToast";
import { useSearch } from "../hooks/useSearch";
import { getCachedMessages, getLabelText, refreshData, getPeople, updatePerson } from "../utils/supabase-data";
import { supabase } from "../utils/supabase";
import type { Message } from "../utils/types";

const router = useRouter();
const { showToast } = useToast();
const { searchQuery, activeLabel } = useSearch();

const messages = ref<Message[]>([]);
const people = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  messages.value = getCachedMessages();
  people.value = getPeople();
  await refreshData();
  messages.value = getCachedMessages();
  people.value = getPeople();
  loading.value = false;
});
const selectedIds = ref<Set<string>>(new Set());
const activeTab = ref("primary");

const tabs = [
  { id: "primary", label: "Primary" },
  { id: "promotions", label: "Promotions" },
  { id: "social", label: "Social" },
];

const allSelected = computed(() => filteredMessages.value.length > 0 && selectedIds.value.size === filteredMessages.value.length);
const someSelected = computed(() => selectedIds.value.size > 0 && selectedIds.value.size < filteredMessages.value.length);

const filteredMessages = computed(() => {
  const personMap = new Map(people.value.map((p) => [p.id, p]));
  let result = messages.value.filter((msg) => {
    const person = personMap.get(msg.person_id || "");
    return !person || person.status !== "bin";
  });

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (msg: Message) =>
        msg.msg_from.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query) ||
        msg.snippet.toLowerCase().includes(query) ||
        msg.body.toLowerCase().includes(query),
    );
  }

  // Filter by label
  if (activeLabel.value) {
    result = result.filter((msg) => msg.label === activeLabel.value);
  }

  return result;
});

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(filteredMessages.value.map((m) => m.id));
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
  msg.starred = !msg.starred;
  // Update in Supabase messages table
  const { error } = await supabase.from("messages").update({ starred: msg.starred }).eq("id", msg.id);
  if (!error) {
    await refreshData();
    messages.value = getCachedMessages();
  } else {
    showToast("Failed to update star status", "Error");
  }
}

async function markRead(id: string) {
  const msg = messages.value.find((m) => m.id === id);
  if (msg) {
    msg.unread = false;
    const { error } = await supabase.from("messages").update({ unread: false }).eq("id", id);
    if (!error) {
      await refreshData();
      messages.value = getCachedMessages();
    } else {
      showToast("Failed to mark as read", "Error");
    }
  }
}

async function deleteMessage(id: string) {
  const msg = messages.value.find((m) => m.id === id);
  if (msg && msg.person_id) {
    await updatePerson(msg.person_id, { status: "bin" });
    await refreshData();
    messages.value = getCachedMessages();
    people.value = getPeople();
    showToast("Conversation moved to Trash", "Undo");
  } else {
    showToast("Failed to delete message", "Error");
  }
}

async function archiveMessage(id: string) {
  const msg = messages.value.find((m) => m.id === id);
  if (msg && msg.person_id) {
    await updatePerson(msg.person_id, { status: "bin" });
    await refreshData();
    messages.value = getCachedMessages();
    people.value = getPeople();
    showToast("Conversation archived", "Undo");
  } else {
    showToast("Failed to archive message", "Error");
  }
}

async function bulkDelete() {
  const count = selectedIds.value.size;
  for (const id of selectedIds.value) {
    const msg = messages.value.find((m) => m.id === id);
    if (msg && msg.person_id) {
      await updatePerson(msg.person_id, { status: "bin" });
    }
  }
  await refreshData();
  messages.value = getCachedMessages();
  people.value = getPeople();
  selectedIds.value = new Set();
  showToast(`${count} conversations moved to Trash`, "Undo");
}

async function bulkArchive() {
  const count = selectedIds.value.size;
  for (const id of selectedIds.value) {
    const msg = messages.value.find((m) => m.id === id);
    if (msg && msg.person_id) {
      await updatePerson(msg.person_id, { status: "bin" });
    }
  }
  await refreshData();
  messages.value = getCachedMessages();
  people.value = getPeople();
  selectedIds.value = new Set();
  showToast(`${count} conversations archived`, "Undo");
}

async function bulkMarkRead() {
  for (const id of selectedIds.value) {
    await supabase.from("messages").update({ unread: false }).eq("id", id);
  }
  await refreshData();
  messages.value = getCachedMessages();
  selectedIds.value = new Set();
  showToast("Marked as read");
}

async function openThread(msg: Message) {
  await markRead(msg.id);
  router.push(`/thread/${msg.id}`);
}
</script>

<template>
  <main class="main-content">
    <div class="main-content-inner">
      <div class="inbox-toolbar main-toolbar">
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
          <button v-if="selectedIds.size > 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Delete selected" @click="bulkDelete">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
          <button v-if="selectedIds.size > 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Archive selected" @click="bulkArchive">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
              />
            </svg>
          </button>
          <button v-if="selectedIds.size > 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Mark as read" @click="bulkMarkRead">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
              />
            </svg>
          </button>
          <button v-if="selectedIds.size === 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="Refresh">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </svg>
          </button>
          <button v-if="selectedIds.size === 0" class="btn-icon-only focus-ring inbox-toolbar-btn" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </button>
        </div>
        <div class="inbox-toolbar-right">
          <div class="pagination">
            <span class="pagination-info">1–{{ filteredMessages.length }} of {{ filteredMessages.length }}</span>
            <button class="pagination-btn focus-ring" disabled aria-label="Newer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
              </svg>
            </button>
            <button class="pagination-btn focus-ring" disabled aria-label="Older">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="inbox-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="inbox-tab focus-ring"
          :class="{ 'inbox-tab-active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span v-if="tab.id === 'primary'" class="inbox-tab-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
              />
            </svg>
          </span>
          <span v-else-if="tab.id === 'promotions'" class="inbox-tab-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"
              />
            </svg>
          </span>
          <span v-else-if="tab.id === 'social'" class="inbox-tab-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              />
            </svg>
          </span>
          {{ tab.label }}
        </button>
      </div>

      <section v-if="loading" class="inbox-list" aria-label="Loading">
        <div class="empty-state">
          <p class="empty-state-text">Loading messages...</p>
        </div>
      </section>

      <section v-else class="inbox-list" aria-label="Messages">
        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          class="list-row hover-row"
          :class="{
            'list-row-unread': msg.unread,
            'list-row-read': !msg.unread,
            'list-row-selected': selectedIds.has(msg.id),
          }"
          @click="openThread(msg)"
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
            <button
              class="star-btn focus-ring"
              :class="{ 'star-btn-active': msg.starred }"
              :aria-label="msg.starred ? 'Unstar' : 'Star'"
              @click="toggleStar(msg)"
            >
              <svg v-if="msg.starred" width="18" height="18" viewBox="0 0 24 24" fill="#f9ab00">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
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

          <div class="row-cell-actions" @click.stop>
            <button class="row-action-btn focus-ring" aria-label="Archive" @click="archiveMessage(msg.id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
                />
              </svg>
            </button>
            <button class="row-action-btn focus-ring" aria-label="Delete" @click="deleteMessage(msg.id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
            <button class="row-action-btn focus-ring hide-mobile" aria-label="Mark as read" @click="markRead(msg.id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
                />
              </svg>
            </button>
            <button class="row-action-btn focus-ring hide-mobile" aria-label="Snooze">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
            </button>
          </div>

          <div class="row-cell row-cell-timestamp hide-mobile">{{ msg.timestamp }}</div>
        </div>

        <div v-if="filteredMessages.length === 0" class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
            <path
              d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v6zm0-10.5l-8 5-8-5V6l8 5 8-5v1.5z"
            />
          </svg>
          <h2 class="empty-state-title">{{ activeLabel ? "No messages found" : searchQuery ? "No results found" : "Your inbox is empty" }}</h2>
          <p class="empty-state-text">
            {{ activeLabel ? "No messages with this label" : searchQuery ? "Try different search terms or filters" : "No messages to display." }}
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.pagination-info {
  font-size: var(--font-xs);
  color: var(--font-color-muted);
  white-space: nowrap;
}

/* Mobile responsive */
@media (max-width: 599px) {
  .list-row {
    padding: 0 var(--space-sm);
    height: var(--row-height-cozy);
  }

  .row-cell-from {
    width: 100px;
  }

  .row-cell-timestamp {
    width: 60px;
  }

  .row-cell-content .snippet {
    display: none;
  }

  .inbox-list {
    max-height: calc(100vh - 200px);
  }

  .hide-mobile {
    display: none;
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  text-align: center;
  color: var(--font-color-muted);
}

.empty-state-icon {
  width: 120px;
  height: 120px;
  opacity: 0.3;
}

.empty-state-text {
  font-size: var(--font-sm);
  color: var(--font-color-secondary);
}
</style>
