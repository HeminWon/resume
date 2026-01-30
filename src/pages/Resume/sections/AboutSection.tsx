import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/SectionTitle';
import { ResumeAbout } from '../../../models/resume';
import { ResumeStyles } from '../../../themes/shared/ResumeStyles';

type AboutSectionProps = {
  about: ResumeAbout | undefined;
  styles: ResumeStyles;
};

const AboutSection: React.FC<AboutSectionProps> = ({ about, styles }) => {
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
