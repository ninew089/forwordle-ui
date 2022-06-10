import { path } from 'constants/index';

import React, { useCallback, useEffect, useState } from 'react';
import Header from 'components/feature/header';
import LinkAccounts from 'components/feature/link-accounts';
import { discordAuth, googleAuth, telegramAuth } from 'services/oauth';
import { getDataFromLocalStorage } from 'services/localStorage';
import {
  IDiscordAuthData,
  IGoogleAuthData,
  ITelegramAuthData,
} from 'api/oauth';
import { EnumAuthProvider } from 'api/register';
import { useLogin, useModal } from 'state/application/hooks';
import { LoginApi } from 'api/login';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/base/Loader';

import styles from './index.module.scss';

const discordHref = process.env.REACT_APP_DISCORD_LOGIN_AUTHO_URL;

const ChangeAccount = () => {
  const navigate = useNavigate();
  const { authData, setAuthData } = useLogin();
  const { setModalOpen, setModalDetails } = useModal();
  const [loading, setLoading] = useState<boolean>(true);

  const catchError = useCallback(
    (error: any) => {
      if (error?.response?.data?.status === 'user_not_found') {
        navigate(path.accountNotFound);
      } else if (error.response?.data?.status === 'unauthorization') {
        setModalDetails({
          title: 'Login failed',
          description: 'Please try again. ',
          okButtonText: 'OK',
          onOk: () => navigate(path.login),
        });
        setModalOpen(true);
      } else if (error.response?.data?.status === 'access_token_expired') {
        setModalDetails({
          title: 'Access token expired',
          description: 'Access token expired. Please login again.',
          okButtonText: 'OK',
          onOk: () => navigate(path.login),
        });
        setModalOpen(true);
      } else if (error.response?.data?.status === 'invalid_token') {
        setModalDetails({
          title: 'Invalid token',
          description: 'Invalid token. Please login again.',
          okButtonText: 'OK',
          onOk: () => navigate(path.login),
        });
        setModalOpen(true);
      } else {
        setModalDetails({
          title: 'Something went wrong',
          description: `Error code : ${error?.response?.status}`,
          okButtonText: 'OK',
          onOk: () => navigate(path.home),
        });
        setModalOpen(true);
      }
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const LoginService = useCallback(
    async (
      data: (IGoogleAuthData | IDiscordAuthData | ITelegramAuthData) & {
        auth_provider: EnumAuthProvider;
      }
    ) => {
      LoginApi(data)
        .then((response) => {
          if (response.status === 200) {
            setAuthData(response.data);
            navigate(path.home);
          }
          setLoading(false);
        })
        .catch((error) => {
          catchError(error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const responseGoogle = useCallback(async () => {
    await googleAuth(new URL(window.location.href))
      .then(() => {
        LoginService(getDataFromLocalStorage());
      })
      .catch((error) => {
        catchError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responseDiscord = useCallback(async () => {
    await discordAuth(
      new URL(window.location.href),
      process.env.REACT_APP_DISCORD_LOGIN_REDIRECT_URL || ''
    )
      .then(() => {
        LoginService(getDataFromLocalStorage());
      })
      .catch((error) => {
        catchError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responseTelegram = useCallback(async () => {
    await telegramAuth(new URL(window.location.href))
      .then(() => {
        LoginService(getDataFromLocalStorage());
      })
      .catch((error) => {
        catchError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const provider = url.searchParams.get('auth_provider');
    if (provider === 'google') {
      responseGoogle();
    } else if (provider === 'discord') {
      responseDiscord();
    } else if (provider === 'telegram') {
      responseTelegram();
    } else {
      // when already logged in
      if (authData?.access_token)
        LoginApi(getDataFromLocalStorage())
          .then((response) => {
            if (response.status === 200) {
              setAuthData(response.data);
              navigate(path.home);
            }
            setLoading(false);
          })
          .catch((error) => {
            const errorStatus = error.response?.data?.status;
            if (
              errorStatus !== 'user_not_found' &&
              errorStatus !== 'unauthorization' &&
              errorStatus !== 'access_token_expired' &&
              errorStatus !== 'invalid_token'
            ) {
              setModalDetails({
                title: 'Something went wrong',
                description: `Error code : ${error?.response?.status}`,
                okButtonText: 'OK',
                onOk: () => navigate(path.home),
              });
              setModalOpen(true);
            }
            setLoading(false);
          });
      else setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    responseGoogle,
    responseDiscord,
    responseTelegram,
    navigate,
    // authData,
    // setAuthData,
  ]);

  return (
    <div className={styles.container}>
      <Header withGameName title="Change account" />
      {loading ? (
        <Loader />
      ) : (
        <LinkAccounts
          desciption="Log in with linked account"
          discordHref={discordHref || ''}
          redirectUrl={`${process.env.REACT_APP_BASE_URL}${path.login}`}
        />
      )}
    </div>
  );
};

export default ChangeAccount;
