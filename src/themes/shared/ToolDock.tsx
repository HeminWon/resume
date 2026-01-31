import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import type { ResumeLanguage } from '../../data/resumeService';
import type { ThemeId } from '../types';
import styles from './ToolDock.module.css';

type ToolDockProps = {
  lang: ResumeLanguage;
  theme: ThemeId;
  onPrint: () => void;
  onSwitchTheme: () => void;
  onSwitchLanguage: () => void;
};

const QR_SIZE = 140;

const ToolDock: React.FC<ToolDockProps> = ({
  lang,
  theme,
  onPrint,
  onSwitchTheme,
  onSwitchLanguage,
}) => {
  const { t } = useTranslation();
  const dockRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [copied, setCopied] = useState(false);

  const themeLabel = useMemo(() => t(`themes.${theme}`), [t, theme]);
  const languageLabel = useMemo(
    () => (lang === 'zh' ? t('actions.toEnglish') : t('actions.toChinese')),
    [lang, t]
  );

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
  }, [lang, theme]);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!showQr) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!dockRef.current) {
        return;
      }
      if (!dockRef.current.contains(event.target as Node)) {
        setShowQr(false);
      }
    };
    const handleScroll = () => {
      setShowQr(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showQr]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (open) {
      setShowQr(false);
    }
  };

  const handleBackdrop = () => {
    setOpen(false);
    setShowQr(false);
  };

  const handleCopyLink = () => {
    if (!qrUrl || typeof navigator === 'undefined') {
      return;
    }
    navigator.clipboard
      ?.writeText(qrUrl)
      .then(() => setCopied(true))
      .catch(() => {});
  };

  const handleAction = (action: () => void) => () => {
    action();
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches) {
      handleBackdrop();
    }
  };

  return (
    <div className={`${styles.toolDock} ${open ? styles.open : ''}`} ref={dockRef}>
      <div className={styles.desktopDock}>
        <button className={styles.dockItem} onClick={handleAction(onPrint)} type="button">
          <span className={styles.dockLabel}>{t('actions.print')}</span>
        </button>
        <button className={styles.dockItem} onClick={handleAction(onSwitchTheme)} type="button">
          <span className={styles.dockLabel}>{`${t('actions.theme')}: ${themeLabel}`}</span>
        </button>
        <button className={styles.dockItem} onClick={handleAction(onSwitchLanguage)} type="button">
          <span className={styles.dockLabel}>{languageLabel}</span>
        </button>
        <button
          className={styles.dockItem}
          onClick={() => setShowQr((prev) => !prev)}
          type="button"
        >
          <span className={styles.dockLabel}>{t('actions.qr')}</span>
        </button>
        {showQr ? (
          <div className={styles.qrPanel} role="dialog" aria-label={t('actions.qr')}>
            {qrImage ? (
              <img className={styles.qrImage} src={qrImage} alt={t('actions.qr')} />
            ) : (
              <div className={styles.qrPlaceholder}>QR</div>
            )}
            <button className={styles.copyLinkButton} type="button" onClick={handleCopyLink}>
              {copied ? t('actions.copied') : t('actions.copyLink')}
            </button>
          </div>
        ) : null}
      </div>

      <button
        className={styles.fab}
        type="button"
        aria-label={t('actions.tools')}
        onClick={handleToggle}
      >
        <span className={styles.fabLabel}>{t('actions.tools')}</span>
      </button>

      <button className={styles.backdrop} type="button" onClick={handleBackdrop} aria-hidden />

      <div className={styles.sheet} role="dialog" aria-label={t('actions.tools')}>
        <div className={styles.sheetHeader}>
          <span className={styles.sheetTitle}>{t('actions.tools')}</span>
          <button className={styles.sheetClose} type="button" onClick={handleBackdrop}>
            {t('actions.close')}
          </button>
        </div>
        <div className={styles.sheetBody}>
          <button className={styles.sheetAction} type="button" onClick={handleAction(onPrint)}>
            <span className={styles.sheetText}>{t('actions.print')}</span>
          </button>
          <button className={styles.sheetAction} type="button" onClick={handleAction(onSwitchTheme)}>
            <span className={styles.sheetText}>{`${t('actions.theme')}: ${themeLabel}`}</span>
          </button>
          <button
            className={styles.sheetAction}
            type="button"
            onClick={handleAction(onSwitchLanguage)}
          >
            <span className={styles.sheetText}>{languageLabel}</span>
          </button>
          <button className={styles.sheetAction} type="button" onClick={handleCopyLink}>
            <span className={styles.sheetText}>
              {copied ? t('actions.copied') : t('actions.copyLink')}
            </span>
          </button>
          <div className={styles.sheetQr}>
            <div className={styles.sheetQrHeader}>
              <span className={styles.sheetText}>{t('actions.qr')}</span>
            </div>
            {qrImage ? (
              <img className={styles.qrImage} src={qrImage} alt={t('actions.qr')} />
            ) : (
              <div className={styles.qrPlaceholder}>QR</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDock;
