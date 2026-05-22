import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import "./assets/styles/main.css";
import { initializeData } from "./utils/supabase-data";

// Initialize Supabase data
initializeData().catch(error => {
  console.error('Failed to initialize Supabase data:', error);
});

createApp(App).use(router).mount("#app");
