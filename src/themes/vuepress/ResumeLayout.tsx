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
import ToolDock from '../shared/ToolDock';
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
      <ToolDock
        lang={lang}
        theme={theme}
        onPrint={onPrint}
        onSwitchTheme={onSwitchTheme}
        onSwitchLanguage={onSwitchLanguage}
      />

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
            <SkillSection skills={state.data.skills ?? []} styles={resumeStyles} />
            <ProjectSection projects={state.data.projects ?? []} styles={resumeStyles} />
            <WorkSection work={state.data.work ?? []} styles={resumeStyles} />
            <AboutSection about={state.data.about} styles={resumeStyles} />
            <EducationSection education={state.data.education ?? []} styles={resumeStyles} />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ResumeLayout;
