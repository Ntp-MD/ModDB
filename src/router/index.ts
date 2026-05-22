import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const views = import.meta.glob("../app/*.vue");

const routeMap: Record<string, string> = {
  "InboxView": "/",
  "ThreadView": "/thread/:id",
};

const routes: RouteRecordRaw[] = Object.keys(views).map((path) => {
  const match = path.match(/\.\/app\/(.*)\.vue$/);
  if (!match) return null;
  const componentName = match[1];
  const routePath = routeMap[componentName] || `/${componentName.toLowerCase().replace("view", "")}`;
  return {
    path: routePath,
    component: views[path],
  };
}).filter(Boolean) as RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
