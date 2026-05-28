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
            @select="handleRaceSelect"
          >
            <template #details="{ isSelected }">
              <div
                v-if="isSelected && selectedRace"
                class="card-extra"
              >
                <div class="detail-tags">
                  <span>Tamaño: {{ selectedRace.size }}</span>
                  <span>Velocidad: {{ selectedRace.speed }}</span>
                  <span>{{ formatAbilityBonuses(selectedRace.abilityBonuses) }}</span>
                </div>

                <div
                  v-if="selectedRace.traits.length"
                  class="detail-block"
                >
                  <h4>Rasgos</h4>
                  <ul>
                    <li
                      v-for="trait in selectedRace.traits"
                      :key="trait"
                    >
                      {{ trait }}
                    </li>
                  </ul>
                </div>

                <div
                  v-if="selectedRace.subraces.length > 1"
                  class="subrace-picker"
                >
                  <h4>{{ selectedRace.selectionLabel || 'Subraza' }}</h4>

                  <div class="subrace-carousel">
                    <button
                      v-for="subrace in selectedRace.subraces"
                      :key="subrace.slug"
                      type="button"
                      class="subrace-chip"
                      :class="{ selected: form.subraceSlug === subrace.slug }"
                      @click.stop="form.subraceSlug = subrace.slug"
                    >
                      <strong>{{ subrace.name }}</strong>
                      <small>{{ formatAbilityBonuses(subrace.abilityBonuses) }}</small>
                    </button>
                  </div>
                </div>

                <div
                  v-if="selectedSubrace"
                  class="detail-block subrace-summary"
                >
                  <h4>{{ selectedSubrace.name }}</h4>
                  <p>{{ selectedSubrace.description }}</p>
                </div>
              </div>
            </template>
          </SelectionGrid>

          <SelectionGrid
            v-if="currentStep === 3"
            title="Elige una clase"
            :items="contentStore.classes"
            :selected-id="form.classId"
            @select="form.classId = $event"
          >
            <template #details="{ isSelected }">
              <div
                v-if="isSelected && selectedClass"
                class="card-extra"
              >
                <div class="detail-tags">
                  <span>Dado de golpe: {{ selectedClass.hitDice }}</span>
                  <span>{{ selectedClass.isSpellcaster ? 'Lanzador de conjuros' : 'Marcial' }}</span>
                </div>

                <div class="detail-block">
                  <h4>Competencias</h4>
                  <p>{{ classProficienciesSummary }}</p>
                </div>
              </div>
            </template>
          </SelectionGrid>

          <SelectionGrid
            v-if="currentStep === 4"
            title="Elige un trasfondo"
            :items="contentStore.backgrounds"
            :selected-id="form.backgroundId"
            @select="form.backgroundId = $event"
          >
            <template #details="{ isSelected }">
              <div
                v-if="isSelected && selectedBackground"
                class="card-extra"
              >
                <div class="detail-block">
                  <h4>{{ selectedBackground.feature.name }}</h4>
                  <p>{{ selectedBackground.feature.description }}</p>
                </div>

                <div class="detail-block">
                  <h4>Competencias</h4>
                  <p>{{ backgroundProficienciesSummary }}</p>
                </div>
              </div>
            </template>
          </SelectionGrid>

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
                  :label="`${ability.label} base`"
                  type="number"
                  variant="outlined"
                  class="rp-input"
                  hide-details="auto"
                />

                <div class="ability-result">
                  <span>Bono {{ formatSigned(totalAbilityBonuses[ability.key] || 0) }}</span>
                  <strong>Final {{ finalAbilities[ability.key] }}</strong>
                </div>
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
            <p><strong>{{ selectedRace?.selectionLabel || 'Subraza' }}:</strong> {{ selectedSubrace?.name || 'Sin seleccionar' }}</p>
            <p><strong>Clase:</strong> {{ selectedClass?.name || 'Sin seleccionar' }}</p>
            <p><strong>Trasfondo:</strong> {{ selectedBackground?.name || 'Sin seleccionar' }}</p>

            <div class="summary-grid mt-4">
              <div
                v-for="ability in abilities"
                :key="ability.key"
                class="summary-stat"
              >
                <span>{{ ability.label }}</span>
                <strong>{{ finalAbilities[ability.key] }}</strong>
              </div>
            </div>

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
import type { AbilityBonuses } from '../../types/content.types';

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
  subraceSlug: '',
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

type AbilityKey = (typeof abilities)[number]['key'];

const abilityLabels: Record<AbilityKey, string> = {
  strength: 'Fuerza',
  dexterity: 'Destreza',
  constitution: 'Constitución',
  intelligence: 'Inteligencia',
  wisdom: 'Sabiduría',
  charisma: 'Carisma',
};

const selectedRace = computed(() =>
  contentStore.races.find((race) => race._id === form.raceId),
);

