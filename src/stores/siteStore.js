import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSiteStore = defineStore('site', () => {
  const currentSite = ref('KJA')
  const sites = ref([
    {
      id: 'KJA',
      name: 'KJA',
      description: 'Kaltim Prima Coal Mine'
    },
    {
      id: 'BMB',
      name: 'BMB',
      description: 'Balikpapan Mining Base'
    },
    {
      id: 'TBG',
      name: 'TBG',
      description: 'Tabang Mining Project'
    },
    {
      id: 'ADR',
      name: 'ADR',
      description: 'Adaro Mining Operation'
    }
  ])

  // Change the current site
  function changeSite(siteId) {
    // Validate that the site exists
    const siteExists = sites.value.some(site => site.id === siteId)
    if (!siteExists) {
      console.error(`Site with ID ${siteId} does not exist`)
      return false
    }
    
    currentSite.value = siteId
    return true
  }

  // Get site information by ID
  function getSiteInfo(siteId = null) {
    const id = siteId || currentSite.value
    return sites.value.find(site => site.id === id) || null
  }

  // Get all available sites
  function getAllSites() {
    return sites.value
  }

  return {
    currentSite,
    sites,
    changeSite,
    getSiteInfo,
    getAllSites
  }
})
