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

const resolveGraduationDate = (education?: { endDate?: string }[]): Date | null => {
  if (!education || education.length === 0) {
    return null;
  }
  const dates = education
    .map((item) => (item.endDate ? new Date(item.endDate) : null))
    .filter((value): value is Date => value !== null && !Number.isNaN(value.getTime()));
  if (dates.length === 0) {
    return null;
  }
  dates.sort((a, b) => b.getTime() - a.getTime());
  return dates[0];
};

const diffWholeYears = (from: Date, to: Date): number => {
  let years = to.getFullYear() - from.getFullYear();
  const fromMonth = from.getMonth();
  const fromDate = from.getDate();
  const toMonth = to.getMonth();
  const toDate = to.getDate();
  if (toMonth < fromMonth || (toMonth === fromMonth && toDate < fromDate)) {
    years -= 1;
  }
  return years;
};

const toChineseNumber = (value: number): string => {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (value < 10) {
    return digits[value] ?? String(value);
  }
  if (value < 20) {
    return `十${digits[value % 10] ?? ''}`.replace(/十零$/, '十');
  }
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return `${digits[tens]}十${ones ? digits[ones] : ''}`;
  }
  return String(value);
};

const resolveExperienceLabel = (
  lang: ResumeLanguage,
  education?: { endDate?: string }[]
): string => {
  const graduationDate = resolveGraduationDate(education);
  if (!graduationDate) {
    return '';
  }
  const years = diffWholeYears(graduationDate, new Date());
  if (years <= 0) {
    return '';
  }
  if (lang === 'zh') {
    return `${toChineseNumber(years)}年经验`;
  }
  return years === 1 ? '1 year' : `${years} years`;
};

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
    const experience = resolveExperienceLabel(lang, state.data?.education);
    const name = basics?.name?.trim() ?? '';
    const label = basics?.label?.trim() ?? '';
    const titleBase = name && label ? `${name}-${label}` : name || label;
    const title = titleBase && experience ? `${titleBase}-${experience}` : titleBase || experience;
    const safeTitle = title ? sanitizeFileName(title) : '';
    const base = safeTitle || `resume-${lang}`;
    return `${base}.pdf`;
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
