<template>
  <header class="w-full h-fit pt-[32px] flex items-center justify-between z-30 flex-shrink-0">

    <!-- Left Side -->
    <div class="flex flex-row items-center gap-[10px]">
      <button 
          class="group bg-primary rounded-[50px] w-[75px] h-[75px] flex items-center justify-center flex-none"
          @click="$emit('toggle-sidebar')"
        >
          <img 
            src="/icons/double-arrow.svg"
            alt="ARFS"
            :class="[
              'w-[12px] h-auto cursor-pointer transform transition-transform duration-300 group-hover:scale-105',
              props.isSidebarOpen ? 'rotate-0' : 'rotate-180'
            ]"
          />
      </button>

      <div class="flex-none flex flex-row items-center gap-[20px] w-fit h-full min-h-[75px] px-[30px] py-[20px] justify-center bg-white rounded-[50px] min-w-[172px] hover:bg-gray-100 cursor-pointer">
        <select 
          v-model="searchCategory"
          class="outline-none w-full h-full text-[14px] cursor-pointer"
        >
          <option value="workorder">Work Order</option>
          <option value="item">Item</option>
          <option value="asset">Asset</option>
          <option value="employee">Employee</option>
          <option value="menu">Menu</option>
        </select>
      </div>

      <div class="relative w-full min-w-[411px]">
        <div class="outline__input flex flex-row items-center gap-[20px] w-full h-full min-h-[75px] ps-[30px] pe-[60px] py-[20px] justify-center bg-white rounded-[50px]">
          <img src="/icons/search.svg" alt="Search Icon" class="w-auto h-[22px] object-center object-cover shrink-0">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleSearch"
            @blur="() => setTimeout(() => showAutocomplete.value = false, 200)"
            class="outline-none w-full text-[14px] placeholder:text-[14px]"
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
      <button class="cursor-pointer p-[10px] flex flex-row items-center justify-between gap-[10px] bg-gray-500 hover:bg-gray-700 rounded-[50px]">
        <div class="w-[20px] h-[20px] rounded-[50px] bg-white"></div>
        <div>
          <img src="/icons/light.svg" alt="Light Mode Icon" class="w-[15px] h-[15px] object-center object-cover shrink-0">
        </div>
      </button>

      <!-- Notification -->
      <div class="relative">
        <button 
          class="relative group bg-white rounded-[50px] w-[75px] h-[75px] flex items-center justify-center flex-none cursor-pointer hover:bg-gray-100"
          @click="showNotifications = !showNotifications"
          :title="`${unreadNotifications > 0 ? unreadNotifications + ' new notifications' : 'No new notifications'}`"
          ref="notificationButton"
        >
          <img 
            src="/icons/notification.svg"
            alt="Notification"
            class="w-[22px] h-auto cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
          />
          <span 
            v-if="unreadNotifications > 0" 
            class="absolute top-1 left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white shadow-lg font-bold"
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
       <button class="cursor-pointer max-h-[75px] bg-white hover:bg-gray-100 px-[30px] py-[20px] flex flex-row items-center gap-[20px] rounded-[50px]">
        <div class="flex flex-row items-center gap-[15px]">
          <div class="icon__rounded bg-primary">
            <span class="text-[14px] text-white">AU</span>
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
import MdiIcon from './MdiIcon.vue'
import { mdiMapMarker } from '@mdi/js'
import logoSmall from '../assets/images/logo-small.svg'
import searchData from '../assets/data/search.json'

// Icons
const SearchIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`
}

const BellIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a50.002 50.002 0 00-1.5-1.5v-6a6 6 0 10-12 0v6c0 .538-.214 1.055-.598 1.436L5 17h5m0 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>`
}

const SunIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
}

const MoonIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`
}

const ChevronDownIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`
}

const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: true
  }
});
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

const pageTitle = computed(() => {
  const routeName = route.name || route.path.slice(1) || 'Dashboard'
  return routeName.charAt(0).toUpperCase() + routeName.slice(1)
})

// Get current site from siteStore
const currentSite = computed(() => siteStore.currentSite)

// User information from authStore
const currentUser = computed(() => authStore.currentUser)

// Get user initials for avatar
const getUserInitials = computed(() => {
  const user = currentUser.value
  if (!user || !user.name) return 'U'
  
  const names = user.name.split(' ')
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
})

// Get favorite menus
const favoriteMenus = computed(() => favoriteMenuStore.favoriteMenus)

const unreadNotifications = ref(3)
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    message: 'Asset maintenance due for Excavator EX-001',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'info',
    message: 'New asset registered: Truck TR-025',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'error',
    message: 'Critical maintenance overdue for Generator GN-003',
    time: '3 hours ago'
  },
])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    searchResults.value = []
    showAutocomplete.value = false
    return
  }
  const cat = searchCategory.value
  let results = []
  if (searchData[cat]) {
    if (cat === 'asset') {
      results = searchData.asset.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query)
      )
    } else if (cat === 'item') {
      results = searchData.item.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.sku.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
      )
    } else if (cat === 'workorder') {
      results = searchData.workorder.filter(w =>
        w.id.toLowerCase().includes(query) ||
        w.title.toLowerCase().includes(query) ||
        w.status.toLowerCase().includes(query)
      )
    } else if (cat === 'employee') {
      results = searchData.employee.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.id.toLowerCase().includes(query) ||
        e.department.toLowerCase().includes(query)
      )
    } else if (cat === 'menu') {
      results = searchData.menu.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.path.toLowerCase().includes(query) ||
        (m.parent && m.parent.toLowerCase().includes(query))
      )
    }
  }
  searchResults.value = results.slice(0, 8)
  showAutocomplete.value = searchResults.value.length > 0
}

const selectAutocomplete = (item) => {
  searchQuery.value = item.name || item.title || item.id
  showAutocomplete.value = false
  
  // Navigate based on category and item
  if (searchCategory.value === 'menu' && item.path) {
    router.push(item.path);
  }
  // Optionally add navigation for other categories in the future
}

const getSearchPlaceholder = () => {
  const placeholders = {
    asset: 'Search assets by name, code, or location...',
    item: 'Search items by name, SKU, or category...',
    workorder: 'Search work orders by ID, title, or status...',
    employee: 'Search employees by name, ID, or department...',
    menu: 'Search menu by name or path...'
  }
  return placeholders[searchCategory.value] || 'Search...'
}

const getNotificationDotStyle = (type) => {
  const colors = {
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)'
  }
  return { backgroundColor: colors[type] || colors.info }
}

const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    // Mark as read logic
    unreadNotifications.value = Math.max(0, unreadNotifications.value - 1)
  }
  showNotifications.value = false
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const navigateToFavorite = (menu) => {
  if (menu.path) {
    router.push(menu.path)
    showUserMenu.value = false
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Check initial theme
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
