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

          <h2 class="forgot-title">
            ¿Has olvidado tu contraseña?
          </h2>

          <p class="rp-auth-subtitle">
            Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            class="rp-input mb-6"
            hide-details="auto"
          />

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
            Enviar
          </v-btn>

          <div class="text-center auth-footer">
            <RouterLink
              to="/login"
              class="auth-link"
            >
              Volver al inicio de sesión
            </RouterLink>
          </div>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { forgotPasswordRequest } from '../../api/password.api';

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');

async function handleSubmit() {
  isLoading.value = true;
  successMessage.value = '';

  try {
    await forgotPasswordRequest(email.value);

    successMessage.value =
      'Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
.forgot-title {
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