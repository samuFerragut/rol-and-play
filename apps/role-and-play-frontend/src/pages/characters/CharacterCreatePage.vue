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

                  <div
                    ref="subraceCarouselRef"
                    class="subrace-carousel"
                    @click.stop
                    @pointerdown.stop="startSubraceDrag"
                    @pointermove.stop="moveSubraceDrag"
                    @pointerup.stop="finishSubraceDrag"
                    @pointercancel.stop="finishSubraceDrag"
                    @pointerleave.stop="finishSubraceDrag"
                    @touchstart.stop
                    @touchmove.stop
                  >
                    <button
                      v-for="subrace in selectedRace.subraces"
                      :key="subrace.slug"
                      type="button"
                      :data-slug="subrace.slug"
                      class="subrace-chip"
                      :class="{ selected: form.subraceSlug === subrace.slug }"
                      @click.stop="selectSubrace(subrace.slug)"
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
            @select="handleClassSelect"
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

                <div
                  v-if="selectedClass.subclasses.length"
                  class="subrace-picker"
                >
                  <h4>{{ selectedClass.subclassSelectionLabel || 'Subclase' }} disponible al nivel {{ selectedClass.subclassLevel }}</h4>

                  <div
                    class="subclass-preview-list"
                    @click.stop
                    @pointerdown.stop
                    @pointermove.stop
                    @touchstart.stop
                    @touchmove.stop
                  >
                    <button
                      v-for="subclass in selectedClass.subclasses"
                      :key="subclass.slug"
                      type="button"
                      class="subclass-preview-chip"
                    >
                      <strong>{{ subclass.name }}</strong>
                      <small>{{ subclass.description }}</small>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </SelectionGrid>

          <SelectionGrid
            v-if="currentStep === 4"
            title="Elige un trasfondo"
            :items="contentStore.backgrounds"
            :selected-id="form.backgroundId"
            @select="handleBackgroundSelect"
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

            <div class="character-options-grid mt-6">
              <section class="option-panel">
                <h3>Idiomas</h3>

                <div
                  v-if="knownLanguages.length"
                  class="chip-row"
                >
                  <span
                    v-for="language in knownLanguages"
                    :key="language"
                    class="info-chip locked"
                  >
                    {{ language }}
                  </span>
                </div>

                <v-select
                  v-if="languageChoiceSlots > 0"
                  v-model="form.languageChoices"
                  :items="availableLanguageOptions"
                  :label="`Elige ${languageChoiceSlots} idioma${languageChoiceSlots > 1 ? 's' : ''}`"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  class="rp-input mt-3"
                  hide-details="auto"
                  :counter="languageChoiceSlots"
                  @update:model-value="trimLanguageChoices"
                />
              </section>

              <section class="option-panel">
                <h3>Rasgos de raza</h3>

                <div class="chip-row">
                  <span
                    v-for="trait in racialTraits"
                    :key="trait"
                    class="info-chip"
                  >
                    {{ trait }}
                  </span>
                </div>
              </section>

              <section class="option-panel">
                <h3>Habilidades</h3>

                <v-select
                  v-if="skillChoiceSlots > 0"
                  v-model="form.skillChoices"
                  :items="availableSkillOptions"
                  :label="`Elige ${skillChoiceSlots} habilidad${skillChoiceSlots > 1 ? 'es' : ''}`"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  class="rp-input mb-3"
                  hide-details="auto"
                  :counter="skillChoiceSlots"
                  @update:model-value="trimSkillChoices"
                />

                <div class="chip-row">
                  <span
                    v-for="skill in fixedSkillProficiencies"
                    :key="skill"
                    class="info-chip locked"
                  >
                    {{ skill }}
                  </span>
                </div>
              </section>

              <section class="option-panel equipment-panel">
                <h3>Equipo inicial</h3>

                <div
                  v-for="group in equipmentGroups"
                  :key="group.key"
                  class="equipment-choice"
                >
                  <span>{{ group.label }}</span>

                  <div
                    v-if="group.options.length > 1"
                    class="equipment-toggle"
                  >
                    <button
                      v-for="option in group.options"
                      :key="option"
                      type="button"
                      class="choice-pill"
                      :class="{ selected: form.equipmentSelections[group.key] === option }"
                      @click="form.equipmentSelections[group.key] = option"
                    >
                      {{ option }}
                    </button>
                  </div>

                  <span
                    v-else
                    class="info-chip locked"
                  >
                    {{ group.options[0] }}
                  </span>
                </div>
              </section>
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
const subraceCarouselRef = ref<HTMLElement | null>(null);

const subraceDrag = reactive({
  active: false,
  moved: false,
  startX: 0,
  scrollLeft: 0,
  suppressClick: false,
});

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
  languageChoices: [] as string[],
  skillChoices: [] as string[],
  equipmentSelections: {} as Record<string, string>,
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

