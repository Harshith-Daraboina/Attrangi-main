// Date utility functions for consistent date handling

/**
 * Convert DD/MM/YYYY format to YYYY-MM-DD (ISO format)
 * @param {string} dateString - Date in DD/MM/YYYY format
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const convertToISOFormat = (dateString) => {
  if (!dateString) return null;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  // Handle YYYY-MM-DD format (already correct)
  if (dateString.includes('-') && dateString.length === 10) {
    return dateString;
  }
  
  // If invalid format, return null
  return null;
};

/**
 * Convert YYYY-MM-DD format to DD/MM/YYYY for display
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} - Date in DD/MM/YYYY format
 */
export const convertToDisplayFormat = (isoDate) => {
  if (!isoDate) return '';
  
  if (isoDate.includes('-')) {
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
  }
  
  return isoDate;
};

/**
 * Validate date format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid date format
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const isoDate = convertToISOFormat(dateString);
  if (!isoDate) return false;
  
  const date = new Date(isoDate);
  return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === isoDate;
};

/**
 * Get current date in ISO format
 * @returns {string} - Current date in YYYY-MM-DD format
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns {number} - Age in years
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
