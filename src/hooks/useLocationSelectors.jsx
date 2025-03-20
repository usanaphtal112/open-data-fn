import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../services/api/endpoints';
import apiClient from '../services/api/client';

/**
 * Custom hook to manage cascading location selectors
 * @param {Object} initialValues - Initial location values (optional)
 * @returns {Object} State and methods for location selection
 */
const useLocationSelectors = (initialValues = {}) => {
  // Location data states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);
  
  // Selected values states
  const [selectedProvince, setSelectedProvince] = useState(initialValues.province || '');
  const [selectedDistrict, setSelectedDistrict] = useState(initialValues.district || '');
  const [selectedSector, setSelectedSector] = useState(initialValues.sector || '');
  const [selectedCell, setSelectedCell] = useState(initialValues.cell || '');
  const [selectedVillage, setSelectedVillage] = useState(initialValues.village || '');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load provinces on initial render
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

  // Load initial districts if province is provided
  useEffect(() => {
    if (initialValues.province) {
      fetchDistricts(initialValues.province);
    }
  }, [initialValues.province]);

  // Load initial sectors if district is provided
  useEffect(() => {
    if (initialValues.district) {
      fetchSectors(initialValues.district);
    }
  }, [initialValues.district]);

  // Load initial cells if sector is provided
  useEffect(() => {
    if (initialValues.sector) {
      fetchCells(initialValues.sector);
    }
  }, [initialValues.sector]);

  // Load initial villages if cell is provided
  useEffect(() => {
    if (initialValues.cell) {
      fetchVillages(initialValues.cell);
    }
  }, [initialValues.cell]);

  // Fetch districts for a province
  const fetchDistricts = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setDistricts([]);
      setSectors([]);
      setCells([]);
      setVillages([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.districts(provinceCode));
      setDistricts(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch districts for province ${provinceCode}`);
      setLoading(false);
      console.error('Error fetching districts:', err);
    }
  }, []);

  // Fetch sectors for a district
  const fetchSectors = useCallback(async (districtCode) => {
    if (!districtCode) {
      setSectors([]);
      setCells([]);
      setVillages([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.sectors(districtCode));
      setSectors(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch sectors for district ${districtCode}`);
      setLoading(false);
      console.error('Error fetching sectors:', err);
    }
  }, []);

  // Fetch cells for a sector
  const fetchCells = useCallback(async (sectorCode) => {
    if (!sectorCode) {
      setCells([]);
      setVillages([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.cells(sectorCode));
      setCells(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch cells for sector ${sectorCode}`);
      setLoading(false);
      console.error('Error fetching cells:', err);
    }
  }, []);

  // Fetch villages for a cell
  const fetchVillages = useCallback(async (cellCode) => {
    if (!cellCode) {
      setVillages([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.locations.villages(cellCode));
      setVillages(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch villages for cell ${cellCode}`);
      setLoading(false);
      console.error('Error fetching villages:', err);
    }
  }, []);

  // Handle province selection
  const handleProvinceChange = useCallback((e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    
    fetchDistricts(provinceCode);
  }, [fetchDistricts]);

  // Handle district selection
  const handleDistrictChange = useCallback((e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    
    fetchSectors(districtCode);
  }, [fetchSectors]);

  // Handle sector selection
  const handleSectorChange = useCallback((e) => {
    const sectorCode = e.target.value;
    setSelectedSector(sectorCode);
    setSelectedCell('');
    setSelectedVillage('');
    
    fetchCells(sectorCode);
  }, [fetchCells]);

  // Handle cell selection
  const handleCellChange = useCallback((e) => {
    const cellCode = e.target.value;
    setSelectedCell(cellCode);
    setSelectedVillage('');
    
    fetchVillages(cellCode);
  }, [fetchVillages]);

  // Handle village selection
  const handleVillageChange = useCallback((e) => {
    const villageCode = e.target.value;
    setSelectedVillage(villageCode);
  }, []);

  // Get current location values
  const getLocationValues = useCallback(() => {
    return {
      province: selectedProvince,
      district: selectedDistrict,
      sector: selectedSector,
      cell: selectedCell,
      village: selectedVillage
    };
  }, [selectedProvince, selectedDistrict, selectedSector, selectedCell, selectedVillage]);

  return {
    // Data
    provinces,
    districts,
    sectors,
    cells,
    villages,
    
    // Selected values
    selectedProvince,
    selectedDistrict,
    selectedSector,
    selectedCell,
    selectedVillage,
    
    // Event handlers
    handleProvinceChange,
    handleDistrictChange,
    handleSectorChange,
    handleCellChange,
    handleVillageChange,
    
    // Utility
    getLocationValues,
    loading,
    error
  };
};

export default useLocationSelectors;