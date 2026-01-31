import type React from 'react';
import type { ResumeLoadState } from '../hooks/useResumeData';
import type { ResumeLanguage } from '../data/resumeService';

export type ThemeId = (typeof import('./index').THEMES)[number]['id'];

export type ResumeLayoutProps = {
  state: ResumeLoadState;
  lang: ResumeLanguage;
  theme: ThemeId;
  onPrint: () => void;
  onSwitchTheme: () => void;
  onSwitchLanguage: () => void;
  onRetry: () => void;
};

export type ThemeConfig = {
  id: ThemeId;
  labelKey: string;
  Component: React.FC<ResumeLayoutProps>;
};
