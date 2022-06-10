import { path } from 'constants/index';

import React, { useEffect } from 'react';
import { BgLanding1, BgLanding2, BgLanding3 } from 'assets/images/wordle';
import clsx from 'clsx';
import { useLogin } from 'state/application/hooks';
import { LoginApi } from 'api/login';
import { getDataFromLocalStorage } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

const Landing = () => {
  const { authData, setAuthData } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (authData?.access_token)
      LoginApi(getDataFromLocalStorage()).then((response) => {
        if (response.status === 200) {
          setAuthData(response.data);
          navigate(path.home);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={clsx(styles.bg, styles.bg1)}>
        <img src={BgLanding1} />
      </div>
      <div className={clsx(styles.bg, styles.bg2)}>
        <img src={BgLanding2} />
      </div>
      <div className={clsx(styles.bg, styles.bg3)}>
        <img src={BgLanding3} />
      </div>
      <h2>FORWORDLE</h2>
      <span>
        A competitive word-guessing game,
        <br />
        Enjoy the game and win the best rewards.
      </span>
      <div className={styles.buttons}>
        <a href={path.login}>Login</a>
        <a href={path.register.linkAccount}>Register</a>
      </div>
      <div className={styles.bottom_links}>
        <a href={path.leaderboard}>Leaderboard</a>
        <a href={path.rewards}>Rewards</a>
        <a href={path.howToPlay}>How to play</a>
      </div>
    </div>
  );
};

export default Landing;
