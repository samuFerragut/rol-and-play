<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth/auth.store';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchMe();
});
</script>