import { path } from 'constants/index';

import { ArrowBack } from 'assets/icon';
import React, { ReactNode, FC } from 'react';
import { useLogin, useModal } from 'state/application/hooks';
import { clearDataInLocal } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

interface IHeader {
  withBackButton?: boolean;
  withGameName?: boolean;
  withChangeAccount?: boolean;
  title?: string;
  playerName?: string;
  help?: {
    question: string;
    name: string;
    toPath: string;
  };
  children?: ReactNode;
}

const Header: FC<IHeader> = ({
  withBackButton,
  withGameName,
  withChangeAccount,
  title,
  playerName,
  help,
  children,
}) => {
  const navigate = useNavigate();
  const { setModalOpen, setModalDetails } = useModal();
  const { setAuthData } = useLogin();

  const handleChangeAccount = () => {
    setModalDetails({
      title: 'You are going to change account ?',
      description: '',
      closeButtonText: 'Cancel',
      okButtonText: 'Change',
      onOk: handleConfirm,
    });
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    await clearDataInLocal();
    await setAuthData(undefined);
    await navigate(path.changeAccount);
  };

  return (
    <div className={styles.container}>
      {withBackButton && (
        <a href={path.home} className={styles.back_button}>
          <ArrowBack />
          <span>Forwordle</span>
        </a>
      )}
      {withGameName && <h4>FORWORDLE</h4>}
      {title && <span className={styles.title}>{title}</span>}
      {playerName && (
        <div className={styles.player_name_container}>
          <span>Player name</span>
          <div>
            <span>{playerName}</span>
            {withChangeAccount && (
              <div
                className={styles.change_account}
                onClick={() => handleChangeAccount()}
              >
                Change account
              </div>
            )}
          </div>
        </div>
      )}
      {help && (
        <div className={styles.to_path}>
          <span>{help.question}</span>
          <a href={help.toPath}>{help.name}</a>
        </div>
      )}
      {children}
    </div>
  );
};

export default Header;
