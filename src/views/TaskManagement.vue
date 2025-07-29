<template>
  <Layout>
    <template #content>
      <div class="flex flex-col h-full">
        <!-- Page Header -->
        <div class="w-full container__section">
          <div class="container__header__main">
            <span class="title__main">Task Management</span>
            <p class="desc__main">
              Manage and track all maintenance tasks and assignments.
            </p>
          </div>

          <div class="flex flex-row items-center gap-[20px]">
            <div class="background__icon">
              <img
                src="/icons/unlove.svg"
                alt="Unlove Icon"
                class="w-auto h-[19px] object-center object-cover shrink-0"
                :show-tooltip="true"
              />
            </div>
          </div>
        </div>

        <!-- Table Bar -->
        <div class="w-full container__section mt-[40px]">
          <div
            v-if="!showAdvanceSearch"
            class="flex flex-row items-center gap-[10px]"
          >
            <div class="search">
              <img
                src="/icons/search.svg"
                alt="Search Icon"
                class="w-[20px] h-auto object-center object-cover shrink-0"
              />
              <input
                v-model="searchQuery"
                type="text"
                name=""
                id=""
                class="w-full h-full outline-none"
                placeholder="Search Task Management"
              />
            </div>

            <button
              @click="refreshData"
              :disabled="loading"
              class="background__icon"
            >
              <img
                src="/icons/repeat.svg"
                alt="Repeat Icon"
                class="w-[16px] h-[16px] object-center object-cover shrink-0"
              />
            </button>

            <button @click="printData" class="background__icon">
              <img
                src="/icons/print.svg"
                alt="Print Icon"
                class="w-[16px] h-[16px] object-center object-cover shrink-0"
              />
            </button>
          </div>

          <button
            @click="showAdvanceSearch = true"
            class="bg-gray-100 hover:bg-gray-300 cursor-pointer px-[30px] py-[20px] rounded-[50px] flex flex-row items-center justify-center gap-[20px]"
          >
            <img
              src="/icons/filter.svg"
              alt="Filter Icon"
              class="w-[18px] h-[11px] object-center object-cover shrink-0"
            />
            <span class="text-[14px]">Advanced Search</span>
            <img
              src="/icons/arrow.svg"
              alt="Arrow Icon"
              class="w-[10px] h-auto object-center object-cover shrink-0"
            />
          </button>
        </div>
        <!-- Tasks Table -->
        <div class="mt-[32px] flex-1 flex flex-col min-h-0">
          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-flex items-center">
              <div
                class="w-6 h-6 mr-3 border-b-2 rounded-full animate-spin border-petrosea-primary"
              ></div>
              <span class="text-gray-600">Loading tasks...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <div class="text-red-600">
              <svg
                class="w-8 h-8 mx-auto mb-2 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
              <p class="font-medium">Error loading tasks</p>
              <p class="mt-1 text-sm">{{ error }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredTasks.length === 0" class="p-8 text-center">
            <svg
              class="w-12 h-12 mx-auto mb-4 text-gray-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path
                d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z"
              />
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
              <thead class="sticky top-0 z-10 font-medium">
                <tr class="text-left text-[14px]">
                  <!-- Task ID -->
                  <th
                    @click="sortBy('id')"
                    class="max-w-[195px] bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span
                        :class="
                          sortField === 'id'
                            ? 'text-petrosea-primary font-medium'
                            : ''
                        "
                        class="truncate"
                        >Task ID</span
                      >
                      <div class="flex flex-col gap-0.5">
                        <img
                          src="/icons/arrow.svg"
                          alt="Arrow Up"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'id' && sortDirection === 'asc'
                              ? 'rotate-180 text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                        <img
                          src="/icons/arrow.svg"
                          alt="Arrow Down"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'id' && sortDirection === 'desc'
                              ? 'text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                      </div>
                    </div>
                  </th>

                  <!-- Task Details -->
                  <th class="max-w-[195px] bg-gray-100 px-[20px] py-[12px]">
                    Task Details
                  </th>

                  <!-- Status -->
                  <th
                    @click="sortBy('status')"
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span
                        :class="
                          sortField === 'status'
                            ? 'text-petrosea-primary font-semibold'
                            : ''
                        "
                        >Status</span
                      >
                      <div class="flex flex-col gap-0.5">
                        <img
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'status' && sortDirection === 'asc'
                              ? 'rotate-180 text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                        <img
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'status' && sortDirection === 'desc'
                              ? 'text-petrosea-primary'
                              : 'opacity-30'
                          "
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
                      <span
                        :class="
                          sortField === 'progress'
                            ? 'text-petrosea-primary font-medium'
                            : ''
                        "
                        >Progress</span
                      >
                      <div class="flex flex-col gap-0.5">
                        <img
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'progress' && sortDirection === 'asc'
                              ? 'rotate-180 text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                        <img
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'progress' && sortDirection === 'desc'
                              ? 'text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                      </div>
                    </div>
                  </th>

                  <!-- Priority -->
                  <th
                    @click="sortBy('priority')"
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px] cursor-pointer select-none"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span
                        :class="
                          sortField === 'priority'
                            ? 'text-petrosea-primary font-normal'
                            : ''
                        "
                        >Priority</span
                      >
                      <div class="flex flex-col gap-0.5">
                        <img
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'priority' && sortDirection === 'asc'
                              ? 'rotate-180 text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                        <img
                          src="/icons/arrow.svg"
                          class="w-[6px] h-auto object-cover shrink-0"
                          :class="
                            sortField === 'items' && sortDirection === 'desc'
                              ? 'text-petrosea-primary'
                              : 'opacity-30'
                          "
                        />
                      </div>
                    </div>
                  </th>

                  <th
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]"
                  >
                    Assigned To
                  </th>
                  <th
                    class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody v-for="task in paginatedTasks" :key="task.id" class="">
                <tr>
                  <td colspan="7" class="h-6"></td>
                </tr>
                <tr class="text-left text-[14px]">
                  <!-- ID -->
                  <td class="container__data">{{ task.id }}</td>
                  <!-- task Details -->
                  <td>
                    <div class="flex flex-col gap-[10px]">
                      <div class="background__icon__content">
                        <svg
                          width="17"
                          height="20"
                          viewBox="0 0 17 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_55_288"
                            style="mask-type: luminance"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="17"
                            height="20"
                          >
                            <path
                              d="M10.3301 1L15.8301 6.5V18C15.8301 18.55 15.3801 19 14.8301 19H2.83008C2.28008 19 1.83008 18.55 1.83008 18V2C1.83008 1.45 2.28008 1 2.83008 1H10.3301Z"
                              fill="white"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M11.3301 1.5V6H15.8301L11.3301 1.5Z"
                              fill="black"
                              stroke="black"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.3301 1L15.8301 6.5"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </mask>
                          <g mask="url(#mask0_55_288)">
                            <path
                              d="M20.8301 -2H-3.16992V22H20.8301V-2Z"
                              fill="#718096"
                            />
                          </g>
                        </svg>
                      </div>

                      <div class="flex flex-col gap-[5px]">
                        <div class="flex justify-between">
                          <span class="text-[14px]"
                            >WO: {{ task.workOrderId }}</span
                          >
                        </div>
                        <p class="truncate label__secondary">
                          {{ task.title }}
                        </p>
                        <p class="label__secondary line-clamp-2">
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
                          <div
                            class="w-32 bg-gray-200 rounded-full h-[15px] mr-2"
                          >
                            <div
                              :class="
                                getCompletionBarClass(task.progressPercentage)
                              "
                              class="h-[15px] rounded-full transition-all duration-300"
                              :style="{
                                width: task.progressPercentage + '%',
                              }"
                            ></div>
                          </div>
                          <span class="text-xs font-medium text-gray-900">
                            {{ task.progressPercentage }}%
                          </span>
                        </div>
                        <span
                          :class="getProgressStatus(tasks).class"
                          class="label__secondary"
                        >
                          {{ getProgressStatus(tasks).label }}
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
                        <span class="text-[14px] font-medium"
                          >{{ task.assignedTo }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td>
                    <div class="flex items-center justify-center">
                      <div class="flex justify-end items-center gap-2.5">
                        <button
                          class="bg-gray-100 p-[15px] hover:bg-gray-300 rounded-[50px] cursor-pointer"
                          :title="`View ${task.id}`"
                        >
                          <MdiIcon :path="mdiEye" class="w-5 h-5" />
                        </button>
                        <button
                          class="bg-gray-100 p-[15px] hover:bg-gray-300 rounded-[50px] cursor-pointer"
                          :title="`Edit ${task.id}`"
                        >
                          <MdiIcon :path="mdiPencil" class="w-5 h-5" />
                        </button>
                        <button
                          class="bg-red-100 p-[15px] hover:bg-red-300 rounded-[50px] cursor-pointer text-red-800"
                          :title="`Delete ${task.id}`"
                        >
                          <MdiIcon :path="mdiDelete" class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template #pagination
      ><div v-if="filteredTasks.length > 0" class="my-[20px]">
        <div class="flex items-center justify-between">
          <div class="flex flex-row items-center gap-[20px]">
            <p class="text-[14px] text-gray-700">
              Showing
              <span class="font-medium">{{
                (currentPage - 1) * itemsPerPage + 1
              }}</span>
              to
              <span class="font-medium">{{
                Math.min(currentPage * itemsPerPage, filteredTasks.length)
              }}</span>
              of
              <span class="font-medium">{{ filteredTasks.length }}</span>
              results
            </p>
            <label class="text-[14px]">Items per page:</label>
            <div
              class="px-[30px] py-[20px] bg-white rounded-[50px] min-h-[61px] hover:bg-gray-300"
            >
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
              <img
                src="/icons/double-arrow.svg"
                alt="Double Arrow"
                class="w-auto h-[13px] object-center object-cover shrink-0 invert"
              />
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="pageButton"
              title="Previous page"
            >
              <img
                src="/icons/arrow.svg"
                alt="Arrow"
                class="w-auto h-[10px] object-center object-cover shrink-0 rotate-90"
              />
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
              <img
                src="/icons/arrow.svg"
                alt="Arrow"
                class="w-auto h-[10px] object-center object-cover shrink-0 -rotate-90"
              />
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="pageButton"
              title="Last page"
            >
              <img
                src="/icons/double-arrow.svg"
                alt="Double Arrow"
                class="w-auto h-[13px] object-center object-cover shrink-0 invert rotate-180"
              />
            </button>
          </div>
        </div></div
    ></template>
    <!-- Fixed Pagination Footer -->

    <!-- Task Viewer Modal -->
    <TaskViewer
      v-if="selectedTask"
      :task="selectedTask"
      @close="closeTaskViewer"
    />
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
                <td><span class="status priority-${task.priority.toLowerCase()}">${
                  task.priority
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

const getStatusBadgeClass = (status) => {
  const baseClass =
    "flex items-center justify-center px-[20px] py-[10px] text-[14px] font-medium rounded-[50px]";
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
    "flex items-center justify-center px-[20px] py-[10px] text-[14px] font-medium rounded-[50px]";
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
