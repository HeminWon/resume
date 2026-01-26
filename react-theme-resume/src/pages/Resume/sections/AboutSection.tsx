import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/SectionTitle';
import { ResumeAbout } from '../../../models/resume';
import styles from '../ResumePage.module.css';

type AboutSectionProps = {
  about: ResumeAbout | undefined;
};

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  const { t } = useTranslation();
  if (!about?.me?.length) {
    return null;
  }
  return (
    <section className={styles.section}>
      <SectionTitle title={t('sections.evaluation')} subtitle={t('sections.evaluationSubtitle')} />
      <ul className={styles.entryList}>
        {about.me.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default AboutSection;
