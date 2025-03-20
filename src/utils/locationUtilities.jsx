/**
 * Creates a new object with location codes replaced by their names
 * 
 * @param {Object} obj - Object with location codes
 * @param {Object} locationService - An instance of a service that can translate codes to names
 * @param {Object} mappings - Mapping of object properties to location types
 * @returns {Promise<Object>} A new object with location names instead of codes
 */
export const replaceLocationCodesWithNames = async (obj, locationService, mappings) => {
    if (!obj || !locationService || !mappings) {
      return obj;
    }
  
    const result = { ...obj };
    
    for (const [key, locationType] of Object.entries(mappings)) {
      if (result[key]) {
        result[key] = await locationService.getLocationName(result[key], locationType);
      }
    }
    
    return result;
  };
  
  /**
   * Transforms an array of objects by replacing location codes with names
   * 
   * @param {Array} items - Array of objects with location codes
   * @param {Object} locationService - An instance of a service that can translate codes to names
   * @param {Object} mappings - Mapping of object properties to location types
   * @returns {Promise<Array>} A new array with location names instead of codes
   */
  export const transformLocationCodes = async (items, locationService, mappings) => {
    if (!Array.isArray(items) || !locationService || !mappings) {
      return items;
    }
    
    const transformedItems = [];
    
    for (const item of items) {
      const transformedItem = await replaceLocationCodesWithNames(item, locationService, mappings);
      transformedItems.push(transformedItem);
    }
    
    return transformedItems;
  };