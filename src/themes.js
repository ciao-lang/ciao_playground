/**
 * @file Theme management.
 * @author Guillermo García
 * @author Jose F. Morales
 */

function themeGetValue() {
  try {
    var v = window.localStorage.getItem('theme');
    if (v === null) return 'system';
    return v;
  } catch (e) {
    return 'system';
  }
}

function themeSetValue(value) {
  try {
    if (value === 'system') {
      window.localStorage.removeItem('theme');
    } else {
      window.localStorage.setItem('theme', value);
    }
  } catch (e) {
    return;
  }
}

/**
 * Get actual theme (based on selection and user UI preferences)
 */
function getActualTheme() {
  var theme = themeGetValue();
  if (theme === 'system') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
  }
  return theme;
}
