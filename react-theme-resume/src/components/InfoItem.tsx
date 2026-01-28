import React from 'react';
import styles from './InfoItem.module.css';

type InfoItemProps = {
  label: string;
  value?: string;
  href?: string;
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value, href }) => {
  if (!value) {
    return null;
  }
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}</span>
      {href ? (
        <a className={styles.value} href={href} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <span className={styles.value}>{value}</span>
      )}
    </div>
  );
};

export default InfoItem;
