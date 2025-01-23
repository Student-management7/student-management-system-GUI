import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface DashboardLayout {
  showRevenueChart: boolean;
  showExpiringPlansChart: boolean;
  showUpcomingExpirations: boolean;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  dashboardLayout: DashboardLayout;
  updateDashboardLayout: (layout: Partial<DashboardLayout>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>({
    showRevenueChart: true,
    showExpiringPlansChart: true,
    showUpcomingExpirations: true,
  });

  useEffect(() => {
    // Check system preference on initial load
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedLayout = localStorage.getItem('dashboardLayout');

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }

    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setDashboardLayout(parsedLayout);
      } catch (error) {
        console.error('Error parsing dashboard layout:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(dashboardLayout));
  }, [dashboardLayout]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateDashboardLayout = (layout: Partial<DashboardLayout>) => {
    setDashboardLayout(prevLayout => ({ ...prevLayout, ...layout }));
  };

  const value = {
    theme,
    toggleTheme,
    dashboardLayout,
    updateDashboardLayout,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};