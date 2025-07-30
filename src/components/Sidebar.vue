<template>
  <div
    id="sidebar"
    class="xl:min-w-[245px] 2xl:min-w-[331px] h-screen fixed flex flex-col items-start xl:py-[16px] 2xl:py-[22px] ps-[2vw] pe-[28px] overflow-y-auto" style="background-color: var(--color-bgsidebar);"
  >
    <!-- Logo -->
    <div class="w-full h-fit">
      <span class="text-primary-color xl:text-[30px] 2xl:text-[40px] xl:leading-[44px] 2xl:leading-[60px] font-bold">Xibex</span>
    </div>

    <!-- Menu Utama -->
    <div class="w-full xl:mt-3.5 2xl:mt-5 flex flex-col items-start xl:gap-[15px] 2xl:gap-[20px]">
      <template v-for="item in menuItems" :key="item.id">
        <!-- Jika bukan group -->
        <router-link
          v-if="!item.isGroup"
          :to="item.href"
          :class="['card__menu', isActiveRoute(item.href) && 'active']"
        >
          <img :src="item.icon" :alt="item.name + ' Icon'" class="icon__menu" />
          <span class="label__main">{{ item.name }}</span>
        </router-link>

        <!-- Jika group -->
        <div v-else class="w-full flex flex-col items-start xl:gap-[11px] 2xl:gap-[15px]">
          <div class="title__container__menu">
            <span>{{ item.name }}</span>
            <div class="dotted__border"></div>
          </div>

          <div class="container__menu">
            <template v-for="child in item.children" :key="child.id">
              <!-- Level 2 tanpa children -->
              <router-link
                v-if="!child.children"
                :to="child.href"
                :class="['card__menu', isActiveRoute(child.href) && 'active']"
              >
                <img :src="child.icon" :alt="child.name + ' Icon'" class="icon__menu" />
                <span class="label__main">{{ child.name }}</span>
              </router-link>

              <!-- Level 2 dengan children -->
              <div 
                class="card__menu w-full flex items-center justify-between relative cursor-pointer"
                v-else
                @mouseenter="handleMouseEnter($event, child)"
                @mouseleave="handleSubmenuLeave"
              >
                <div class="flex items-center xl:gap-[15px] 2xl:gap-[20px]">
                  <img :src="child.icon" :alt="child.name + ' Icon'" class="icon__menu" />
                  <span class="label__main">{{ child.name }}</span>
                </div>
                <img src="/icons/arrow.svg" alt="Arrow Icon" class="arrow xl:w-[10px] 2xl:w-[12px] h-auto object-center object-cover shrink-0 -rotate-90">
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal submenu -->
    <div
      v-if="hoveredMenu"
      class="fixed z-50 min-w-[300px] bg__submenu shadow-xl p-4"
      :style="`top: ${submenuPosition.top}px; left: ${submenuPosition.left}px`"
      @mouseenter="cancelSubmenuClose"
      @mouseleave="handleSubmenuLeave"
    >
      <div class="grid grid-cols-3 gap-4">
        <router-link
          v-for="sub in hoveredMenu.children"
          :key="sub.id"
          :to="sub.link"
          class="flex items-center gap-2 text-sm hover:underline cursor-pointer"
        >
          <img :src="sub.icon" alt="Submenu Icon" class="w-4 h-4 object-contain" />
          <span>{{ sub.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- Status & Logout -->
    <div class="w-full xl:mt-[44px] 2xl:mt-[60px] mb-32">
      <div class="w-full flex flex-col gap-[25px] items-start">
        <div class="dotted__border"></div>
        <div class="w-full flex flex-col gap-[10px] items-start">
          <div class="w-full flex flex-row justify-between items-center">
            <div class="w-full flex flex-row gap-[22px] items-center">
              <div class="icon__rounded bg-success-light">
                <img
                  src="/icons/location.svg"
                  alt="Location Icon"
                  class="xl:w-[10px] xl:h-auto 2xl:w-[12px] 2xl:h-[15px] object-cover object-center shrink-0"
                />
              </div>
              <div class="flex flex-col">
                <span class="label__main">{{ currentSite }}</span>
                <span class="label__secondary">Status: Active</span>
              </div>
            </div>

            <div
              class="icon__rounded bg-gray-100 hover:bg-gray-300 flex-none cursor-pointer"
              @click="openSiteChangeModal"
            >
              <img
                src="/icons/switch.svg"
                alt="Switch Icon"
                class="xl:w-[12px] xl:h-auto 2xl:w-[16px] 2xl:h-[14px] object-cover object-center shrink-0"
              />
            </div>
          </div>

          <div class="w-full flex flex-row justify-between items-center">
            <div class="w-full flex flex-row gap-[22px] items-center">
              <div class="icon__rounded bg-primary">
                <span class="text-[10px] 2xl:text-[14px] leading-[21px] text-white">A</span>
              </div>
              <div class="flex flex-col">
                <span class="label__main">Admin</span>
                <span class="label__secondary">Administrator</span>
              </div>
            </div>

            <div
              class="icon__rounded bg-gray-100 hover:bg-gray-300 flex-none cursor-pointer"
              @click="logout"
            >
              <img
                src="/icons/logout.svg"
                alt="Logout Icon"
                class="xl:w-[12px] xl:h-auto 2xl:w-[16px] 2xl:h-[14px] object-cover object-center shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Site Change -->
    <SiteChangeModal
      :show="showSiteModal"
      :current-site="currentSite"
      @close="showSiteModal = false"
      @change="handleSiteChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSiteStore } from '@/stores/siteStore'
import SiteChangeModal from '@/components/SiteChangeModal.vue'

const menuItems = ref([])
const hoveredMenu = ref(null)
const submenuPosition = ref({ top: 0, left: 0 })
const submenuLocked = ref(false)
const showSiteModal = ref(false)
const submenuCloseTimeout = ref(null)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const siteStore = useSiteStore()

const currentSite = computed(() => siteStore.currentSite)

function isActiveRoute(path) {
  return route.path === path || route.path.startsWith(path + '/')
}

function handleMouseEnter(event, child) {
  if (submenuLocked.value) return

  // Batalkan timeout jika user kembali hover
  if (submenuCloseTimeout.value) {
    clearTimeout(submenuCloseTimeout.value)
    submenuCloseTimeout.value = null
  }

  hoveredMenu.value = child
  const rect = event.currentTarget.getBoundingClientRect()
  submenuPosition.value = {
    top: rect.top,
    left: rect.right + 16,
  }
}

function handleSubmenuLeave() {
  if (!submenuLocked.value) {
    submenuCloseTimeout.value = setTimeout(() => {
      hoveredMenu.value = null
    }, 250) // delay sebelum submenu tertutup
  }
}

function cancelSubmenuClose() {
  if (submenuCloseTimeout.value) {
    clearTimeout(submenuCloseTimeout.value)
    submenuCloseTimeout.value = null
  }
}

function handleClickOutside(event) {
  const sidebar = document.getElementById('sidebar')
  if (sidebar && !sidebar.contains(event.target)) {
    hoveredMenu.value = null
    submenuLocked.value = false
  }
}

function openSiteChangeModal() {
  showSiteModal.value = true
}

function handleSiteChange(newSite) {
  siteStore.changeSite(newSite)
  showSiteModal.value = false
}

async function logout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout gagal:', err)
  }
}

onMounted(async () => {
  try {
    const menuData = await import('@/assets/data/menu.json')
    menuItems.value = menuData.default || menuData
  } catch (error) {
    console.error('Failed to load menu.json:', error)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)

  if (submenuCloseTimeout.value) {
    clearTimeout(submenuCloseTimeout.value)
  }
})
</script>

<style scoped>
#sidebar::-webkit-scrollbar {
  display: none;
}
</style>
