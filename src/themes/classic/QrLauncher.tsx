import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import styles from './ResumeLayout.module.css';

const QR_SIZE = 140;

const QrLauncher: React.FC = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const url = window.location.href;
    setQrUrl(url);
    QRCode.toDataURL(url, { width: QR_SIZE, margin: 1 })
      .then((dataUrl) => setQrImage(dataUrl))
      .catch(() => {
        setQrImage('');
      });
  }, []);

  if (!qrUrl) {
    return null;
  }

  return (
    <div className={styles.qrLauncher}>
      <button className={styles.qrButton} type="button" aria-label="在线简历二维码">
        <span className={styles.qrIcon} aria-hidden="true" />
      </button>
      <div className={styles.qrPopover} role="dialog" aria-label="在线简历二维码">
        {qrImage ? (
          <img className={styles.qrImage} src={qrImage} alt="在线简历二维码" />
        ) : (
          <div className={styles.qrPlaceholder}>QR</div>
        )}
        <div className={styles.qrUrl} title={qrUrl}>
          {qrUrl}
        </div>
      </div>
    </div>
  );
};

export default QrLauncher;
