<template>
  <div
    id="sidebar"
    class="min-w-[331px] h-screen fixed flex flex-col items-start py-[22px] ps-[2vw] pe-[28px] bg-white overflow-y-auto"
  >
    <!-- Logo -->
    <div class="w-full h-fit">
      <span class="text-primary-color text-[40px] leading-[60px] font-bold">Xibex</span>
    </div>

    <!-- Menu Utama -->
    <div class="w-full mt-5 flex flex-col items-start gap-[20px]">
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
        <div v-else class="w-full flex flex-col items-start gap-[15px]">
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

              <!-- Level 2 dengan children (submenu modal fixed) -->
              <div
                class="card__menu relative"
                v-else
                @mouseenter="handleMouseEnter($event, child)"
                @mouseleave="hoveredMenu = null"
              >
                <img :src="child.icon" :alt="child.name + ' Icon'" class="icon__menu" />
                <span class="label__main">{{ child.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal submenu (muncul di luar sidebar) -->
    <div
      v-if="hoveredMenu"
      class="fixed z-50 min-w-[300px] bg-white border border-gray-200 shadow-xl p-4"
      :style="`top: ${submenuPosition.top}px; left: ${submenuPosition.left}px`"
      @mouseleave="hoveredMenu = null"
    >
      <div class="grid grid-cols-3 gap-4">
        <router-link
          v-for="sub in hoveredMenu.children"
          :key="sub.id"
          :to="sub.link"
          class="text-sm hover:underline cursor-pointer"
        >
          {{ sub.name }}
        </router-link>
      </div>
    </div>

    <!-- Status & Logout -->
    <div class="w-full mt-[60px] mb-32">
      <div class="w-full flex flex-col gap-[25px] items-start">
        <div class="dotted__border"></div>
        <div class="w-full flex flex-col gap-[10px] items-start">
          <div class="w-full flex flex-row justify-between items-center">
            <div class="w-full flex flex-row gap-[22px] items-center">
              <div class="icon__rounded bg-success-light">
                <img
                  src="/icons/location.svg"
                  alt="Location Icon"
                  class="w-[12px] h-[15px] object-cover object-center shrink-0"
                />
              </div>
              <div class="flex flex-col">
                <span class="label__main">{{ currentSite }}</span>
                <span class="label__secondary">Status: Active</span>
              </div>
            </div>

            <div
              class="icon__rounded bg-gray-300 flex-none cursor-pointer"
              @click="openSiteChangeModal"
            >
              <img
                src="/icons/switch.svg"
                alt="Switch Icon"
                class="w-[16px] h-[14px] object-cover object-center shrink-0"
              />
            </div>
          </div>

          <div class="w-full flex flex-row justify-between items-center">
            <div class="w-full flex flex-row gap-[22px] items-center">
              <div class="icon__rounded bg-primary">
                <span class="text-[14px] leading-[21px] text-white">A</span>
              </div>
              <div class="flex flex-col">
                <span class="label__main">Admin</span>
                <span class="label__secondary">Administrator</span>
              </div>
            </div>

            <div
              class="icon__rounded bg-gray-300 flex-none cursor-pointer"
              @click="logout"
            >
              <img
                src="/icons/logout.svg"
                alt="Logout Icon"
                class="w-[16px] h-[14px] object-cover object-center shrink-0"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSiteStore } from '@/stores/siteStore'
import SiteChangeModal from '@/components/SiteChangeModal.vue'

const menuItems = ref([])
const hoveredMenu = ref(null)
const submenuPosition = ref({ top: 0, left: 0 })
const showSiteModal = ref(false)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const siteStore = useSiteStore()

const currentSite = computed(() => siteStore.currentSite)

function isActiveRoute(path) {
  return route.path === path || route.path.startsWith(path + '/')
}

function handleMouseEnter(event, child) {
  hoveredMenu.value = child
  const rect = event.currentTarget.getBoundingClientRect()
  submenuPosition.value = {
    top: rect.top,
    left: rect.right + 16,
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
})
</script>

<style scoped>
#sidebar::-webkit-scrollbar {
  display: none;
}

.card__menu:hover,
.card__menu:active {
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
}

.card__menu:hover .icon__menu,
.card__menu:active .icon__menu {
  filter: brightness(0) invert(1);
}

.card__menu.active {
  background-color: var(--color-primary);
  color: white;
}

.card__menu.active .icon__menu {
  filter: brightness(0) invert(1);
}
</style>
