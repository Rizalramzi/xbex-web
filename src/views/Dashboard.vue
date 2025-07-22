<template>
  <Layout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-primary">{{ dashboardTitle }}</h1>
          <p class="mt-1 text-muted">{{ dashboardSubtitle }}</p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <FavoriteButton :show-tooltip="true" />
        </div>
      </div>

      <!-- Site Manager Dashboard -->
      <SiteManager v-if="currentDashboard === 'site-manager'" />

      <!-- Warehouse Manager Dashboard -->
      <WarehouseManager v-if="currentDashboard === 'warehouse-manager'" />

      <!-- Maintenance Engineer Dashboard -->
      <MaintenanceEngineer v-if="currentDashboard === 'maintenance-engineer'" />

      <!-- Dashboard Layout Selector -->
      <div class="mt-8 p-6 bg-warning-light rounded-lg border border-warning">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <MdiIcon :path="mdiExclamation" :size="20" class="text-warning-color" />
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-warning-color">Test Mode</h3>
            <div class="mt-2 text-sm text-warning-color">
              <p>This dashboard layout selector is for testing purposes only. In production, the dashboard layout will automatically adapt based on the logged-in user's role.</p>
            </div>
            <div class="mt-4">
              <div class="flex flex-wrap gap-3">
                <button 
                  v-for="dashboard in dashboardTypes" 
                  :key="dashboard.key"
                  @click="currentDashboard = dashboard.key"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    currentDashboard === dashboard.key 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-primary border border-primary hover:bg-primary-light'
                  ]"
                >
                  {{ dashboard.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import MdiIcon from '../components/MdiIcon.vue'
import SiteManager from './dashboard/SiteManager.vue'
import WarehouseManager from './dashboard/WarehouseManager.vue'
import MaintenanceEngineer from './dashboard/MaintenanceEngineer.vue'
import { useAssetStore } from '../stores/assetStore'
import { useMaintenanceStore } from '../stores/maintenanceStore'
import { useWorkOrderStore } from '../stores/workOrderStore'
import { useItemStore } from '../stores/itemStore'
import { useTaskStore } from '../stores/taskStore'

// Import MDI icons
import { 
  mdiFactory,
  mdiAccountGroup,
  mdiTruck,
  mdiClock,
  mdiExclamation,
  mdiPackageVariant,
  mdiCheck,
  mdiAlertCircle
} from '@mdi/js'

// Current dashboard type
const currentDashboard = ref('site-manager')

// Dashboard types configuration
const dashboardTypes = [
  { key: 'site-manager', label: 'Site Manager' },
  { key: 'warehouse-manager', label: 'Warehouse Manager' },
  { key: 'maintenance-engineer', label: 'Maintenance Engineer' }
]

// Dashboard titles and subtitles
const dashboardConfig = {
  'site-manager': {
    title: 'Site Manager Dashboard',
    subtitle: 'Monitor work orders, maintenance execution, and item availability.'
  },
  'warehouse-manager': {
    title: 'Warehouse Manager Dashboard',
    subtitle: 'Manage inventory, track deliveries, and monitor stock levels.'
  },
  'maintenance-engineer': {
    title: 'Maintenance Engineer Dashboard',
    subtitle: 'Track asset maintenance, schedules, and equipment health.'
  }
}

// Computed dashboard title and subtitle
const dashboardTitle = computed(() => dashboardConfig[currentDashboard.value]?.title || 'Dashboard')
const dashboardSubtitle = computed(() => dashboardConfig[currentDashboard.value]?.subtitle || 'Welcome back!')

// Store instances (still needed for data loading)
const assetStore = useAssetStore()
const maintenanceStore = useMaintenanceStore()
const workOrderStore = useWorkOrderStore()
const itemStore = useItemStore()
const taskStore = useTaskStore()

onMounted(() => {
  // Load initial data
  assetStore.fetchAssets()
  maintenanceStore.fetchMaintenanceRecords()
  workOrderStore.fetchWorkOrders()
  itemStore.fetchItems()
  taskStore.fetchTasks()
})
</script>
