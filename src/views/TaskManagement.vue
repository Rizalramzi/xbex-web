<template>
  <Layout>
    <div class="h-full flex flex-col">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between flex-shrink-0">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold leading-6 text-gray-900">Task Management</h1>
          <p class="mt-2 text-sm text-gray-700">Manage and track all maintenance tasks and assignments.</p>
        </div>
        <div class="mt-3 sm:mt-0 flex items-center space-x-3">
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
                placeholder="Search tasks..."
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
                title="Print tasks"
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
                title="Print tasks"
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
            <!-- Task ID Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
              <input
                v-model="advanceSearch.taskId"
                type="text"
                placeholder="e.g., TSK-001"
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
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
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

      <!-- Tasks Table -->
      <div class="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-petrosea-primary mr-3"></div>
            <span class="text-gray-600">Loading tasks...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="text-red-600">
            <svg class="h-8 w-8 mx-auto mb-2 fill-current" viewBox="0 0 24 24">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            </svg>
            <p class="font-medium">Error loading tasks</p>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTasks.length === 0" class="p-8 text-center">
          <svg class="h-12 w-12 text-gray-400 mx-auto mb-4 fill-current" viewBox="0 0 24 24">
            <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p class="text-gray-600">{{ searchQuery || advanceSearch.taskId || advanceSearch.status || advanceSearch.priority || advanceSearch.progress ? 'Try adjusting your filters' : 'Create your first task to get started' }}</p>
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
                      <span :class="sortField === 'id' ? 'text-petrosea-primary font-semibold' : ''">Task ID</span>
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
                      Task Details
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
                    :class="sortField === 'priority' ? 'bg-petrosea-primary/10 border-petrosea-primary/20' : 'hover:bg-gray-100'"
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r border-gray-200" 
                    @click="sortBy('priority')"
                  >
                    <div class="flex items-center justify-between">
                      <span :class="sortField === 'priority' ? 'text-petrosea-primary font-semibold' : ''">Priority</span>
                      <div class="flex flex-col ml-1">
                        <svg 
                          :class="sortField === 'priority' && sortDirection === 'asc' ? 'text-petrosea-primary' : 'text-gray-300'" 
                          class="h-3 w-3 -mb-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M7,14L12,9L17,14H7Z" />
                        </svg>
                        <svg 
                          :class="sortField === 'priority' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'text-gray-300'" 
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
                <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50 cursor-pointer" @click="viewTask(task)">
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ task.id }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex items-start space-x-3">
                      <svg class="h-6 w-6 text-gray-400 mt-1 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      <div class="min-w-0 flex-1">
                        <!-- Work Order Info -->
                        <div class="flex items-center space-x-2 mb-1">
                          <div class="text-sm font-medium text-gray-900 truncate">
                            WO: {{ task.workOrderId }}
                          </div>
                          <div class="text-xs text-gray-500">{{ task.category }}</div>
                        </div>
                        
                        <!-- Task Title & Description -->
                        <div class="text-sm text-gray-900 mb-2" :title="task.title">
                          {{ task.title }}
                        </div>
                        <div class="text-xs text-gray-600 mb-2" :title="task.description">
                          {{ task.description.length > 80 ? task.description.substring(0, 80) + '...' : task.description }}
                        </div>
                        
                        <!-- Instructions -->
                        <div v-if="task.instructions" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Instructions available
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(task.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusLabel(task.status) }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <div class="flex items-center mb-1">
                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            :class="getCompletionBarClass(task.progressPercentage)"
                            class="h-2 rounded-full transition-all duration-300"
                            :style="{ width: task.progressPercentage + '%' }"
                          ></div>
                        </div>
                        <span class="text-xs font-medium text-gray-900 min-w-[2rem]">
                          {{ task.progressPercentage }}%
                        </span>
                      </div>
                      <span class="text-xs text-gray-500">
                        {{ getProgressStatus(task) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <span :class="getPriorityBadgeClass(task.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ task.priority }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <div class="text-sm font-medium text-gray-900">
                        {{ task.assignedTo }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatDate(task.dueDate) }}
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        @click="viewTask(task)"
                        class="text-petrosea-primary hover:text-petrosea-primary-dark transition-colors duration-200"
                        :title="`View ${task.id}`"
                      >
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        :title="`Edit ${task.id}`"
                      >
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-900 transition-colors duration-200"
                        :title="`Delete ${task.id}`"
                      >
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        
          <!-- Fixed Pagination Footer -->
          <div v-if="filteredTasks.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTasks.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredTasks.length }}</span>
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

    <!-- Task Viewer Modal -->
    <TaskViewer 
      v-if="selectedTask" 
      :task="selectedTask" 
      @close="closeTaskViewer"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import FavoriteButton from '../components/FavoriteButton.vue'
import TaskViewer from '../components/TaskViewer.vue'
import { useTaskStore } from '../stores/taskStore'

const taskStore = useTaskStore()

// State
const searchQuery = ref('')
const showAdvanceSearch = ref(false)
const selectedTask = ref(null)
const advanceSearch = ref({
  taskId: '',
  status: '',
  priority: '',
  progress: ''
})

// Sorting state - default to ID descending
const sortField = ref('id')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed - access store properties directly
const tasks = computed(() => taskStore.tasks)
const loading = computed(() => taskStore.loading)
const error = computed(() => taskStore.error)

// Filtered tasks
const filteredTasks = computed(() => {
  let filtered = tasks.value

  if (showAdvanceSearch.value) {
    // Advanced search mode
    
    // Task ID filter
    if (advanceSearch.value.taskId) {
      const query = advanceSearch.value.taskId.toLowerCase()
      filtered = filtered.filter(task => task.id.toLowerCase().includes(query))
    }

    // Status filter
    if (advanceSearch.value.status) {
      filtered = filtered.filter(task => task.status === advanceSearch.value.status)
    }

    // Priority filter
    if (advanceSearch.value.priority) {
      filtered = filtered.filter(task => task.priority === advanceSearch.value.priority)
    }

    // Progress filter
    if (advanceSearch.value.progress) {
      const [min, max] = advanceSearch.value.progress.split('-').map(Number)
      filtered = filtered.filter(task => {
        const progress = task.progressPercentage || 0
        return progress >= min && progress <= max
      })
    }
  } else {
    // Simple search mode
    
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(task => 
        task.id.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.workOrderId.toLowerCase().includes(query) ||
        task.assignedTo.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      )
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
        aVal = a.progressPercentage || 0
        bVal = b.progressPercentage || 0
        break
      case 'priority':
        aVal = a.priority
        bVal = b.priority
        // Custom order for priority: Critical > High > Medium > Low
        const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 }
        aVal = priorityOrder[aVal] ?? 3
        bVal = priorityOrder[bVal] ?? 3
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

// Paginated tasks
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage.value))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTasks.value.slice(start, end)
})

