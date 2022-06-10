import { path } from 'constants/index';

import React from 'react';
import Header from 'components/feature/header';
import { DiscordLogo, GoogleLogo, TelegramLogo } from 'assets/icon';
import { getDataFromLocalStorage } from 'services/localStorage';
import {
  IDiscordAuthData,
  IGoogleAuthData,
  ITelegramAuthData,
} from 'api/oauth';

import styles from './index.module.scss';

const AccountNotFound = () => {
  const dataFromProvider = getDataFromLocalStorage() as (
    | IGoogleAuthData
    | IDiscordAuthData
    | ITelegramAuthData
  ) & {
    auth_provider: string;
  };
  const authProvider = dataFromProvider.auth_provider;

  const registerUrl = () => {
    let href = path.register.linkedAccount;
    let once = false;

    for (const [key, value] of Object.entries(dataFromProvider)) {
      if (!once) {
        href = `${href}?${key}=${value}`;
        once = true;
      } else href = `${href}&${key}=${value}`;
    }

    return href;
  };

  return (
    <div className={styles.container}>
      <Header withGameName title="Change account" />
      <div className={styles.body_container}>
        <div className={styles.title}>We can’t find this account</div>
        <div className={styles.linked_account}>
          {authProvider === 'google' && <GoogleLogo />}
          {authProvider === 'discord' && <DiscordLogo />}
          {authProvider === 'telegram' && <TelegramLogo />}
          <span>
            {'email' in dataFromProvider
              ? dataFromProvider.email
              : dataFromProvider.first_name}
          </span>
        </div>
        <div className={styles.description}>
          This account has never been linked with us. You could register
          forwordle with this account.
        </div>
        <a href={registerUrl()}>Register with this account</a>
      </div>
    </div>
  );
};

export default AccountNotFound;
