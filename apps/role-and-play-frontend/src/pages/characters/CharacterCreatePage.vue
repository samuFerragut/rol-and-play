<template>
  <AppLayout>
    <div class="character-create-page">
      <div class="page-header">
        <h1 class="rp-title text-h4">Crear personaje</h1>
        <p class="page-subtitle">Construye tu aventurero paso a paso.</p>
      </div>

      <v-progress-linear
        v-if="contentStore.isLoading"
        indeterminate
        color="#C6A15B"
        class="mb-6"
      />

      <div class="rp-wizard">
        <div class="mobile-step-header">
          <span class="step-count">Paso {{ currentStep }} de 6</span>
          <h2>{{ currentStepTitle }}</h2>

          <v-progress-linear
            :model-value="(currentStep / 6) * 100"
            height="6"
            rounded
            color="#C6A15B"
          />
        </div>

        <div class="wizard-content">
          <div
            v-if="currentStep === 1"
            class="rp-card pa-6 identity-card"
          >
            <v-text-field
              v-model="form.name"
              label="Nombre del personaje"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              class="rp-input mb-4"
              hide-details="auto"
            />

            <v-text-field
              v-model="form.alignment"
              label="Alineamiento"
              prepend-inner-icon="mdi-compass-outline"
              variant="outlined"
              class="rp-input mb-4"
              hide-details="auto"
            />

            <v-textarea
              v-model="form.appearance"
              label="Apariencia"
              prepend-inner-icon="mdi-eye-outline"
              variant="outlined"
              class="rp-input"
              rows="3"
              hide-details="auto"
            />
          </div>

          <SelectionGrid
            v-if="currentStep === 2"
            title="Elige una raza"
            :items="contentStore.races"
            :selected-id="form.raceId"
            @select="form.raceId = $event"
          />

          <SelectionGrid
            v-if="currentStep === 3"
            title="Elige una clase"
            :items="contentStore.classes"
            :selected-id="form.classId"
            @select="form.classId = $event"
          />

          <SelectionGrid
            v-if="currentStep === 4"
            title="Elige un trasfondo"
            :items="contentStore.backgrounds"
            :selected-id="form.backgroundId"
            @select="form.backgroundId = $event"
          />

          <div
            v-if="currentStep === 5"
            class="rp-card pa-6"
          >
            <h2 class="section-title mb-4">
              Puntuaciones de característica
            </h2>

            <v-row>
              <v-col
                v-for="ability in abilities"
                :key="ability.key"
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model.number="form.abilities[ability.key]"
                  :label="ability.label"
                  type="number"
                  variant="outlined"
                  class="rp-input"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </div>

          <div
            v-if="currentStep === 6"
            class="rp-card pa-6"
          >
            <h2 class="section-title mb-4">Resumen</h2>

            <p><strong>Nombre:</strong> {{ form.name || 'Sin nombre' }}</p>
            <p><strong>Raza:</strong> {{ selectedRace?.name || 'Sin seleccionar' }}</p>
            <p><strong>Clase:</strong> {{ selectedClass?.name || 'Sin seleccionar' }}</p>
            <p><strong>Trasfondo:</strong> {{ selectedBackground?.name || 'Sin seleccionar' }}</p>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ errorMessage }}
            </v-alert>
          </div>
        </div>

        <div class="step-actions">
          <v-btn
            variant="text"
            class="rp-button-secondary"
            :disabled="currentStep === 1"
            @click="currentStep--"
          >
            Atrás
          </v-btn>

          <v-spacer />

          <v-btn
            v-if="currentStep < 6"
            class="rp-button-primary"
            @click="currentStep++"
          >
            Siguiente
          </v-btn>

          <v-btn
            v-else
            class="rp-button-primary"
            :loading="charactersStore.isLoading"
            @click="handleCreate"
          >
            Crear personaje
          </v-btn>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import AppLayout from '../../components/layout/AppLayout.vue';
import SelectionGrid from '../../components/characters/SelectionGrid.vue';
import { useCharactersStore } from '../../stores/characters/characters.store';
import { useContentStore } from '../../stores/content/content.store';

const router = useRouter();
const contentStore = useContentStore();
const charactersStore = useCharactersStore();

const currentStep = ref(1);
const errorMessage = ref('');

const stepTitles = [
  'Identidad',
  'Raza',
  'Clase',
  'Trasfondo',
  'Atributos',
  'Resumen',
];

const currentStepTitle = computed(
  () => stepTitles[currentStep.value - 1],
);

const form = reactive({
  name: '',
  raceId: '',
  classId: '',
  backgroundId: '',
  alignment: '',
  appearance: '',
  abilities: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
});

const abilities = [
  { key: 'strength', label: 'Fuerza' },
  { key: 'dexterity', label: 'Destreza' },
  { key: 'constitution', label: 'Constitución' },
  { key: 'intelligence', label: 'Inteligencia' },
  { key: 'wisdom', label: 'Sabiduría' },
  { key: 'charisma', label: 'Carisma' },
] as const;

const selectedRace = computed(() =>
  contentStore.races.find((race) => race._id === form.raceId),
);

const selectedClass = computed(() =>
  contentStore.classes.find(
    (characterClass) => characterClass._id === form.classId,
  ),
);

const selectedBackground = computed(() =>
  contentStore.backgrounds.find(
    (background) => background._id === form.backgroundId,
  ),
);

onMounted(async () => {
  await contentStore.fetchContent();
});

async function handleCreate() {
  errorMessage.value = '';

  if (!form.name || !form.raceId || !form.classId || !form.backgroundId) {
    errorMessage.value = 'Completa nombre, raza, clase y trasfondo.';
    return;
  }

  const character = await charactersStore.createCharacter({
    name: form.name,
    raceId: form.raceId,
    classId: form.classId,
    backgroundId: form.backgroundId,
    alignment: form.alignment,
    appearance: form.appearance,
    abilities: form.abilities,
  });

  router.push(`/characters/${character._id}`);
}
</script>

<style scoped lang="scss">
.character-create-page {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  color: var(--rp-text-primary);
}

.page-header {
  margin-bottom: 28px;
}

.page-subtitle {
  color: var(--rp-text-secondary);
}

.rp-wizard {
  background:
    linear-gradient(
      180deg,
      rgba(20, 20, 22, 0.96),
      rgba(11, 11, 13, 0.98)
    );

  border: 1px solid rgba(198, 161, 91, 0.16);
  border-radius: 24px;
  box-shadow: var(--rp-shadow-lg);
  overflow: hidden;
}

.mobile-step-header {
  padding: 24px;
  background: rgba(11, 11, 13, 0.86);
  border-bottom: 1px solid rgba(198, 161, 91, 0.16);

  h2 {
    margin: 4px 0 16px;
    font-family: 'Cinzel', serif;
    color: var(--rp-gold-primary);
    font-size: clamp(1.35rem, 5vw, 1.8rem);
  }
}

.step-count {
  color: var(--rp-text-secondary);
  font-size: 0.9rem;
}

.wizard-content {
  padding: 24px;
}

.identity-card {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.section-title {
  font-family: 'Cinzel', serif;
  color: var(--rp-gold-primary);
}

.step-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

@media (max-width: 600px) {
  .character-create-page {
    max-width: 100%;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .wizard-content {
    padding: 18px;
  }

  .identity-card {
    padding: 20px !important;
  }

  .step-actions {
    padding: 18px;
  }

  .step-actions :deep(.v-btn) {
    min-width: 120px;
  }
}
</style>