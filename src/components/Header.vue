<template>
  <header class="w-full h-fit xl:pt-[16px] 2xl:pt-[32px] flex items-center justify-between z-30 flex-shrink-0">
    <!-- Left Side -->
    <div class="flex flex-row items-center gap-[10px]">
      <button 
          class="group bg-primary rounded-[50px] xl:w-[50px] xl:h-[50px] 2xl:w-[75px] 2xl:h-[75px] flex items-center justify-center flex-none"
          @click="$emit('toggle-sidebar')"
        >
          <img 
            src="/icons/double-arrow.svg"
            alt="ARFS"
            :class="[
              'xl:w-[10px] 2xl:w-[12px] h-auto cursor-pointer transform transition-transform duration-300 group-hover:scale-105',
              props.isSidebarOpen ? 'rotate-0' : 'rotate-180'
            ]"
          />
      </button>

      <div class="category__option flex-none flex flex-row items-center gap-[20px] w-fit h-full xl:min-h-[50px] 2xl:min-h-[75px] xl:px-[20px] 2xl:px-[30px] xl:py-[13px] 2xl:py-[20px] justify-center rounded-[50px] 2xl:min-w-[172px] cursor-pointer">
        <select 
          v-model="searchCategory"
          class="outline-none w-full h-full xl:text-[10px] 2xl:text-[14px] cursor-pointer"
        >
          <option value="workorder">Work Order</option>
          <option value="item">Item</option>
          <option value="asset">Asset</option>
          <option value="employee">Employee</option>
          <option value="menu">Menu</option>
        </select>
      </div>

      <div class="relative w-full xl:min-w-[275px] 2xl:min-w-[411px]">
        <div class="outline__input flex flex-row items-center xl:gap-[13px] 2xl:gap-[20px] w-full h-full xl:min-h-[50px] 2xl:min-h-[75px] xl:ps-[20px] xl:pe-[40px] py-[13px] 2xl:ps-[30px] 2xl:pe-[60px] 2xl:py-[20px] justify-center rounded-[50px]" style="background-color: var(--color-bgsidebar);">
          <img src="/icons/search.svg" alt="Search Icon" class="w-auto xl:h-[16px] 2xl:h-[22px] object-center object-cover shrink-0">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleSearch"
            @blur="() => setTimeout(() => showAutocomplete.value = false, 200)"
            class="outline-none w-full xl:text-[10px] 2xl:text-[14px] xl:placeholder:text-[10px] 2xl:placeholder:text-[14px] placeholder:truncate"
            :placeholder="getSearchPlaceholder()"
          />
        </div>

        <!-- Autocomplete Dropdown -->
        <div v-if="showAutocomplete" class="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-auto">
          <div 
            v-for="item in searchResults" 
            :key="item.id || item.sku || item.title"
            @mousedown.prevent="selectAutocomplete(item)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
          >
            <template v-if="searchCategory === 'asset'">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500">{{ item.code }} • {{ item.location }}</div>
            </template>
            <template v-else-if="searchCategory === 'item'">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500">SKU: {{ item.sku }} • {{ item.category }}</div>
            </template>
            <template v-else-if="searchCategory === 'workorder'">
              <div class="font-medium">{{ item.title }}</div>
              <div class="text-xs text-gray-500">{{ item.id }} • {{ item.status }}</div>
            </template>
            <template v-else-if="searchCategory === 'employee'">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500">ID: {{ item.id }} • {{ item.department }}</div>
            </template>
            <template v-else-if="searchCategory === 'menu'">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500">{{ item.parent ? item.parent + ' • ' : '' }}{{ item.path }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- End Left Side -->

    <!-- Right Side -->
    <div class="flex flex-row items-center gap-[10px]">

      <!-- Toggle theme Mode -->
      <button 
        @click="toggleTheme"
        class="cursor-pointer xl:p-[7px] 2xl:p-[10px] flex flex-row items-center justify-between gap-[7px] 2xl:gap-[10px] bg-gray-500 hover:bg-gray-700 rounded-[50px]"
      >
        <div class="xl:w-[13px] xl:h-[13px] 2xl:w-[20px] 2xl:h-[20px] rounded-[50px] bg-white"></div>
        <div>
          <img src="/icons/light.svg" alt="Light Mode Icon" class="xl:w-[13px] xl:h-[13px] 2xl:w-[15px] 2xl:h-[15px] object-center object-cover shrink-0">
        </div>
      </button>

      <!-- Notification -->
      <div class="relative">
        <button 
          class="relative group bg__notification"
          @click="showNotifications = !showNotifications"
          :title="`${unreadNotifications > 0 ? unreadNotifications + ' new notifications' : 'No new notifications'}`"
          ref="notificationButton"
        >
          <img 
            src="/icons/notification.svg"
            alt="Notification"
            class="xl:w-[15px] 2xl:w-[22px] h-auto cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
          />
          <span 
            v-if="unreadNotifications > 0" 
            class="absolute top-1 xl:left-0 2xl:left-1 h-5 w-5 bg-red-500 text-white xl:text-[8px] 2xl:text-xs rounded-full flex items-center justify-center border-2 border-white shadow-lg font-bold"
          >
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>

        <!-- Dropdown Notifications -->
        <div 
          v-if="showNotifications" 
          ref="notificationDropdown"
          class="absolute right-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 max-h-[300px] overflow-y-auto"
        >
          <div v-if="notifications.length === 0" class="text-sm text-gray-500">No notifications</div>
          <div v-else>
            <div 
              v-for="notif in notifications" 
              :key="notif.id" 
              class="flex items-start gap-2 mb-3 last:mb-0 cursor-pointer hover:bg-gray-100 rounded-md p-2"
              @click="markAsRead(notif.id)"
            >
              <div class="w-2 h-2 rounded-full mt-1 flex-none" :style="getNotificationDotStyle(notif.type)"></div>
              <div class="text-sm">
                <div class="font-medium">{{ notif.message }}</div>
                <div class="text-xs text-gray-500">{{ notif.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile -->
       <button class="profile__container">
        <div class="flex flex-row items-center gap-[15px]">
          <div class="icon__rounded bg-primary">
            <span class="xl:text-[10px] 2xl:text-[14px] text-white">AU</span>
          </div>
          <div class="flex flex-col items-start">
            <span class="label__main">Admin User</span>
            <span class="label__secondary">admin@example.com</span>
          </div>
        </div>

        <div>
          <img src="/icons/arrow.svg" alt="Arrow Icon" class="w-[10px] h-auto object-center object-cover shrink-0">
        </div>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useSiteStore } from '../stores/siteStore'
import { useFavoriteMenuStore } from '../stores/favoriteMenuStore'
import searchData from '../assets/data/search.json'

const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: true
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const storedTheme = localStorage.getItem('theme')
  isDarkMode.value = storedTheme === 'dark'
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const siteStore = useSiteStore()
const favoriteMenuStore = useFavoriteMenuStore()

const searchQuery = ref('')
const searchCategory = ref('workorder')
const showNotifications = ref(false)
const showUserMenu = ref(false)
const isDarkMode = ref(false)
const searchResults = ref([])
const showAutocomplete = ref(false)

const currentSite = computed(() => siteStore.currentSite)
const currentUser = computed(() => authStore.currentUser)

const getUserInitials = computed(() => {
  const user = currentUser.value
  if (!user || !user.name) return 'U'
  const names = user.name.split(' ')
  return (names[0].charAt(0) + (names[1]?.charAt(0) || '')).toUpperCase()
})

const unreadNotifications = ref(3)
const notifications = ref([
  { id: 1, type: 'warning', message: 'Asset maintenance due for Excavator EX-001', time: '2 minutes ago' },
  { id: 2, type: 'info', message: 'New asset registered: Truck TR-025', time: '1 hour ago' },
  { id: 3, type: 'error', message: 'Critical maintenance overdue for Generator GN-003', time: '3 hours ago' },
])

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme', 'light')
  }
}


const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return searchResults.value = [], showAutocomplete.value = false

  const cat = searchCategory.value
  let results = []
  if (searchData[cat]) {
    results = searchData[cat].filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      )
    )
  }
  searchResults.value = results.slice(0, 8)
  showAutocomplete.value = searchResults.value.length > 0
}

const selectAutocomplete = (item) => {
  searchQuery.value = item.name || item.title || item.id
  showAutocomplete.value = false
  if (searchCategory.value === 'menu' && item.path) router.push(item.path)
}

const getSearchPlaceholder = () => ({
  asset: 'Search assets by name, code, or location...',
  item: 'Search items by name, SKU, or category...',
  workorder: 'Search work orders by ID, title, or status...',
  employee: 'Search employees by name, ID, or department...',
  menu: 'Search menu by name or path...'
})[searchCategory.value] || 'Search...'

const getNotificationDotStyle = (type) => {
  const colors = {
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)'
  }
  return { backgroundColor: colors[type] || colors.info }
}

const markAsRead = (id) => {
  const idx = notifications.value.findIndex(n => n.id === id)
  if (idx !== -1) {
    notifications.value.splice(idx, 1)
    unreadNotifications.value = Math.max(0, unreadNotifications.value - 1)
  }
  showNotifications.value = false
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
