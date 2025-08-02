<template>
  <Layout>
    <template #content>
      <div id="desktop" class="h-full hidden xl:flex flex-col">
        <!-- Page Header -->
        <div class="w-full container__section">
          
          <div class="container__header__main">
            <span class="title__main">Work Orders</span>
            <p class="desc__main">Track and manage all maintenance work orders.</p>
          </div>
  
          <div class="flex flex-row items-center xl:gap-[13px] 2xl:gap-[20px]">
            <button class="btn__primary">+ New Work Order</button>
            <FavoriteButton :show-tooltip="true" />
          </div>
        </div>
  
        <!-- Table Bar -->
        <div class="w-full container__section xl:mt-[26px] 2xl:mt-[40px]">
          <!-- Simple Search -->
          <div v-if="!showAdvanceSearch" class="w-full flex flex-row items-center justify-between">
            <div class="flex flex-row items-center xl:gap-[7px] 2xl:gap-[10px]">
              <div class="search outline__input">
                <img src="/icons/search.svg" alt="Search Icon" class="xl:w-[13px] 2xl:w-[20px] h-auto">
                <input v-model="searchQuery" type="text" class="w-full h-full outline-none" placeholder="Search Work Order">
              </div>
              
              <button @click="refreshData" :disabled="loading" class="background__icon">
                <img src="/icons/repeat.svg" alt="Repeat Icon" class="xl:w-[14px] xl:h-[14px] 2xl:w-[18px] 2xl:h-[18px] object-center object-cover shrink-0">
              </button>
              
              <button @click="printData" class="background__icon">
                <img src="/icons/print.svg" alt="Print Icon" class="xl:w-[14px] xl:h-[14px] 2xl:w-[18px] 2xl:h-[18px] object-center object-cover shrink-0">
              </button>
            </div>
            
            <!-- Tombol Advanced Search -->
            <button @click="showAdvanceSearch = true" class="cursor-pointer min-h-[10vw] xl:min-h-full btn__padding">
              <svg class="w-[3vw] xl:w-[12px] h-auto 2xl:w-[18px] 2xl:h-[11px] object-center object-cover shrink-0" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.271973 1.5C0.271973 1.23478 0.377329 0.98043 0.564866 0.792893C0.752402 0.605357 1.00676 0.5 1.27197 0.5H17.272C17.5372 0.5 17.7915 0.605357 17.9791 0.792893C18.1666 0.98043 18.272 1.23478 18.272 1.5C18.272 1.76522 18.1666 2.01957 17.9791 2.20711C17.7915 2.39464 17.5372 2.5 17.272 2.5H1.27197C1.00676 2.5 0.752402 2.39464 0.564866 2.20711C0.377329 2.01957 0.271973 1.76522 0.271973 1.5ZM2.27197 6C2.27197 5.73478 2.37733 5.48043 2.56487 5.29289C2.7524 5.10536 3.00676 5 3.27197 5H15.272C15.5372 5 15.7915 5.10536 15.9791 5.29289C16.1666 5.48043 16.272 5.73478 16.272 6C16.272 6.26522 16.1666 6.51957 15.9791 6.70711C15.7915 6.89464 15.5372 7 15.272 7H3.27197C3.00676 7 2.7524 6.89464 2.56487 6.70711C2.37733 6.51957 2.27197 6.26522 2.27197 6ZM5.27197 10.5C5.27197 10.2348 5.37733 9.98043 5.56487 9.79289C5.7524 9.60536 6.00676 9.5 6.27197 9.5H12.272C12.5372 9.5 12.7915 9.60536 12.9791 9.79289C13.1666 9.98043 13.272 10.2348 13.272 10.5C13.272 10.7652 13.1666 11.0196 12.9791 11.2071C12.7915 11.3946 12.5372 11.5 12.272 11.5H6.27197C6.00676 11.5 5.7524 11.3946 5.56487 11.2071C5.37733 11.0196 5.27197 10.7652 5.27197 10.5Z" fill="currentColor"/>
              </svg>

              <span class="hidden xl:block xl:text-[10px] 2xl:text-[14px]">Advanced Search</span>
              <svg class="w-[2vw] xl:w-[8px] 2xl:w-[10px] h-auto object-center object-cover shrink-0" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <!-- Advanced Search -->
          <div v-else class="w-full flex flex-col xl:gap-[25px] 2xl:gap-[40px]">
            <!-- Konten Advanced Search di sini -->
            <div class="w-full flex flex-row items-center justify-between">
              <span class="xl:text-[13px] 2xl:text-[18px]">Advanced Search</span>

              <div class="flex flex-row items-center gap-[20px]">
                <!-- Clear Search -->
                <button @click="clearAdvanceSearch" class="btn__padding cursor-pointer">
                  <svg class="xl:w-[12px] 2xl:w-[18px] xl:h-[12px] 2xl:h-[18px] object-center object-cover shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77425 0.0710887C9.89275 0.118913 10.0006 0.189488 10.0917 0.278784C10.1828 0.36808 10.2553 0.474348 10.3051 0.59152C10.3548 0.708692 10.3809 0.834473 10.3819 0.961681C10.3828 1.08889 10.3585 1.21503 10.3104 1.33291L6.78045 10.0055C7.24004 10.1656 7.70741 10.4084 8.11766 10.7339C8.83171 11.3009 9.41334 12.1546 9.41334 13.2898C9.41334 13.9808 9.58341 14.5555 9.84176 15.0256C10.2546 15.7799 11.1608 16.0498 12.0255 16.0498C12.2837 16.0498 12.5314 16.1519 12.714 16.3335C12.8966 16.5152 12.9992 16.7615 12.9992 17.0184C12.9992 17.2753 12.8966 17.5217 12.714 17.7034C12.5314 17.885 12.2837 17.9871 12.0255 17.9871H11.9086V18H3.47117C2.11058 18 0.674697 17.0946 0.638346 15.5138C0.608485 14.1887 0.891508 12.6815 1.69643 11.5308C2.37153 10.566 3.38808 9.89053 4.77073 9.773L8.50715 0.604487C8.55522 0.486608 8.62616 0.379304 8.71593 0.288701C8.80569 0.198098 8.91251 0.125972 9.03029 0.076441C9.14808 0.0269098 9.27452 0.000943603 9.40239 2.52436e-05C9.53026 -0.000893116 9.65576 0.0232543 9.77425 0.0710887ZM17.6625 17.9871C17.9208 17.9871 18.1684 17.885 18.351 17.7034C18.5336 17.5217 18.6362 17.2753 18.6362 17.0184C18.6362 16.7615 18.5336 16.5152 18.351 16.3335C18.1684 16.1519 17.9208 16.0498 17.6625 16.0498H15.1608C14.9025 16.0498 14.6549 16.1519 14.4723 16.3335C14.2897 16.5152 14.1871 16.7615 14.1871 17.0184C14.1871 17.2753 14.2897 17.5217 14.4723 17.7034C14.6549 17.885 14.9025 17.9871 15.1608 17.9871H17.6625ZM17.4782 13.5029C17.4782 13.7598 17.3756 14.0062 17.193 14.1879C17.0104 14.3695 16.7627 14.4716 16.5045 14.4716H14.017C13.7588 14.4716 13.5111 14.3695 13.3285 14.1879C13.1459 14.0062 13.0433 13.7598 13.0433 13.5029C13.0433 13.246 13.1459 12.9996 13.3285 12.818C13.5111 12.6363 13.7588 12.5343 14.017 12.5343H16.5045C16.7627 12.5343 17.0104 12.6363 17.193 12.818C17.3756 12.9996 17.4782 13.246 17.4782 13.5029ZM15.1608 10.8256C15.419 10.8256 15.6667 10.7235 15.8493 10.5419C16.0319 10.3602 16.1345 10.1139 16.1345 9.85695C16.1345 9.60005 16.0319 9.35367 15.8493 9.17202C15.6667 8.99036 15.419 8.88831 15.1608 8.88831H12.672C12.4137 8.88831 12.1661 8.99036 11.9835 9.17202C11.8009 9.35367 11.6983 9.60005 11.6983 9.85695C11.6983 10.1139 11.8009 10.3602 11.9835 10.5419C12.1661 10.7235 12.4137 10.8256 12.672 10.8256H15.1608Z" fill="currentColor"/>
                  </svg>

                  <span class="">Clear All Filter</span>
                </button>
                
                <!-- Close Search -->
                <button class="btn__padding cursor-pointer" @click="closeAdvanceSearch">
                  <svg class="w-auto xl:h-[6px] 2xl:h-[10px] object-center object-cover shrink-0 rotate-90" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z" fill="currentColor"/>
                  </svg>
                  <span class="">Close</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-[20px]">
              <!-- ID -->
              <div class="flex flex-col gap-[10px] flex-none">
                <label for="id" class="xl:text-[10px] 2xl:text-[14px]">Work Orders ID</label>
                <div class="btn__padding xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.woId" name="id" id="id" class="outline-none w-full cursor-pointer">
                    <option value="">All Work Orders</option>
                    <option v-for="wo in workOrders" :key="wo.id" :value="wo.id">{{ wo.id }}</option>
                  </select>
                </div>
              </div>
              
              <!-- Status -->
              <div class="flex flex-col gap-[10px] flex-none">
                <label for="status" class="xl:text-[10px] 2xl:text-[14px]">Status</label>
                <div class="btn__padding xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.status" name="status" id="status" class="outline-none w-full cursor-pointer">
                    <option value="">All Status</option>
                    <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ getStatusLabel(status) }}</option>
                  </select>
                </div>
              </div>

              <!-- Priorities -->
              <div class="flex flex-col gap-[10px] flex-none">
                <label for="priority" class="xl:text-[10px] 2xl:text-[14px]">Priorities</label>
                <div class="btn__padding xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.priority" name="priority" id="priority" class="outline-none w-full cursor-pointer">
                    <option value="">All Priorities</option>
                    <option v-for="priority in uniquePriorities" :key="priority" :value="priority">{{ priority }}</option>
                  </select>
                </div>
              </div>

              <!-- Progress -->
              <div class="flex flex-col gap-[10px] flex-none">
                <label for="progress" class="xl:text-[10px] 2xl:text-[14px]">Progress</label>
                <div class="btn__padding xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.progress" name="progress" id="progress" class="outline-none w-full cursor-pointer">
                    <option value="">All Progress</option>
                    <option value="0-25">0-25%</option>
                    <option value="26-50">26-50%</option>
                    <option value="51-75">51-75%</option>
                    <option value="76-99">76-99%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
  
        <!-- Work Orders Table -->
        <div class="xl:mt-[21px] 2xl:mt-[32px] flex-1 flex flex-col min-h-0">
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
              <MdiIcon :path="mdiAlertCircle" class="h-8 w-8 mx-auto mb-2" />
              <p class="font-medium">Error loading work orders</p>
              <p class="text-sm mt-1">{{ error }}</p>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-else-if="filteredWorkOrders.length === 0" class="p-8 text-center">
            <MdiIcon :path="mdiClipboardTextOutline" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
            <p class="text-gray-600">{{ searchQuery || statusFilter || priorityFilter || typeFilter ? 'Try adjusting your filters' : 'Create your first work order to get started' }}</p>
          </div>
  
          <!-- Table Component -->
          <div v-else class="overflow-y-auto">
            <table class="w-full table-fixed">
              <thead class="font-medium sticky top-0 z-10">
                <tr class="text-left xl:text-[10px] 2xl:text-[14px]">
                  <!-- Work ID -->
                  <th
                    @click="sortBy('id')"
                    class="container__header__table cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'id' ? 'text-petrosea-primary font-medium' : ''" class="truncate">Work ID</span>
                      <div class="flex flex-col gap-0.5">
                        <img 
                          src="/icons/arrow.svg"
                          alt="Arrow Up"
                          class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'id' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'"
                        />
                        <img 
                          src="/icons/arrow.svg"
                          alt="Arrow Down"
                          class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'id' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'"
                        />
                      </div>
                    </div>
                  </th>
  
                  <!-- Work Details -->
                  <th class="truncate container__header__table">Work Details</th>
  
                  <!-- Status -->
                  <th
                    @click="sortBy('status')"
                    class="truncate container__header__table cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'status' ? 'text-petrosea-primary font-semibold' : ''">Status</span>
                      <div class="flex flex-col gap-0.5">
                        <img 
                          src="/icons/arrow.svg"
                          class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'status' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'"
                        />
                        <img 
                          src="/icons/arrow.svg"
                          class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'status' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'"
                        />
                      </div>
                    </div>
                  </th>
  
                  <!-- Progress -->
                  <th
                    @click="sortBy('progress')"
                    class="truncate container__header__table cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'progress' ? 'text-petrosea-primary font-medium' : ''">Progress</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'progress' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'" />
                        <img src="/icons/arrow.svg" class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'progress' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'" />
                      </div>
                    </div>
                  </th>
  
                  <!-- Items -->
                  <th
                    @click="sortBy('items')"
                    class="truncate container__header__table cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'items' ? 'text-petrosea-primary font-normal' : ''">Items</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'items' && sortDirection === 'asc' ? 'rotate-180 text-petrosea-primary' : 'opacity-30'" />
                        <img src="/icons/arrow.svg" class="xl:w-[4px] 2xl:w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'items' && sortDirection === 'desc' ? 'text-petrosea-primary' : 'opacity-30'" />
                      </div>
                    </div>
                  </th>
  
                  <th class="truncate container__header__table">Assigned To</th>
                  <th class="truncate container__header__table">Actions</th>
                </tr>
              </thead>
  
              <tbody v-for="workOrder in paginatedWorkOrders" :key="workOrder.id" class="">
                <tr>
                  <td colspan="7" class="xl:h-[21px] 2xl:h-[32px]"></td>
                </tr>
                <tr  class="text-left">
                  <!-- ID -->
                  <td class="container__data xl:text-[10px] 2xl:text-[14px]">{{ workOrder.id }}</td>
  
                  <!-- Work Details -->
                  <td>
                    <div class="flex flex-col gap-[10px]">
                      <div class="background__icon__content">
                        <img :src="getAssetIcon(workOrder.assetName)" alt="Asset Icon" class="w-auto xl:h-[13px] 2xl:h-[18px] object-center object-contain shrink-0" />
                      </div>
  
                      <div class="flex flex-col gap-[5px]">
                        <div class="flex justify-between">
                          <span class="xl:text-[10px] 2xl:text-[14px]">{{ workOrder.assetName.split(' ').slice(0, 2).join(' ') }}</span>
                          <p class="xl:text-[10px] 2xl:text-[14px]">{{ workOrder.assetId }}</p>
                        </div>
                        <p class="label__secondary truncate">{{ workOrder.title }}</p>
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
                          <div class="xl:w-16 2xl:w-32 rounded-full xl:h-[10px] 2xl:h-[15px] mr-2" style="background-color: var(--color-bgtable);">
                            <div
                              :class="getCompletionBarClass(getWorkOrderCompletion(workOrder.id))"
                              class="xl:h-[10px] 2xl:h-[15px] rounded-full transition-all duration-300"
                              :style="{ width: getWorkOrderCompletion(workOrder.id) + '%' }"
                            ></div>
                          </div>
                          <span class="text-xs font-medium">
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
                      <span :class="getItemStatusBadgeClass(getWorkOrderItemStatus(workOrder.id).status)" class="mb-1 inline-flex items-center xl:text-[10px] 2xl:text-[14px] font-semibold rounded-full xl:ps-[13px] 2xl:ps-[20px] xl:pe-[30px] 2xl:pe-[50px] xl:py-[7px] 2xl:py-[10px]">
                        <MdiIcon :path="getItemStatusIcon(getWorkOrderItemStatus(workOrder.id).status)" class="xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 xl:mr-1.5 2xl:mr-2.5" />
                        {{ getItemStatusLabel(getWorkOrderItemStatus(workOrder.id).status) }}
                      </span>
                      <span class="xl:text-[10px] 2xl:text-[14px] text-gray-500 truncate" :title="getWorkOrderItemStatus(workOrder.id).message">
                        {{ getWorkOrderItemStatus(workOrder.id).message }}
                      </span>
                    </div>
                  </td>
  
                  <!-- Assigned To -->
                  <td>
                    <div class="flex flex-col justify-center items-center">
                      <div class="flex flex-col">
                        <span class="xl:text-[10px] 2xl:text-[14px] font-medium">{{ getAssignedTeamInfo(workOrder.assignedTo).mainPerson }}</span>
                        <span v-if="getAssignedTeamInfo(workOrder.assignedTo).otherCount > 0" class="label__secondary">
                          +{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount }} other{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount > 1 ? 's' : '' }}
                        </span>
                      </div>
                    </div>
                  </td>
  
                  <!-- Actions -->
                  <td>
                    <div class="flex items-center justify-center">
                      <div class="flex justify-end items-center gap-2.5">
                        <button class="container__action" :title="`View ${workOrder.id}`">
                          <MdiIcon :path="mdiEye" class="xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                        </button>
                        <button class="container__action" :title="`Edit ${workOrder.id}`">
                          <MdiIcon :path="mdiPencil" class="xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                        </button>
                        <button class="bg-red-100 xl:p-[8px] 2xl:p-[15px] hover:bg-red-300 rounded-[50px] cursor-pointer text-red-800" :title="`Delete ${workOrder.id}`">
                          <MdiIcon :path="mdiDelete" class="xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <hr class="xl:mt-[21px] 2xl:mt-[32px] border-[#101828]/10">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
        </div>
      </div>

      <div id="mobile" class="flex xl:hidden flex-col gap-[3vw]">
        <div class="flex flex-col gap-[20px] px-[8vw] py-[5.5vw] rounded-[4vw]" style="background-color: var(--color-bgsidebar);">
          <div class="flex flex-col gap-[2.7vw]">
            <div class="container__header__main">
                <span class="title__main">Work Orders</span>
                <p class="desc__main">Track and manage all maintenance work orders.</p>
            </div>
            <div class="flex flex-row items-center gap-[2.7vw] xl:gap-[13px] 2xl:gap-[20px]">
              <FavoriteButton :show-tooltip="true" />
              <button class="btn__primary">+ New Work Order</button>
            </div>
          </div>
          <div class="w-full container__section xl:mt-[26px] 2xl:mt-[40px]">
            <div v-if="!showAdvanceSearch" class="flex flex-row items-center gap-[2vw] xl:gap-[7px] 2xl:gap-[10px]">
              <div class="search outline__input" >
                <img src="/icons/search.svg" alt="Search Icon" class="w-[3.5vw] xl:w-[13px] 2xl:w-[20px] h-auto object-center object-cover shrink-0">
                <input v-model="searchQuery" type="text" name="" id="" class="w-full h-full outline-none" placeholder="Search Work Order">
              </div>
      
              <button @click="refreshData" :disabled="loading" class="background__icon">
                <img src="/icons/repeat.svg" alt="Repeat Icon" class="w-[3.5vw] xl:w-[13px] xl:h-[13px] 2xl:w-[16px] 2xl:h-[16px] object-center object-cover shrink-0">
              </button>
              
              <button @click="printData" class="background__icon">
                <img src="/icons/print.svg" alt="Print Icon" class="w-[3.5vw] h-auto object-center object-cover shrink-0">
              </button>

              <button @click="showAdvanceSearch = true" class="cursor-pointer min-h-[10vw] xl:min-h-full btn__padding">
              <svg class="w-[3vw] h-auto object-center object-cover shrink-0" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.271973 1.5C0.271973 1.23478 0.377329 0.98043 0.564866 0.792893C0.752402 0.605357 1.00676 0.5 1.27197 0.5H17.272C17.5372 0.5 17.7915 0.605357 17.9791 0.792893C18.1666 0.98043 18.272 1.23478 18.272 1.5C18.272 1.76522 18.1666 2.01957 17.9791 2.20711C17.7915 2.39464 17.5372 2.5 17.272 2.5H1.27197C1.00676 2.5 0.752402 2.39464 0.564866 2.20711C0.377329 2.01957 0.271973 1.76522 0.271973 1.5ZM2.27197 6C2.27197 5.73478 2.37733 5.48043 2.56487 5.29289C2.7524 5.10536 3.00676 5 3.27197 5H15.272C15.5372 5 15.7915 5.10536 15.9791 5.29289C16.1666 5.48043 16.272 5.73478 16.272 6C16.272 6.26522 16.1666 6.51957 15.9791 6.70711C15.7915 6.89464 15.5372 7 15.272 7H3.27197C3.00676 7 2.7524 6.89464 2.56487 6.70711C2.37733 6.51957 2.27197 6.26522 2.27197 6ZM5.27197 10.5C5.27197 10.2348 5.37733 9.98043 5.56487 9.79289C5.7524 9.60536 6.00676 9.5 6.27197 9.5H12.272C12.5372 9.5 12.7915 9.60536 12.9791 9.79289C13.1666 9.98043 13.272 10.2348 13.272 10.5C13.272 10.7652 13.1666 11.0196 12.9791 11.2071C12.7915 11.3946 12.5372 11.5 12.272 11.5H6.27197C6.00676 11.5 5.7524 11.3946 5.56487 11.2071C5.37733 11.0196 5.27197 10.7652 5.27197 10.5Z" fill="currentColor"/>
              </svg>
              <svg class="w-[2vw] xl:w-[8px] 2xl:w-[10px] h-auto object-center object-cover shrink-0" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z" fill="currentColor"/>
              </svg>
            </button>
            </div>

            <!-- Advanced Search -->
          <div v-else class="w-full flex flex-col gap-[5.5vw]">
            <!-- Konten Advanced Search di sini -->
            <div class="w-full flex flex-row items-center justify-between">
              <span class="text-[2.7vw]">Advanced Search</span>

              <div class="flex flex-row items-center gap-[20px]">
                <!-- Clear Search -->
                <button @click="clearAdvanceSearch" class="btn__padding cursor-pointer">
                  <svg class="w-[3vw] h-auto object-center object-cover shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77425 0.0710887C9.89275 0.118913 10.0006 0.189488 10.0917 0.278784C10.1828 0.36808 10.2553 0.474348 10.3051 0.59152C10.3548 0.708692 10.3809 0.834473 10.3819 0.961681C10.3828 1.08889 10.3585 1.21503 10.3104 1.33291L6.78045 10.0055C7.24004 10.1656 7.70741 10.4084 8.11766 10.7339C8.83171 11.3009 9.41334 12.1546 9.41334 13.2898C9.41334 13.9808 9.58341 14.5555 9.84176 15.0256C10.2546 15.7799 11.1608 16.0498 12.0255 16.0498C12.2837 16.0498 12.5314 16.1519 12.714 16.3335C12.8966 16.5152 12.9992 16.7615 12.9992 17.0184C12.9992 17.2753 12.8966 17.5217 12.714 17.7034C12.5314 17.885 12.2837 17.9871 12.0255 17.9871H11.9086V18H3.47117C2.11058 18 0.674697 17.0946 0.638346 15.5138C0.608485 14.1887 0.891508 12.6815 1.69643 11.5308C2.37153 10.566 3.38808 9.89053 4.77073 9.773L8.50715 0.604487C8.55522 0.486608 8.62616 0.379304 8.71593 0.288701C8.80569 0.198098 8.91251 0.125972 9.03029 0.076441C9.14808 0.0269098 9.27452 0.000943603 9.40239 2.52436e-05C9.53026 -0.000893116 9.65576 0.0232543 9.77425 0.0710887ZM17.6625 17.9871C17.9208 17.9871 18.1684 17.885 18.351 17.7034C18.5336 17.5217 18.6362 17.2753 18.6362 17.0184C18.6362 16.7615 18.5336 16.5152 18.351 16.3335C18.1684 16.1519 17.9208 16.0498 17.6625 16.0498H15.1608C14.9025 16.0498 14.6549 16.1519 14.4723 16.3335C14.2897 16.5152 14.1871 16.7615 14.1871 17.0184C14.1871 17.2753 14.2897 17.5217 14.4723 17.7034C14.6549 17.885 14.9025 17.9871 15.1608 17.9871H17.6625ZM17.4782 13.5029C17.4782 13.7598 17.3756 14.0062 17.193 14.1879C17.0104 14.3695 16.7627 14.4716 16.5045 14.4716H14.017C13.7588 14.4716 13.5111 14.3695 13.3285 14.1879C13.1459 14.0062 13.0433 13.7598 13.0433 13.5029C13.0433 13.246 13.1459 12.9996 13.3285 12.818C13.5111 12.6363 13.7588 12.5343 14.017 12.5343H16.5045C16.7627 12.5343 17.0104 12.6363 17.193 12.818C17.3756 12.9996 17.4782 13.246 17.4782 13.5029ZM15.1608 10.8256C15.419 10.8256 15.6667 10.7235 15.8493 10.5419C16.0319 10.3602 16.1345 10.1139 16.1345 9.85695C16.1345 9.60005 16.0319 9.35367 15.8493 9.17202C15.6667 8.99036 15.419 8.88831 15.1608 8.88831H12.672C12.4137 8.88831 12.1661 8.99036 11.9835 9.17202C11.8009 9.35367 11.6983 9.60005 11.6983 9.85695C11.6983 10.1139 11.8009 10.3602 11.9835 10.5419C12.1661 10.7235 12.4137 10.8256 12.672 10.8256H15.1608Z" fill="#101828"/>
                  </svg>

                  <span class="">Clear All Filter</span>
                </button>
                
                <!-- Close Search -->
                <button class="btn__padding cursor-pointer" @click="closeAdvanceSearch">
                  <svg class="w-auto h-[1.5vw] object-center object-cover shrink-0 rotate-90" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z" fill="currentColor"/>
                  </svg>
                  <span class="">Close</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-4 gap-[2.7vw] xl:gap-[13px] 2xl:gap-[20px]">
              <!-- ID -->
              <div class="flex flex-col gap-[2.7vw] flex-none">
                <label for="id" class="text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">Work Orders ID</label>
                <div class="btn__padding text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.woId" name="id" id="id" class="outline-none w-full cursor-pointer">
                    <option value="">All Work Orders</option>
                    <option v-for="wo in workOrders" :key="wo.id" :value="wo.id">{{ wo.id }}</option>
                  </select>
                </div>
              </div>
              
              <!-- Status -->
              <div class="flex flex-col gap-[2.7vw] flex-none">
                <label for="status" class="text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">Status</label>
                <div class="btn__padding text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.status" name="status" id="status" class="outline-none w-full cursor-pointer">
                    <option value="">All Status</option>
                    <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ getStatusLabel(status) }}</option>
                  </select>
                </div>
              </div>

              <!-- Priorities -->
              <div class="flex flex-col gap-[2.7vw] flex-none">
                <label for="priority" class="text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">Priorities</label>
                <div class="btn__padding text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.priority" name="priority" id="priority" class="outline-none w-full cursor-pointer">
                    <option value="">All Priorities</option>
                    <option v-for="priority in uniquePriorities" :key="priority" :value="priority">{{ priority }}</option>
                  </select>
                </div>
              </div>

              <!-- Progress -->
              <div class="flex flex-col gap-[2.7vw] flex-none">
                <label for="progress" class="text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">Progress</label>
                <div class="btn__padding text-[2.7vw] xl:text-[10px] 2xl:text-[14px]">
                  <select v-model="advanceSearch.progress" name="progress" id="progress" class="outline-none w-full cursor-pointer">
                    <option value="">All Progress</option>
                    <option value="0-25">0-25%</option>
                    <option value="26-50">26-50%</option>
                    <option value="51-75">51-75%</option>
                    <option value="76-99">76-99%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
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
              <MdiIcon :path="mdiAlertCircle" class="h-8 w-8 mx-auto mb-2" />
              <p class="font-medium">Error loading work orders</p>
              <p class="text-sm mt-1">{{ error }}</p>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-else-if="filteredWorkOrders.length === 0" class="p-8 text-center">
            <MdiIcon :path="mdiClipboardTextOutline" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
            <p class="text-gray-600">{{ searchQuery || statusFilter || priorityFilter || typeFilter ? 'Try adjusting your filters' : 'Create your first work order to get started' }}</p>
          </div>

        <div v-else v-for="workOrder in paginatedWorkOrders" :key="workOrder.id" class="w-full h-fit px-[8vw] py-[5.5vw] rounded-[4vw]" style="background-color: var(--color-bgsidebar);">
            <div class="container__data__mobile">

              <div class="flex flex-col gap-[2.7vw]">
                <span class="text-[3vw] xl:text-[10px] 2xl:text-[14px]">{{ workOrder.id }}</span>
                <div class="flex flex-col gap-[1.5vw]">
                    <div class="background__icon__content">
                      <img :src="getAssetIcon(workOrder.assetName)" alt="Asset Icon" class="w-auto xl:h-[13px] 2xl:h-[18px] object-center object-contain shrink-0" />
                    </div>
  
                    <div class="flex flex-col gap-[5px]">
                      <div class="">
                        <span class="xl:text-[10px] 2xl:text-[14px]">{{ workOrder.assetName.split(' ').slice(0, 2).join(' ') }}</span>
                      </div>
                      <p class="label__secondary line-clamp-3 max-w-[27vw]">{{ workOrder.title }}</p>
                    </div>
  
                    <div class="flex flex-wrap items-center gap-[10px]">
                      <div :class="getPriorityBadgeClass(workOrder.priority)">{{ workOrder.priority }}</div>
                      <div :class="getTypeBadgeClass(workOrder.type)">{{ getTypeLabel(workOrder.type) }}</div>
                    </div>
                </div>

                <div class="flex flex-col mt-[2.7vw]">
                      <span :class="getItemStatusBadgeClass(getWorkOrderItemStatus(workOrder.id).status)" class="mb-1 w-fit inline-flex items-center text-[2.7vw] xl:text-[10px] 2xl:text-[14px] font-semibold rounded-full ps-[2.7vw] pe-[8vw] py-[1.5vw] xl:ps-[13px] 2xl:ps-[20px] xl:pe-[30px] 2xl:pe-[50px] xl:py-[7px] 2xl:py-[10px]">
                        <MdiIcon :path="getItemStatusIcon(getWorkOrderItemStatus(workOrder.id).status)" class="w-[4vw] h-[4vw] mr-[1.5vw] xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 xl:mr-1.5 2xl:mr-2.5" />
                        {{ getItemStatusLabel(getWorkOrderItemStatus(workOrder.id).status) }}
                      </span>
                      <span class="label__secondary truncate" :title="getWorkOrderItemStatus(workOrder.id).message">
                        {{ getWorkOrderItemStatus(workOrder.id).message }}
                      </span>
                    </div>
              </div>

              <div class="flex flex-col items-end gap-[3.5vw]">

                <p class="label__secondary">{{ workOrder.assetId }}</p>

                <div :class="getStatusBadgeClass(workOrder.status)">
                  {{ getStatusLabel(workOrder.status) }}
                </div>

                <div class="flex items-center justify-center">
                    <div class="flex flex-col items-end gap-1">
                      <div class="flex items-center">
                          <span class="text-xs font-medium">
                            {{ getWorkOrderCompletion(workOrder.id) }}%
                          </span>
                          <div class="w-[14vw] xl:w-16 2xl:w-32 rounded-full xl:h-[10px] 2xl:h-[15px] ml-2" style="background-color: var(--color-bgtable);">
                            <div
                              :class="getCompletionBarClass(getWorkOrderCompletion(workOrder.id))"
                              class="h-[2.2vw] xl:h-[10px] 2xl:h-[15px] rounded-full transition-all duration-300"
                              :style="{ width: getWorkOrderCompletion(workOrder.id) + '%' }"
                            ></div>
                          </div>
                        </div>
                        <span :class="getWorkOrderProgressStatus(workOrder).class" class="label__secondary">
                          {{ getWorkOrderProgressStatus(workOrder).label }}
                        </span>
                      </div>
                </div>

                <div class="flex flex-col justify-center items-center">
                  <div class="flex flex-col items-end">
                    <span class="text-[2.7vw] xl:text-[10px] 2xl:text-[14px] font-medium">{{ getAssignedTeamInfo(workOrder.assignedTo).mainPerson }}</span>
                    <span v-if="getAssignedTeamInfo(workOrder.assignedTo).otherCount > 0" class="label__secondary">
                      +{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount }} other{{ getAssignedTeamInfo(workOrder.assignedTo).otherCount > 1 ? 's' : '' }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-center">
                  <div class="flex justify-end items-center gap-2.5">
                    <button class="container__action" :title="`View ${workOrder.id}`">
                      <MdiIcon :path="mdiEye" class="w-[5vw] h-[5vw] xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                    </button>
                    <button class="container__action" :title="`Edit ${workOrder.id}`">
                      <MdiIcon :path="mdiPencil" class="w-[5vw] h-[5vw] xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                    </button>
                    <button class="bg-red-100 p-[2vw] xl:p-[8px] 2xl:p-[15px] hover:bg-red-300 rounded-[50px] cursor-pointer text-red-800" :title="`Delete ${workOrder.id}`">
                      <MdiIcon :path="mdiDelete" class="w-[5vw] h-[5vw] xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </template>

    <template #pagination>
      <div v-if="filteredWorkOrders.length > 0" class="my-[20px]">
            <div class="flex items-center justify-center xl:justify-between">
              <div class="hidden xl:flex flex-row items-center xl:gap-[13px] 2xl:gap-[20px]">
                <p class="xl:text-[10px] 2xl:text-[14px]">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredWorkOrders.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredWorkOrders.length }}</span>
                  results
                </p>
                <label class="xl:text-[10px] 2xl:text-[14px]">Items per page:</label>
                <div class="pagination__option">
                  <select
                    v-model="itemsPerPage"
                    class="xl:text-[10px] 2xl:text-[14px] outline-none xl:min-w-[40px] 2xl:min-w-[50px] cursor-pointer"
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
                  <svg class="w-auto h-[2vw] xl:h-[8px] 2xl:h-[13px] object-center object-cover shrink-0" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.134766 6.50001L6.08873 12.454L7.44509 11.0976L2.84748 6.50001L7.44509 1.9024L6.08873 0.546043L0.134766 6.50001ZM5.55444 6.50001L11.5084 12.454L12.8648 11.0976L8.26716 6.50001L12.8648 1.9024L11.5084 0.546043L5.55444 6.50001Z" fill="currentColor"/>
                  </svg>

                </button>
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="pageButton"
                  title="Previous page"
                >
                  <svg class="w-auto h-[1.4vw] xl:h-[6px] 2xl:h-[10px] object-center object-cover shrink-0 rotate-90" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z" fill="currentColor"/>
                  </svg>

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
                   <svg class="w-auto h-[1.4vw] xl:h-[6px] 2xl:h-[10px] object-center object-cover shrink-0 -rotate-90" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z" fill="currentColor"/>
                  </svg>
                </button>
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="pageButton"
                  title="Last page"
                >
                   <svg class="w-auto h-[2vw] xl:h-[8px] 2xl:h-[13px] object-center object-cover shrink-0 rotate-180" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.134766 6.50001L6.08873 12.454L7.44509 11.0976L2.84748 6.50001L7.44509 1.9024L6.08873 0.546043L0.134766 6.50001ZM5.55444 6.50001L11.5084 12.454L12.8648 11.0976L8.26716 6.50001L12.8648 1.9024L11.5084 0.546043L5.55444 6.50001Z" fill="currentColor"/>
                  </svg>
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

