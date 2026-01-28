import React from 'react';
import styles from './SectionTitle.module.css';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => (
  <div className={styles.titleRow}>
    <h2 className={styles.title}>{title}</h2>
    {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
    <span className={styles.line} />
  </div>
);

export default SectionTitle;
