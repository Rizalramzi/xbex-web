<template>
  <Layout>
    <div v-if="loading" class="p-6 text-center">
      <p>Loading asset details...</p>
    </div>
    <div v-else-if="!asset" class="p-6 text-center">
      <p>Asset not found.</p>
      <router-link to="/assets" class="text-indigo-600 hover:text-indigo-900">
        Back to assets
      </router-link>
    </div>
    <div v-else class="overflow-hidden">
      <div class="px-4 py-5 sm:px-6 flex justify-between">
        <div>
          <h3 class="text-2xl font-bold leading-6 text-gray-900">{{ asset.name }}</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Asset details and maintenance history.</p>
        </div>
        <div class="flex space-x-3">
          <router-link :to="`/maintenance/new?assetId=${asset.id}`" class="btn btn-primary">
            Schedule Maintenance
          </router-link>
          <router-link :to="`/assets/${asset.id}/edit`" class="btn btn-secondary">
            Edit Asset
          </router-link>
        </div>
      </div>
      
      <!-- Asset Details -->
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Asset ID</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ asset.id }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Category</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ getCategoryName(asset.categoryId) }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Location</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ asset.location }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <span 
                :class="{
                  'bg-green-100 text-green-800': asset.statusId === 1,
                  'bg-yellow-100 text-yellow-800': asset.statusId === 2,
                  'bg-red-100 text-red-800': asset.statusId === 3,
                  'bg-gray-100 text-gray-800': asset.statusId === 4
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ getStatusName(asset.statusId) }}
              </span>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Acquisition Date</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ formatDate(asset.acquisitionDate) }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Last Maintenance</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ asset.lastMaintenance ? formatDate(asset.lastMaintenance) : 'No maintenance recorded' }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ asset.description || 'No description provided' }}</dd>
          </div>
        </dl>
      </div>
      
      <!-- Maintenance History -->
      <div class="px-4 py-5 sm:px-6 mt-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Maintenance History</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Performed By</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="maintenanceHistory.length === 0">
              <td colspan="5" class="py-4 px-4 text-center text-sm text-gray-500">
                No maintenance records found for this asset.
              </td>
            </tr>
            <tr v-for="record in maintenanceHistory" :key="record.id">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ formatDate(record.date) }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ record.type }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ record.performedBy }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': record.status === 'completed',
                    'bg-yellow-100 text-yellow-800': record.status === 'scheduled',
                    'bg-red-100 text-red-800': record.status === 'overdue'
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ record.status }}
                </span>
              </td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <router-link :to="`/maintenance/${record.id}`" class="text-indigo-600 hover:text-indigo-900">
                  View<span class="sr-only">, Maintenance #{{ record.id }}</span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useAssetStore } from '../../stores/assetStore';
import { useMaintenanceStore } from '../../stores/maintenanceStore';

const route = useRoute();
const assetStore = useAssetStore();
const maintenanceStore = useMaintenanceStore();
const assetId = route.params.id;

const loading = ref(true);
const maintenanceHistory = ref([]);

// Mock data for categories and status types (in a real app, these would come from the store)
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

const asset = computed(() => assetStore.currentAsset);

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};

const getStatusName = (statusId) => {
  const status = statusTypes.value.find(s => s.id === statusId);
  return status ? status.name : 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    // In a real app, this would be an API call
    // Using mock data for demonstration
    
    // Simulating an API delay
    setTimeout(async () => {
      // Mock asset data
      assetStore.currentAsset = {
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
        lastMaintenance: assetId === 'A001' ? '2025-05-20' : 
                        assetId === 'A002' ? '2025-06-05' : 
                        null,
        description: assetId === 'A001' ? 'Toyota forklift with 2-ton capacity' : 
                    assetId === 'A002' ? '12,000 BTU split-type air conditioner' : 
                    assetId === 'A003' ? 'Toyota Camry company car for executive use' : 
                    'Standard office equipment'
      };
      
      // Mock maintenance history
      if (assetId === 'A001') {
        maintenanceHistory.value = [
          { id: 101, date: '2025-05-20', type: 'Preventive', performedBy: 'John Smith', status: 'completed' },
          { id: 102, date: '2025-03-10', type: 'Repair', performedBy: 'Technical Team', status: 'completed' },
          { id: 103, date: '2025-01-15', type: 'Inspection', performedBy: 'Quality Control', status: 'completed' }
        ];
      } else if (assetId === 'A002') {
        maintenanceHistory.value = [
          { id: 201, date: '2025-06-05', type: 'Preventive', performedBy: 'HVAC Specialist', status: 'completed' },
          { id: 202, date: '2025-06-25', type: 'Repair', performedBy: 'Maintenance Team', status: 'scheduled' }
        ];
      } else {
        maintenanceHistory.value = [];
      }
      
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error(`Error fetching asset ${assetId}:`, error);
    loading.value = false;
  }
});
</script>