const allLanguages = [
  'Común',
  'Enano',
  'Élfico',
  'Gigante',
  'Gnómico',
  'Goblin',
  'Mediano',
  'Orco',
  'Abisal',
  'Celestial',
  'Dracónico',
  'Habla profunda',
  'Infernal',
  'Primordial',
  'Silvano',
  'Infracomún',
];

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

const knownLanguages = computed(() =>
  uniqueValues([
    ...fixedLanguages(selectedRace.value?.languages),
    ...fixedLanguages(selectedSubrace.value?.languages),
  ]),
);

const languageChoiceSlots = computed(
  () =>
    countLanguageChoices(selectedRace.value?.languages) +
    countLanguageChoices(selectedSubrace.value?.languages) +
    countLanguageChoices(selectedBackground.value?.proficiencies.languages),
);

const availableLanguageOptions = computed(() =>
  allLanguages.filter((language) => !knownLanguages.value.includes(language)),
);

const finalLanguages = computed(() =>
  uniqueValues([
    ...knownLanguages.value,
    ...form.languageChoices.slice(0, languageChoiceSlots.value),
  ]),
);

const racialTraits = computed(() =>
  uniqueValues([
    ...(selectedRace.value?.traits || []),
    ...(selectedSubrace.value?.traits || []),
  ]),
);

const fixedSkillProficiencies = computed(() =>
  uniqueValues([
    ...(selectedRace.value?.skillProficiencies || []),
    ...(selectedSubrace.value?.skillProficiencies || []),
    ...(selectedBackground.value?.proficiencies.skills || []),
  ]),
);

const skillChoiceSlots = computed(
  () =>
    (selectedRace.value?.numberOfSkillChoices || 0) +
    (selectedSubrace.value?.numberOfSkillChoices || 0) +
    (selectedClass.value?.proficiencies.numberOfSkillChoices || 0),
);

const skillChoicePool = computed(() =>
  uniqueValues([
    ...(selectedRace.value?.skillChoices || []),
    ...(selectedSubrace.value?.skillChoices || []),
    ...(selectedClass.value?.proficiencies.skillChoices || []),
  ]),
);

const availableSkillOptions = computed(() =>
  skillChoicePool.value.filter(
    (skill) =>
      !fixedSkillProficiencies.value.includes(skill) &&
      !form.skillChoices.includes(skill),
  ),
);

const skillProficiencies = computed(() =>
  uniqueValues([
    ...fixedSkillProficiencies.value,
    ...form.skillChoices.slice(0, skillChoiceSlots.value),
  ]),
);

const equipmentGroups = computed(() =>
  (selectedClass.value?.startingEquipmentChoices || []).map((group, index) => ({
    key: `equipment-${index}`,
    label: group.label,
    options: group.options,
  })),
);

const selectedEquipment = computed(() =>
  equipmentGroups.value
    .map((group) => form.equipmentSelections[group.key] || group.options[0])
    .filter(Boolean),
);

onMounted(async () => {
  await contentStore.fetchContent();
});

function handleRaceSelect(raceId: string) {
  form.raceId = raceId;

  const race = contentStore.races.find((item) => item._id === raceId);
  form.subraceSlug = race?.subraces[0]?.slug || '';
  trimSkillChoices();
}

function handleClassSelect(classId: string) {
  form.classId = classId;
  trimSkillChoices();
  setDefaultEquipmentSelections();
}

function handleBackgroundSelect(backgroundId: string) {
  form.backgroundId = backgroundId;
  trimLanguageChoices();
  trimSkillChoices();
}

function selectSubrace(slug: string) {
  if (subraceDrag.suppressClick) return;

  form.subraceSlug = slug;
}

function startSubraceDrag(event: PointerEvent) {
  const target = event.currentTarget;

  if (!(target instanceof HTMLElement)) return;

  subraceDrag.active = true;
  subraceDrag.moved = false;
  subraceDrag.startX = event.clientX;
  subraceDrag.scrollLeft = target.scrollLeft;
  target.setPointerCapture?.(event.pointerId);
}

function moveSubraceDrag(event: PointerEvent) {
  const target = event.currentTarget;

  if (!subraceDrag.active || !(target instanceof HTMLElement)) return;

  const delta = event.clientX - subraceDrag.startX;

  if (Math.abs(delta) > 4) {
    subraceDrag.moved = true;
  }

  target.scrollLeft = subraceDrag.scrollLeft - delta;
}

function finishSubraceDrag(event: PointerEvent) {
  const target = event.currentTarget;

  if (!(target instanceof HTMLElement) || !subraceDrag.active) return;

  target.releasePointerCapture?.(event.pointerId);

  if (subraceDrag.moved) {
    selectCenteredSubrace(target);
    subraceDrag.suppressClick = true;

    window.setTimeout(() => {
      subraceDrag.suppressClick = false;
    });
  } else {
    selectSubraceAtPoint(event.clientX, event.clientY);
  }

  subraceDrag.active = false;
}

function selectSubraceAtPoint(x: number, y: number) {
  const element = document.elementFromPoint(x, y);
  const chip = element?.closest<HTMLElement>('.subrace-chip');
  const slug = chip?.dataset.slug;

  if (slug) {
    form.subraceSlug = slug;
  }
}

