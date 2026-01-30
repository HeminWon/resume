import ClassicResumeLayout from './classic/ResumeLayout';
import VuepressResumeLayout from './vuepress/ResumeLayout';
import { ThemeConfig, ThemeId } from './types';

export const THEMES: ThemeConfig[] = [
  { id: 'classic', labelKey: 'themes.classic', Component: ClassicResumeLayout },
  { id: 'vuepress', labelKey: 'themes.vuepress', Component: VuepressResumeLayout },
];

export const resolveThemeId = (value?: string): ThemeId => {
  if (!value) {
    return THEMES[0].id;
  }
  const matched = THEMES.find((item) => item.id === value);
  return matched ? matched.id : THEMES[0].id;
};