// Computed properties untuk mendapatkan nilai unik dari work orders
const uniqueStatuses = computed(() => {
  const statuses = new Set()
  workOrders.value.forEach(wo => statuses.add(wo.status))
  return Array.from(statuses)
})

const uniquePriorities = computed(() => {
  const priorities = new Set()
  workOrders.value.forEach(wo => priorities.add(wo.priority))
  return Array.from(priorities)
})

const getStatusBadgeClass = (status) => {
  const baseClass = 'flex items-center justify-center text-[2.7vw] px-[3.5vw] py-[2vw] xl:px-[13px] xl:py-[7px] 2xl:px-[20px] 2xl:py-[10px] xl:text-[10px] 2xl:text-[14px] font-medium rounded-[25px] xl:rounded-[33px] 2xl:rounded-[50px]'
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
  const baseClass = 'flex items-center justify-center text-[2.7vw] px-[3.5vw] py-[2vw] xl:px-[13px] xl:py-[7px] 2xl:px-[20px] 2xl:py-[10px] xl:text-[10px] 2xl:text-[14px] font-medium rounded-[25px] xl:rounded-[33px] 2xl:rounded-[50px]'
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
  const baseClass = 'flex items-center justify-center text-[2.7vw] px-[3.5vw] py-[2vw] xl:px-[13px] xl:py-[7px] 2xl:px-[20px] 2xl:py-[10px] xl:text-[10px] 2xl:text-[14px] font-medium rounded-[25px] xl:rounded-[33px] 2xl:rounded-[50px]'
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
  return percentage
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
