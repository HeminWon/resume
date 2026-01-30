import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/SectionTitle';
import { ResumeEducationItem } from '../../../models/resume';
import { formatPeriod } from '../../../transformers/resume';
import { ResumeStyles } from '../../../themes/shared/ResumeStyles';

type EducationSectionProps = {
  education: ResumeEducationItem[];
  styles: ResumeStyles;
};

const EducationSection: React.FC<EducationSectionProps> = ({ education, styles }) => {
  const { t } = useTranslation();
  if (!education.length) {
    return null;
  }
  return (
    <section className={styles.section}>
      <SectionTitle title={t('sections.education')} subtitle={t('sections.educationSubtitle')} />
      <div className={styles.sectionBody}>
        {education.map((item) => (
          <article key={`${item.institution}-${item.area}`} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div>
                <div className={styles.entryTitle}>{item.institution}</div>
                <div className={styles.entrySubtitle}>
                  {[item.area, item.studyType].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div className={styles.entryDate}>
                {formatPeriod(item.startDate, item.endDate, t('labels.present'))}
              </div>
            </div>
            {item.courses?.length ? (
              <p className={styles.entrySummary}>{item.courses.join(' / ')}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