function selectCenteredSubrace(container: HTMLElement) {
  const chips = Array.from(
    container.querySelectorAll<HTMLElement>('.subrace-chip'),
  );

  const containerCenter = container.scrollLeft + container.clientWidth / 2;
  const closestChip = chips.reduce<HTMLElement | null>((closest, chip) => {
    if (!closest) return chip;

    const chipCenter = chip.offsetLeft + chip.offsetWidth / 2;
    const closestCenter = closest.offsetLeft + closest.offsetWidth / 2;

    return Math.abs(chipCenter - containerCenter) <
      Math.abs(closestCenter - containerCenter)
      ? chip
      : closest;
  }, null);

  const slug = closestChip?.dataset.slug;

  if (slug) {
    form.subraceSlug = slug;
  }
}

function fixedLanguages(languages?: string[]) {
  return (languages || []).filter((language) => !isLanguageChoice(language));
}

function countLanguageChoices(languages?: string[]) {
  return (languages || []).reduce(
    (total, language) => total + languageChoiceCount(language),
    0,
  );
}

function languageChoiceCount(language: string) {
  const normalized = language.toLowerCase();

  if (!isLanguageChoice(language)) return 0;
  if (normalized.includes('dos')) return 2;
  if (normalized.includes('tres')) return 3;

  return 1;
}

function isLanguageChoice(language: string) {
  const normalized = language.toLowerCase();

  return (
    normalized.includes('adicional') ||
    normalized.includes('elección') ||
    normalized.includes('eleccion')
  );
}

function trimLanguageChoices() {
  const allowed = form.languageChoices
    .filter((language) => availableLanguageOptions.value.includes(language))
    .slice(0, languageChoiceSlots.value);

  form.languageChoices.splice(0, form.languageChoices.length, ...allowed);
}

function setDefaultEquipmentSelections() {
  for (const key of Object.keys(form.equipmentSelections)) {
    delete form.equipmentSelections[key];
  }

  for (const group of equipmentGroups.value) {
    form.equipmentSelections[group.key] = group.options[0] || '';
  }
}

function trimSkillChoices() {
  const allowed = form.skillChoices
    .filter((skill) => skillChoicePool.value.includes(skill))
    .filter((skill) => !fixedSkillProficiencies.value.includes(skill))
    .slice(0, skillChoiceSlots.value);

  form.skillChoices.splice(0, form.skillChoices.length, ...allowed);
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
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

  if (form.languageChoices.length < languageChoiceSlots.value) {
    errorMessage.value = 'Completa los idiomas a tu elección.';
    currentStep.value = 5;
    return;
  }

  if (form.skillChoices.length < skillChoiceSlots.value) {
    errorMessage.value = 'Completa las habilidades a tu elección.';
    currentStep.value = 5;
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
    languages: finalLanguages.value,
    skillProficiencies: skillProficiencies.value,
    equipment: selectedEquipment.value,
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
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  touch-action: pan-x;
}

.subrace-chip {
  flex: 0 0 138px;
  scroll-snap-align: center;
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

.subclass-preview-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: thin;
}

.subclass-preview-chip {
  flex: 0 0 168px;
  min-height: 112px;
  padding: 10px;
  text-align: left;
  cursor: default;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(198, 161, 91, 0.16);
  border-radius: 12px;

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
    margin-top: 7px;
    color: var(--rp-text-secondary);
    font-size: 0.72rem;
    line-height: 1.25;
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

.character-options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.option-panel {
  min-height: 160px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(198, 161, 91, 0.14);
  border-radius: 14px;

  h3 {
    margin-bottom: 12px;
    font-family: 'Cinzel', serif;
    color: var(--rp-gold-primary);
    font-size: 1rem;
  }
}

.equipment-panel {
  grid-column: 1 / -1;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 10px;
  color: var(--rp-text-primary);
  background: rgba(198, 161, 91, 0.1);
  border: 1px solid rgba(198, 161, 91, 0.16);
  border-radius: 999px;
  font-size: 0.82rem;

  &.locked {
    background: rgba(198, 161, 91, 0.16);
    border-color: rgba(198, 161, 91, 0.28);
  }
}

.equipment-choice {
  display: grid;
  grid-template-columns: minmax(110px, 140px) 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid rgba(198, 161, 91, 0.1);

  > span:first-child {
    color: var(--rp-text-secondary);
    font-size: 0.84rem;
  }
}

.equipment-choice:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.equipment-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.choice-pill {
  min-height: 34px;
  padding: 7px 12px;
  color: var(--rp-text-primary);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(198, 161, 91, 0.18);
  border-radius: 999px;
  font-size: 0.82rem;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &.selected {
    color: #0f0f11;
    background: var(--rp-gold-primary);
    border-color: var(--rp-gold-primary);
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

  .character-options-grid {
    grid-template-columns: 1fr;
  }

  .equipment-choice {
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
