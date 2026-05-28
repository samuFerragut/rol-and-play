<template>
  <v-app>
    <div class="rp-auth-page">
      <div class="rp-auth-card">
        <div class="text-center mb-4">
          <img
            src="../../assets/branding/logo-icon.png"
            alt="Rol&Play"
            class="rp-auth-logo"
          />

          <h2 class="reset-title">
            Restablecer contraseña
          </h2>

          <p class="rp-auth-subtitle">
            Introduce tu nueva contraseña.
          </p>
        </div>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="password"
            label="Nueva contraseña"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            class="rp-input mb-4"
            hide-details="auto"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirmar contraseña"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            class="rp-input mb-6"
            hide-details="auto"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          />

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>

          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4"
          >
            {{ successMessage }}
          </v-alert>

          <v-btn
            type="submit"
            block
            size="x-large"
            class="rp-button-primary mb-6"
            :loading="isLoading"
          >
            Guardar contraseña
          </v-btn>

          <div class="text-center auth-footer">
            <RouterLink
              to="/login"
              class="auth-link"
            >
              Volver al login
            </RouterLink>
          </div>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { resetPasswordRequest } from '../../api/password.api';

const route = useRoute();

const token = route.query.token as string;

const password = ref('');
const confirmPassword = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isLoading = ref(false);

const errorMessage = ref('');
const successMessage = ref('');

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value =
      'Las contraseñas no coinciden.';
    return;
  }

  if (password.value.length < 8) {
    errorMessage.value =
      'La contraseña debe tener mínimo 8 caracteres.';
    return;
  }

  isLoading.value = true;

  try {
    await resetPasswordRequest(
      token,
      password.value,
    );

    successMessage.value =
      'Tu contraseña ha sido actualizada correctamente.';
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      'No se pudo restablecer la contraseña.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
.reset-title {
  color: var(--rp-text-primary);

  font-family: 'Cinzel', serif;

  font-size: 1.5rem;

  margin-bottom: 12px;
}

.auth-link {
  color: var(--rp-gold-primary);

  font-weight: 500;

  transition: var(--rp-transition-fast);

  &:hover {
    opacity: 0.8;
  }
}

.auth-footer {
  color: var(--rp-text-secondary);
}
</style>