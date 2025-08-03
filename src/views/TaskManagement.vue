<template>
  <Layout>
    <template #content>
      <div id="desktop" class="h-full hidden xl:flex flex-col h-full">
        <!-- Page Header -->
        <div class="w-full container__section">
          <div class="container__header__main">
            <span class="text-[16px] 2xl:text-[24px] font-[500]">Task Management</span>
            <p class="text-[9px] 2xl:text-[14px] font-[300]">
              Manage and track all maintenance tasks and assignments.
            </p>
          </div>

          <div class="flex flex-row items-center gap-[20px]">
            <div class="background__icon">
              <img src="/icons/unlove.svg" alt="Unlove Icon"
                class="w-auto h-[12px] 2xl:h-[19px] object-center object-cover shrink-0" :show-tooltip="true" />
            </div>
          </div>
        </div>

        <!-- Table Bar -->
        <div v-if="!showAdvanceSearch" class="w-full container__section mt-[27px] 2xl:mt-[40px]">
          <div v-if="!showAdvanceSearch" class="flex flex-row items-center gap-[10px]">
            <div class="search">
              <img src="/icons/search.svg" alt="Search Icon"
                class="w-[13px] 2xl:w-[20px] h-auto object-center object-cover shrink-0" />
              <input v-model="searchQuery" type="text" name="" id="" class="w-full h-full outline-none"
                placeholder="Search Task Management" />
            </div>

            <button @click="refreshData" :disabled="loading" class="background__icon">
              <img src="/icons/repeat.svg" alt="Repeat Icon"
                class="w-[11px] h-[11px] 2xl:w-[16px] 2xl:h-[16px] object-center object-cover shrink-0" />
            </button>

            <button @click="printData" class="background__icon">
              <img src="/icons/print.svg" alt="Print Icon"
                class="w-[11px] h-[11px] 2xl:w-[16px] 2xl:h-[16px] object-center object-cover shrink-0" />
            </button>
          </div>

          <!-- <div v-if="showAdvanceSearch" class="flex flex-row items-center gap-[10px]">
