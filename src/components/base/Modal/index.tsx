import clsx from 'clsx';
import React from 'react';
import { useModal } from 'state/application/hooks';

import styles from './index.module.scss';

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { isModalOpen } = useModal();

  return (
    <>
      <div
        className={clsx(styles.background, {
          [styles.open]: isModalOpen,
          [styles.close]: !isModalOpen,
        })}
      />
      <div
        className={clsx(styles.modal_container, {
          [styles.open]: isModalOpen,
          [styles.close]: !isModalOpen,
        })}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
