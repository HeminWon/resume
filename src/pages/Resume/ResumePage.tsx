import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResumeLanguage } from '../../data/resumeService';
import { useResumeData } from '../../hooks/useResumeData';
import { THEMES, resolveThemeId } from '../../themes';
import { THEME_STORAGE_KEY } from '../../themes/storage';
import { ThemeId } from '../../themes/types';
import { withPublicUrl } from '../../utils/publicUrl';

const resolveLanguage = (value?: string): ResumeLanguage => {
  if (value && value.toLowerCase().startsWith('en')) {
    return 'en';
  }
  return 'zh';
};

const sanitizeFileName = (value: string): string =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '');

const ResumePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = useMemo(
    () => resolveLanguage(i18n.resolvedLanguage ?? i18n.language),
    [i18n.language, i18n.resolvedLanguage]
  );
  const [state, retry] = useResumeData(lang);
  const [theme, setTheme] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') {
      return THEMES[0].id;
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    return resolveThemeId(stored ?? undefined);
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleSwitchLanguage = () => {
    const next = lang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  const handleSwitchTheme = () => {
    const index = THEMES.findIndex((item) => item.id === theme);
    const nextTheme = THEMES[(index + 1) % THEMES.length].id;
    setTheme(nextTheme);
  };

  const resolvePdfName = () => {
    const basics = state.data?.basics;
    const name = basics?.name?.trim() ?? '';
    const label = basics?.label?.trim() ?? '';
    const title = name && label ? `${name}-${label}` : name || label;
    const safeTitle = title ? sanitizeFileName(title) : '';
    const base = safeTitle || `resume-${lang}`;
    return `${base}-${theme}.pdf`;
  };

  const handlePrint = async () => {
    try {
      const pdfPath = withPublicUrl(`resume-${lang}-${theme}.pdf`);
      const response = await fetch(pdfPath, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to download resume.pdf (${response.status})`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resolvePdfName();
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(t('alerts.downloadFailed'));
    }
  };

  const themeConfig = useMemo(() => THEMES.find((item) => item.id === theme) ?? THEMES[0], [theme]);
  const ThemeLayout = themeConfig.Component;

  return (
    <ThemeLayout
      state={state}
      lang={lang}
      theme={theme}
      onPrint={handlePrint}
      onSwitchTheme={handleSwitchTheme}
      onSwitchLanguage={handleSwitchLanguage}
      onRetry={retry}
    />
  );
};

export default ResumePage;