<div>ayam</div>
          </div> -->

          <button @click="showAdvanceSearch = true"
            class="cursor-pointer xl:px-[20px] xl:py-[13px] 2xl:px-[30px] 2xl:py-[20px] xl:rounded-[33px] 2xl:rounded-[50px] flex flex-row items-center justify-center xl:gap-[13px] 2xl:gap-[20px]"
            style="background-color: var(--color-bgtable);">
            <svg class="w-[3vw] xl:w-[12px] h-auto 2xl:w-[18px] 2xl:h-[11px] object-center object-cover shrink-0"
              viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M0.271973 1.5C0.271973 1.23478 0.377329 0.98043 0.564866 0.792893C0.752402 0.605357 1.00676 0.5 1.27197 0.5H17.272C17.5372 0.5 17.7915 0.605357 17.9791 0.792893C18.1666 0.98043 18.272 1.23478 18.272 1.5C18.272 1.76522 18.1666 2.01957 17.9791 2.20711C17.7915 2.39464 17.5372 2.5 17.272 2.5H1.27197C1.00676 2.5 0.752402 2.39464 0.564866 2.20711C0.377329 2.01957 0.271973 1.76522 0.271973 1.5ZM2.27197 6C2.27197 5.73478 2.37733 5.48043 2.56487 5.29289C2.7524 5.10536 3.00676 5 3.27197 5H15.272C15.5372 5 15.7915 5.10536 15.9791 5.29289C16.1666 5.48043 16.272 5.73478 16.272 6C16.272 6.26522 16.1666 6.51957 15.9791 6.70711C15.7915 6.89464 15.5372 7 15.272 7H3.27197C3.00676 7 2.7524 6.89464 2.56487 6.70711C2.37733 6.51957 2.27197 6.26522 2.27197 6ZM5.27197 10.5C5.27197 10.2348 5.37733 9.98043 5.56487 9.79289C5.7524 9.60536 6.00676 9.5 6.27197 9.5H12.272C12.5372 9.5 12.7915 9.60536 12.9791 9.79289C13.1666 9.98043 13.272 10.2348 13.272 10.5C13.272 10.7652 13.1666 11.0196 12.9791 11.2071C12.7915 11.3946 12.5372 11.5 12.272 11.5H6.27197C6.00676 11.5 5.7524 11.3946 5.56487 11.2071C5.37733 11.0196 5.27197 10.7652 5.27197 10.5Z"
                fill="currentColor" />
            </svg>

            <span class="hidden xl:block xl:text-[10px] 2xl:text-[14px]">Advanced Search</span>
            <svg class="w-[2vw] xl:w-[8px] 2xl:w-[10px] h-auto object-center object-cover shrink-0" viewBox="0 0 13 9"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z"
                fill="currentColor" />
            </svg>
          </button>
        </div>

        <!-- Advanced Search -->
        <div v-if="showAdvanceSearch" class="w-full container__section mt-[27px] 2xl:mt-[40px]">
          <span class="xl:text-[12px] 2xl:text-[18px] font-[400]">Advanced Search</span>
          <div class="flex flex-row xl:gap-[13px] 2xl:gap-[20px]">

            <button
              class="cursor-pointer xl:px-[20px] xl:py-[13px] 2xl:px-[30px] 2xl:py-[20px] xl:rounded-[33px] 2xl:rounded-[50px] flex flex-row items-center justify-center xl:gap-[13px] 2xl:gap-[20px]"
              style="background-color: var(--color-bgtable);">
              <svg class="xl:w-[12px] 2xl:w-[18px] xl:h-[12px] 2xl:h-[18px] object-center object-cover shrink-0"
                viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9.77425 0.0710887C9.89275 0.118913 10.0006 0.189488 10.0917 0.278784C10.1828 0.36808 10.2553 0.474348 10.3051 0.59152C10.3548 0.708692 10.3809 0.834473 10.3819 0.961681C10.3828 1.08889 10.3585 1.21503 10.3104 1.33291L6.78045 10.0055C7.24004 10.1656 7.70741 10.4084 8.11766 10.7339C8.83171 11.3009 9.41334 12.1546 9.41334 13.2898C9.41334 13.9808 9.58341 14.5555 9.84176 15.0256C10.2546 15.7799 11.1608 16.0498 12.0255 16.0498C12.2837 16.0498 12.5314 16.1519 12.714 16.3335C12.8966 16.5152 12.9992 16.7615 12.9992 17.0184C12.9992 17.2753 12.8966 17.5217 12.714 17.7034C12.5314 17.885 12.2837 17.9871 12.0255 17.9871H11.9086V18H3.47117C2.11058 18 0.674697 17.0946 0.638346 15.5138C0.608485 14.1887 0.891508 12.6815 1.69643 11.5308C2.37153 10.566 3.38808 9.89053 4.77073 9.773L8.50715 0.604487C8.55522 0.486608 8.62616 0.379304 8.71593 0.288701C8.80569 0.198098 8.91251 0.125972 9.03029 0.076441C9.14808 0.0269098 9.27452 0.000943603 9.40239 2.52436e-05C9.53026 -0.000893116 9.65576 0.0232543 9.77425 0.0710887ZM17.6625 17.9871C17.9208 17.9871 18.1684 17.885 18.351 17.7034C18.5336 17.5217 18.6362 17.2753 18.6362 17.0184C18.6362 16.7615 18.5336 16.5152 18.351 16.3335C18.1684 16.1519 17.9208 16.0498 17.6625 16.0498H15.1608C14.9025 16.0498 14.6549 16.1519 14.4723 16.3335C14.2897 16.5152 14.1871 16.7615 14.1871 17.0184C14.1871 17.2753 14.2897 17.5217 14.4723 17.7034C14.6549 17.885 14.9025 17.9871 15.1608 17.9871H17.6625ZM17.4782 13.5029C17.4782 13.7598 17.3756 14.0062 17.193 14.1879C17.0104 14.3695 16.7627 14.4716 16.5045 14.4716H14.017C13.7588 14.4716 13.5111 14.3695 13.3285 14.1879C13.1459 14.0062 13.0433 13.7598 13.0433 13.5029C13.0433 13.246 13.1459 12.9996 13.3285 12.818C13.5111 12.6363 13.7588 12.5343 14.017 12.5343H16.5045C16.7627 12.5343 17.0104 12.6363 17.193 12.818C17.3756 12.9996 17.4782 13.246 17.4782 13.5029ZM15.1608 10.8256C15.419 10.8256 15.6667 10.7235 15.8493 10.5419C16.0319 10.3602 16.1345 10.1139 16.1345 9.85695C16.1345 9.60005 16.0319 9.35367 15.8493 9.17202C15.6667 8.99036 15.419 8.88831 15.1608 8.88831H12.672C12.4137 8.88831 12.1661 8.99036 11.9835 9.17202C11.8009 9.35367 11.6983 9.60005 11.6983 9.85695C11.6983 10.1139 11.8009 10.3602 11.9835 10.5419C12.1661 10.7235 12.4137 10.8256 12.672 10.8256H15.1608Z"
                  fill="currentColor" />
              </svg>
              <span class="xl:text-[9px] 2xl:text-[14px]">Clear All Filters</span>
            </button>


            <button @click="showAdvanceSearch = false"
              class="cursor-pointer xl:px-[20px] xl:py-[13px] 2xl:px-[30px] 2xl:py-[20px] xl:rounded-[33px] 2xl:rounded-[50px] flex flex-row items-center justify-center xl:gap-[13px] 2xl:gap-[20px]"
              style="background-color: var(--color-bgtable);">
              <svg class="w-auto xl:h-[6px] 2xl:h-[10px] object-center object-cover shrink-0 rotate-90"
                viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z"
                  fill="currentColor" />
              </svg>
              <span class="xl:text-[9px] 2xl:text-[14px]">Close</span>
            </button>
          </div>
        </div>

        <div v-if="showAdvanceSearch"
          class="w-full grid grid-cols-4 xl:gap-y-[7px] xl:gap-x-[13px] 2xl:gap-y-[10px] 2xl:gap-x-[20px] justify-center items-center mt-[21px] 2xl:mt-[32px]">
          <div class="w-full flex flex-row items-center font-400 xl:text-[9px] 2xl:text-[14px]">
            <p class="">Task ID</p>
          </div>
          <div class="w-full flex flex-row items-center font-400 xl:text-[9px] 2xl:text-[14px]">
            <p class="">Status</p>
          </div>
          <div class="w-full flex flex-row items-center font-400 xl:text-[9px] 2xl:text-[14px]">
            <p class="">Priority</p>
          </div>
          <div class="w-full flex flex-row items-center font-400 xl:text-[9px] 2xl:text-[14px]">
            <p class="">Progress</p>
          </div>

          <div
            class="hidden bg-table flex-none xl:flex flex-row items-center gap-[20px] w-full h-full xl:max-h-[50px] 2xl:max-h-[75px] xl:px-[20px] 2xl:px-[30px] xl:py-[13px] 2xl:py-[20px] justify-center xl:rounded-[33px] 2xl:rounded-[50px] xl:max-w-[217px] 2xl:max-w-[326px] cursor-pointer">
            <select v-model="advanceSearch.taskId" name="id" id="id" class="outline-none w-full h-full xl:text-[10px] 2xl:text-[14px] cursor-pointer">
                    <option value="">All Tasks</option>
                    <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.id }}</option>
            </select>
          </div>

          <div
            class="hidden bg-table flex-none xl:flex flex-row items-center gap-[20px] w-full h-full xl:max-h-[50px] 2xl:max-h-[75px] xl:px-[20px] 2xl:px-[30px] xl:py-[13px] 2xl:py-[20px] justify-center xl:rounded-[33px] 2xl:rounded-[50px] xl:max-w-[217px] 2xl:max-w-[326px] cursor-pointer">
            <select v-model="advanceSearch.status" name="status" id="status" class="outline-none w-full h-full xl:text-[10px] 2xl:text-[14px] cursor-pointer">
      <option value="">All Status</option>
                    <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ getStatusLabel(status) }}</option>
            </select>
          </div>

          <div
            class="hidden bg-table flex-none xl:flex flex-row items-center gap-[20px] w-full h-full xl:max-h-[50px] 2xl:max-h-[75px] xl:px-[20px] 2xl:px-[30px] xl:py-[13px] 2xl:py-[20px] justify-center xl:rounded-[33px] 2xl:rounded-[50px] xl:max-w-[217px] 2xl:max-w-[326px] cursor-pointer">
            <select v-model="advanceSearch.priority" name="priority" id="priority" class="outline-none w-full h-full xl:text-[10px] 2xl:text-[14px] cursor-pointer">
   <option value="">All Priorities</option>
                    <option v-for="priority in uniquePriorities" :key="priority" :value="priority">{{ priority }}</option>
            </select>
          </div>

          <div
            class="hidden bg-table flex-none xl:flex flex-row items-center gap-[20px] w-full h-full xl:max-h-[50px] 2xl:max-h-[75px] xl:px-[20px] 2xl:px-[30px] xl:py-[13px] 2xl:py-[20px] justify-center xl:rounded-[33px] 2xl:rounded-[50px] xl:max-w-[217px] 2xl:max-w-[326px] cursor-pointer">
            <select v-model="advanceSearch.progress" name="progress" id="progress" class="outline-none w-full h-full xl:text-[10px] 2xl:text-[14px] cursor-pointer">
                    <option value="">All Progress</option>
                    <option value="0-25">0-25%</option>
                    <option value="26-50">26-50%</option>
                    <option value="51-75">51-75%</option>
                    <option value="76-99">76-99%</option>
                    <option value="100">100%</option>
            </select>
          </div>



        </div>
        <!-- Tasks Table -->
        <div class="xl:mt-[21px] 2xl:mt-[32px] flex-1 flex flex-col min-h-0">
          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-flex items-center">
              <div class="w-6 h-6 mr-3 border-b-2 rounded-full animate-spin border-petrosea-primary"></div>
              <span class="text-gray-600">Loading tasks...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <div class="text-red-600">
              <svg class="w-8 h-8 mx-auto mb-2 fill-current" viewBox="0 0 24 24">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
              <p class="font-medium">Error loading tasks</p>
              <p class="mt-1 text-sm">{{ error }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredTasks.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-400 fill-current" viewBox="0 0 24 24">
              <path
                d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z" />
            </svg>
            <h3 class="mb-2 text-lg font-medium text-gray-900">
              No tasks found
            </h3>
            <p class="text-gray-600">
              {{
                searchQuery ||
                  advanceSearch.taskId ||
                  advanceSearch.status ||
                  advanceSearch.priority ||
                  advanceSearch.progress
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"
              }}
            </p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-y-auto">
            <table class="w-full table-fixed">
              <thead class="sticky z-10 font-medium" style="top: -0.10rem;">
                <tr class="text-left text-[9px] 2xl:text-[14px]">
                  <!-- Task ID -->
                  <th @click="sortBy('id')" class="container__header__table cursor-pointer select-none">
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'id'
                        ? 'text-petrosea-primary font-medium'
                        : ''
                        " class="truncate">Task ID</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" alt="Arrow Up" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'id' && sortDirection === 'asc'
                          ? 'rotate-180 text-petrosea-primary'
                          : 'opacity-30'
                          " />
                        <img src="/icons/arrow.svg" alt="Arrow Down" class="w-[6px] h-auto object-cover shrink-0"
                          :class="sortField === 'id' && sortDirection === 'desc'
                            ? 'text-petrosea-primary'
                            : 'opacity-30'
                            " />
                      </div>
                    </div>
                  </th>

                  <!-- Task Details -->
                  <th class="container__header__table cursor-pointer select-none">
                    Task Details
                  </th>

                  <!-- Status -->
                  <th @click="sortBy('status')" class="container__header__table cursor-pointer select-none">
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'status'
                        ? 'text-petrosea-primary font-semibold'
                        : ''
                        ">Status</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'status' && sortDirection === 'asc'
                          ? 'rotate-180 text-petrosea-primary'
                          : 'opacity-30'
                          " />
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'status' && sortDirection === 'desc'
                          ? 'text-petrosea-primary'
                          : 'opacity-30'
                          " />
                      </div>
                    </div>
                  </th>

                  <!-- Progress -->
                  <th @click="sortBy('progress')" class="container__header__table cursor-pointer select-none">
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'progress'
                        ? 'text-petrosea-primary font-medium'
                        : ''
                        ">Progress</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'progress' && sortDirection === 'asc'
                          ? 'rotate-180 text-petrosea-primary'
                          : 'opacity-30'
                          " />
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'progress' && sortDirection === 'desc'
                          ? 'text-petrosea-primary'
                          : 'opacity-30'
                          " />
                      </div>
                    </div>
                  </th>

                  <!-- Priority -->
                  <th @click="sortBy('priority')" class="container__header__table cursor-pointer select-none">
                    <div class="flex items-center justify-between w-full">
                      <span :class="sortField === 'priority'
                        ? 'text-petrosea-primary font-normal'
                        : ''
                        ">Priority</span>
                      <div class="flex flex-col gap-0.5">
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'priority' && sortDirection === 'asc'
                          ? 'rotate-180 text-petrosea-primary'
                          : 'opacity-30'
                          " />
                        <img src="/icons/arrow.svg" class="w-[6px] h-auto object-cover shrink-0" :class="sortField === 'items' && sortDirection === 'desc'
                          ? 'text-petrosea-primary'
                          : 'opacity-30'
                          " />
                      </div>
                    </div>
                  </th>

                  <th class="container__header__table cursor-pointer select-none">
                    Assigned To
                  </th>
                  <th class="container__header__table cursor-pointer select-none">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody v-for="task in paginatedTasks" :key="task.id" class="">
                <tr>
                  <td colspan="7" class="h-6"></td>
                </tr>
                <tr class="text-left text-[9px] 2xl:text-[14px]">
                  <!-- ID -->
                  <td class="container__data">{{ task.id }}</td>
                  <!-- task Details -->
                  <td>
                    <div class="flex flex-col   gap-[7px] 2xl:gap-[10px]">
                      <div class="background__icon__content">
                        <svg width="17" height="20" class="w-[16px] h-[16px] 2xl:w-[24px] 2xl:h-[24px]"
                          viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id="mask0_55_288" style="mask-type: luminance" maskUnits="userSpaceOnUse" x="0" y="0"
                            width="17" height="20">
                            <path
                              d="M10.3301 1L15.8301 6.5V18C15.8301 18.55 15.3801 19 14.8301 19H2.83008C2.28008 19 1.83008 18.55 1.83008 18V2C1.83008 1.45 2.28008 1 2.83008 1H10.3301Z"
                              fill="white" stroke="white" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path d="M11.3301 1.5V6H15.8301L11.3301 1.5Z" fill="black" stroke="black" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.3301 1L15.8301 6.5" stroke="white" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" />
                          </mask>
                          <g mask="url(#mask0_55_288)">
                            <path d="M20.8301 -2H-3.16992V22H20.8301V-2Z" fill="#718096" />
                          </g>
                        </svg>
                      </div>

                      <div class="flex flex-col gap-[5px]">
                        <div class="flex justify-between">
                          <span class="text-[9px] 2xl:text-[14px]">WO: {{ task.workOrderId }}</span>
                        </div>
                        <p class="truncate text-[9px] 2xl:text-[14px] font-[400]" style="color: var(--text-muted);">
                          {{ task.title }}
                        </p>
                        <p class="text-[9px] 2xl:text-[14px] font-[400] line-clamp-2" style="color: var(--text-muted);">
                          {{ task.description }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="container__data">
                    <div :class="getStatusBadgeClass(task.status)">
                      {{ getStatusLabel(task.status) }}
                    </div>
                  </td>
                  <!-- Progress -->
                  <td>
                    <div class="flex items-center justify-center">
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center">
                          <div class="w-[66px] 2xl:w-[100px] bg-gray-200 rounded-full h-[10px] 2xl:h-[15px] mr-2">
                            <div :class="getCompletionBarClass(task.progressPercentage)
                              " class="h-[10px] 2xl:h-[15px] rounded-full transition-all duration-300" :style="{
                                width: task.progressPercentage + '%',
                              }"></div>
                          </div>
                          <span class="text-[9px] 2xl:text-[14px] font-medium">
                            {{ task.progressPercentage }}%
                          </span>
                        </div>
                        <span :class="getProgressStatus(task).class" class="label__secondary">
                          {{ getProgressStatus(task) }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <!-- Priority -->
                  <td class="container__data">
                    <div :class="getPriorityBadgeClass(task.priority)">
                      {{ task.priority }}
                    </div>
                  </td>
                  <!-- Assigned To -->
                  <td>
                    <div class="flex flex-col items-center justify-center">
                      <div class="flex flex-col">
                        <span class="text-[9px] 2xl:text-[14px] font-medium">{{ task.assignedTo }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td>
                    <div class="flex items-center justify-center">
                      <div class="flex justify-end items-center gap-2.5">
                        <button class="container__action" :title="`View ${task.id}`">
                          <MdiIcon :path="mdiEye" class="xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                        </button>
                        <button class="container__action" :title="`Edit ${task.id}`">
                          <MdiIcon :path="mdiPencil" class="xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                        </button>
                        <button
                          class="bg-red-100 xl:p-[8px] 2xl:p-[15px] hover:bg-red-300 rounded-[50px] cursor-pointer text-red-800"
                          :title="`Delete ${task.id}`">
                          <MdiIcon :path="mdiDelete" class="xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
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

      <div id="mobile" class="flex xl:hidden flex-col gap-[3vw]">
        <div class="flex flex-col px-[8vw] py-[5.5vw] rounded-[4vw]" style="background-color: var(--color-bgsidebar);">
          <div class="flex flex-row gap-[2.7vw]">
            <div class="container__header__main">
              <span class="title__main">Task Management</span>
              <p class="desc__main">Manage and track all maintenance tasks and assignments.</p>
            </div>
                        <div class="flex flex-row items-center gap-[2.7vw] xl:gap-[13px] 2xl:gap-[20px]">
              <FavoriteButton :show-tooltip="true" />
            </div>
          </div>
          <div class="w-full container__section mt-[4.444vw]">
            <div v-if="!showAdvanceSearch" class="flex flex-row items-center gap-[2vw] xl:gap-[7px] 2xl:gap-[10px]">
              <div class="search outline__input">
                <img src="/icons/search.svg" alt="Search Icon"
                  class="w-[3.5vw] xl:w-[13px] 2xl:w-[20px] h-auto object-center object-cover shrink-0">
                <input v-model="searchQuery" type="text" name="" id="" class="w-full h-full outline-none"
                  placeholder="Search Task">
              </div>

              <button @click="refreshData" :disabled="loading" class="background__icon">
                <img src="/icons/repeat.svg" alt="Repeat Icon"
                  class="w-[3.5vw] xl:w-[13px] xl:h-[13px] 2xl:w-[16px] 2xl:h-[16px] object-center object-cover shrink-0">
              </button>

              <button @click="printData" class="background__icon">
                <img src="/icons/print.svg" alt="Print Icon"
                  class="w-[3.5vw] xl:w-[13px] xl:h-[13px] 2xl:w-[16px] 2xl:h-[16px] object-center object-cover shrink-0">
              </button>
              <button @click="showAdvanceSearch = true"
                class="cursor-pointer min-h-[10vw] xl:min-h-full px-[3vw] py-[2.7vw] xl:px-[20px] xl:py-[13px] 2xl:px-[30px] 2xl:py-[20px] rounded-[7vw] xl:rounded-[33px] 2xl:rounded-[50px] flex flex-row items-center justify-center gap-[2vw] xl:gap-[13px] 2xl:gap-[20px]"
                style="background-color: var(--color-bgtable);">
                <svg class="w-[3vw] h-auto object-center object-cover shrink-0" viewBox="0 0 19 12" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.271973 1.5C0.271973 1.23478 0.377329 0.98043 0.564866 0.792893C0.752402 0.605357 1.00676 0.5 1.27197 0.5H17.272C17.5372 0.5 17.7915 0.605357 17.9791 0.792893C18.1666 0.98043 18.272 1.23478 18.272 1.5C18.272 1.76522 18.1666 2.01957 17.9791 2.20711C17.7915 2.39464 17.5372 2.5 17.272 2.5H1.27197C1.00676 2.5 0.752402 2.39464 0.564866 2.20711C0.377329 2.01957 0.271973 1.76522 0.271973 1.5ZM2.27197 6C2.27197 5.73478 2.37733 5.48043 2.56487 5.29289C2.7524 5.10536 3.00676 5 3.27197 5H15.272C15.5372 5 15.7915 5.10536 15.9791 5.29289C16.1666 5.48043 16.272 5.73478 16.272 6C16.272 6.26522 16.1666 6.51957 15.9791 6.70711C15.7915 6.89464 15.5372 7 15.272 7H3.27197C3.00676 7 2.7524 6.89464 2.56487 6.70711C2.37733 6.51957 2.27197 6.26522 2.27197 6ZM5.27197 10.5C5.27197 10.2348 5.37733 9.98043 5.56487 9.79289C5.7524 9.60536 6.00676 9.5 6.27197 9.5H12.272C12.5372 9.5 12.7915 9.60536 12.9791 9.79289C13.1666 9.98043 13.272 10.2348 13.272 10.5C13.272 10.7652 13.1666 11.0196 12.9791 11.2071C12.7915 11.3946 12.5372 11.5 12.272 11.5H6.27197C6.00676 11.5 5.7524 11.3946 5.56487 11.2071C5.37733 11.0196 5.27197 10.7652 5.27197 10.5Z"
                    fill="currentColor" />
                </svg>
                <svg class="w-[2vw] xl:w-[8px] 2xl:w-[10px] h-auto object-center object-cover shrink-0"
                  viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z"
                    fill="currentColor" />
                </svg>
              </button>
            </div>



          </div>

          <!-- Advanced Search -->
          <div v-if="showAdvanceSearch" class="w-full container__section mt-[4.444vw]">
            <span class="text-[9px] font-[400]">Advanced Search</span>
            <div class="flex flex-row gap-[2.778vw]">

              <button
                class="cursor-pointer px-[4.167vw] py-[2.778vw] rounded-[6.944vw] flex flex-row items-center justify-center gap-[2.778vw]"
                style="background-color: var(--color-bgtable);">
                  <svg class="w-[3vw] h-auto object-center object-cover shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77425 0.0710887C9.89275 0.118913 10.0006 0.189488 10.0917 0.278784C10.1828 0.36808 10.2553 0.474348 10.3051 0.59152C10.3548 0.708692 10.3809 0.834473 10.3819 0.961681C10.3828 1.08889 10.3585 1.21503 10.3104 1.33291L6.78045 10.0055C7.24004 10.1656 7.70741 10.4084 8.11766 10.7339C8.83171 11.3009 9.41334 12.1546 9.41334 13.2898C9.41334 13.9808 9.58341 14.5555 9.84176 15.0256C10.2546 15.7799 11.1608 16.0498 12.0255 16.0498C12.2837 16.0498 12.5314 16.1519 12.714 16.3335C12.8966 16.5152 12.9992 16.7615 12.9992 17.0184C12.9992 17.2753 12.8966 17.5217 12.714 17.7034C12.5314 17.885 12.2837 17.9871 12.0255 17.9871H11.9086V18H3.47117C2.11058 18 0.674697 17.0946 0.638346 15.5138C0.608485 14.1887 0.891508 12.6815 1.69643 11.5308C2.37153 10.566 3.38808 9.89053 4.77073 9.773L8.50715 0.604487C8.55522 0.486608 8.62616 0.379304 8.71593 0.288701C8.80569 0.198098 8.91251 0.125972 9.03029 0.076441C9.14808 0.0269098 9.27452 0.000943603 9.40239 2.52436e-05C9.53026 -0.000893116 9.65576 0.0232543 9.77425 0.0710887ZM17.6625 17.9871C17.9208 17.9871 18.1684 17.885 18.351 17.7034C18.5336 17.5217 18.6362 17.2753 18.6362 17.0184C18.6362 16.7615 18.5336 16.5152 18.351 16.3335C18.1684 16.1519 17.9208 16.0498 17.6625 16.0498H15.1608C14.9025 16.0498 14.6549 16.1519 14.4723 16.3335C14.2897 16.5152 14.1871 16.7615 14.1871 17.0184C14.1871 17.2753 14.2897 17.5217 14.4723 17.7034C14.6549 17.885 14.9025 17.9871 15.1608 17.9871H17.6625ZM17.4782 13.5029C17.4782 13.7598 17.3756 14.0062 17.193 14.1879C17.0104 14.3695 16.7627 14.4716 16.5045 14.4716H14.017C13.7588 14.4716 13.5111 14.3695 13.3285 14.1879C13.1459 14.0062 13.0433 13.7598 13.0433 13.5029C13.0433 13.246 13.1459 12.9996 13.3285 12.818C13.5111 12.6363 13.7588 12.5343 14.017 12.5343H16.5045C16.7627 12.5343 17.0104 12.6363 17.193 12.818C17.3756 12.9996 17.4782 13.246 17.4782 13.5029ZM15.1608 10.8256C15.419 10.8256 15.6667 10.7235 15.8493 10.5419C16.0319 10.3602 16.1345 10.1139 16.1345 9.85695C16.1345 9.60005 16.0319 9.35367 15.8493 9.17202C15.6667 8.99036 15.419 8.88831 15.1608 8.88831H12.672C12.4137 8.88831 12.1661 8.99036 11.9835 9.17202C11.8009 9.35367 11.6983 9.60005 11.6983 9.85695C11.6983 10.1139 11.8009 10.3602 11.9835 10.5419C12.1661 10.7235 12.4137 10.8256 12.672 10.8256H15.1608Z" fill="currentColor"/>
                  </svg>
                <span class="text-[1.944vw]">Clear All Filters</span>
              </button>


              <button @click="showAdvanceSearch = false"
                class="cursor-pointer px-[4.167vw] py-[2.778vw] rounded-[6.944vw] flex flex-row items-center justify-center gap-[2.778vw]"
                style="background-color: var(--color-bgtable);">
                <svg class="w-auto h-[1.5vw] object-center object-cover shrink-0 rotate-90" viewBox="0 0 13 9"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z"
                    fill="currentColor" />
                </svg>

                <span class="text-[1.944vw]">Close</span>
              </button>
            </div>
          </div>

          <div v-if="showAdvanceSearch" class="w-full grid grid-cols-1 justify-center items-center mt-[4.444vw]">
            <div class="w-full flex flex-row items-center font-400 text-[1.944vw]">
              <p class="">Task ID</p>
            </div>

            <div
              class="bg-table flex-none flex flex-row items-center w-full h-full max-h-[10.278vw] px-[4.167vw] py-[2.778vw] justify-center rounded-[6.944vw]  cursor-pointer mt-[1.389vw]">
              <select v-model="advanceSearch.taskId" name="id" id="id" class="outline-none w-full h-full text-[1.944vw] cursor-pointer">
                    <option value="">All Tasks</option>
                    <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.id }}</option>
              </select>
            </div>

            <div class="w-full flex flex-row items-center font-400 text-[1.944vw] mt-[2.778vw]">
              <p class="">Status</p>
            </div>


            <div
              class="bg-table flex-none flex flex-row items-center w-full h-full max-h-[10.278vw] px-[4.167vw] py-[2.778vw] justify-center rounded-[6.944vw]  cursor-pointer mt-[1.389vw]">
              <select v-model="advanceSearch.status" name="status" id="status" class="outline-none w-full h-full text-[1.944vw] cursor-pointer">
  <option value="">All Status</option>
                    <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ getStatusLabel(status) }}</option>
              </select>
            </div>

            <div class="w-full flex flex-row items-center font-400 text-[1.944vw] mt-[2.778vw]">
              <p class="">Priority</p>
            </div>


            <div
              class="bg-table flex-none flex flex-row items-center w-full h-full max-h-[10.278vw] px-[4.167vw] py-[2.778vw] justify-center rounded-[6.944vw]  cursor-pointer mt-[1.389vw]">
              <select v-model="advanceSearch.priority" name="priority" id="priority" class="outline-none w-full h-full text-[1.944vw] cursor-pointer">
 <option value="">All Priorities</option>
                    <option v-for="priority in uniquePriorities" :key="priority" :value="priority">{{ priority }}</option>
              </select>
            </div>

            <div class="w-full flex flex-row items-center font-400 text-[1.944vw] mt-[2.778vw]">
              <p class="">Progress</p>
            </div>


            <div
              class="bg-table flex-none flex flex-row items-center w-full h-full max-h-[10.278vw] px-[4.167vw] py-[2.778vw] justify-center rounded-[6.944vw]  cursor-pointer mt-[1.389vw]">
              <select v-model="advanceSearch.progress" name="progress" id="progress" class="outline-none w-full h-full text-[1.944vw] cursor-pointer">
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
            <MdiIcon :path="mdiAlertCircle" class="h-8 w-8 mx-auto mb-2" />
            <p class="font-medium">Error loading tasks</p>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTasks.length === 0" class="p-8 text-center">
          <MdiIcon :path="mdiClipboardTextOutline" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p class="text-gray-600">{{ searchQuery || statusFilter || priorityFilter || typeFilter ?
            'Try adjusting your filters' : 'Create your first task to get started' }}</p>
        </div>

        <div v-else v-for="task in paginatedTasks" :key="task.id" class="w-full h-fit px-[8vw] py-[5.5vw] rounded-[4vw]"
          style="background-color: var(--color-bgsidebar);">
          <div class="container__data__mobile">

            <div class="flex flex-col gap-[2.7vw]">
              <span class="text-[3vw] xl:text-[10px] 2xl:text-[14px]">{{ task.id }}</span>
              <div class="flex flex-col gap-[1.5vw]">
                <div class="background__icon__content">
                  <svg width="16" height="14"  class="w-auto xl:h-[13px] 2xl:h-[18px] object-center object-contain shrink-0" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_132_2566" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0"
                      width="9" height="11">
                      <path
                        d="M5.11993 0.700195L7.8616 3.44186V9.17444C7.8616 9.4486 7.63728 9.67292 7.36312 9.67292H1.3813C1.10713 9.67292 0.882812 9.4486 0.882812 9.17444V1.19868C0.882812 0.924513 1.10713 0.700195 1.3813 0.700195H5.11993Z"
                        fill="white" stroke="white" stroke-width="0.99697" stroke-linecap="round"
                        stroke-linejoin="round" />
                      <path d="M5.61865 0.949463V3.19264H7.86183L5.61865 0.949463Z" fill="black" stroke="black"
                        stroke-width="0.99697" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5.12012 0.700195L7.86178 3.44186" stroke="white" stroke-width="0.99697"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </mask>
                    <g mask="url(#mask0_132_2566)">
                      <path d="M10.3543 -0.795166H-1.60938V11.1685H10.3543V-0.795166Z" fill="#718096" />
                    </g>
                  </svg>

                </div>

                <div class="flex flex-col gap-[5px]">
                  <div class="">
                    <span class="text-[3vw] xl:text-[10px] 2xl:text-[14px]">WO: {{ task.workOrderId }}</span>
                  </div>
                  <div>
                    <p class="truncate text-[3vw] xl:text-[9px] 2xl:text-[14px] font-[400] text-[#718096]">{{
                      task.title }}</p>
                    <p
                      class="text-[3vw] xl:text-[9px] 2xl:text-[14px] font-[400] text-[#718096] line-clamp-2 max-w-[27vw]">
                      {{ task.description
                      }}</p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-[10px]">
                  <div :class="getPriorityBadgeClass(task.priority)">{{ task.priority }}</div>
                </div>
              </div>

              <!-- <div class="flex flex-col mt-[2.7vw]">
                                      <div :class="getStatusBadgeClass(task.status)">
                      {{ getStatusLabel(task.status) }}
                    </div>
                </div> -->
            </div>

            <div class="flex flex-col items-end gap-[3.5vw]">


              <div :class="getStatusBadgeClass(task.status)">
                {{ getStatusLabel(task.status) }}
              </div>

              <div class="flex items-center justify-center">
                <div class="flex flex-col gap-[3.5vw] items-end">
                  <div class="flex items-center">
                    <span class="text-[3vw] font-medium">
                      {{ task.progressPercentage }}%
                    </span>
                    <div class="w-[13.889vw] h-[2.083vw] ml-2 bg-gray-200 rounded-full">
                      <div :class="getCompletionBarClass(task.progressPercentage)
                        " class="h-[2.083vw] transition-all duration-300 rounded-full"
                        :style="{ width: task.progressPercentage + '%' }"></div>
                    </div>


                  </div>
                  <span :class="getProgressStatus(task).class"
                    class=" text-[3vw]  xl:text-[10px] 2xl:text-[14px] font-normal"
                    style="color: var(--text-muted);">
                    {{ getProgressStatus(task) }}
                  </span>
                  <span class="text-[3vw] font-medium">{{ task.assignedTo }}</span>
                  <div class="flex items-center justify-center">
                                      <div class="flex justify-end items-center gap-2.5">
                    <button class="container__action" :title="`View ${task.id}`">
                      <MdiIcon :path="mdiEye" class="w-[5vw] h-[5vw] xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                    </button>
                    <button class="container__action" :title="`Edit ${task.id}`">
                      <MdiIcon :path="mdiPencil" class="w-[5vw] h-[5vw] xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                    </button>
                    <button class="bg-red-100 p-[2vw] xl:p-[8px] 2xl:p-[15px] hover:bg-red-300 rounded-[50px] cursor-pointer text-red-800" :title="`Delete ${task.id}`">
                      <MdiIcon :path="mdiDelete" class="w-[5vw] h-[5vw] xl:w-3 xl:h-3 2xl:w-5 2xl:h-5" />
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
    <template #pagination>
      <div v-if="filteredTasks.length > 0" class="my-[20px]">
        <div class="flex items-center justify-center xl:justify-between">
          <div class="hidden xl:flex flex-row items-center xl:gap-[13px] 2xl:gap-[20px]">
            <p class="xl:text-[10px] 2xl:text-[14px]">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTasks.length) }}</span>
              of
              <span class="font-medium">{{ filteredTasks.length }}</span>
              results
            </p>
            <label class="xl:text-[10px] 2xl:text-[14px]">Items per page:</label>
            <div class="pagination__option">
              <select v-model="itemsPerPage"
                class="xl:text-[10px] 2xl:text-[14px] outline-none xl:min-w-[40px] 2xl:min-w-[50px] cursor-pointer">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button @click="currentPage = 1" :disabled="currentPage === 1" class="pageButton" title="First page">
              <svg class="w-auto h-[2vw] xl:h-[8px] 2xl:h-[13px] object-center object-cover shrink-0"
                viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.134766 6.50001L6.08873 12.454L7.44509 11.0976L2.84748 6.50001L7.44509 1.9024L6.08873 0.546043L0.134766 6.50001ZM5.55444 6.50001L11.5084 12.454L12.8648 11.0976L8.26716 6.50001L12.8648 1.9024L11.5084 0.546043L5.55444 6.50001Z"
                  fill="currentColor" />
              </svg>

            </button>
            <button @click="currentPage--" :disabled="currentPage === 1" class="pageButton" title="Previous page">
              <svg class="w-auto h-[1.4vw] xl:h-[6px] 2xl:h-[10px] object-center object-cover shrink-0 rotate-90"
                viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z"
                  fill="currentColor" />
              </svg>

            </button>
            <span class="pageButton">
              {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="pageButton" title="Next page">
              <svg class="w-auto h-[1.4vw] xl:h-[6px] 2xl:h-[10px] object-center object-cover shrink-0 -rotate-90"
                viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.65703 7.88911L2.67029e-05 2.23212L1.41403 0.818115L6.36403 5.76812L11.314 0.818115L12.728 2.23212L7.07103 7.88911C6.8835 8.07659 6.62919 8.1819 6.36403 8.1819C6.09886 8.1819 5.84455 8.07659 5.65703 7.88911Z"
                  fill="currentColor" />
              </svg>
            </button>
            <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="pageButton"
              title="Last page">
              <svg class="w-auto h-[2vw] xl:h-[8px] 2xl:h-[13px] object-center object-cover shrink-0 rotate-180"
                viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.134766 6.50001L6.08873 12.454L7.44509 11.0976L2.84748 6.50001L7.44509 1.9024L6.08873 0.546043L0.134766 6.50001ZM5.55444 6.50001L11.5084 12.454L12.8648 11.0976L8.26716 6.50001L12.8648 1.9024L11.5084 0.546043L5.55444 6.50001Z"
                  fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Task Viewer Modal -->
    <TaskViewer v-if="selectedTask" :task="selectedTask" @close="closeTaskViewer" />
  </Layout>
</template>

<script setup>
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
  mdiBulldozer,
} from "@mdi/js";
import { ref, computed, onMounted, watch } from "vue";
import MdiIcon from "../components/MdiIcon.vue";
import FavoriteButton from "../components/FavoriteButton.vue";
import TaskViewer from "../components/TaskViewer.vue";
import { useTaskStore } from "../stores/taskStore";

