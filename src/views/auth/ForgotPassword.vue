<template>
  <div class="min-h-screen bg-app flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Forgot Password Card -->
      <div class="card-dark shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        <!-- Logo/Image Section -->
        <div class="text-center px-6 pt-8 pb-6">
          <div class="mx-auto flex justify-center">
            <img 
              :src="logoImage" 
              alt="ARFS Logo" 
              class="w-24 h-24 transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h2 class="mt-6 text-2xl font-bold" style="color: var(--text-primary);">
            Forgot Password
          </h2>
          <p class="mt-2 text-sm" style="color: var(--text-muted);">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <!-- Form Section -->
        <div class="px-6 pb-8">
          <form class="space-y-6" @submit.prevent="handleForgotPassword">
            <div>
              <label for="email" class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
                Email address
              </label>
              <input 
                id="email" 
                v-model="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="form-input-dark w-full"
                placeholder="Enter your email"
              />
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="text-sm p-3 rounded-md" style="background-color: var(--color-success-light); color: var(--color-success);">
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-sm p-3 rounded-md" style="background-color: var(--color-error-light); color: var(--color-error);">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <div>
              <button 
                type="submit" 
                :disabled="isLoading"
                class="btn-custom-primary w-full"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
                <span v-else>Send Reset Link</span>
              </button>
            </div>

            <!-- Back to Login -->
            <div class="text-center pt-4 border-t" style="border-color: var(--border-light);">
              <router-link 
                to="/login" 
                class="text-sm font-medium transition-colors hover:opacity-80" 
                style="color: var(--color-primary);"
              >
                ← Back to Sign In
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-xs" style="color: var(--text-muted);">
          © 2025 ARFS
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logoImage from '../../assets/images/logo.svg';

const router = useRouter();

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleForgotPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    successMessage.value = 'Password reset link has been sent to your email address.';
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login');
    }, 3000);
    
  } catch (error) {
    errorMessage.value = 'Failed to send reset link. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>
