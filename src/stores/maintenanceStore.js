import { defineStore } from 'pinia';
import assetService from '../services/assetService';

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    maintenanceRecords: [],
    currentMaintenance: null,
    loading: false,
    error: null,
    maintenanceTypes: []
  }),
  
  getters: {
    getMaintenanceById: (state) => (id) => {
      return state.maintenanceRecords.find(record => record.id === id);
    },
    
    maintenanceByAsset: (state) => (assetId) => {
      return state.maintenanceRecords.filter(record => record.assetId === assetId);
    },
    
    maintenanceByType: (state) => (typeId) => {
      return state.maintenanceRecords.filter(record => record.typeId === typeId);
    },
    
    scheduledMaintenance: (state) => {
      return state.maintenanceRecords.filter(record => record.status === 'scheduled');
    },
    
    completedMaintenance: (state) => {
      return state.maintenanceRecords.filter(record => record.status === 'completed');
    }
  },
  
  actions: {
    async fetchMaintenanceRecords(params = {}) {
      this.loading = true;
      try {
        const response = await assetService.getMaintenanceRecords(params);
        this.maintenanceRecords = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Failed to fetch maintenance records';
        console.error('Error fetching maintenance records:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchMaintenanceById(id) {
      this.loading = true;
      try {
        const response = await assetService.getMaintenanceById(id);
        this.currentMaintenance = response.data;
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to fetch maintenance ${id}`;
        console.error(`Error fetching maintenance ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createMaintenance(maintenanceData) {
      this.loading = true;
      try {
        const response = await assetService.createMaintenance(maintenanceData);
        this.maintenanceRecords.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to create maintenance record';
        console.error('Error creating maintenance record:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateMaintenance(id, maintenanceData) {
      this.loading = true;
      try {
        const response = await assetService.updateMaintenance(id, maintenanceData);
        const index = this.maintenanceRecords.findIndex(record => record.id === id);
        if (index !== -1) {
          this.maintenanceRecords[index] = response.data;
        }
        if (this.currentMaintenance && this.currentMaintenance.id === id) {
          this.currentMaintenance = response.data;
        }
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to update maintenance ${id}`;
        console.error(`Error updating maintenance ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteMaintenance(id) {
      this.loading = true;
      try {
        await assetService.deleteMaintenance(id);
        this.maintenanceRecords = this.maintenanceRecords.filter(record => record.id !== id);
        if (this.currentMaintenance && this.currentMaintenance.id === id) {
          this.currentMaintenance = null;
        }
        this.error = null;
        return true;
      } catch (error) {
        this.error = error.message || `Failed to delete maintenance ${id}`;
        console.error(`Error deleting maintenance ${id}:`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchMaintenanceTypes() {
      try {
        const response = await assetService.getMaintenanceTypes();
        this.maintenanceTypes = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching maintenance types:', error);
        return [];
      }
    }
  }
});