const taskStore = useTaskStore();

// State
const searchQuery = ref("");
const showAdvanceSearch = ref(false);
const selectedTask = ref(null);
const advanceSearch = ref({
  taskId: "",
  status: "",
  priority: "",
  progress: "",
});

// Sorting state - default to ID descending
const sortField = ref("id");
const sortDirection = ref("desc");
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed - access store properties directly
const tasks = computed(() => taskStore.tasks);
const loading = computed(() => taskStore.loading);
const error = computed(() => taskStore.error);

// Filtered tasks
const filteredTasks = computed(() => {
  let filtered = tasks.value;

  if (showAdvanceSearch.value) {
    // Advanced search mode

    // Task ID filter
    if (advanceSearch.value.taskId) {
      const query = advanceSearch.value.taskId.toLowerCase();
      filtered = filtered.filter((task) =>
        task.id.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (advanceSearch.value.status) {
      filtered = filtered.filter(
        (task) => task.status === advanceSearch.value.status
      );
    }

    // Priority filter
    if (advanceSearch.value.priority) {
      filtered = filtered.filter(
        (task) => task.priority === advanceSearch.value.priority
      );
    }

    // Progress filter
    if (advanceSearch.value.progress) {
      const [min, max] = advanceSearch.value.progress.split("-").map(Number);
      filtered = filtered.filter((task) => {
        const progress = task.progressPercentage || 0;
        return progress >= min && progress <= max;
      });
    }
  } else {
    // Simple search mode

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.id.toLowerCase().includes(query) ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tasksId.toLowerCase().includes(query) ||
          task.assignedTo.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query)
      );
    }
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal, bVal;

    switch (sortField.value) {
      case "id":
        aVal = a.id;
        bVal = b.id;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "progress":
        aVal = a.progressPercentage || 0;
        bVal = b.progressPercentage || 0;
        break;
      case "priority":
        aVal = a.priority;
        bVal = b.priority;
        // Custom order for priority: Critical > High > Medium > Low
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        aVal = priorityOrder[aVal] ?? 3;
        bVal = priorityOrder[bVal] ?? 3;
        break;
      default:
        aVal = a[sortField.value];
        bVal = b[sortField.value];
    }

    // Handle date sorting
    if (sortField.value.includes("Date") && aVal && bVal) {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sortDirection.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
});

// Paginated tasks
const totalPages = computed(() =>
  Math.ceil(filteredTasks.value.length / itemsPerPage.value)
);

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTasks.value.slice(start, end);
});

