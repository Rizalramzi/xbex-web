<template>
  <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" @click="closeModal"></div>

    <!-- Modal panel -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden z-[10000]">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0 mr-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: var(--color-primary-light);">
              <MdiIcon :path="mdiMapMarker" :size="20" style="color: var(--color-primary-dark);" />
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900" id="modal-title">
              Change Site
            </h3>
            <p class="text-sm text-gray-500">
              Select a site to switch to
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4 max-h-60 overflow-y-auto">
        <div v-if="sites && sites.length > 0" class="space-y-3">
          <div 
            v-for="site in sites" 
            :key="site.id"
            class="p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center hover:shadow-md"
            :class="site.id === selectedSite ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'"
            @click="selectSite(site.id)"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: var(--color-primary-light);">
              <MdiIcon :path="mdiMapMarker" :size="16" style="color: var(--color-primary-dark);" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ site.name }}</p>
              <p class="text-xs text-gray-500">{{ site.description }}</p>
            </div>
            <div v-if="site.id === selectedSite" class="ml-3">
              <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No sites available</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          type="button" 
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          @click="closeModal"
        >
          Cancel
        </button>
        <button 
          type="button" 
          class="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          style="background-color: var(--color-primary);"
          @click="changeSite"
        >
          Change Site
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import MdiIcon from './MdiIcon.vue';
import { mdiMapMarker } from '@mdi/js';
import { useSiteStore } from '../stores/siteStore';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentSite: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'change']);
const siteStore = useSiteStore();

const selectedSite = ref(props.currentSite);
const sites = computed(() => {
  console.log('Sites from store:', siteStore.getAllSites());
  return siteStore.getAllSites();
});

// Watch for changes to props.currentSite
watch(() => props.currentSite, (newValue) => {
  selectedSite.value = newValue;
  console.log('Current site changed to:', newValue);
});

// Watch for changes to props.show
watch(() => props.show, (isVisible) => {
  console.log('Modal visibility:', isVisible);
  if (isVisible) {
    selectedSite.value = props.currentSite;
  }
});

const selectSite = (siteId) => {
  console.log('Selected site:', siteId);
  selectedSite.value = siteId;
};

const changeSite = () => {
  console.log('Changing to site:', selectedSite.value);
  emit('change', selectedSite.value);
  closeModal();
};

const closeModal = () => {
  console.log('Closing modal');
  emit('close');
};
</script>

<style scoped>
/* Ensure modal is properly positioned and sized */
.fixed {
  z-index: 9999;
}

/* Ensure the modal content doesn't exceed viewport */
.max-h-\[80vh\] {
  max-height: 80vh;
}

/* Custom scrollbar for the site list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Focus styles for accessibility */
button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
