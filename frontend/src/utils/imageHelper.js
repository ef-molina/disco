/**
 * Normalizes an image path for proper display in the application
 * 
 * This function:
 * 1. Replaces '../' with '/' at the beginning of paths
 * 2. Adds a leading '/' if missing
 * 3. Returns a fallback image if the path is falsy
 * 
 * @param {string} imagePath - The original image path from data
 * @param {string} fallbackImage - The fallback image to use if no image path (default: '/444.svg')
 * @returns {string} - Normalized image path
 */
export function normalizeImagePath(imagePath, fallbackImage = '/444.svg') {
  if (!imagePath) return fallbackImage;
  
  // Replace '../' prefix with '/'
  let normalizedPath = imagePath.replace(/^\.\.\//, '/');
  
  // Ensure path starts with '/'
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  
  return normalizedPath;
} 