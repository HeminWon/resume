import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/SectionTitle';
import { ResumeProjectItem } from '../../../models/resume';
import { formatPeriod } from '../../../transformers/resume';
import styles from '../ResumePage.module.css';

type ProjectSectionProps = {
  projects: ResumeProjectItem[];
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  const { t } = useTranslation();
  if (!projects.length) {
    return null;
  }
  return (
    <section className={styles.section}>
      <SectionTitle title={t('sections.project')} subtitle={t('sections.projectSubtitle')} />
      <div className={styles.sectionBody}>
        {projects.map((project) => (
          <article key={project.name} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div>
                <div className={styles.entryTitle}>{project.name}</div>
                {project.url ? (
                  <a className={styles.entryLink} href={project.url} target="_blank" rel="noreferrer">
                    {project.url}
                  </a>
                ) : null}
              </div>
              <div className={styles.entryDate}>
                {formatPeriod(project.startDate, project.endDate, t('labels.present'))}
              </div>
            </div>
            {project.description ? <p className={styles.entrySummary}>{project.description}</p> : null}
            {project.duties?.length ? (
              <div className={styles.entryBlock}>
                <p className={styles.entryBlockTitle}>{t('labels.duties')}</p>
                <ul className={styles.entryList}>
                  {project.duties.map((duty) => (
                    <li key={duty}>{duty}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.highlights?.length ? (
              <div className={styles.entryBlock}>
                <p className={styles.entryBlockTitle}>{t('labels.technologies')}</p>
                <ul className={styles.entryList}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
