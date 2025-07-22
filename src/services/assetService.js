// Asset Service - Handles all asset-related API calls and data management
import assetsData from '../assets/data/assets.json'
import categoriesData from '../assets/data/categories.json'
import statusTypesData from '../assets/data/statusTypes.json'

/**
 * Asset Service
 * Provides methods to interact with asset data
 */
class AssetService {
  constructor() {
    this.assets = [...assetsData]
    this.categories = [...categoriesData]
    this.statusTypes = [...statusTypesData]
  }

  /**
   * Get all assets
   * @param {Object} params - Optional parameters
   * @returns {Promise<Object>} Response with assets data
   */
  async getAssets(params = {}) {
    await this.delay(300)
    
    let result = [...this.assets]
    
    // Apply filters
    if (params.categoryId) {
      result = result.filter(asset => asset.categoryId === parseInt(params.categoryId))
    }
    
    if (params.statusId) {
      result = result.filter(asset => asset.statusId === parseInt(params.statusId))
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.location.toLowerCase().includes(searchTerm) ||
        asset.id.toLowerCase().includes(searchTerm) ||
        asset.serialNumber.toLowerCase().includes(searchTerm)
      )
    }
    
    return { data: result }
  }

  /**
   * Get single asset by ID
   * @param {string} id - Asset ID
   * @returns {Promise<Object>} Response with asset data
   */
  async getAssetById(id) {
    await this.delay(200)
    
    const asset = this.assets.find(asset => asset.id === id)
    if (!asset) {
      throw new Error('Asset not found')
    }
    
    return { data: asset }
  }

  /**
   * Create new asset
   * @param {Object} data - Asset data
   * @returns {Promise<Object>} Response with created asset
   */
  async createAsset(data) {
    await this.delay(500)
    
    // Generate new ID
    const newId = this.generateAssetId()
    
    const newAsset = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.assets.push(newAsset)
    return { data: newAsset }
  }

  /**
   * Update existing asset
   * @param {string} id - Asset ID
   * @param {Object} data - Updated asset data
   * @returns {Promise<Object>} Response with updated asset
   */
  async updateAsset(id, data) {
    await this.delay(400)
    
    const index = this.assets.findIndex(asset => asset.id === id)
    if (index === -1) {
      throw new Error('Asset not found')
    }
    
    this.assets[index] = {
      ...this.assets[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    return { data: this.assets[index] }
  }

  /**
   * Delete asset
   * @param {string} id - Asset ID
   * @returns {Promise<Object>} Response with success status
   */
  async deleteAsset(id) {
    await this.delay(300)
    
    const index = this.assets.findIndex(asset => asset.id === id)
    if (index === -1) {
      throw new Error('Asset not found')
    }
    
    this.assets.splice(index, 1)
    return { data: { success: true } }
  }

  /**
   * Get asset categories
   * @returns {Promise<Object>} Response with categories data
   */
  async getAssetCategories() {
    await this.delay(200)
    return { data: [...this.categories] }
  }

  /**
   * Get asset status types
   * @returns {Promise<Object>} Response with status types data
   */
  async getAssetStatusTypes() {
    await this.delay(200)
    return { data: [...this.statusTypes] }
  }

  // Maintenance methods (keeping existing structure for compatibility)
  async getMaintenanceRecords(params = {}) {
    await this.delay(300)
    // Mock maintenance data - this would normally come from maintenance.json
    return { data: [] }
  }

  async getMaintenanceById(id) {
    await this.delay(200)
    return { data: null }
  }

  async createMaintenance(data) {
    await this.delay(500)
    return { data: { id: Date.now(), ...data } }
  }

  async updateMaintenance(id, data) {
    await this.delay(400)
    return { data: { id, ...data } }
  }

  async deleteMaintenance(id) {
    await this.delay(300)
    return { data: { success: true } }
  }

  // Helper methods
  
  /**
   * Generate new asset ID
   * @returns {string} New asset ID
   */
  generateAssetId() {
    const prefix = 'A'
    const existingIds = this.assets.map(asset => asset.id)
    let counter = 1
    
    while (existingIds.includes(`${prefix}${counter.toString().padStart(3, '0')}`)) {
      counter++
    }
    
    return `${prefix}${counter.toString().padStart(3, '0')}`
  }

  /**
   * Simulate API delay
   * @param {number} ms - Delay in milliseconds
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Create singleton instance
const assetService = new AssetService()

export default assetService
