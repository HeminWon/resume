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
        {education.map((item) => {
          const coursesText = item.courses?.filter(Boolean).join(' / ');
          const meta = [item.area, coursesText, item.studyType].filter(Boolean).join(' · ');
          return (
            <article key={`${item.institution}-${item.area}`} className={styles.entryCard}>
              <div className={styles.entryHeader}>
                <div>
                  <div className={styles.entryTitle}>{item.institution}</div>
                  {meta ? <div className={`${styles.entrySubtitle} ${styles.entryMeta}`}>{meta}</div> : null}
                </div>
                <div className={styles.entryDate}>
                  {formatPeriod(item.startDate, item.endDate, t('labels.present'))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default EducationSection;
