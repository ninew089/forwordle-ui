import { path } from 'constants/index';

import React from 'react';
import Header from 'components/feature/header';
import LinkAccounts from 'components/feature/link-accounts';

import styles from './index.module.scss';

const LinkAccount = () => {
  const discordHref = process.env.REACT_APP_DISCORD_REGISTER_AUTHO_URL;

  return (
    <div className={styles.container}>
      <Header
        withGameName
        title="Register"
        help={{
          question: 'Already have an account ?',
          name: 'Log in',
          toPath: path.login,
        }}
      />
      <LinkAccounts
        desciption="Link account"
        discordHref={discordHref || ''}
        redirectUrl={`${process.env.REACT_APP_BASE_URL}${path.register.linkedAccount}`}
      />
    </div>
  );
};

export default LinkAccount;
