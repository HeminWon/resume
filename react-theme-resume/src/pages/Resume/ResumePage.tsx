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

  const handlePrint = () => {
    window.print();
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
          <div className={styles.content}>
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
