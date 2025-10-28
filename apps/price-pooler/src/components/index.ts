import * as ThemeDropdownModule from './ThemeDropdown';

const ThemeDropdown = (ThemeDropdownModule as any).default ?? (ThemeDropdownModule as any).ThemeDropdown;

// Re-export as both named and default to allow easy swapping
export { ThemeDropdown };
export default ThemeDropdown;