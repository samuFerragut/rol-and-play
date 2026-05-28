<template>
  <AppLayout>
    <h1 class="rp-title text-h3 mb-4">
      Bienvenido a Rol&Play
    </h1>

    <v-row>
      <v-col cols="12" md="6">
        <div class="rp-card pa-6">
          <h2 class="text-h5 mb-2">Tus personajes</h2>
          <p>Gestiona tus aventuras y hojas de personaje.</p>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="rp-card pa-6">
          <h2 class="text-h5 mb-2">Campañas</h2>
          <p>Organiza tus partidas y grupos.</p>
        </div>
      </v-col>
    </v-row>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/layout/AppLayout.vue';
</script>