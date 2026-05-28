import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth/auth.store";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/auth/LoginPage.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/auth/RegisterPage.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../pages/HomePage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/characters",
    name: "characters",
    component: () => import("../pages/characters/CharactersPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/characters/new",
    name: "character-create",
    component: () => import("../pages/characters/CharacterCreatePage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/characters/:id",
    name: "character-detail",
    component: () => import("../pages/characters/CharacterDetailPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../pages/auth/ForgotPasswordPage.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../pages/auth/ResetPasswordPage.vue"),
    meta: {
      guestOnly: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.fetchMe();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return "/home";
  }

  return true;
});

export default router;
