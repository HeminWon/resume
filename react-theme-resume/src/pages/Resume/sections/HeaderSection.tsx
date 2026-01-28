import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoItem from '../../../components/InfoItem';
import { ResumeBasics } from '../../../models/resume';
import styles from '../ResumePage.module.css';

type HeaderSectionProps = {
  basics: ResumeBasics;
};

const HeaderSection: React.FC<HeaderSectionProps> = ({ basics }) => {
  const { t } = useTranslation();
  return (
    <section className={styles.headerSection}>
      <div className={styles.headerIntro}>
        <h1 className={styles.name}>{basics.name}</h1>
        <p className={styles.label}>{basics.label}</p>
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
