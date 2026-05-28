<template>
  <v-navigation-drawer
    v-model="drawer"
    color="#141416"
    border="0"
    app
  >
    <div class="sidebar-header">
      <h1 class="rp-title text-h5">Rol&Play</h1>
    </div>

    <v-divider />

    <v-list nav density="comfortable">
      <v-list-item
        prepend-icon="mdi-home"
        title="Inicio"
        to="/home"
      />

      <v-list-item
        prepend-icon="mdi-account-group"
        title="Personajes"
        to="/characters"
      />

      <v-list-item
        prepend-icon="mdi-sword-cross"
        title="Campañas"
      />

      <v-list-item
        prepend-icon="mdi-book-open-page-variant"
        title="Manuales"
      />

      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Amigos"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);
</script>

<style scoped lang="scss">
.sidebar-header {
  padding: 24px 16px;
}
</style>