// Methods
const sortBy = (field) => {
  // Only allow sorting on specific fields
  const sortableFields = ['id', 'status', 'progress', 'priority']
  if (!sortableFields.includes(field)) return

  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const refreshData = async () => {
  await taskStore.fetchTasks()
}

const printData = () => {
  // Create a printable version of the current filtered data
  const printContent = `
    <html>
      <head>
        <title>Tasks Report</title>
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
          .pending { background-color: #fff3cd; color: #856404; }
          .on-hold { background-color: #ffeaa7; color: #d63031; }
          .priority-critical { background-color: #f8d7da; color: #721c24; }
          .priority-high { background-color: #ffeaa7; color: #856404; }
          .priority-medium { background-color: #fff3cd; color: #856404; }
          .priority-low { background-color: #d4edda; color: #155724; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tasks Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>Total Records: ${filteredTasks.value.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Work Order</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTasks.value.map(task => `
              <tr>
                <td>${task.id}</td>
                <td>${task.workOrderId}</td>
                <td>${task.title}</td>
                <td><span class="status ${task.status}">${getStatusLabel(task.status)}</span></td>
                <td><span class="status priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
                <td>${task.progressPercentage}%</td>
                <td>${task.assignedTo}</td>
                <td>${formatDate(task.dueDate)}</td>
                <td>${task.category}</td>
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
    taskId: '',
    status: '',
    priority: '',
    progress: ''
  }
}

const viewTask = (task) => {
  selectedTask.value = task
}

const closeTaskViewer = () => {
  selectedTask.value = null
}

const getStatusBadgeClass = (status) => {
  const baseClass = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
  switch (status) {
    case 'completed':
      return `${baseClass} bg-green-100 text-green-800`
    case 'in-progress':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    case 'on-hold':
      return `${baseClass} bg-orange-100 text-orange-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getStatusLabel = (status) => {
  const labels = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending',
    'on-hold': 'On Hold'
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

const getCompletionBarClass = (percentage) => {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-yellow-500'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

const getProgressStatus = (task) => {
  if (task.progressPercentage >= 100) return 'Completed'
  if (task.progressPercentage >= 75) return 'Nearly Done'
  if (task.progressPercentage >= 50) return 'In Progress'
  if (task.progressPercentage >= 25) return 'Started'
  return 'Not Started'
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

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  taskStore.fetchTasks()
})
</script>
