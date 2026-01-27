import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResumeLanguage } from '../../data/resumeService';
import { useResumeData } from '../../hooks/useResumeData';
import HeaderSection from './sections/HeaderSection';
import WorkSection from './sections/WorkSection';
import ProjectSection from './sections/ProjectSection';
import EducationSection from './sections/EducationSection';
import SkillSection from './sections/SkillSection';
import AboutSection from './sections/AboutSection';
import styles from './ResumePage.module.css';

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

  const handleSwitchLanguage = () => {
    const next = lang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  const resolvePdfName = () => {
    const basics = state.data?.basics;
    const name = basics?.name?.trim() ?? '';
    const label = basics?.label?.trim() ?? '';
    const title = name && label ? `${name}-${label}` : name || label;
    const safeTitle = title ? sanitizeFileName(title) : '';
    return `${safeTitle || `resume-${lang}`}.pdf`;
  };

  const handlePrint = async () => {
    try {
      const response = await fetch('/resume.pdf', { cache: 'no-store' });
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
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <button className={styles.primaryButton} onClick={handlePrint} type="button">
          {t('actions.print')}
        </button>
        <button className={styles.ghostButton} onClick={handleSwitchLanguage} type="button">
          {lang === 'zh' ? t('actions.toEnglish') : t('actions.toChinese')}
        </button>
      </div>

      <main className={styles.resumeCard}>
        {state.loading ? (
          <div className={styles.status}>{t('status.loading')}</div>
        ) : null}
        {state.error ? (
          <div className={styles.status}>
            <p>{t('status.error')}</p>
            <button className={styles.ghostButton} onClick={retry} type="button">
              {t('actions.retry')}
            </button>
          </div>
        ) : null}
        {state.data ? (
          <div className={styles.content} data-testid="resume-content">
            <HeaderSection basics={state.data.basics} />
            <EducationSection education={state.data.education ?? []} />
            <WorkSection work={state.data.work ?? []} />
            <ProjectSection projects={state.data.projects ?? []} />
            <SkillSection skills={state.data.skills ?? []} />
            <AboutSection about={state.data.about} />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ResumePage;
