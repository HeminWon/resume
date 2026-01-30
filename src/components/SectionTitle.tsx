import React from 'react';
import styles from './SectionTitle.module.css';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => (
  <div className={styles.titleRow} data-ui="section-title">
    <h2 className={styles.title} data-slot="title">
      {title}
    </h2>
    {subtitle ? (
      <span className={styles.subtitle} data-slot="subtitle">
        {subtitle}
      </span>
    ) : null}
    <span className={styles.line} data-slot="line" />
  </div>
);

export default SectionTitle;
