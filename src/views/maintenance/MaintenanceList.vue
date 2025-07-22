<template>
  <Layout>
    <div>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">Maintenance Records</h1>
          <p class="mt-2 text-sm text-gray-700">A list of all maintenance records, including scheduled and completed maintenance activities.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center space-x-3">
          <FavoriteButton :show-tooltip="true" />
          <router-link to="/maintenance/new" class="btn btn-primary">
            Schedule Maintenance
          </router-link>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="mt-6 bg-gray-50 p-4 rounded-md">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              v-model="filters.type"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option v-for="type in maintenanceTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                v-model="filters.search"
                class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Search assets or technicians..."
              />
            </div>
          </div>
          
          <div class="flex items-end">
            <button @click="resetFilters" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      <!-- Maintenance Table -->
      <div class="mt-6 flow-root">
        <div v-if="loading" class="flex justify-center py-8">
          <p>Loading maintenance records...</p>
        </div>
        <div v-else-if="filteredMaintenanceRecords.length === 0" class="bg-white p-6 text-center text-gray-500">
          No maintenance records found matching your filters.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Asset</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Performed By</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="record in filteredMaintenanceRecords" :key="record.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ record.id }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ record.assetName }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ getMaintenanceTypeName(record.typeId) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(record.date) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ record.performedBy || 'Not assigned' }}</td>
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
                  <router-link :to="`/maintenance/${record.id}`" class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View<span class="sr-only">, Maintenance #{{ record.id }}</span>
                  </router-link>
                  <router-link :to="`/maintenance/${record.id}/edit`" class="text-indigo-600 hover:text-indigo-900">
                    Edit<span class="sr-only">, Maintenance #{{ record.id }}</span>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import FavoriteButton from '../../components/FavoriteButton.vue';
import { useMaintenanceStore } from '../../stores/maintenanceStore';

const maintenanceStore = useMaintenanceStore();
const loading = computed(() => maintenanceStore.loading);

const filters = ref({
  type: '',
  status: '',
  search: ''
});

// Mock data for maintenance types
const maintenanceTypes = ref([
  { id: 1, name: 'Preventive' },
  { id: 2, name: 'Corrective' },
  { id: 3, name: 'Predictive' },
  { id: 4, name: 'Inspection' }
]);

const filteredMaintenanceRecords = computed(() => {
  let result = maintenanceStore.maintenanceRecords;
  
  if (filters.value.type) {
    result = result.filter(record => record.typeId === parseInt(filters.value.type));
  }
  
  if (filters.value.status) {
    result = result.filter(record => record.status === filters.value.status);
  }
  
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(record => 
      record.assetName.toLowerCase().includes(searchTerm) || 
      (record.performedBy && record.performedBy.toLowerCase().includes(searchTerm)) ||
      record.id.toString().includes(searchTerm)
    );
  }
  
  return result;
});

const resetFilters = () => {
  filters.value = {
    type: '',
    status: '',
    search: ''
  };
};

const getMaintenanceTypeName = (typeId) => {
  const type = maintenanceTypes.value.find(t => t.id === typeId);
  return type ? type.name : 'Unknown';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
  // In a real app, this would be an API call
  await maintenanceStore.fetchMaintenanceRecords();
  
  // Mock data for maintenance types
  await maintenanceStore.fetchMaintenanceTypes();
  
  // Mock data for demonstration
  maintenanceStore.maintenanceRecords = [
    { 
      id: 1, 
      assetId: 'A001', 
      assetName: 'Forklift #F201', 
      typeId: 1, 
      date: '2025-05-20', 
      performedBy: 'John Smith', 
      status: 'completed',
      notes: 'Regular quarterly maintenance. Replaced oil filter and hydraulic fluid.'
    },
    { 
      id: 2, 
      assetId: 'A002', 
      assetName: 'Air Conditioner #103', 
      typeId: 1, 
      date: '2025-06-05', 
      performedBy: 'HVAC Specialist', 
      status: 'completed',
      notes: 'Cleaned filters and checked refrigerant levels. System working normally.'
    },
    { 
      id: 3, 
      assetId: 'A003', 
      assetName: 'Company Car', 
      typeId: 1, 
      date: '2025-06-10', 
      performedBy: 'Auto Service Center', 
      status: 'completed',
      notes: 'Oil change and general inspection. Tire pressure adjusted.'
    },
    { 
      id: 4, 
      assetId: 'A002', 
      assetName: 'Air Conditioner #103', 
      typeId: 2, 
      date: '2025-06-25', 
      performedBy: 'Maintenance Team', 
      status: 'scheduled',
      notes: 'Scheduled repair for compressor issues.'
    },
    { 
      id: 5, 
      assetId: 'A005', 
      assetName: 'Generator #G501', 
      typeId: 3, 
      date: '2025-06-25', 
      performedBy: 'Technical Team', 
      status: 'scheduled',
      notes: 'Scheduled inspection for potential issues detected during monitoring.'
    },
    { 
      id: 6, 
      assetId: 'A004', 
      assetName: 'Server Rack', 
      typeId: 4, 
      date: '2025-05-15', 
      performedBy: 'IT Department', 
      status: 'completed',
      notes: 'Monthly inspection of server hardware. All systems normal.'
    },
    { 
      id: 7, 
      assetId: 'A006', 
      assetName: 'HVAC System', 
      typeId: 1, 
      date: '2025-06-10', 
      performedBy: null, 
      status: 'overdue',
      notes: 'Quarterly maintenance check.'
    }
  ];
});
</script>
