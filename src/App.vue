<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();

onMounted(async () => {
  // Check if user is logged in and load profile
  if (authStore.isAuthenticated) {
    await authStore.fetchUserProfile();
  }
});
</script>

<template>
  <router-view />
</template>
