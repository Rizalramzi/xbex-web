<template>
  <div class="h-screen flex flex-col relative">
    <!-- Sidebar -->
    <Sidebar
      v-show="sidebarStore.sidebarOpen"
      @toggle-sidebar="toggleSidebar"
      class="fixed top-0 left-0 z-50"
    />

    <!-- Main content area -->
    <div
      class="transition-all duration-300 ease-in-out flex flex-col flex-1 min-h-screen"
      :class="[ 
        sidebarStore.sidebarOpen
          ? 'ml-[4.4vw] xl:ml-[269px] 2xl:ml-[373px]'
          : 'ml-[4.4vw] xl:ml-[24px] 2xl:ml-[62px]',
        'me-[4.4vw] xl:me-[24px] 2xl:me-[62px]'
      ]"
    >
      <!-- Header (mobile: fixed, desktop: static) -->
      <Header
        @toggle-sidebar="toggleSidebar"
        class="fixed xl:static top-0 left-0 right-0 z-40"
      />

      <!-- Page content -->
      <main :class="'pt-[14vw] xl:pt-0'">
        <section
          class="min-h-[43.3vw] xl:h-[40vw] mt-[4.1vw] xl:mt-[20px] py-[5.5vw] xl:px-[40px] xl:py-[27px] 2xl:px-[60px] 2xl:py-[40px] rounded-[30px] overflow-hidden page__content">
          <slot name="content" />
        </section>
        <section>
          <slot name="pagination" />
        </section>
      </main>
    </div>
  </div>
</template>


<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useSidebarStore } from '../stores/sidebarStore'

const sidebarStore = useSidebarStore()

const toggleSidebar = () => {
  sidebarStore.toggleSidebar()
}

const handleResize = () => {
  const width = window.innerWidth
  if (width < 1280) {
    sidebarStore.closeSidebar()
  } else {
    sidebarStore.openSidebar()
  }
}

onMounted(() => {
  handleResize() // Set initial state
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
