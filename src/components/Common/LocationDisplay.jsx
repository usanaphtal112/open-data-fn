import React, { useState, useEffect } from 'react';
import useLocationNames from '../../hooks/useLocationNames';
import PropTypes from 'prop-types';

/**
 * A component that displays human-readable location names from location codes
 * @param {string} code - The location code
 * @param {string} type - The location type (province, district, sector, cell, village)
 * @param {boolean} showCode - Whether to show the code alongside the name
 * @returns {React.ReactElement} The rendered component
 */
const LocationDisplay = ({ code, type, showCode = false }) => {
  const { getLocationName, loading } = useLocationNames();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      if (code) {
        const locationName = await getLocationName(code, type);
        setName(locationName);
      }
    };

    fetchName();
  }, [code, type, getLocationName]);

  if (!code) return null;
  
  if (loading) return <span>Loading...</span>;

  return (
    <span>
      {name}
      {showCode && name !== code && ` (${code})`}
    </span>
  );
};

LocationDisplay.propTypes = {
  code: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['province', 'district', 'sector', 'cell', 'village']).isRequired,
  showCode: PropTypes.bool
};

export default LocationDisplay;