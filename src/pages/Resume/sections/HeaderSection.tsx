import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoItem from '../../../components/InfoItem';
import { ResumeBasics } from '../../../models/resume';
import { ResumeStyles } from '../../../themes/shared/ResumeStyles';

type HeaderSectionProps = {
  basics: ResumeBasics;
  styles: ResumeStyles;
};

const HeaderSection: React.FC<HeaderSectionProps> = ({ basics, styles }) => {
  const { t } = useTranslation();
  return (
    <section className={styles.headerSection} data-ui="resume-header">
      <div className={styles.headerIntro}>
        <h1 className={styles.name} data-slot="name">
          {basics.name}
        </h1>
        <p className={styles.label} data-slot="label">
          {basics.label}
        </p>
        {basics.summary ? <p className={styles.summary}>{basics.summary}</p> : null}
      </div>
      <div className={styles.headerInfo}>
        <InfoItem label={t('labels.email')} value={basics.email} href={basics.email ? `mailto:${basics.email}` : undefined} />
        <InfoItem label={t('labels.phone')} value={basics.phone} href={basics.phone ? `tel:${basics.phone}` : undefined} />
        <InfoItem label={t('labels.website')} value={basics.website} href={basics.website} />
        {basics.profiles?.map((profile) => (
          <InfoItem key={profile.url} label={profile.network} value={profile.username} href={profile.url} />
        ))}
      </div>
    </section>
  );
};

export default HeaderSection;
