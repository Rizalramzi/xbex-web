<template>
  <div class="min-h-screen bg-app p-6 pb-20">
    <div class="card-dark p-6 text-center">
      <MdiIcon :path="mdiBookOpenPageVariant" :size="48" class="text-primary-color mx-auto mb-4" />
      <h1 class="text-xl font-bold text-primary mb-2">Knowledge Base</h1>
      <p class="text-muted">Access documentation, procedures, and technical guides.</p>
      <div class="mt-6">
        <button class="btn-custom-primary">
          Coming Soon
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import MdiIcon from '../components/MdiIcon.vue';
import { mdiBookOpenPageVariant } from '@mdi/js';
</script>
