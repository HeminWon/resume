import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/SectionTitle';
import { ResumeSkillItem } from '../../../models/resume';
import { ResumeStyles } from '../../../themes/shared/ResumeStyles';

type SkillSectionProps = {
  skills: ResumeSkillItem[];
  styles: ResumeStyles;
};

const SkillSection: React.FC<SkillSectionProps> = ({ skills, styles }) => {
  const { t } = useTranslation();
  if (!skills.length) {
    return null;
  }
  return (
    <section className={styles.section}>
      <SectionTitle title={t('sections.skill')} subtitle={t('sections.skillSubtitle')} />
      <div className={styles.skillGrid}>
        {skills.map((skill) => (
          <div key={skill.name} className={styles.skillItem}>
            <div className={styles.skillName}>{skill.name}</div>
            {skill.keywords?.length ? (
              <div className={styles.skillKeywords}>{skill.keywords.join(' / ')}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillSection;
