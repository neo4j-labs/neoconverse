import { createContext, useMemo, useState, ReactNode } from 'react';
import { NeedleThemeProvider, useMediaQuery } from '@neo4j-ndl/react';

export const ThemeWrapperContext = createContext({
  toggleColorMode: () => {},
  colorMode: 'light' as string,
});

interface ThemeWrapperProps {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<string>(prefersDarkMode ? 'dark' : 'light');
  const [usingPreferredMode, setUsingPreferredMode] = useState<boolean>(true);
  const themeWrapperUtils = useMemo(
    () => ({
      colorMode: mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          setUsingPreferredMode(false);
          themeBodyInjection(prevMode);
          return prevMode === 'light' ? 'dark' : 'light';
        });
      },
    }),
    [mode]
  );
  const themeBodyInjection = (mode: string) => {
    if (mode === 'light') {
      document.body.classList.add('ndl-theme-dark');
    } else {
      document.body.classList.remove('ndl-theme-dark');
    }
  };

  if (usingPreferredMode) {
    prefersDarkMode ? themeBodyInjection('light') : themeBodyInjection('dark');
  }

  return (
    <ThemeWrapperContext.Provider value={themeWrapperUtils}>
      <NeedleThemeProvider theme={mode as 'light' | 'dark' | undefined} wrapperProps={{ isWrappingChildren: true }}>
        {children}
      </NeedleThemeProvider>
    </ThemeWrapperContext.Provider>
  );
}
