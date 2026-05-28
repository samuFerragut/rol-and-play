<template>
  <div class="selection-carousel-wrapper">
    <h2 class="section-title">
      {{ title }}
    </h2>

    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <div
          v-for="(item, index) in items"
          :key="item._id"
          class="embla__slide"
        >
          <div
            role="button"
            tabindex="0"
            class="selection-card"
            :class="{
              selected: selectedId === item._id,
              active: selectedIndex === index,
              previous: selectedIndex === index + 1,
              next: selectedIndex === index - 1,
            }"
            @click="selectItem(item._id, index)"
            @keydown.enter.prevent="selectItem(item._id, index)"
            @keydown.space.prevent="selectItem(item._id, index)"
          >
            <div class="card-image">
              <v-icon
                v-if="!item.imageUrl"
                icon="mdi-dice-d20-outline"
                size="68"
              />

              <img v-else :src="item.imageUrl" :alt="item.name" />
            </div>

            <div class="card-content">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>

              <slot
                name="details"
                :item="item"
                :is-selected="selectedId === item._id"
                :is-active="selectedIndex === index"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-actions">
      <v-btn
        icon="mdi-chevron-left"
        variant="text"
        class="carousel-btn"
        @click="scrollPrev"
      />

      <div class="carousel-dots">
        <button
          v-for="(item, index) in items"
          :key="item._id"
          type="button"
          class="carousel-dot"
          :class="{ active: selectedIndex === index }"
          @click="scrollTo(index)"
        />
      </div>

      <v-btn
        icon="mdi-chevron-right"
        variant="text"
        class="carousel-btn"
        @click="scrollNext"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import emblaCarouselVue from "embla-carousel-vue";

interface SelectionItem {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
}

const props = defineProps<{
  title: string;
  items: SelectionItem[];
  selectedId: string;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

const [emblaRef, emblaApi] = emblaCarouselVue({
  align: "center",
  containScroll: false,
  dragFree: false,
  skipSnaps: false,
  loop: false,
});

const selectedIndex = computed(() => {
  const index = props.items.findIndex((item) => item._id === props.selectedId);

  return index >= 0 ? index : 0;
});

watch(
  emblaApi,
  (api) => {
    if (!api) return;

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      const selectedItem = props.items[index];

      if (selectedItem) {
        emit("select", selectedItem._id);
      }
    });
  },
  {
    immediate: true,
  },
);

watch(
  () => props.items.length,
  () => {
    requestAnimationFrame(() => {
      emblaApi.value?.reInit();
    });
  },
);

watch(
  () => [props.items, props.selectedId] as const,
  ([items, selectedId]) => {
    if (!selectedId && items[0]) {
      emit("select", items[0]._id);
    }
  },
  {
    immediate: true,
  },
);

function selectItem(id: string, index: number) {
  emit("select", id);
  emblaApi.value?.scrollTo(index);
}

function scrollPrev() {
  emblaApi.value?.scrollPrev();
}

function scrollNext() {
  emblaApi.value?.scrollNext();
}

function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index);
}
</script>

<style scoped lang="scss">
.selection-carousel-wrapper {
  width: 100%;
}

.section-title {
  margin-bottom: 22px;
  font-family: "Cinzel", serif;
  color: var(--rp-gold-primary);
}

.embla {
  width: 100%;
  overflow: hidden;
  padding: 20px 0 28px;
}

.embla__container {
  display: flex;
  align-items: center;
  touch-action: pan-y pinch-zoom;
}

.embla__slide {
  flex: 0 0 82%;
  min-width: 0;

  display: flex;
  justify-content: center;
}

.selection-card {
  width: 100%;
  max-width: 380px;
  min-height: 560px;

  cursor: pointer;
  overflow: hidden;
  text-align: left;

  display: flex;
  flex-direction: column;

  background:
    radial-gradient(circle at top, rgba(198, 161, 91, 0.08), transparent 45%),
    linear-gradient(180deg, rgba(28, 28, 31, 0.98), rgba(11, 11, 13, 0.98));

  border: 1px solid rgba(198, 161, 91, 0.18);
  border-radius: 24px;

  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.42);

  transform: scale(0.86);
  opacity: 0.45;

  transition:
    transform 0.28s ease,
    opacity 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;

  &.active {
    transform: scale(1);
    opacity: 1;
    z-index: 3;

    border-color: var(--rp-gold-primary);

    box-shadow:
      0 0 0 1px rgba(198, 161, 91, 0.3),
      0 0 28px rgba(198, 161, 91, 0.18),
      0 18px 42px rgba(0, 0, 0, 0.65);
  }

  &.previous,
  &.next {
    opacity: 0.68;
    z-index: 2;
  }

  &.selected {
    border-color: var(--rp-gold-primary);
  }
}

.card-image {
  height: 140px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--rp-gold-primary);

  background: radial-gradient(
    circle at center,
    rgba(198, 161, 91, 0.16),
    rgba(11, 11, 13, 0.2) 58%
  );

  border-bottom: 1px solid rgba(198, 161, 91, 0.12);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-content {
  padding: 22px;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    margin-bottom: 12px;
    font-family: "Cinzel", serif;
    color: var(--rp-gold-primary);
    font-size: 1.25rem;
  }

  p {
    color: var(--rp-text-secondary);
    font-size: 0.95rem;
    line-height: 1.52;
  }
}

.carousel-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.carousel-btn {
  color: var(--rp-gold-primary) !important;
}

.carousel-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.carousel-dot {
  width: 8px;
  height: 8px;

  border: 0;
  border-radius: 999px;

  cursor: pointer;

  background: rgba(198, 161, 91, 0.25);

  transition:
    width 0.2s ease,
    background 0.2s ease;

  &.active {
    width: 24px;
    background: var(--rp-gold-primary);
  }
}

@media (min-width: 768px) {
  .embla {
    padding: 32px 0 36px;
  }

  .embla__slide {
    flex: 0 0 36%;
  }

  .selection-card {
    max-width: 420px;
    min-height: 590px;
  }

  .embla__slide:not(:has(.selection-card.active)) {
    pointer-events: auto;
  }
}

@media (min-width: 1200px) {
  .embla__slide {
    flex: 0 0 30%;
  }

  .selection-card {
    max-width: 440px;
  }
}

@media (max-width: 600px) {
  .embla {
    padding: 10px 0 18px;
  }

  .embla__slide {
    flex: 0 0 100%;
  }

  .selection-card {
    width: 100%;
    max-width: 330px;
    min-height: 560px;
    transform: scale(0.92);
  }

  .selection-card.active {
    transform: scale(1);
  }

  .card-image {
    height: 120px;
  }

  .card-content {
    padding: 18px;

    h3 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
}
</style>
