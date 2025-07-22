import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteMenuStore = defineStore('favoriteMenu', () => {
  // State
  const favoriteMenus = ref([])

  // Getters
  const getFavoriteMenus = computed(() => favoriteMenus.value)
  
  const isFavorite = computed(() => (menuId) => {
    return favoriteMenus.value.some(menu => menu.id === menuId)
  })

  const favoriteCount = computed(() => favoriteMenus.value.length)

  // Actions
  const addToFavorites = (menuItem) => {
    if (!isFavorite.value(menuItem.id)) {
      const favoriteItem = {
        id: menuItem.id,
        name: menuItem.name,
        href: menuItem.href,
        icon: menuItem.icon,
        level: menuItem.level,
        parent: menuItem.parent || null,
        addedAt: new Date().toISOString()
      }
      favoriteMenus.value.push(favoriteItem)
      saveToLocalStorage()
    }
  }

  const removeFromFavorites = (menuId) => {
    const index = favoriteMenus.value.findIndex(menu => menu.id === menuId)
    if (index > -1) {
      favoriteMenus.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  const toggleFavorite = (menuItem) => {
    if (isFavorite.value(menuItem.id)) {
      removeFromFavorites(menuItem.id)
    } else {
      addToFavorites(menuItem)
    }
  }

  const clearAllFavorites = () => {
    favoriteMenus.value = []
    saveToLocalStorage()
  }

  // Local Storage persistence
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('arfs_favorite_menus', JSON.stringify(favoriteMenus.value))
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('arfs_favorite_menus')
      if (stored) {
        favoriteMenus.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error)
      favoriteMenus.value = []
    }
  }

  // Initialize from localStorage
  loadFromLocalStorage()

  return {
    // State
    favoriteMenus,
    
    // Getters
    getFavoriteMenus,
    isFavorite,
    favoriteCount,
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,
    loadFromLocalStorage
  }
})
