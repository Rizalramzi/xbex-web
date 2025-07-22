<template>
  <header class="border-b h-16 flex items-center justify-between px-6 z-30 flex-shrink-0" style="background-color: var(--color-bgheader); border-color: var(--border-light);">    <!-- Left side - Hamburger menu, app title and breadcrumb -->
    <div class="flex items-center space-x-4">
      <!-- Hamburger menu button for all screen sizes -->
      <div class="flex items-center space-x-3">
        <img 
          :src="logoSmall" 
          @click="toggleSidebar" 
          alt="ARFS" 
          class="w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-105"
        />
        <h1 class="font-bold hidden sm:block" style="color: var(--color-primary);">XiBex</h1>
      </div>
      
      <!-- Breadcrumb -->
      <nav class="hidden sm:flex items-center space-x-1 text-sm">
        <span style="color: var(--text-muted);">|</span>
        <span class="font-medium" style="color: var(--color-primary);">{{ pageTitle }}</span>
        <template v-if="currentSite">
          <span style="color: var(--text-muted);">|</span>
          <span class="font-medium flex items-center text-secondary-light">
            <MdiIcon :path="mdiMapMarker" :size="16" class="mr-1" />
            {{ currentSite }}
          </span>
        </template>
      </nav>
    </div>    <!-- Center - Search with Category Dropdown (hidden on small screens) -->
    <div class="hidden md:flex flex-1 max-w-lg mx-8">
      <div class="flex w-full gap-1">
        <!-- Search Category Dropdown -->
        <div class="relative">
          <select 
            v-model="searchCategory"
            class="form-select-dark rounded-r-none border-r-0 pr-8 py-2 text-sm min-w-[120px]"
            style="background-color: var(--color-bgpopup); border-color: var(--border-light); color: var(--text-primary);"
          >
            <option value="workorder">Work Order</option>
            <option value="item">Item</option>
            <option value="asset">Asset</option>
            <option value="employee">Employee</option>
            <option value="menu">Menu</option>
          </select>
          <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDownIcon class="h-4 w-4" style="color: var(--text-muted);" />
          </div>
        </div>
        
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="h-5 w-5" style="color: var(--text-muted);" />
          </div>
          <input 
            type="text" 
            :placeholder="getSearchPlaceholder()"
            class="form-input-dark w-full pl-10 pr-4 py-2 text-sm rounded-l-none"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleSearch"
            @blur="() => setTimeout(() => showAutocomplete.value = false, 200)"
            style="background-color: var(--color-bgpopup); border-color: var(--border-light); color: var(--text-primary);"
          >
          <div v-if="showAutocomplete" class="absolute left-0 right-0 top-full mt-1 bg-popup rounded-lg shadow-lg border border-light z-50 max-h-64 overflow-auto">
            <div v-for="item in searchResults" :key="item.id || item.sku || item.title" @mousedown.prevent="selectAutocomplete(item)" class="px-4 py-2 cursor-pointer hover:bg-primary-light text-sm" style="color: var(--text-primary);">
              <template v-if="searchCategory === 'asset'">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted">{{ item.code }} &bull; {{ item.location }}</div>
              </template>
              <template v-else-if="searchCategory === 'item'">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted">SKU: {{ item.sku }} &bull; {{ item.category }}</div>
              </template>
              <template v-else-if="searchCategory === 'workorder'">
                <div class="font-medium">{{ item.title }}</div>
                <div class="text-xs text-muted">{{ item.id }} &bull; {{ item.status }}</div>
              </template>
              <template v-else-if="searchCategory === 'employee'">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-xs text-muted">ID: {{ item.id }} &bull; {{ item.department }}</div>
              </template>
              <template v-else-if="searchCategory === 'menu'">
                <div class="flex items-center font-medium">
                  <span 
                    v-if="item.level > 1" 
                    class="mr-2 text-xs px-1.5 py-0.5 rounded-full" 
                    :style="{
                      backgroundColor: item.level === 2 ? 'var(--color-primary-light)' : 'var(--color-secondary-light)',
                      color: item.level === 2 ? 'var(--color-primary)' : 'var(--color-secondary)'
                    }"
                  >
                    L{{ item.level }}
                  </span>
                  {{ item.name }}
                </div>
                <div class="text-xs text-muted">
                  {{ item.parent ? item.parent + ' • ' : '' }}{{ item.path }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Notifications, theme toggle, and user menu -->
    <div class="flex items-center space-x-1">
      <!-- Theme toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 rounded-md text-secondary hover:text-primary hover:bg-primary-light transition-all duration-200"
        :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <SunIcon v-if="isDarkMode" class="h-5 w-5" />
        <MoonIcon v-else class="h-5 w-5" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button 
          @click="showNotifications = !showNotifications"
          class="relative p-2 rounded-md text-secondary hover:text-primary hover:bg-primary-light transition-all duration-200"
          :title="`${unreadNotifications > 0 ? unreadNotifications + ' new notifications' : 'No new notifications'}`"
        >
          <!-- Bell Icon -->
          <svg fill="none" stroke="white" viewBox="0 0 24 24" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a50.002 50.002 0 00-1.5-1.5v-6a6 6 0 10-12 0v6c0 .538-.214 1.055-.598 1.436L5 17h5m0 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          
          <!-- Notification Count Badge -->
          <span 
            v-if="unreadNotifications > 0" 
            class="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white shadow-lg font-bold"
          >
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>        <!-- Notifications dropdown -->
        <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50" style="background-color: var(--color-bgpopup); border-color: var(--border-light);">
          <div class="p-4 border-b" style="border-color: var(--border-light);">
            <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Notifications</h3>
          </div>          <div class="max-h-96 overflow-y-auto">
            <div v-if="notifications.length === 0" class="p-4 text-center" style="color: var(--text-muted);">
              No notifications
            </div>
            <div v-else class="divide-y" style="border-color: var(--border-light);">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="p-4 transition-colors cursor-pointer hover:opacity-80"
                @click="markAsRead(notification.id)"
                style="background-color: var(--color-bgpopup);"
              >
                <div class="flex items-start space-x-3">                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 rounded-full" :style="getNotificationDotStyle(notification.type)"></div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm" style="color: var(--text-primary);">{{ notification.message }}</p>
                    <p class="text-xs mt-1" style="color: var(--text-muted);">{{ notification.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-3 border-t" style="border-color: var(--border-light);">
            <button class="text-sm font-medium transition-colors hover:opacity-80" style="color: var(--color-primary);">
              View all notifications
            </button>
          </div>
        </div>
      </div>

      <!-- User menu -->
      <div class="relative">
        <button 
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-1 p-2 rounded-md text-secondary hover:text-primary hover:bg-primary-light transition-all duration-200"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style="background-color: var(--color-primary);">
            <span class="text-sm font-semibold text-white">{{ getUserInitials }}</span>
          </div>
          <ChevronDownIcon class="h-4 w-4" />
        </button>        <!-- User dropdown -->
        <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50" style="background-color: var(--color-bgpopup); border-color: var(--border-light);">
          <div class="p-3 border-b" style="border-color: var(--border-light);">
            <p class="text-sm font-medium" style="color: var(--text-primary);">{{ currentUser?.name || 'User' }}</p>
            <p class="text-xs" style="color: var(--text-muted);">{{ currentUser?.email || 'user@example.com' }}</p>
          </div>
          <div class="py-1">
            <a href="#" class="block px-4 py-2 text-sm transition-colors hover:opacity-80" style="color: var(--text-secondary);">
              Profile Settings
            </a>
            <a href="#" class="block px-4 py-2 text-sm transition-colors hover:opacity-80" style="color: var(--text-secondary);">
              Account
            </a>
            <div class="border-t my-1" style="border-color: var(--border-light);"></div>
            
            <!-- Favorite Menus Section -->
            <div v-if="favoriteMenus.length > 0" class="py-1">
              <div class="px-4 py-2 text-xs font-semibold uppercase tracking-wide" style="color: var(--text-muted);">
                Favorite Menus
              </div>
              <div class="max-h-32 overflow-y-auto">
                <button 
                  v-for="menu in favoriteMenus" 
                  :key="menu.path"
                  @click="navigateToFavorite(menu)"
                  class="block w-full text-left px-4 py-2 text-sm transition-colors hover:opacity-80 flex items-center"
                  style="color: var(--text-secondary);"
                >
                  <svg class="h-3 w-3 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                  <span class="truncate">{{ menu.name }}</span>
                </button>
              </div>
              <div class="border-t my-1" style="border-color: var(--border-light);"></div>
            </div>
            
            <button 
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm transition-colors hover:opacity-80"
              style="color: var(--color-error);"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
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
  }
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
