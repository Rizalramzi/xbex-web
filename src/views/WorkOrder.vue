<template>
  <Layout>
    <template #content>
      <div class="flex flex-col h-full">
        <!-- Page Header -->
        <div class="w-full container__section">
          
          <div class="container__header__main">
            <span class="title__main">Work Orders</span>
            <p class="desc__main">Track and manage all maintenance work orders.</p>
          </div>
  
          <div class="flex flex-row items-center gap-[20px]">
            <button class="btn__primary">+ New Work Order</button>
            <div class="background__icon">
              <img src="/icons/unlove.svg" alt="Unlove Icon" class="w-auto h-[19px] object-center object-cover shrink-0" :show-tooltip="true">
            </div>
          </div>
        </div>
  
        <!-- Table Bar -->
        <div class="w-full container__section mt-[40px]">
          <div v-if="!showAdvanceSearch" class="flex flex-row items-center gap-[10px]">
            <div class="search" >
              <img src="/icons/search.svg" alt="Search Icon" class="w-[20px] h-auto object-center object-cover shrink-0">
              <input v-model="searchQuery" type="text" name="" id="" class="w-full h-full outline-none" placeholder="Search Work Order">
            </div>
    
            <button @click="refreshData" :disabled="loading" class="background__icon">
              <img src="/icons/repeat.svg" alt="Repeat Icon" class="w-[16px] h-[16px] object-center object-cover shrink-0">
            </button>
            
            <button @click="printData" class="background__icon">
              <img src="/icons/print.svg" alt="Print Icon" class="w-[16px] h-[16px] object-center object-cover shrink-0">
            </button>
          </div>
  
          <button @click="showAdvanceSearch = true" class="bg-gray-100 hover:bg-gray-300 cursor-pointer px-[30px] py-[20px] rounded-[50px] flex flex-row items-center justify-center gap-[20px]">
            <img src="/icons/filter.svg" alt="Filter Icon" class="w-[18px] h-[11px] object-center object-cover shrink-0">
            <span class="text-[14px]">Advanced Search</span>
            <img src="/icons/arrow.svg" alt="Arrow Icon" class="w-[10px] h-auto object-center object-cover shrink-0">
          </button>
        </div>
  
        <!-- Work Orders Table -->
        <div class="mt-[32px] flex-1 flex flex-col min-h-0">
          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-flex items-center">
              <div class="w-6 h-6 mr-3 border-b-2 rounded-full animate-spin border-petrosea-primary"></div>
              <span class="text-gray-600">Loading work orders...</span>
            </div>
          </div>
  
          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <div class="text-red-600">
              <MdiIcon :path="mdiAlertCircle" class="w-8 h-8 mx-auto mb-2" />
              <p class="font-medium">Error loading work orders</p>
              <p class="mt-1 text-sm">{{ error }}</p>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-else-if="filteredWorkOrders.length === 0" class="p-8 text-center">
            <MdiIcon :path="mdiClipboardTextOutline" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 class="mb-2 text-lg font-medium text-gray-900">No work orders found</h3>
            <p class="text-gray-600">{{ searchQuery || statusFilter || priorityFilter || typeFilter ? 'Try adjusting your filters' : 'Create your first work order to get started' }}</p>
          </div>
  
          <!-- Table Component -->
          <div v-else class="overflow-y-auto">
            <table class="w-full table-fixed">
              <thead class="sticky top-0 z-10 font-medium">
                <tr class="text-left text-[14px]">
                  <!-- Work ID -->
                  <th
                    @click="sortBy('id')"
                    class="max-w-[195px] bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'id' ? 'text-petrosea-primary font-medium' : ''" class="truncate">Work ID</span>
                      <div class="flex flex-col gap-0.5">
                        <img 
                          src="/icons/arrow.svg"
                          alt="Arrow Up"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'id' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'"
                        />
                        <img 
                          src="/icons/arrow.svg"
                          alt="Arrow Down"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'id' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'"
                        />
                      </div>
                    </div>
                  </th>
  
                  <!-- Work Details -->
                  <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Work Details</th>
  
                  <!-- Status -->
                  <th
                    @click="sortBy('status')"
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'status' ? 'text-petrosea-primary font-semibold' : ''">Status</span>
                      <div class="flex flex-col gap-0.5">
                        <img 
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'status' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'"
                        />
                        <img 
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'status' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'"
                        />
                      </div>
                    </div>
                  </th>
  
                  <!-- Progress -->
                  <th
                    @click="sortBy('progress')"
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'progress' ? 'text-petrosea-primary font-medium' : ''">Progress</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'progress' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'" />
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'progress' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'" />
                      </div>
                    </div>
                  </th>
  
                  <!-- Items -->
                  <th
                    @click="sortBy('items')"
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'items' ? 'text-petrosea-primary font-normal' : ''">Items</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'items' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'" />
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'items' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'" />
                      </div>
                    </div>
                  </th>
  
                  <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Assigned To</th>
                  <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Actions</th>
                </tr>
              </thead>
  
              <tbody v-for="workOrder in paginatedWorkOrders" :key="workOrder.id" class="">
                <tr><td colspan="7" class="h-6"></td></tr>
                <tr  class="text-left text-[14px]">
                  <!-- ID -->
                  <td class="container__data">{{ workOrder.id }}</td>
  
                  <!-- Work Details -->
                  <td>
                    <div class="flex flex-col gap-[10px]">
                      <div class="background__icon__content">
                        <img :src="getAssetIcon(workOrder.assetName)" alt="Asset Icon" class="w-auto h-[18px] object-center object-contain shrink-0" />
                      </div>
  
                      <div class="flex flex-col gap-[5px]">
                        <div class="flex justify-between">
                          <span class="text-[14px]">{{ workOrder.assetName.split(' ').slice(0, 2).join(' ') }}</span>
                          <p class="text-[14px]">{{ workOrder.assetId }}</p>
                        </div>
                        <p class="truncate label__secondary">{{ workOrder.title }}</p>
                      </div>
  
                      <div class="flex flex-wrap items-center gap-[10px]">
                        <div :class="getPriorityBadgeClass(workOrder.priority)">{{ workOrder.priority }}</div>
                        <div :class="getTypeBadgeClass(workOrder.type)">{{ getTypeLabel(workOrder.type) }}</div>
                      </div>
                    </div>
                  </td>
  
                  <!-- Status -->
                  <td class="container__data">
                    <div :class="getStatusBadgeClass(workOrder.status)">
                      {{ getStatusLabel(workOrder.status) }}
                    </div>
                  </td>
  
                  <!-- Progress -->
                  <td>
                    <div class="flex items-center justify-center">
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center">
                          <div class="w-32 bg-gray-200 rounded-full h-[15px] mr-2">
                            <div
                              :class="getCompletionBarClass(getWorkOrderCompletion(workOrder.id))"
                              class="h-[15px] rounded-full transition-all duration-300"
                              :style="{ width: getWorkOrderCompletion(workOrder.id) + '%' }"
                            ></div>
                          </div>
                          <span class="text-xs font-medium text-gray-900">
                            {{ getWorkOrderCompletion(workOrder.id) }}%
                          </span>
                        </div>
                        <span :class="getWorkOrderProgressStatus(workOrder).class" class="label__secondary">
                          {{ getWorkOrderProgressStatus(workOrder).label }}
                        </span>
                      </div>
                    </div>
                  </td>
  
                  <!-- Items -->
                  <td>
                    <div class="flex flex-col items-center">
                      <span :class="getItemStatusBadgeClass(getWorkOrderItemStatus(workOrder.id).status)" class="mb-1 inline-flex items-center text-[14px] font-semibold rounded-full ps-[20px] pe-[50px] py-[10px]">
                        <MdiIcon :path="getItemStatusIcon(getWorkOrderItemStatus(workOrder.id).status)" class="w-4 h-4 mr-1" />
                        {{ getItemStatusLabel(getWorkOrderItemStatus(workOrder.id).status) }}
                      </span>
                      <span class="text-[14px] text-gray-500 truncate" :title="getWorkOrderItemStatus(workOrder.id).message">
                        {{ getWorkOrderItemStatus(workOrder.id).message }}
                      </span>
                    </div>
                  </td>
  
                  <!-- Assigned To -->
                  <td>
                    <div class="flex flex-col items-center justify-center">
                      <div class="flex flex-col">
                        <span class="text-[14px] font-medium">{{ getAssignedTeamInfo(workOrder.assignedTo).mainPerson }}</span>
                        <span v-if="getAssignedTeamInfo(workOrder.assignedTo).otherCount > 0" class="text-xs text-gray-500">
                          +{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount }} other{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount > 1 ? 's' : '' }}
                        </span>
                      </div>
                    </div>
                  </td>
  
                  <!-- Actions -->
                  <td>
                    <div class="flex items-center justify-center">
                      <div class="flex justify-end items-center gap-2.5">
                        <button class="bg-gray-100 p-[15px] hover:bg-gray-300 rounded-[50px] cursor-pointer" :title="`View ${workOrder.id}`">
                          <MdiIcon :path="mdiEye" class="w-5 h-5" />
                        </button>
                        <button class="bg-gray-100 p-[15px] hover:bg-gray-300 rounded-[50px] cursor-pointer" :title="`Edit ${workOrder.id}`">
                          <MdiIcon :path="mdiPencil" class="w-5 h-5" />
                        </button>
                        <button class="bg-red-100 p-[15px] hover:bg-red-300 rounded-[50px] cursor-pointer text-red-800" :title="`Delete ${workOrder.id}`">
                          <MdiIcon :path="mdiDelete" class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <hr class="my-[32px] border-[#101828]/10">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
        </div>
      </div>
    </template>

    <template #pagination>
      <div v-if="filteredWorkOrders.length > 0" class="my-[20px]">
            <div class="flex items-center justify-between">
              <div class="flex flex-row items-center gap-[20px]">
                <p class="text-[14px] text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredWorkOrders.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredWorkOrders.length }}</span>
                  results
                </p>
                <label class="text-[14px]">Items per page:</label>
                <div class=" px-[30px] py-[20px] bg-white rounded-[50px] min-h-[61px] hover:bg-gray-300">
                  <select
                    v-model="itemsPerPage"
                    class="text-[14px] outline-none min-w-[50px]"
                  >
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </div>
              </div>
              
              <div class="flex items-center gap-1">
                <button
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                  class="pageButton"
                  title="First page"
                >
                  <img src="/icons/double-arrow.svg" alt="Double Arrow" class="w-auto h-[13px] object-center object-cover shrink-0 invert">
                </button>
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="pageButton"
                  title="Previous page"
                >
                  <img src="/icons/arrow.svg" alt="Arrow" class="w-auto h-[10px] object-center object-cover shrink-0 rotate-90">
                </button>
                <span class="pageButton">
                  {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="pageButton"
                  title="Next page"
                >
                  <img src="/icons/arrow.svg" alt="Arrow" class="w-auto h-[10px] object-center object-cover shrink-0 -rotate-90">
                </button>
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="pageButton"
                  title="Last page"
                >
                   <img src="/icons/double-arrow.svg" alt="Double Arrow" class="w-auto h-[13px] object-center object-cover shrink-0 invert rotate-180">
                </button>
              </div>
            </div>
          </div>
    </template>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import MdiIcon from '../components/MdiIcon.vue'
import { useWorkOrderStore } from '../stores/workOrderStore'
import { useTaskStore } from '../stores/taskStore'
import { useItemStore } from '../stores/itemStore'

// Import MDI icons
import { 
  mdiPlus,
  mdiEye,
  mdiPencil,
  mdiDelete,
  mdiAlertCircle,
  mdiClipboardTextOutline,
  mdiCheckCircle,
  mdiCloseCircle,
  mdiHelpCircle,
  mdiExcavator,
  mdiTruckFast,
  mdiHammerScrewdriver,
  mdiCog,
  mdiRoadVariant,
  mdiRoad,
  mdiForklift,
  mdiBulldozer
} from '@mdi/js'

const workOrderStore = useWorkOrderStore()
const taskStore = useTaskStore()
const itemStore = useItemStore()

// State
const searchQuery = ref('')
const showAdvanceSearch = ref(false)
const advanceSearch = ref({
  woId: '',
  status: '',
  priority: '',
  progress: ''
})

// Legacy filter states (for backward compatibility)
const statusFilter = ref('')
const priorityFilter = ref('')
const typeFilter = ref('')

// Sorting state - default to ID descending
const sortField = ref('id')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed - access store properties directly
const workOrders = computed(() => workOrderStore.workOrders)
const loading = computed(() => workOrderStore.loading)
const error = computed(() => workOrderStore.error)
const tasks = computed(() => taskStore.tasks)
const taskItems = computed(() => taskStore.taskItems)

// Calculate completion percentage for each work order
const getWorkOrderCompletion = (workOrderId) => {
  const workOrderTasks = tasks.value.filter(task => task.workOrderId === workOrderId)
  if (workOrderTasks.length === 0) return 0
  
  const totalProgress = workOrderTasks.reduce((sum, task) => sum + (task.progressPercentage || 0), 0)
  return Math.round(totalProgress / workOrderTasks.length)
}

// Calculate item status for each work order
const getWorkOrderItemStatus = (workOrderId) => {
  const workOrderTasks = tasks.value.filter(task => task.workOrderId === workOrderId)
  const taskIds = workOrderTasks.map(task => task.id)
  const relatedItems = taskItems.value.filter(item => taskIds.includes(item.taskId))
  
  if (relatedItems.length === 0) return { status: 'unknown', message: 'No items required' }
  
  const criticalItems = relatedItems.filter(item => 
    item.stockStatus === 'out-of-stock' || 
    item.availableQuantity < item.quantityRequired
  )
  
  const concerningItems = relatedItems.filter(item => 
    item.stockStatus === 'low-stock' || 
    (item.availableQuantity >= item.quantityRequired && 
     item.availableQuantity <= item.minimumStock * 1.5)
  )
  
  if (criticalItems.length > 0) {
    return { 
      status: 'critical', 
      message: `${criticalItems.length} item(s) unavailable`,
      count: criticalItems.length
    }
  }
  
  if (concerningItems.length > 0) {
    return { 
      status: 'concerning', 
      message: `${concerningItems.length} item(s) low stock`,
      count: concerningItems.length
    }
  }
  
  return { 
    status: 'ok', 
    message: 'All items available',
    count: relatedItems.length
  }
}

// Calculate progress status (on-track or delayed) for each work order
const getWorkOrderProgressStatus = (workOrder) => {
  const currentDate = new Date()
  const scheduledStart = new Date(workOrder.scheduledStartDate)
  const scheduledEnd = new Date(workOrder.scheduledEndDate)
  const completion = getWorkOrderCompletion(workOrder.id)
  
  // If work order is completed
  if (workOrder.status === 'completed') {
    if (workOrder.actualEndDate) {
      const actualEnd = new Date(workOrder.actualEndDate)
      return {
        status: actualEnd <= scheduledEnd ? 'completed-ontime' : 'completed-late',
        label: actualEnd <= scheduledEnd ? 'Completed On-Time' : 'Completed Late',
        class: actualEnd <= scheduledEnd ? 'text-green-600' : 'text-orange-600'
      }
    }
    return {
      status: 'completed',
      label: 'Completed',
      class: 'text-green-600'
    }
  }
  
  // If work order is scheduled (not started yet)
  if (workOrder.status === 'scheduled') {
    return {
      status: 'scheduled',
      label: 'Scheduled',
      class: 'text-blue-600'
    }
  }
  
  // If work order is pending
  if (workOrder.status === 'pending') {
    return {
      status: 'pending',
      label: 'Pending',
      class: 'text-yellow-600'
    }
  }
  
  // For in-progress work orders, calculate if on-track or delayed
  if (workOrder.status === 'in-progress') {
    const totalDuration = scheduledEnd - scheduledStart
    const elapsedTime = currentDate - scheduledStart
    const expectedProgress = Math.min((elapsedTime / totalDuration) * 100, 100)
    
    // If past scheduled end date
    if (currentDate > scheduledEnd) {
      return {
        status: 'overdue',
        label: 'Overdue',
        class: 'text-red-600'
      }
    }
    
    // Compare actual vs expected progress
    const progressDiff = completion - expectedProgress
    
    if (progressDiff >= 5) {
      return {
        status: 'ahead',
        label: 'Ahead of Schedule',
        class: 'text-green-600'
      }
    } else if (progressDiff <= -10) {
      return {
        status: 'delayed',
        label: 'Behind Schedule',
        class: 'text-red-600'
      }
    } else {
      return {
        status: 'ontrack',
        label: 'On Track',
        class: 'text-blue-600'
      }
    }
  }
  
  // Default case
  return {
    status: 'unknown',
    label: 'Unknown',
    class: 'text-gray-600'
  }
}

// Process assigned team to show main person + team count
const getAssignedTeamInfo = (assignedTo) => {
  // Define team compositions for different work order types
  const teamCompositions = {
    'Maintenance Team A': ['John Smith', 'Mike Johnson', 'David Chen'],
    'Emergency Response Team': ['Sarah Wilson', 'Kevin Lee', 'Lisa Garcia', 'Tom Anderson'],
    'Track Team B': ['Robert Brown', 'Emma Davis', 'James Miller'],
    'Service Team C': ['Maria Santos', 'Chris Taylor', 'Anna Rodriguez'],
    'Hydraulics Specialist': ['Alex Thompson'],
    'Drilling Team A': ['Michael Torres', 'Sarah Johnson', 'Robert Chen'],
    'Compaction Team': ['Emma Davis', 'James Wilson'],
    'Hydraulic Team B': ['Kevin Lee', 'Mike Johnson'],
    'Engine Specialist Team': ['David Chen', 'Tom Anderson', 'Chris Taylor'],
    'Tire and Brake Team': ['Anna Rodriguez', 'John Smith', 'Lisa Garcia'],
    'Crushing Plant Team': ['Michael Torres', 'Sarah Wilson', 'Robert Brown'],
    'Belt Maintenance Team': ['Maria Santos', 'Alex Thompson'],
    'Power Systems Team': ['Chris Taylor', 'David Chen', 'Kevin Lee']
  }
  
  const team = teamCompositions[assignedTo] || [assignedTo]
  const mainPerson = team[0]
  const otherCount = team.length - 1
  
  return {
    mainPerson,
    otherCount,
    fullTeam: team
  }
}

// Filtered work orders
const filteredWorkOrders = computed(() => {
  let filtered = workOrders.value

  if (showAdvanceSearch.value) {
    // Advanced search mode
    
    // WO ID filter
    if (advanceSearch.value.woId) {
      const query = advanceSearch.value.woId.toLowerCase()
      filtered = filtered.filter(wo => wo.id.toLowerCase().includes(query))
    }

    // Status filter
    if (advanceSearch.value.status) {
      filtered = filtered.filter(wo => wo.status === advanceSearch.value.status)
    }

    // Priority filter
    if (advanceSearch.value.priority) {
      filtered = filtered.filter(wo => wo.priority === advanceSearch.value.priority)
    }

    // Progress filter
    if (advanceSearch.value.progress) {
      const [min, max] = advanceSearch.value.progress.split('-').map(Number)
      filtered = filtered.filter(wo => {
        const progress = getWorkOrderCompletion(wo.id)
        return progress >= min && progress <= max
      })
    }
  } else {
    // Simple search mode
    
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(wo => 
        wo.id.toLowerCase().includes(query) ||
        wo.title.toLowerCase().includes(query) ||
        wo.assetName.toLowerCase().includes(query) ||
        wo.assignedTo.toLowerCase().includes(query) ||
        wo.description.toLowerCase().includes(query)
      )
    }

    // Legacy filters (for backward compatibility)
    if (statusFilter.value) {
      filtered = filtered.filter(wo => wo.status === statusFilter.value)
    }

    if (priorityFilter.value) {
      filtered = filtered.filter(wo => wo.priority === priorityFilter.value)
    }

    if (typeFilter.value) {
      filtered = filtered.filter(wo => wo.type === typeFilter.value)
    }
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal, bVal

    switch (sortField.value) {
      case 'id':
        aVal = a.id
        bVal = b.id
        break
      case 'status':
        aVal = a.status
        bVal = b.status
        break
      case 'progress':
        aVal = getWorkOrderCompletion(a.id)
        bVal = getWorkOrderCompletion(b.id)
        break
      case 'items':
        aVal = getWorkOrderItemStatus(a.id).status
        bVal = getWorkOrderItemStatus(b.id).status
        // Custom order for item status: critical > concerning > ok > unknown
        const statusOrder = { 'critical': 0, 'concerning': 1, 'ok': 2, 'unknown': 3 }
        aVal = statusOrder[aVal] ?? 3
        bVal = statusOrder[bVal] ?? 3
        break
      default:
        aVal = a[sortField.value]
        bVal = b[sortField.value]
    }

    // Handle date sorting
    if (sortField.value.includes('Date') && aVal && bVal) {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

// Paginated work orders
const totalPages = computed(() => Math.ceil(filteredWorkOrders.value.length / itemsPerPage.value))

const paginatedWorkOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredWorkOrders.value.slice(start, end)
})

// Methods
const sortBy = (field) => {
  // Only allow sorting on specific fields
  const sortableFields = ['id', 'status', 'progress', 'items']
  if (!sortableFields.includes(field)) return

  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const refreshData = async () => {
  await Promise.all([
    workOrderStore.fetchWorkOrders(),
    taskStore.fetchTasks(),
    itemStore.fetchItems()
  ])
}

const printData = () => {
  // Create a printable version of the current filtered data
  const printContent = `
    <html>
      <head>
        <title>Work Orders Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #0066cc; margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .completed { background-color: #d4edda; color: #155724; }
          .in-progress { background-color: #cce6ff; color: #004085; }
          .scheduled { background-color: #fff3cd; color: #856404; }
          .pending { background-color: #ffeaa7; color: #d63031; }
          .priority-critical { background-color: #f8d7da; color: #721c24; }
          .priority-high { background-color: #ffeaa7; color: #856404; }
          .priority-medium { background-color: #fff3cd; color: #856404; }
          .priority-low { background-color: #d4edda; color: #155724; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Work Orders Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>Total Records: ${filteredWorkOrders.value.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>WO ID</th>
              <th>Asset</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Assigned To</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredWorkOrders.value.map(wo => `
              <tr>
                <td>${wo.id}</td>
                <td>${wo.assetName.split(' ').slice(0, 2).join(' ')}</td>
                <td>${wo.title}</td>
                <td><span class="status ${wo.status}">${getStatusLabel(wo.status)}</span></td>
                <td><span class="status priority-${wo.priority.toLowerCase()}">${wo.priority}</span></td>
                <td>${getWorkOrderCompletion(wo.id)}%</td>
                <td>${getAssignedTeamInfo(wo.assignedTo).mainPerson}</td>
                <td>${formatDate(wo.scheduledStartDate)}</td>
                <td>${formatDate(wo.scheduledEndDate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

const closeAdvanceSearch = () => {
  showAdvanceSearch.value = false
  // Clear search query when returning to simple search
  searchQuery.value = ''
}

const clearAdvanceSearch = () => {
  advanceSearch.value = {
    woId: '',
    status: '',
    priority: '',
    progress: ''
  }
}

const getStatusBadgeClass = (status) => {
  const baseClass = 'flex items-center justify-center px-[20px] py-[10px] text-[14px] font-medium rounded-[50px]'
  switch (status) {
    case 'completed':
      return `${baseClass} bg-green-100 text-green-800`
    case 'in-progress':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'scheduled':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'pending':
      return `${baseClass} bg-orange-100 text-orange-800`
    case 'cancelled':
      return `${baseClass} bg-red-100 text-red-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getStatusLabel = (status) => {
  const labels = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'scheduled': 'Scheduled',
    'pending': 'Pending',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getPriorityBadgeClass = (priority) => {
  const baseClass = 'flex items-center justify-center px-[20px] py-[10px] text-[14px] font-medium rounded-[50px]'
  switch (priority) {
    case 'Critical':
      return `${baseClass} bg-red-100 text-red-800`
    case 'High':
      return `${baseClass} bg-orange-100 text-orange-800`
    case 'Medium':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'Low':
      return `${baseClass} bg-green-100 text-green-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getTypeBadgeClass = (type) => {
  const baseClass = 'flex items-center justify-center px-[20px] py-[10px] text-[14px] font-medium rounded-[50px]'
  switch (type) {
    case 'planned':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'unplanned':
      return `${baseClass} bg-purple-100 text-purple-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getTypeLabel = (type) => {
  const labels = {
    'planned': 'Planned',
    'unplanned': 'Unplanned'
  }
  return labels[type] || type
}

const getAssetIcon = (assetName) => {
  const name = assetName.toLowerCase()
  if (name.includes('excavator')) return 'icons/road.svg'
  if (name.includes('truck') || name.includes('dump')) return 'icons/road.svg'
  if (name.includes('drill')) return 'icons/road.svg'
  if (name.includes('crusher')) return 'icons/road.svg'
  if (name.includes('grader')) return 'icons/road.svg'
  if (name.includes('compactor')) return 'icons/road.svg'
  if (name.includes('loader')) return 'icons/road.svg'
  if (name.includes('dozer') || name.includes('bulldozer')) return 'icons/road.svg'
  return 'icons/road.svg'
}

const getCompletionBarClass = (percentage) => {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-yellow-500'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

const getItemStatusBadgeClass = (status) => {
  const baseClass = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full'
  switch (status) {
    case 'ok':
      return `${baseClass} bg-green-100 text-green-800`
    case 'concerning':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'critical':
      return `${baseClass} bg-red-100 text-red-800`
    case 'unknown':
      return `${baseClass} bg-gray-100 text-gray-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getItemStatusIcon = (status) => {
  switch (status) {
    case 'ok':
      return mdiCheckCircle
    case 'concerning':
      return mdiAlertCircle
    case 'critical':
      return mdiCloseCircle
    case 'unknown':
      return mdiHelpCircle
    default:
      return mdiHelpCircle
  }
}

const getItemStatusLabel = (status) => {
  const labels = {
    'ok': 'OK',
    'concerning': 'Low Stock',
    'critical': 'Critical',
    'unknown': 'Unknown'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watch for filter changes to reset pagination
watch([searchQuery, showAdvanceSearch], () => {
  currentPage.value = 1
})

watch(advanceSearch, () => {
  currentPage.value = 1
}, { deep: true })

watch([statusFilter, priorityFilter, typeFilter], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  workOrderStore.fetchWorkOrders()
  taskStore.fetchTasks()
  itemStore.fetchItems()
})
</script>
