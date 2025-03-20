import React, { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import useLocationSelectors from '../../../../hooks/useLocationSelectors';
import styles from './SchoolCreationForm.module.css';

const LocationForm = ({ formData, updateFormData, schools, selectedSchool, setSelectedSchool }) => {
  // Initialize location selectors with existing form data
  const {
    provinces,
    districts,
    sectors,
    cells,
    villages,
    selectedProvince,
    selectedDistrict,
    selectedSector,
    selectedCell,
    selectedVillage,
    handleProvinceChange,
    handleDistrictChange,
    handleSectorChange,
    handleCellChange,
    handleVillageChange,
    loading,
    error
  } = useLocationSelectors({
    province: formData.province,
    district: formData.district,
    sector: formData.sector,
    cell: formData.cell,
    village: formData.village
  });

  // Sync selected location values with parent form data
  useEffect(() => {
    updateFormData({
      province: selectedProvince,
      district: selectedDistrict,
      sector: selectedSector,
      cell: selectedCell,
      village: selectedVillage
    });
  }, [selectedProvince, selectedDistrict, selectedSector, selectedCell, selectedVillage, updateFormData]);

  // Handle input changes for address and coordinates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formSectionTitle}>School Location</h3>
      
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="school">
            <Form.Label>Select School*</Form.Label>
            <Form.Select
              name="school"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              required
            >
              <option value="">Select School</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.school_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="province">
            <Form.Label>Province*</Form.Label>
            <Form.Select
              name="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              disabled={loading}
              required
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="district">
            <Form.Label>District*</Form.Label>
            <Form.Select
              name="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={loading || !selectedProvince}
              required
            >
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="sector">
            <Form.Label>Sector*</Form.Label>
            <Form.Select
              name="sector"
              value={selectedSector}
              onChange={handleSectorChange}
              disabled={loading || !selectedDistrict}
              required
            >
              <option value="">Select Sector</option>
              {sectors.map(sector => (
                <option key={sector.code} value={sector.code}>
                  {sector.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group controlId="cell">
            <Form.Label>Cell*</Form.Label>
            <Form.Select
              name="cell"
              value={selectedCell}
              onChange={handleCellChange}
              disabled={loading || !selectedSector}
              required
            >
              <option value="">Select Cell</option>
              {cells.map(cell => (
                <option key={cell.code} value={cell.code}>
                  {cell.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group controlId="village">
            <Form.Label>Village*</Form.Label>
            <Form.Select
              name="village"
              value={selectedVillage}
              onChange={handleVillageChange}
              disabled={loading || !selectedCell}
              required
            >
              <option value="">Select Village</option>
              {villages.map(village => (
                <option key={village.code} value={village.code}>
                  {village.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="address">
            <Form.Label>Detailed Address*</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter detailed address"
              required
            />
            <Form.Text className="text-muted">
              Provide specific location details like street name, landmark, etc.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="latitude">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g. -1.940278"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="longitude">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g. 30.059444"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default LocationForm;