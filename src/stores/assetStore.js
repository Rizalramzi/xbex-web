import { defineStore } from 'pinia';
import assetService from '../services/assetService';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    assets: [],
    currentAsset: null,
    loading: false,
    error: null,
    categories: [],
    statusTypes: []
  }),
  
  getters: {
    getAssetById: (state) => (id) => {
      return state.assets.find(asset => asset.id === id);
    },
    
    assetsByCategory: (state) => (categoryId) => {
      return state.assets.filter(asset => asset.categoryId === categoryId);
    },
    
    assetsByStatus: (state) => (statusId) => {
      return state.assets.filter(asset => asset.statusId === statusId);
    }
  },
  
  actions: {
    async fetchAssets(params = {}) {
      this.loading = true;
      try {
        const response = await assetService.getAssets(params);
        this.assets = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Failed to fetch assets';
        console.error('Error fetching assets:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAssetById(id) {
      this.loading = true;
      try {
        const response = await assetService.getAssetById(id);
        this.currentAsset = response.data;
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to fetch asset ${id}`;
        console.error(`Error fetching asset ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createAsset(assetData) {
      this.loading = true;
      try {
        const response = await assetService.createAsset(assetData);
        this.assets.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to create asset';
        console.error('Error creating asset:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateAsset(id, assetData) {
      this.loading = true;
      try {
        const response = await assetService.updateAsset(id, assetData);
        const index = this.assets.findIndex(asset => asset.id === id);
        if (index !== -1) {
          this.assets[index] = response.data;
        }
        if (this.currentAsset && this.currentAsset.id === id) {
          this.currentAsset = response.data;
        }
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to update asset ${id}`;
        console.error(`Error updating asset ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteAsset(id) {
      this.loading = true;
      try {
        await assetService.deleteAsset(id);
        this.assets = this.assets.filter(asset => asset.id !== id);
        if (this.currentAsset && this.currentAsset.id === id) {
          this.currentAsset = null;
        }
        this.error = null;
        return true;
      } catch (error) {
        this.error = error.message || `Failed to delete asset ${id}`;
        console.error(`Error deleting asset ${id}:`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCategories() {
      try {
        const response = await assetService.getAssetCategories();
        this.categories = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    
    async fetchStatusTypes() {
      try {
        const response = await assetService.getAssetStatusTypes();
        this.statusTypes = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching status types:', error);
        return [];
      }
    }
  }
});
