<template>
  <v-app>
    <AppSidebar />
    <AppTopbar />

    <v-main>
      <div class="page-container">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppSidebar from './AppSideBar.vue';
import AppTopbar from './AppTopBar.vue';
</script>
