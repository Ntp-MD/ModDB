import { ref } from "vue";

const searchQuery = ref("");
const activeLabel = ref<string | null>(null);

export function useSearch() {
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setActiveLabel = (label: string | null) => {
    activeLabel.value = label;
  };

  const clearSearch = () => {
    searchQuery.value = "";
    activeLabel.value = null;
  };

  return {
    searchQuery,
    activeLabel,
    setSearchQuery,
    setActiveLabel,
    clearSearch,
  };
}
