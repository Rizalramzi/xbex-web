<template>  <Layout>
    <div class="">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">Assets</h1>
          <p class="mt-2 text-sm text-gray-700">A list of all assets in your organization, including their ID, name, location, and status.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center space-x-3">
          <FavoriteButton :show-tooltip="true" />
          <router-link to="/assets/new" class="btn btn-primary">
            Add Asset
          </router-link>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="mt-6 bg-gray-50 p-4 rounded-md">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              v-model="filters.categoryId"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="filters.statusId"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option v-for="status in statusTypes" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
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
                placeholder="Search assets..."
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
      
      <!-- Asset Table -->
      <div class="mt-6 flow-root">        <div v-if="loading" class="flex justify-center py-8">
          <p>Loading assets...</p>
        </div>
        <div v-else-if="filteredAssets.length === 0" class="bg-white p-6 text-center text-gray-500">
          No assets found matching your filters.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="asset in filteredAssets" :key="asset.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ asset.id }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ asset.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ getCategoryName(asset.categoryId) }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ asset.location }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
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
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <router-link :to="`/assets/${asset.id}`" class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View<span class="sr-only">, {{ asset.name }}</span>
                  </router-link>
                  <router-link :to="`/assets/${asset.id}/edit`" class="text-indigo-600 hover:text-indigo-900">
                    Edit<span class="sr-only">, {{ asset.name }}</span>
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
import Layout from '../../components/Layout.vue';
import FavoriteButton from '../../components/FavoriteButton.vue';
import { useAssetStore } from '../../stores/assetStore';
import assetService from '../../services/assetService';

const assetStore = useAssetStore();
const loading = ref(false);

const filters = ref({
  categoryId: '',
  statusId: '',
  search: ''
});

const categories = ref([]);
const statusTypes = ref([]);

const filteredAssets = computed(() => {
  let result = assetStore.assets;
  
  if (filters.value.categoryId) {
    result = result.filter(asset => asset.categoryId === parseInt(filters.value.categoryId));
  }
  
  if (filters.value.statusId) {
    result = result.filter(asset => asset.statusId === parseInt(filters.value.statusId));
  }
  
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(asset => 
      asset.name.toLowerCase().includes(searchTerm) || 
      asset.location.toLowerCase().includes(searchTerm) ||
      asset.id.toString().includes(searchTerm) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm)
    );
  }
  
  return result;
});

const resetFilters = () => {
  filters.value = {
    categoryId: '',
    statusId: '',
    search: ''
  };
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};

const getStatusName = (statusId) => {
  const status = statusTypes.value.find(s => s.id === statusId);
  return status ? status.name : 'Unknown';
};

const loadAssets = async () => {
  try {
    loading.value = true;
    const response = await assetService.getAssets();
    assetStore.assets = response.data;
  } catch (error) {
    console.error('Error loading assets:', error);
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const response = await assetService.getAssetCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

const loadStatusTypes = async () => {
  try {
    const response = await assetService.getAssetStatusTypes();
    statusTypes.value = response.data;
  } catch (error) {
    console.error('Error loading status types:', error);
  }
};

onMounted(async () => {
  await Promise.all([
    loadAssets(),
    loadCategories(),
    loadStatusTypes()
  ]);
});
</script>
