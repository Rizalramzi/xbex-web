<template>
  <Layout>
    <div v-if="loading" class="p-6 text-center">
      <p>Loading maintenance details...</p>
    </div>
    <div v-else-if="!maintenance" class="p-6 text-center">
      <p>Maintenance record not found.</p>
      <router-link to="/maintenance" class="text-indigo-600 hover:text-indigo-900">
        Back to maintenance records
      </router-link>
    </div>
    <div v-else class="overflow-hidden">
      <div class="px-4 py-5 sm:px-6 flex justify-between">
        <div>
          <h3 class="text-2xl font-bold leading-6 text-gray-900">Maintenance Record #{{ maintenance.id }}</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Maintenance details for {{ maintenance.assetName }}</p>
        </div>
        <div class="flex space-x-3">
          <router-link :to="`/maintenance/${maintenance.id}/edit`" class="btn btn-secondary">
            Edit Record
          </router-link>
          <button 
            @click="confirmDelete" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
      
      <!-- Maintenance Details -->
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Asset</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <router-link :to="`/assets/${maintenance.assetId}`" class="text-indigo-600 hover:text-indigo-900">
                {{ maintenance.assetName }}
              </router-link>
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Type</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ getMaintenanceTypeName(maintenance.typeId) }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Date</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ formatDate(maintenance.date) }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <span 
                :class="{
                  'bg-green-100 text-green-800': maintenance.status === 'completed',
                  'bg-yellow-100 text-yellow-800': maintenance.status === 'scheduled',
                  'bg-red-100 text-red-800': maintenance.status === 'overdue'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ maintenance.status }}
              </span>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Performed By</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ maintenance.performedBy || 'Not assigned' }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Notes</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ maintenance.notes || 'No notes provided' }}</dd>
          </div>
        </dl>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
          <p class="mt-2 text-sm text-gray-500">
            Are you sure you want to delete this maintenance record? This action cannot be undone.
          </p>
          <div class="mt-4 flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              @click="deleteMaintenance" 
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useMaintenanceStore } from '../../stores/maintenanceStore';

const route = useRoute();
const router = useRouter();
const maintenanceStore = useMaintenanceStore();
const maintenanceId = parseInt(route.params.id);

const loading = ref(true);
const showDeleteModal = ref(false);
const deleting = ref(false);

// Mock data for maintenance types
const maintenanceTypes = ref([
  { id: 1, name: 'Preventive' },
  { id: 2, name: 'Corrective' },
  { id: 3, name: 'Predictive' },
  { id: 4, name: 'Inspection' }
]);

const maintenance = computed(() => maintenanceStore.currentMaintenance);

const getMaintenanceTypeName = (typeId) => {
  const type = maintenanceTypes.value.find(t => t.id === typeId);
  return type ? type.name : 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteMaintenance = async () => {
  deleting.value = true;
  try {
    const success = await maintenanceStore.deleteMaintenance(maintenanceId);
    if (success) {
      router.push('/maintenance');
    } else {
      // Handle error
      showDeleteModal.value = false;
      alert('Failed to delete maintenance record. Please try again.');
    }
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    alert('An error occurred while deleting the maintenance record.');
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  try {
    // In a real app, this would be an API call
    // Using mock data for demonstration
    
    // Simulating an API delay
    setTimeout(async () => {
      // Find the record in the existing maintenance records or fetch it
      let record = maintenanceStore.getMaintenanceById(maintenanceId);
      
      if (!record) {
        // Mock data for the requested maintenance record
        if (maintenanceId === 1) {
          record = { 
            id: 1, 
            assetId: 'A001', 
            assetName: 'Forklift #F201', 
            typeId: 1, 
            date: '2025-05-20', 
            performedBy: 'John Smith', 
            status: 'completed',
            notes: 'Regular quarterly maintenance. Replaced oil filter and hydraulic fluid.'
          };
        } else if (maintenanceId === 2) {
          record = { 
            id: 2, 
            assetId: 'A002', 
            assetName: 'Air Conditioner #103', 
            typeId: 1, 
            date: '2025-06-05', 
            performedBy: 'HVAC Specialist', 
            status: 'completed',
            notes: 'Cleaned filters and checked refrigerant levels. System working normally.'
          };
        } else if (maintenanceId === 4) {
          record = { 
            id: 4, 
            assetId: 'A002', 
            assetName: 'Air Conditioner #103', 
            typeId: 2, 
            date: '2025-06-25', 
            performedBy: 'Maintenance Team', 
            status: 'scheduled',
            notes: 'Scheduled repair for compressor issues.'
          };
        }
      }
      
      maintenanceStore.currentMaintenance = record;
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error(`Error fetching maintenance ${maintenanceId}:`, error);
    loading.value = false;
  }
});
</script>
