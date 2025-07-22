<template>
  <Layout>
    <div class="h-full flex flex-col">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between flex-shrink-0">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">Work Orders</h1>
          <p class="mt-2 text-sm text-gray-700">Track and manage all maintenance work orders.</p>
        </div>
        <div class="mt-3 sm:mt-0 flex items-center space-x-3">
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-petrosea-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-petrosea-primary-dark"
          >
            <MdiIcon name="plus" class="mr-2 h-4 w-4" />
            New Work Order
          </button>
          <FavoriteButton :show-tooltip="true" />
        </div>
      </div>

      <!-- Table Bar -->
      <div class="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
        <!-- Simple Search Mode -->
        <div v-if="!showAdvanceSearch" class="flex items-center justify-between">
          <div class="flex items-center space-x-4 flex-1">
            <!-- Search Box -->
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 fill-current" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search work orders..."
                class="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-petrosea-primary focus:ring-petrosea-primary"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <!-- Refresh Button -->
              <button
                @click="refreshData"
                :disabled="loading"
                class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                title="Refresh data"
              >
                <svg 
                  :class="loading ? 'animate-spin' : ''" 
                  class="h-4 w-4 fill-current" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              </button>

              <!-- Print Button -->
              <button
                @click="printData"
                class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 transition-all duration-200 flex items-center"
                title="Print work orders"
              >
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
                </svg>
              </button>

              <!-- Advanced Search Button -->
              <button
                @click="showAdvanceSearch = true"
                class="px-4 py-2 text-sm font-medium text-gray-600 bg-petrosea-primary hover:bg-petrosea-primary-dark rounded-md border border-petrosea-primary shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                title="Advanced search"
              >
                <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
                </svg>
                Advanced Search
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced Search Mode -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="h-5 w-5 mr-2 text-petrosea-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
              </svg>
              Advanced Search
            </h3>
            <div class="flex items-center space-x-2">
              <!-- Print Button -->
              <button
                @click="printData"
                class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 transition-all duration-200 flex items-center"
                title="Print work orders"
              >
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
                </svg>
              </button>
              
              <!-- Simple Search Button -->
              <button
                @click="closeAdvanceSearch"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
              >
                <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                </svg>
                Simple Search
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- WO ID Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Work Order ID</label>
              <input
                v-model="advanceSearch.woId"
                type="text"
                placeholder="e.g., WO-2024-001"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-petrosea-primary focus:ring-petrosea-primary"
              />
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="advanceSearch.status"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-petrosea-primary focus:ring-petrosea-primary"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Priority Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                v-model="advanceSearch.priority"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-petrosea-primary focus:ring-petrosea-primary"
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <!-- Progress Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Progress</label>
              <select
                v-model="advanceSearch.progress"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-petrosea-primary focus:ring-petrosea-primary"
              >
                <option value="">All Progress</option>
                <option value="0-25">0% - 25%</option>
                <option value="26-50">26% - 50%</option>
                <option value="51-75">51% - 75%</option>
                <option value="76-100">76% - 100%</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <button
              @click="clearAdvanceSearch"
              class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-200 flex items-center"
            >
              <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83C8.74,11.13 11.57,12.55 14.37,12.17L15.56,13.36C14.5,14.6 13.03,15.4 11.5,15.4C9.15,15.4 6.92,14.22 5.93,17.57M8.58,19.93C9.82,21.18 11.33,21.86 12.88,21.94L13.68,18.11C12.12,17.87 10.58,17.2 9.29,16.21L8.58,19.93Z" />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Work Orders Table -->
      <div class="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-petrosea-primary mr-3"></div>
            <span class="text-gray-600">Loading work orders...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="text-red-600">
            <MdiIcon name="alert-circle" class="h-8 w-8 mx-auto mb-2" />
            <p class="font-medium">Error loading work orders</p>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredWorkOrders.length === 0" class="p-8 text-center">
          <MdiIcon name="clipboard-text-outline" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
          <p class="text-gray-600">{{ searchQuery || statusFilter || priorityFilter || typeFilter ? 'Try adjusting your filters' : 'Create your first work order to get started' }}</p>
        </div>

        <!-- Table -->
        <div v-else class="flex flex-col flex-1 min-h-0">
          <!-- Fixed Header -->
          <div class="flex-shrink-0 overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    :class="sortField === 'id' ? 'bg-petrosea-primary/10 border-petrosea-primary/20' : 'hover:bg-gray-100'"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r border-gray-200" 
                    @click="sortBy('id')"
                  >
                    <div class="flex items-center justify-between">
                      <span :class="sortField === 'id' ? 'text-petrosea-primary font-semibold' : ''">WO ID</span>
                      <div class="flex flex-col ml-1">
                        <svg 
                          :class="sortField === 'id' && sortDirection === 'asc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3 -mb-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,14L12,9L17,14H7Z" />
                        </svg>
                        <svg 
                          :class="sortField === 'id' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,10L12,15L17,10H7Z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    <div class="flex items-center">
                      Work Order Details
                    </div>
                  </th>
                  <th 
                    :class="sortField === 'status' ? 'bg-petrosea-primary/10 border-petrosea-primary/20' : 'hover:bg-gray-100'"
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r border-gray-200" 
                    @click="sortBy('status')"
                  >
                    <div class="flex items-center justify-between">
                      <span :class="sortField === 'status' ? 'text-petrosea-primary font-semibold' : ''">Status</span>
                      <div class="flex flex-col ml-1">
                        <svg 
                          :class="sortField === 'status' && sortDirection === 'asc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3 -mb-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,14L12,9L17,14H7Z" />
                        </svg>
                        <svg 
                          :class="sortField === 'status' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,10L12,15L17,10H7Z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th 
                    :class="sortField === 'progress' ? 'bg-petrosea-primary/10 border-petrosea-primary/20' : 'hover:bg-gray-100'"
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r border-gray-200" 
                    @click="sortBy('progress')"
                  >
                    <div class="flex items-center justify-between">
                      <span :class="sortField === 'progress' ? 'text-petrosea-primary font-semibold' : ''">Progress</span>
                      <div class="flex flex-col ml-1">
                        <svg 
                          :class="sortField === 'progress' && sortDirection === 'asc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3 -mb-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,14L12,9L17,14H7Z" />
                        </svg>
                        <svg 
                          :class="sortField === 'progress' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,10L12,15L17,10H7Z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th 
                    :class="sortField === 'items' ? 'bg-petrosea-primary/10 border-petrosea-primary/20' : 'hover:bg-gray-100'"
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r border-gray-200" 
                    @click="sortBy('items')"
                  >
                    <div class="flex items-center justify-between">
                      <span :class="sortField === 'items' ? 'text-petrosea-primary font-semibold' : ''">Items</span>
                      <div class="flex flex-col ml-1">
                        <svg 
                          :class="sortField === 'items' && sortDirection === 'asc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3 -mb-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,14L12,9L17,14H7Z" />
                        </svg>
                        <svg 
                          :class="sortField === 'items' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,10L12,15L17,10H7Z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    <div class="flex items-center">
                      Assigned To
                    </div>
                  </th>
                  <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          
          <!-- Scrollable Body -->
          <div class="flex-1 overflow-y-auto">
            <table class="min-w-full">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="workOrder in paginatedWorkOrders" :key="workOrder.id" class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ workOrder.id }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex items-start space-x-3">
                      <MdiIcon :name="getAssetIcon(workOrder.assetName)" class="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                      <div class="min-w-0 flex-1">
                        <!-- Asset Info -->
                        <div class="flex items-center space-x-2 mb-1">
                          <div class="text-sm font-medium text-gray-900 truncate">
                            {{ workOrder.assetName.split(' ').slice(0, 2).join(' ') }}
                          </div>
                          <div class="text-xs text-gray-500">{{ workOrder.assetId }}</div>
                        </div>
                        
                        <!-- Title -->
                        <div class="text-sm text-gray-900 mb-2" :title="workOrder.title">
                          {{ workOrder.title }}
                        </div>
                        
                        <!-- Priority, Type badges -->
                        <div class="flex items-center space-x-2">
                          <span :class="getPriorityBadgeClass(workOrder.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ workOrder.priority }}
                          </span>
                          <span :class="getTypeBadgeClass(workOrder.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ getTypeLabel(workOrder.type) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(workOrder.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusLabel(workOrder.status) }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <div class="flex items-center mb-1">
                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            :class="getCompletionBarClass(getWorkOrderCompletion(workOrder.id))"
                            class="h-2 rounded-full transition-all duration-300"
                            :style="{ width: getWorkOrderCompletion(workOrder.id) + '%' }"
                          ></div>
                        </div>
                        <span class="text-xs font-medium text-gray-900 min-w-[2rem]">
                          {{ getWorkOrderCompletion(workOrder.id) }}%
                        </span>
                      </div>
                      <span :class="getWorkOrderProgressStatus(workOrder).class" class="text-xs font-medium">
                        {{ getWorkOrderProgressStatus(workOrder).label }}
                      </span>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <span :class="getItemStatusBadgeClass(getWorkOrderItemStatus(workOrder.id).status)" class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full mb-1">
                        <MdiIcon :name="getItemStatusIcon(getWorkOrderItemStatus(workOrder.id).status)" class="h-3 w-3 mr-1" />
                        {{ getItemStatusLabel(getWorkOrderItemStatus(workOrder.id).status) }}
                      </span>
                      <span class="text-xs text-gray-500 truncate max-w-[8rem]" :title="getWorkOrderItemStatus(workOrder.id).message">
                        {{ getWorkOrderItemStatus(workOrder.id).message }}
                      </span>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <div class="text-sm font-medium text-gray-900">
                        {{ getAssignedTeamInfo(workOrder.assignedTo).mainPerson }}
                      </div>
                      <div v-if="getAssignedTeamInfo(workOrder.assignedTo).otherCount > 0" class="text-xs text-gray-500">
                        +{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount }} other{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount > 1 ? 's' : '' }}
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        class="text-petrosea-primary hover:text-petrosea-primary-dark"
                        :title="`View ${workOrder.id}`"
                      >
                        <MdiIcon name="eye" class="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        class="text-gray-600 hover:text-gray-900"
                        :title="`Edit ${workOrder.id}`"
                      >
                        <MdiIcon name="pencil" class="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-900"
                        :title="`Delete ${workOrder.id}`"
                      >
                        <MdiIcon name="delete" class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        
          <!-- Fixed Pagination Footer -->
          <div v-if="filteredWorkOrders.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredWorkOrders.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredWorkOrders.length }}</span>
                  results
                </p>
                <div class="ml-4">
                  <label class="text-sm text-gray-700 mr-2">Items per page:</label>
                  <select
                    v-model="itemsPerPage"
                    class="text-sm rounded-md border-gray-300 shadow-sm focus:border-petrosea-primary focus:ring-petrosea-primary"
                  >
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all font-medium"
                  title="First page"
                >
                  ⏮️
                </button>
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all font-medium"
                  title="Previous page"
                >
                  ◀️
                </button>
                <span class="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-md min-w-[5rem] text-center">
                  {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all font-medium"
                  title="Next page"
                >
                  ▶️
                </button>
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all font-medium"
                  title="Last page"
                >
                  ⏭️
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
import { ref, computed, onMounted, watch } from 'vue'
import Layout from '../components/Layout.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import MdiIcon from '../components/MdiIcon.vue'
import { useWorkOrderStore } from '../stores/workOrderStore'
import { useTaskStore } from '../stores/taskStore'
import { useItemStore } from '../stores/itemStore'

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
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
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
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
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
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
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
  if (name.includes('excavator')) return 'excavator'
  if (name.includes('truck') || name.includes('dump')) return 'dump-truck'
  if (name.includes('drill')) return 'hammer-screwdriver'
  if (name.includes('crusher')) return 'cog'
  if (name.includes('grader')) return 'road-variant'
  if (name.includes('compactor')) return 'steamroller'
  if (name.includes('loader')) return 'forklift'
  if (name.includes('dozer') || name.includes('bulldozer')) return 'bulldozer'
  return 'cog'
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
      return 'check-circle'
    case 'concerning':
      return 'alert-circle'
    case 'critical':
      return 'close-circle'
    case 'unknown':
      return 'help-circle'
    default:
      return 'help-circle'
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
