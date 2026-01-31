import type React from 'react';
import ClassicResumeLayout from './classic/ResumeLayout';
import VuepressResumeLayout from './vuepress/ResumeLayout';
import type { ResumeLayoutProps, ThemeId } from './types';

export const THEMES = [
  { id: 'classic', labelKey: 'themes.classic', Component: ClassicResumeLayout },
  { id: 'vuepress', labelKey: 'themes.vuepress', Component: VuepressResumeLayout },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: string;
  Component: React.FC<ResumeLayoutProps>;
}>;

export const resolveThemeId = (value?: string): ThemeId => {
  if (!value) {
    return THEMES[0].id;
  }
  const matched = THEMES.find((item) => item.id === value);
  return matched ? matched.id : THEMES[0].id;
};
