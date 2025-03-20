import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../services/api/endpoints';
import apiClient from '../services/api/client';

/**
 * Custom hook to fetch and translate location codes to names
 * @returns {Object} Methods and state for location code translation
 */
const useLocationNames = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState({});
  const [sectors, setSectors] = useState({});
  const [cells, setCells] = useState({});
  const [villages, setVillages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all provinces on initial load
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(endpoints.locations.provinces);
        setProvinces(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch provinces');
        setLoading(false);
        console.error('Error fetching provinces:', err);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts for a province if not already cached
  const fetchDistricts = useCallback(async (provinceCode) => {
    if (!provinceCode) return [];
    
    // Return cached data if available
    if (districts[provinceCode]) {
      return districts[provinceCode];
    }

    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.districts(provinceCode));
      const districtsData = response.data;
      
      // Update the districts cache
      setDistricts(prev => ({
        ...prev,
        [provinceCode]: districtsData
      }));
      
      setLoading(false);
      return districtsData;
    } catch (err) {
      setError(`Failed to fetch districts for province ${provinceCode}`);
      setLoading(false);
      console.error('Error fetching districts:', err);
      return [];
    }
  }, [districts]);

  // Fetch sectors for a district if not already cached
  const fetchSectors = useCallback(async (districtCode) => {
    if (!districtCode) return [];
    
    // Return cached data if available
    if (sectors[districtCode]) {
      return sectors[districtCode];
    }

    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.sectors(districtCode));
      const sectorsData = response.data;
      
      // Update the sectors cache
      setSectors(prev => ({
        ...prev,
        [districtCode]: sectorsData
      }));
      
      setLoading(false);
      return sectorsData;
    } catch (err) {
      setError(`Failed to fetch sectors for district ${districtCode}`);
      setLoading(false);
      console.error('Error fetching sectors:', err);
      return [];
    }
  }, [sectors]);

  // Fetch cells for a sector if not already cached
  const fetchCells = useCallback(async (sectorCode) => {
    if (!sectorCode) return [];
    
    // Return cached data if available
    if (cells[sectorCode]) {
      return cells[sectorCode];
    }

    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.cells(sectorCode));
      const cellsData = response.data;
      
      // Update the cells cache
      setCells(prev => ({
        ...prev,
        [sectorCode]: cellsData
      }));
      
      setLoading(false);
      return cellsData;
    } catch (err) {
      setError(`Failed to fetch cells for sector ${sectorCode}`);
      setLoading(false);
      console.error('Error fetching cells:', err);
      return [];
    }
  }, [cells]);

  // Fetch villages for a cell if not already cached
  const fetchVillages = useCallback(async (cellCode) => {
    if (!cellCode) return [];
    
    // Return cached data if available
    if (villages[cellCode]) {
      return villages[cellCode];
    }

    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.villages(cellCode));
      const villagesData = response.data;
      
      // Update the villages cache
      setVillages(prev => ({
        ...prev,
        [cellCode]: villagesData
      }));
      
      setLoading(false);
      return villagesData;
    } catch (err) {
      setError(`Failed to fetch villages for cell ${cellCode}`);
      setLoading(false);
      console.error('Error fetching villages:', err);
      return [];
    }
  }, [villages]);

  // Get location name by code
  const getLocationName = useCallback(async (code, type) => {
    if (!code) return '';
    
    try {
      let result = '';
      
      switch (type) {
        case 'province':
          // Search in provinces
          result = provinces.find(province => province.code === code)?.name || '';
          break;
          
        case 'district':
          // Extract province code from district code (RW.KL.GB -> RW.KL)
          const provinceCode = code.split('.').slice(0, 2).join('.');
          const districtsData = await fetchDistricts(provinceCode);
          result = districtsData.find(district => district.code === code)?.name || '';
          break;
          
        case 'sector':
          // Extract district code from sector code (RW.KL.GB.NY -> RW.KL.GB)
          const districtCode = code.split('.').slice(0, 3).join('.');
          const sectorsData = await fetchSectors(districtCode);
          result = sectorsData.find(sector => sector.code === code)?.name || '';
          break;
          
        case 'cell':
          // Extract sector code from cell code (RW.KL.GB.NY.RC -> RW.KL.GB.NY)
          const sectorCode = code.split('.').slice(0, 4).join('.');
          const cellsData = await fetchCells(sectorCode);
          result = cellsData.find(cell => cell.code === code)?.name || '';
          break;
          
        case 'village':
          // Extract cell code from village code (RW.KL.GB.NY.RC.VL -> RW.KL.GB.NY.RC)
          const cellCode = code.split('.').slice(0, 5).join('.');
          const villagesData = await fetchVillages(cellCode);
          result = villagesData.find(village => village.code === code)?.name || '';
          break;
          
        default:
          result = code;
      }
      
      return result || code; // Return the original code if name not found
    } catch (err) {
      console.error(`Error getting ${type} name for code ${code}:`, err);
      return code; // Return the original code on error
    }
  }, [provinces, fetchDistricts, fetchSectors, fetchCells, fetchVillages]);

  return {
    provinces,
    getLocationName,
    loading,
    error
  };
};

export default useLocationNames;