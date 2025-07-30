<template>
  <div class="h-screen flex">
    <!-- Sidebar -->
    <Sidebar
      v-show="sidebarStore.sidebarOpen"
      @toggle-sidebar="toggleSidebar"
      class="fixed top-0 left-0 z-50"
    />

    <!-- Main content area -->
    <div
      class="transition-all duration-300 ease-in-out flex flex-col flex-1 min-h-screen  xl:me-[24px] 2xl:me-[62px]" :class="sidebarStore.sidebarOpen ? 'xl:ms-[269px] 2xl:ms-[373px]' : 'xl:ml-[24px] 2xl:ml-[62px]'"
    >
      <!-- Header -->
      <Header @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main>
        <section class="h-[40vw] mt-[20px] px-[40px] py-[27px] 2xl:px-[60px] 2xl:py-[40px] rounded-[30px] overflow-hidden"
        style="background-color: var(--color-bgsidebar);">
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
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useSidebarStore } from '../stores/sidebarStore'

const sidebarStore = useSidebarStore()

const toggleSidebar = () => {
  sidebarStore.toggleSidebar()
}
</script>
