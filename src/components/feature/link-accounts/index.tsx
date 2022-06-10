import { Discord, Google, Telegram } from 'assets/icon';
import React, { FC, ReactElement, ReactNode } from 'react';
import GoogleLogin from 'react-google-login';
import { Helmet } from 'react-helmet';
import { responseGoogle } from 'services/oauth';

import styles from './index.module.scss';

export interface ILinkAccount {
  icon: ReactElement;
  name: string;
  href?: string;
  button?: ReactNode;
}

interface LinkAccountsProps {
  redirectUrl: string;
  discordHref: string;
  desciption: string;
}

const LinkAccounts: FC<LinkAccountsProps> = ({
  redirectUrl,
  discordHref,
  desciption,
}) => {
  const links: ILinkAccount[] = [
    {
      icon: <Google />,
      name: 'Google',
      button: (
        <div className={styles.google_button}>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
            buttonText="Login"
            onSuccess={responseGoogle(redirectUrl)}
            onFailure={responseGoogle(redirectUrl)}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      ),
    },
    {
      icon: <Discord />,
      name: 'Discord',
      href: discordHref || '',
    },
    {
      icon: <Telegram />,
      name: 'Telegram',
      button: (
        <div className={styles.telegram_button}>
          <Helmet>
            <script async src="https://telegram.org/js/telegram-widget.js?19" />
          </Helmet>
          <script
            async
            src="https://telegram.org/js/telegram-widget.js?19"
            data-telegram-login={process.env.REACT_APP_TELEGRAM_BOT_NAME}
            data-size="large"
            data-userpic="false"
            data-radius="0"
            data-auth-url={`${redirectUrl}?auth_provider=telegram`}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <span>{desciption}</span>
      <div className={styles.links_container}>
        {links.map((link, i) => {
          return (
            <a className={styles.link} key={i} href={link.href}>
              {link.button ? link.button : ''}
              <div className={styles.image}>{link.icon}</div>
              <span>{link.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default LinkAccounts;
