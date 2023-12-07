'use client';
import { AppState } from '@/store';
import { useSelector } from '@/store/hooks';
import * as locales from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import _ from 'lodash';
import { useEffect } from 'react';
import components from './Components';
import { DarkThemeColors } from './DarkThemeColors';
import { baseDarkTheme, baselightTheme } from './DefaultColors';
import { LightThemeColors } from './LightThemeColors';
import { darkshadows, shadows } from './Shadows';
import typography from './Typography';

export const BuildTheme = (config: any = {}) => {
  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const darkthemeOptions = DarkThemeColors.find((theme) => theme.name === config.theme);
  const customizer = useSelector((state: AppState) => state.customizer);
  const defaultTheme = customizer.activeMode === 'dark' ? baseDarkTheme : baselightTheme;
  const defaultShadow = customizer.activeMode === 'dark' ? darkshadows : shadows;
  const themeSelect = customizer.activeMode === 'dark' ? darkthemeOptions : themeOptions;
  const baseMode = {
    palette: {
      mode: customizer.activeMode,
    },
    shape: {
      borderRadius: customizer.borderRadius,
    },
    shadows: defaultShadow,
    typography: typography,
  };
  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales, themeSelect, {
      direction: config.direction,
    }),
  );
  theme.components = components(theme);

  return theme;
};

const ThemeSettings = () => {
  const activDir = useSelector((state: AppState) => state.customizer.activeDir);
  const activeTheme = useSelector((state: AppState) => state.customizer.activeTheme);
  const theme = BuildTheme({
    direction: activDir,
    theme: activeTheme,
  });
  document;
  useEffect(() => {
    document.dir = activDir as string;
  }, [activDir]);

  return theme;
};

export { ThemeSettings };
