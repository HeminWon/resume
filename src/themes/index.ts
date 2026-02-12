import type React from 'react';
import ClassicResumeLayout from './classic/ResumeLayout';
import VuepressResumeLayout from './vuepress/ResumeLayout';
import themeIds from './theme-ids.json';
import type { ResumeLayoutProps, ThemeId } from './types';

export const THEME_COMPONENTS = {
  classic: ClassicResumeLayout,
  vuepress: VuepressResumeLayout,
} as const;

const orderedThemeIds = Array.from(new Set(themeIds));
const unresolvedIds = orderedThemeIds.filter(
  (id) => !Object.prototype.hasOwnProperty.call(THEME_COMPONENTS, id)
);
if (unresolvedIds.length > 0) {
  throw new Error(`[theme] unknown theme ids in theme-ids.json: ${unresolvedIds.join(', ')}`);
}
if (orderedThemeIds.length === 0) {
  throw new Error('[theme] no theme ids found in theme-ids.json');
}

export const THEMES = orderedThemeIds.map((id) => ({
  id: id as ThemeId,
  labelKey: `themes.${id}`,
  Component: THEME_COMPONENTS[id as keyof typeof THEME_COMPONENTS],
})) satisfies ReadonlyArray<{
  id: ThemeId;
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
