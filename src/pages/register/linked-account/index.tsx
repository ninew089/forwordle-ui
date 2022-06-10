import { path } from 'constants/index';

import {
  IDiscordAuthData,
  IGoogleAuthData,
  ITelegramAuthData,
} from 'api/oauth';
import { Close, DiscordLogo, GoogleLogo, TelegramLogo } from 'assets/icon';
import Header from 'components/feature/header';
import React, { useState, useEffect, useCallback } from 'react';
import ClientCaptcha from 'react-client-captcha';
import { useNavigate } from 'react-router-dom';
import { discordAuth, googleAuth, telegramAuth } from 'services/oauth';
import {
  clearDataInLocal,
  getDataFromLocalStorage,
} from 'services/localStorage';
import { EnumAuthProvider, IRegister, RegisterApi } from 'api/register';
import TextField from 'components/base/TextIField';
import { useModal } from 'state/application/hooks';
import Loader from 'components/base/Loader';

import styles from './index.module.scss';

interface IFormError {
  playerName: boolean;
  wallet: boolean;
  captchaInput: boolean;
}

const LinkedAccount = () => {
  const [authProvider, setAuthProvider] = useState<EnumAuthProvider>();
  const [dataFromProvider, setDataFromProvider] = useState<
    (IGoogleAuthData | IDiscordAuthData | ITelegramAuthData) | null
  >(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [wallet, setWallet] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [formError, setFormError] = useState<IFormError>({
    playerName: false,
    wallet: false,
    captchaInput: false,
  });
  const navigate = useNavigate();
  const { setModalOpen, setModalDetails } = useModal();

  const responseGoogle = useCallback(async () => {
    await googleAuth(new URL(window.location.href));
    setAuthProvider(EnumAuthProvider.google);
    setDataFromProvider(getDataFromLocalStorage());
  }, []);

  const responseDiscord = useCallback(async () => {
    await discordAuth(
      new URL(window.location.href),
      process.env.REACT_APP_DISCORD_REGISTER_REDIRECT_URL || ''
    );
    setAuthProvider(EnumAuthProvider.discord);
    setDataFromProvider(getDataFromLocalStorage());
  }, []);

  const responseTelegram = useCallback(async () => {
    await telegramAuth(new URL(window.location.href));
    setAuthProvider(EnumAuthProvider.telegram);
    setDataFromProvider(getDataFromLocalStorage());
  }, []);

  const handleCloseAccount = () => {
    setModalDetails({
      title: 'Cancel registration ?',
      description: 'Are you sure to leave this page ?',
      closeButtonText: 'Countinue',
      okButtonText: 'Confirm',
      onOk: () => {
        navigate(path.register.linkAccount);
        clearDataInLocal();
      },
    });
    setModalOpen(true);
  };

  const validateForm = () => {
    return playerName !== '' && wallet !== '' && captchaInput !== '';
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (captchaInput === '' || wallet === '' || playerName === '') {
      setFormError({
        ...formError,
        playerName: playerName === '',
        wallet: wallet === '',
        captchaInput: captchaInput === '',
      });
    } else if (captchaInput !== captchaCode) {
      setCaptchaInput('');
    } else if (dataFromProvider !== null && authProvider) {
      const data: (IDiscordAuthData | IGoogleAuthData | ITelegramAuthData) &
        IRegister = {
        ...dataFromProvider,
        auth_provider: authProvider,
        bsc_address: wallet,
        player_name: playerName,
      };
      // call api
      RegisterApi(data)
        .then(() => {
          setModalDetails({
            title: 'Success',
            description:
              'This account is created successfully. You can log in with this account.',
            okButtonText: 'Log in',
            onOk: () => navigate(path.login),
          });
          setModalOpen(true);
        })
        .catch((error) => {
          if (error.response?.data?.status === 'user_already_exist') {
            setModalDetails({
              title: 'Account already exist',
              description:
                'This account is already exist. You can log in with this account.',
              okButtonText: 'Log in',
              onOk: () => navigate(path.login),
            });
            setModalOpen(true);
          } else if (error.response?.data?.status === 'access_token_expired') {
            setModalDetails({
              title: 'Access token expired',
              description:
                'Access token expired. Please link your account with 3rd party again.',
              okButtonText: 'OK',
              onOk: () => navigate(path.register.linkAccount),
            });
            setModalOpen(true);
          } else {
            setModalDetails({
              title: 'Something went wrong',
              description: `Error code : ${error?.response?.status}`,
              okButtonText: 'OK',
              onOk: () => navigate(path.register.linkAccount),
            });
            setModalOpen(true);
          }
        });
    } else {
      setModalDetails({
        title: 'Something went wrong',
        okButtonText: 'OK',
        onOk: () => navigate(path.register.linkAccount),
      });
      setModalOpen(true);
    }
  };

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
      navigate(path.register.linkAccount);
    }
  }, [responseGoogle, responseDiscord, responseTelegram, navigate]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Header
        withGameName
        title="Register"
        help={{
          question: 'Already have an account ?',
          name: 'Log in',
          toPath: path.login,
        }}
      />
      {dataFromProvider ? (
        <>
          <div className={styles.linked_container}>
            <span>This account will be linked to</span>
            <div className={styles.linked_account}>
              {authProvider === 'google' && <GoogleLogo />}
              {authProvider === 'discord' && <DiscordLogo />}
              {authProvider === 'telegram' && <TelegramLogo />}
              <span>
                {'email' in dataFromProvider
                  ? dataFromProvider.email
                  : dataFromProvider.first_name}
              </span>
              <Close onClick={handleCloseAccount} />
            </div>
          </div>
          <div className={styles.input_container}>
            <span>Player</span>
            <TextField
              error={formError.playerName}
              placeholder="Enter player name"
              value={playerName}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                if (e.currentTarget.value.length <= 15)
                  setPlayerName(e.currentTarget.value);
                setFormError({
                  ...formError,
                  playerName:
                    e.currentTarget.value === '' ||
                    e.currentTarget.value.length > 15,
                });
              }}
              type="text"
              name="player_name"
            />
          </div>
          <div className={styles.input_container}>
            <span>BNB Smart chain wallet</span>
            <TextField
              error={formError.wallet}
              placeholder="Enter wallet address"
              value={wallet}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setWallet(e.currentTarget.value);
                setFormError({
                  ...formError,
                  wallet: e.currentTarget.value === '',
                });
              }}
              type="text"
              name="bsc_address"
            />
          </div>
          <div className={styles.input_container}>
            <span>Captcha security check</span>
            <div className={styles.captcha_img}>
              <ClientCaptcha
                retry={false}
                width={170}
                backgroundColor="white"
                charsCount={5}
                captchaCode={(code: string) => setCaptchaCode(code)}
              />
            </div>
            <TextField
              error={formError.captchaInput}
              placeholder="Enter the text you see on image"
              value={captchaInput}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setCaptchaInput(e.currentTarget.value);
                setFormError({
                  ...formError,
                  captchaInput: e.currentTarget.value === '',
                });
              }}
              type="text"
              name="captcha"
            />
          </div>
          <button
            className={styles.register_button}
            type="submit"
            disabled={!validateForm()}
          >
            <span>Register</span>
          </button>
        </>
      ) : (
        <Loader />
      )}
    </form>
  );
};

export default LinkedAccount;
