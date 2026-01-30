import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderSection from '../../pages/Resume/sections/HeaderSection';
import WorkSection from '../../pages/Resume/sections/WorkSection';
import ProjectSection from '../../pages/Resume/sections/ProjectSection';
import EducationSection from '../../pages/Resume/sections/EducationSection';
import SkillSection from '../../pages/Resume/sections/SkillSection';
import AboutSection from '../../pages/Resume/sections/AboutSection';
import { ResumeStyles } from '../shared/ResumeStyles';
import { ResumeLayoutProps } from '../types';
import styles from './ResumeLayout.module.css';

const ResumeLayout: React.FC<ResumeLayoutProps> = ({
  state,
  lang,
  theme,
  onPrint,
  onSwitchTheme,
  onSwitchLanguage,
  onRetry,
}) => {
  const { t } = useTranslation();
  const resumeStyles = styles as ResumeStyles;

  return (
    <div className={resumeStyles.page}>
      <div className={resumeStyles.toolbar}>
        <button className={resumeStyles.primaryButton} onClick={onPrint} type="button">
          {t('actions.print')}
        </button>
        <button className={resumeStyles.ghostButton} onClick={onSwitchTheme} type="button">
          {`${t('actions.theme')}: ${t(`themes.${theme}`)}`}
        </button>
        <button className={resumeStyles.ghostButton} onClick={onSwitchLanguage} type="button">
          {lang === 'zh' ? t('actions.toEnglish') : t('actions.toChinese')}
        </button>
      </div>

      <main className={resumeStyles.resumeCard}>
        {state.loading ? <div className={resumeStyles.status}>{t('status.loading')}</div> : null}
        {state.error ? (
          <div className={resumeStyles.status}>
            <p>{t('status.error')}</p>
            <button className={resumeStyles.ghostButton} onClick={onRetry} type="button">
              {t('actions.retry')}
            </button>
          </div>
        ) : null}
        {state.data ? (
          <div className={resumeStyles.content} data-testid="resume-content">
            <HeaderSection basics={state.data.basics} styles={resumeStyles} />
            <EducationSection education={state.data.education ?? []} styles={resumeStyles} />
            <WorkSection work={state.data.work ?? []} styles={resumeStyles} />
            <ProjectSection projects={state.data.projects ?? []} styles={resumeStyles} />
            <SkillSection skills={state.data.skills ?? []} styles={resumeStyles} />
            <AboutSection about={state.data.about} styles={resumeStyles} />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ResumeLayout;
