<template>  <Layout>
    <div class="">
      <div class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-2xl font-semibold leading-6 text-gray-900">
          {{ isEditing ? 'Edit Asset' : 'Add New Asset' }}
        </h3>
        <div class="mt-3 sm:mt-0 sm:ml-4">
          <router-link to="/assets" class="btn btn-secondary">
            Cancel
          </router-link>
        </div>
      </div>
      
      <form @submit.prevent="saveAsset" class="mt-6 space-y-6">
        <!-- Asset ID -->
        <div v-if="isEditing" class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="asset-id" class="block text-sm font-medium text-gray-700">Asset ID</label>
            <div class="mt-1">
              <input 
                type="text"
                id="asset-id"
                v-model="assetForm.id"
                disabled
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <!-- Name and Category -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Asset Name</label>
            <div class="mt-1">
              <input 
                type="text"
                id="name"
                v-model="assetForm.name"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <div class="mt-1">
              <select
                id="category"
                v-model="assetForm.categoryId"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option disabled value="">Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Location and Status -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <div class="mt-1">
              <input 
                type="text"
                id="location"
                v-model="assetForm.location"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <div class="mt-1">
              <select
                id="status"
                v-model="assetForm.statusId"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option disabled value="">Select Status</option>
                <option v-for="status in statusTypes" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Acquisition Date -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="acquisition-date" class="block text-sm font-medium text-gray-700">Acquisition Date</label>
            <div class="mt-1">
              <input 
                type="date"
                id="acquisition-date"
                v-model="assetForm.acquisitionDate"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <div class="mt-1">
            <textarea
              id="description"
              v-model="assetForm.description"
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
        
        <!-- Form Errors -->
        <div v-if="formError" class="text-sm text-red-600">
          {{ formError }}
        </div>
        
        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <router-link to="/assets" class="btn btn-secondary">
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="submitting"
          >
            {{ submitting ? 'Saving...' : 'Save Asset' }}
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Layout from '../../components/Layout.vue';
import { useAssetStore } from '../../stores/assetStore';

const route = useRoute();
const router = useRouter();
const assetStore = useAssetStore();

const assetId = route.params.id;
const isEditing = computed(() => !!assetId);
const submitting = ref(false);
const formError = ref('');

// Mock data for categories and status types
const categories = ref([
  { id: 1, name: 'Machinery' },
  { id: 2, name: 'IT Equipment' },
  { id: 3, name: 'Vehicles' },
  { id: 4, name: 'Office Equipment' }
]);

const statusTypes = ref([
  { id: 1, name: 'Operational' },
  { id: 2, name: 'Under Maintenance' },
  { id: 3, name: 'Needs Repair' },
  { id: 4, name: 'Retired' }
]);

const assetForm = ref({
  id: '',
  name: '',
  categoryId: '',
  location: '',
  statusId: 1, // Default to operational
  acquisitionDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  description: ''
});

const saveAsset = async () => {
  submitting.value = true;
  formError.value = '';
  
  try {
    if (isEditing.value) {
      // Update existing asset
      await assetStore.updateAsset(assetId, assetForm.value);
      router.push(`/assets/${assetId}`);
    } else {
      // Create new asset with a generated ID
      const newId = 'A' + Math.floor(Math.random() * 10000).toString().padStart(3, '0');
      const newAsset = { ...assetForm.value, id: newId };
      await assetStore.createAsset(newAsset);
      router.push('/assets');
    }
  } catch (error) {
    formError.value = error.message || 'Failed to save asset. Please try again.';
    console.error('Error saving asset:', error);
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  if (isEditing.value) {
    // In a real app, this would be an API call
    // Using mock data for demonstration
    
    // Simulating an API delay
    setTimeout(() => {
      // Mock asset data based on ID
      const mockAsset = {
        id: assetId,
        name: assetId === 'A001' ? 'Forklift #F201' : 
              assetId === 'A002' ? 'Air Conditioner #103' : 
              assetId === 'A003' ? 'Company Car' : 
              'Asset ' + assetId,
        categoryId: assetId === 'A001' ? 1 : 
                  assetId === 'A002' ? 1 : 
                  assetId === 'A003' ? 3 : 
                  2,
        location: assetId === 'A001' ? 'Warehouse A' : 
                assetId === 'A002' ? 'Office Building' : 
                assetId === 'A003' ? 'Parking Lot' : 
                'Main Building',
        statusId: assetId === 'A002' ? 2 : 
                assetId === 'A005' ? 3 : 
                1,
        acquisitionDate: '2023-06-15',
        description: assetId === 'A001' ? 'Toyota forklift with 2-ton capacity' : 
                    assetId === 'A002' ? '12,000 BTU split-type air conditioner' : 
                    assetId === 'A003' ? 'Toyota Camry company car for executive use' : 
                    'Standard office equipment'
      };
      
      // Fill form with mock asset data
      assetForm.value = { ...mockAsset };
    }, 300);
  }
});
</script>