// Methods
const sortBy = (field) => {
  // Only allow sorting on specific fields
  const sortableFields = ["id", "status", "progress", "priority"];
  if (!sortableFields.includes(field)) return;

  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const refreshData = async () => {
  await taskStore.fetchTasks();
};

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
          <p>Generated on: ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
            ${filteredTasks.value
      .map(
        (task) => `
              <tr>
                <td>${task.id}</td>
                <td>${task.tasksId}</td>
                <td>${task.title}</td>
                <td><span class="status ${task.status}">${getStatusLabel(
          task.status
        )}</span></td>
                <td><span class="status priority-${task.priority.toLowerCase()}">${task.priority
          }</span></td>
                <td>${task.progressPercentage}%</td>
                <td>${task.assignedTo}</td>
                <td>${formatDate(task.dueDate)}</td>
                <td>${task.category}</td>
              </tr>
            `
      )
      .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const closeAdvanceSearch = () => {
  showAdvanceSearch.value = false;
  // Clear search query when returning to simple search
  searchQuery.value = "";
};

const clearAdvanceSearch = () => {
  advanceSearch.value = {
    taskId: "",
    status: "",
    priority: "",
    progress: "",
  };
};

const viewTask = (task) => {
  selectedTask.value = task;
};

const closeTaskViewer = () => {
  selectedTask.value = null;

};


const uniqueStatuses = computed(() => {
  const statuses = new Set()
  tasks.value.forEach(wo => statuses.add(wo.status))
  return Array.from(statuses)
})

const uniquePriorities = computed(() => {
  const priorities = new Set()
  tasks.value.forEach(wo => priorities.add(wo.priority))
  return Array.from(priorities)
})


const getStatusBadgeClass = (status) => {
  const baseClass =
    "flex items-center justify-center text-[2.7vw] px-[3.5vw] py-[2vw] xl:px-[13px] xl:py-[7px] 2xl:px-[20px] 2xl:py-[10px] xl:text-[10px] 2xl:text-[14px] font-medium rounded-[25px] xl:rounded-[33px] 2xl:rounded-[50px]";
  switch (status) {
    case "completed":
      return `${baseClass} bg-green-100 text-green-800`;
    case "in-progress":
      return `${baseClass} bg-blue-100 text-blue-800`;
    case "pending":
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    case "on-hold":
      return `${baseClass} bg-orange-100 text-orange-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

const getStatusLabel = (status) => {
  const labels = {
    completed: "Completed",
    "in-progress": "In Progress",
    pending: "Pending",
    "on-hold": "On Hold",
  };
  return labels[status] || status;
};

const getPriorityBadgeClass = (priority) => {
  const baseClass =
    "flex items-center justify-center text-[2.7vw] px-[3.5vw] py-[2vw] xl:px-[13px] xl:py-[7px] 2xl:px-[20px] 2xl:py-[10px] xl:text-[10px] 2xl:text-[14px] font-medium rounded-[25px] xl:rounded-[33px] 2xl:rounded-[50px]";
  switch (priority) {
    case "Critical":
      return `${baseClass} bg-red-100 text-red-800`;
    case "High":
      return `${baseClass} bg-orange-100 text-orange-800`;
    case "Medium":
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    case "Low":
      return `${baseClass} bg-green-100 text-green-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

const getCompletionBarClass = (percentage) => {
  if (percentage >= 100) return "bg-green-500";
  if (percentage >= 75) return "bg-blue-500";
  if (percentage >= 50) return "bg-yellow-500";
  if (percentage >= 25) return "bg-orange-500";
  return "bg-red-500";
};

const getProgressStatus = (task) => {
  if (task.progressPercentage >= 100) return "Completed";
  if (task.progressPercentage >= 75) return "Nearly Done";
  if (task.progressPercentage >= 50) return "In Progress";
  if (task.progressPercentage >= 25) return "Started";
  return "Not Started";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Watch for filter changes to reset pagination
watch([searchQuery, showAdvanceSearch], () => {
  currentPage.value = 1;
});

watch(
  advanceSearch,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  taskStore.fetchTasks();
});
</script>
