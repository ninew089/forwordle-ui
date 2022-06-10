import React from 'react';
import { useModal } from 'state/application/hooks';

import Modal from '../Modal';

import styles from './index.module.scss';

export interface ErrorModalProps {
  title?: string;
  description?: string;
  closeButtonText?: string;
  okButtonText?: string;
  onOk?: () => void;
  children?: React.ReactNode;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  title,
  closeButtonText,
  description,
  onOk,
  okButtonText,
  children,
}) => {
  const { setModalOpen } = useModal();

  const handleOk = () => {
    setModalOpen(false);
    if (onOk) onOk();
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <Modal>
      {children ? (
        children
      ) : (
        <div className={styles.content_container}>
          <h4 className={styles.title}>{title}</h4>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
          <div className={styles.buttons}>
            {closeButtonText && (
              <button onClick={() => handleClose()}>{closeButtonText}</button>
            )}
            <button onClick={handleOk}>{okButtonText}</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ErrorModal;
