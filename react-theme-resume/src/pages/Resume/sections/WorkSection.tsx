import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/SectionTitle';
import { ResumeWorkItem } from '../../../models/resume';
import { formatPeriod } from '../../../transformers/resume';
import styles from '../ResumePage.module.css';

type WorkSectionProps = {
  work: ResumeWorkItem[];
};

const WorkSection: React.FC<WorkSectionProps> = ({ work }) => {
  const { t } = useTranslation();
  if (!work.length) {
    return null;
  }
  return (
    <section className={styles.section}>
      <SectionTitle title={t('sections.work')} subtitle={t('sections.workSubtitle')} />
      <div className={styles.sectionBody}>
        {work.map((item) => (
          <article key={`${item.company}-${item.position}`} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div>
                <div className={styles.entryTitle}>{item.company}</div>
                <div className={styles.entrySubtitle}>{item.position}</div>
              </div>
              <div className={styles.entryDate}>
                {formatPeriod(item.startDate, item.endDate, t('labels.present'))}
              </div>
            </div>
            {item.summary ? <p className={styles.entrySummary}>{item.summary}</p> : null}
            {item.highlights?.length ? (
              <ul className={styles.entryList}>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default WorkSection;
