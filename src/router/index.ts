import { createRouter, createWebHistory } from "vue-router";
import InboxView from "../app/InboxView.vue";
import PeopleView from "../app/PeopleView.vue";
import ThreadView from "../app/ThreadView.vue";
import StarredView from "../app/StarredView.vue";
import SentView from "../app/SentView.vue";
import ComposeView from "../app/ComposeView.vue";
import SnoozedView from "../app/SnoozedView.vue";
import DraftsView from "../app/DraftsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: InboxView },
    { path: "/starred", component: StarredView },
    { path: "/people", component: PeopleView },
    { path: "/sent", component: SentView },
    { path: "/snoozed", component: SnoozedView },
    { path: "/drafts", component: DraftsView },
    { path: "/thread/:id", component: ThreadView },
    { path: "/compose", component: ComposeView },
  ],
});

export default router;
