import { create } from 'zustand';

const setBodyTheme = (dark) => {
  document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
};

setBodyTheme(localStorage.getItem('theme') === 'dark');

export const useTheme = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggleTheme: () =>
    set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      setBodyTheme(newIsDark);
      return { isDark: newIsDark };
    }),
}));
