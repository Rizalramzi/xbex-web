<template>  <Layout>
    <div class="">
      <div class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-2xl font-semibold leading-6 text-gray-900">
          {{ isEditing ? 'Edit Maintenance Record' : 'Schedule New Maintenance' }}
        </h3>        <div class="mt-3 sm:mt-0 sm:ml-4">
          <router-link to="/maintenance" class="btn btn-secondary cursor-pointer">
            Cancel
          </router-link>
        </div>
      </div>
      
      <form @submit.prevent="saveMaintenance" class="mt-6 space-y-6">
        <!-- Asset Selection -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="asset" class="block text-sm font-medium text-gray-700">Asset</label>
            <div class="mt-1">              <select
                id="asset"
                v-model="maintenanceForm.assetId"
                required
                :disabled="assetPreselected"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
              >
                <option disabled value="">Select Asset</option>
                <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                  {{ asset.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="type" class="block text-sm font-medium text-gray-700">Maintenance Type</label>
            <div class="mt-1">              <select
                id="type"
                v-model="maintenanceForm.typeId"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
              >
                <option disabled value="">Select Type</option>
                <option v-for="type in maintenanceTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Date and Status -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
            <div class="mt-1">              <input 
                type="date"
                id="date"
                v-model="maintenanceForm.date"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <div class="mt-1">              <select
                id="status"
                v-model="maintenanceForm.status"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
              >
                <option disabled value="">Select Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Performed By -->
        <div>
          <label for="performed-by" class="block text-sm font-medium text-gray-700">Performed By</label>
          <div class="mt-1">
            <input 
              type="text"
              id="performed-by"
              v-model="maintenanceForm.performedBy"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Name of mining technician, mechanic, or maintenance crew"
            />
          </div>
        </div>
        
        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <div class="mt-1">
            <textarea
              id="notes"
              v-model="maintenanceForm.notes"
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Mining equipment maintenance details, component replacements, operating conditions, issues found, repairs completed, etc."
            ></textarea>
          </div>
        </div>
        
        <!-- Form Errors -->
        <div v-if="formError" class="text-sm text-red-600">
          {{ formError }}
        </div>
        
        <!-- Form Actions -->        <div class="flex justify-end space-x-3">
          <router-link 
            :to="isEditing ? `/maintenance/${maintenanceId}` : '/maintenance'" 
            class="btn btn-secondary cursor-pointer"
          >
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary cursor-pointer"
            :disabled="submitting"
          >
            {{ submitting ? 'Saving...' : 'Save Maintenance Record' }}
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useMaintenanceStore } from '../../stores/maintenanceStore';
import { useAssetStore } from '../../stores/assetStore';

const route = useRoute();
const router = useRouter();
const maintenanceStore = useMaintenanceStore();
const assetStore = useAssetStore();

const maintenanceId = route.params.id ? parseInt(route.params.id) : null;
const isEditing = computed(() => !!maintenanceId);
const submitting = ref(false);
const formError = ref('');

// Check if an asset was preselected (from asset detail page)
const assetPreselected = computed(() => !!route.query.assetId);

// Mock data for assets - Mining equipment
const assets = ref([
  { id: 'A001', name: 'Excavator CAT 336' },
  { id: 'A002', name: 'Mining Dump Truck Komatsu HD785' },
  { id: 'A003', name: 'Bulldozer CAT D8T' },
  { id: 'A004', name: 'Water Truck Volvo FM460' },
  { id: 'A005', name: 'Generator CAT 3512C' },
  { id: 'A006', name: 'Wheel Loader CAT 980M' },
  { id: 'A007', name: 'Mobile Crusher Sandvik QJ341' },
  { id: 'A008', name: 'Coal Hauler Belaz 75710' },
  { id: 'A009', name: 'Drilling Rig Atlas Copco DM45' },
  { id: 'A010', name: 'Grader CAT 16M3' }
]);

// Mock data for maintenance types - Mining specific
const maintenanceTypes = ref([
  { id: 1, name: 'Preventive - Engine Service' },
  { id: 2, name: 'Preventive - Hydraulic System' },
  { id: 3, name: 'Preventive - Track/Tire Inspection' },
  { id: 4, name: 'Corrective - Component Replacement' },
  { id: 5, name: 'Corrective - Breakdown Repair' },
  { id: 6, name: 'Overhaul - Major Component' },
  { id: 7, name: 'Safety Inspection' },
  { id: 8, name: 'Lubrication Service' }
]);

const maintenanceForm = ref({
  assetId: route.query.assetId || '',
  assetName: '',
  typeId: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  status: 'scheduled', // Default to scheduled
  performedBy: '',
  notes: ''
});

// Update assetName when assetId changes
const updateAssetName = () => {
  if (maintenanceForm.value.assetId) {
    const selectedAsset = assets.value.find(a => a.id === maintenanceForm.value.assetId);
    if (selectedAsset) {
      maintenanceForm.value.assetName = selectedAsset.name;
    }
  } else {
    maintenanceForm.value.assetName = '';
  }
};

// Watch for changes to assetId
const watchAssetId = () => {
  updateAssetName();
};

const saveMaintenance = async () => {
  submitting.value = true;
  formError.value = '';
  
  // Update the asset name before saving
  updateAssetName();
  
  try {
    if (isEditing.value) {
      // Update existing maintenance record
      await maintenanceStore.updateMaintenance(maintenanceId, maintenanceForm.value);
      router.push(`/maintenance/${maintenanceId}`);
    } else {
      // Create new maintenance record with a generated ID
      const newId = maintenanceStore.maintenanceRecords.length + 1;
      const newMaintenance = { ...maintenanceForm.value, id: newId };
      await maintenanceStore.createMaintenance(newMaintenance);
      router.push('/maintenance');
    }
  } catch (error) {
    formError.value = error.message || 'Failed to save maintenance record. Please try again.';
    console.error('Error saving maintenance record:', error);
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  // Initialize with asset name if assetId is provided
  watchAssetId();
  
  if (isEditing.value) {
    // In a real app, this would be an API call
    // Using mock data for demonstration
    
    // Simulating an API delay
    setTimeout(() => {
      // Find the record in the existing maintenance records or fetch it
      let record = maintenanceStore.getMaintenanceById(maintenanceId);
      
      if (!record) {
        // Mock data for the requested maintenance record        if (maintenanceId === 1) {
          record = { 
            id: 1, 
            assetId: 'A001', 
            assetName: 'Excavator CAT 336', 
            typeId: 1, 
            date: '2025-05-20', 
            performedBy: 'Mining Maintenance Crew - Team A', 
            status: 'completed',
            notes: 'Quarterly preventive maintenance completed. Engine oil and filter replaced, hydraulic fluid checked and topped up, tracks inspected for wear, greasing of all pivot points completed. Equipment operational and ready for next shift.'
          };
        } else if (maintenanceId === 2) {
          record = { 
            id: 2, 
            assetId: 'A002', 
            assetName: 'Mining Dump Truck Komatsu HD785', 
            typeId: 3, 
            date: '2025-06-05', 
            performedBy: 'Heavy Equipment Specialist', 
            status: 'completed',
            notes: 'Tire inspection and rotation completed. All 6 tires checked for cuts, wear patterns, and proper inflation. Brake system inspection performed. Suspension components lubricated.'
          };
        } else if (maintenanceId === 4) {
          record = { 
            id: 4, 
            assetId: 'A005', 
            assetName: 'Generator CAT 3512C', 
            typeId: 5, 
            date: '2025-06-25', 
            performedBy: 'Power Systems Technician', 
            status: 'scheduled',
            notes: 'Scheduled corrective maintenance for generator cooling system leak. Radiator inspection and possible hose replacement required.'          };
        }
      
      if (record) {
        // Fill form with maintenance record data
        maintenanceForm.value = { ...record };
        
        // Convert date string to YYYY-MM-DD format if needed
        if (maintenanceForm.value.date) {
          const date = new Date(maintenanceForm.value.date);
          maintenanceForm.value.date = date.toISOString().split('T')[0];
        }
      }
    }, 300);
  }
});
</script>