const selectedSubrace = computed(() =>
  selectedRace.value?.subraces.find(
    (subrace) => subrace.slug === form.subraceSlug,
  ),
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

const totalAbilityBonuses = computed<Record<AbilityKey, number>>(() => {
  const bonuses = createEmptyAbilityBonuses();

  addAbilityBonuses(bonuses, selectedRace.value?.abilityBonuses);
  addAbilityBonuses(bonuses, selectedSubrace.value?.abilityBonuses);

  return bonuses;
});

const finalAbilities = computed<Record<AbilityKey, number>>(() => ({
  strength: form.abilities.strength + totalAbilityBonuses.value.strength,
  dexterity: form.abilities.dexterity + totalAbilityBonuses.value.dexterity,
  constitution:
    form.abilities.constitution + totalAbilityBonuses.value.constitution,
  intelligence:
    form.abilities.intelligence + totalAbilityBonuses.value.intelligence,
  wisdom: form.abilities.wisdom + totalAbilityBonuses.value.wisdom,
  charisma: form.abilities.charisma + totalAbilityBonuses.value.charisma,
}));

const classProficienciesSummary = computed(() => {
  if (!selectedClass.value) return '';

  const { proficiencies } = selectedClass.value;

  return [
    listLabel('Armaduras', proficiencies.armor),
    listLabel('Armas', proficiencies.weapons),
    listLabel('Herramientas', proficiencies.tools),
    listLabel('Salvaciones', proficiencies.savingThrows),
  ]
    .filter(Boolean)
    .join(' · ');
});

const backgroundProficienciesSummary = computed(() => {
  if (!selectedBackground.value) return '';

  const { proficiencies } = selectedBackground.value;

  return [
    listLabel('Habilidades', proficiencies.skills),
    listLabel('Herramientas', proficiencies.tools),
    listLabel('Idiomas', proficiencies.languages),
  ]
    .filter(Boolean)
    .join(' · ');
});

onMounted(async () => {
  await contentStore.fetchContent();
});

function handleRaceSelect(raceId: string) {
  form.raceId = raceId;

  const race = contentStore.races.find((item) => item._id === raceId);
  form.subraceSlug = race?.subraces[0]?.slug || '';
}

function createEmptyAbilityBonuses(): Record<AbilityKey, number> {
  return {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };
}

function addAbilityBonuses(
  target: Record<AbilityKey, number>,
  bonuses?: AbilityBonuses | null,
) {
  if (!bonuses) return;

  for (const ability of abilities) {
    target[ability.key] += bonuses[ability.key] || 0;
  }
}

function formatAbilityBonuses(bonuses?: AbilityBonuses | null) {
  if (!bonuses) return 'Sin bono de característica';

  const parts = abilities
    .filter((ability) => bonuses[ability.key])
    .map(
      (ability) =>
        `${abilityLabels[ability.key]} ${formatSigned(bonuses[ability.key] || 0)}`,
    );

  return parts.length ? parts.join(', ') : 'Sin bono de característica';
}

function formatSigned(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function listLabel(label: string, values: string[]) {
  return values.length ? `${label}: ${values.join(', ')}` : '';
}

async function handleCreate() {
  errorMessage.value = '';

  if (!form.name || !form.raceId || !form.classId || !form.backgroundId) {
    errorMessage.value = 'Completa nombre, raza, clase y trasfondo.';
    return;
  }

  const character = await charactersStore.createCharacter({
    name: form.name,
    raceId: form.raceId,
    subraceSlug: form.subraceSlug,
    classId: form.classId,
    backgroundId: form.backgroundId,
    alignment: form.alignment,
    appearance: form.appearance,
    abilities: finalAbilities.value,
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

.card-extra {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(198, 161, 91, 0.14);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 6px 10px;
    color: var(--rp-text-primary);
    background: rgba(198, 161, 91, 0.12);
    border: 1px solid rgba(198, 161, 91, 0.18);
    border-radius: 999px;
    font-size: 0.78rem;
  }
}

.detail-block {
  margin-top: 14px;

  h4 {
    margin-bottom: 8px;
    font-family: 'Cinzel', serif;
    color: var(--rp-gold-primary);
    font-size: 0.95rem;
  }

  p,
  li {
    color: var(--rp-text-secondary);
    font-size: 0.86rem;
    line-height: 1.42;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 5px 12px;
    margin: 0;
    padding-left: 18px;
  }
}

.subrace-picker {
  margin-top: 14px;

  h4 {
    margin-bottom: 8px;
    font-family: 'Cinzel', serif;
    color: var(--rp-gold-primary);
    font-size: 0.95rem;
  }
}

.subrace-carousel {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: thin;
}

.subrace-chip {
  flex: 0 0 138px;
  min-height: 76px;
  padding: 10px;
  cursor: pointer;
  text-align: left;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(198, 161, 91, 0.16);
  border-radius: 12px;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--rp-gold-primary);
    font-size: 0.82rem;
    line-height: 1.2;
  }

  small {
    margin-top: 6px;
    color: var(--rp-text-secondary);
    font-size: 0.72rem;
    line-height: 1.25;
  }

  &.selected {
    background: rgba(198, 161, 91, 0.12);
    border-color: var(--rp-gold-primary);
    transform: translateY(-1px);
  }
}

.subrace-summary {
  min-height: 84px;
}

.ability-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(198, 161, 91, 0.08);
  border: 1px solid rgba(198, 161, 91, 0.12);
  border-radius: 10px;

  span {
    color: var(--rp-text-secondary);
    font-size: 0.85rem;
  }

  strong {
    color: var(--rp-gold-primary);
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.summary-stat {
  padding: 12px;
  background: rgba(198, 161, 91, 0.08);
  border: 1px solid rgba(198, 161, 91, 0.12);
  border-radius: 12px;

  span,
  strong {
    display: block;
  }

  span {
    color: var(--rp-text-secondary);
    font-size: 0.85rem;
  }

  strong {
    color: var(--rp-gold-primary);
    font-size: 1.35rem;
  }
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

  .detail-block ul {
    grid-template-columns: 1fr;
  }

  .step-actions {
    padding: 18px;
  }

  .step-actions :deep(.v-btn) {
    min-width: 120px;
  }
}
</style>
