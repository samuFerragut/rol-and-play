<template>
  <v-app-bar
    color="#141416"
    border="b"
    elevation="0"
  >
    <v-app-bar-title class="rp-title">
      Rol&Play
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      icon="mdi-bell-outline"
      variant="text"
    />

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          icon="mdi-account-circle"
          variant="text"
          v-bind="props"
        />
      </template>

      <v-list bg-color="#1C1C1F">
        <v-list-item>
          <v-list-item-title>
            {{ authStore.user?.username }}
          </v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item @click="handleLogout">
          <template #prepend>
            <v-icon icon="mdi-logout" />
          </template>

          <v-list-item-title>
            Cerrar sesión
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth/auth.store';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();

  router.push('/login');
}
</script>