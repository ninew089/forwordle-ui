import {
  discordGetAccessTokenApi,
  discordGetUserApi,
  IDiscordAuthData,
  IGoogleAuthData,
  ITelegramAuthData,
} from 'api/oauth';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';

import { setDataInLocal } from './localStorage';

export const telegramAuth = async (url: URL) => {
  const data: ITelegramAuthData & {
    auth_provider: string;
  } = {
    telegram_id: parseInt(url.searchParams.get('id') || ''),
    first_name: url.searchParams.get('first_name') || '',
    last_name: url.searchParams.get('last_name') || '',
    auth_date: parseInt(url.searchParams.get('auth_date') || ''),
    hash: url.searchParams.get('hash') || '',
    username: url.searchParams.get('username') || '',
    photo_url: url.searchParams.get('photo_url') || '',
    auth_provider: 'telegram',
  };
  setDataInLocal(data);
};

export const responseGoogle = (redirectUrl: string) => {
  return async (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('accessToken' in res && 'profileObj' in res && 'tokenId' in res) {
      const data: IGoogleAuthData & {
        auth_provider: string;
      } = {
        auth_token: res.accessToken,
        email: res.profileObj.email,
        token_id: res.tokenId,
        auth_provider: 'google',
      };
      setDataInLocal(data);
      window.location.replace(
        `${redirectUrl}?auth_provider=google&auth_token=${data.auth_token}&email=${data.email}&token_id=${data.token_id}`
      );
    } else if ('error' in res) {
      console.log(res);
    }
  };
};

export const googleAuth = async (url: URL) => {
  const data: IGoogleAuthData & {
    auth_provider: string;
  } = {
    auth_token: url.searchParams.get('auth_token') || '',
    email: url.searchParams.get('email') || '',
    token_id: url.searchParams.get('token_id') || '',
    auth_provider: 'google',
  };
  setDataInLocal(data);
};

export const discordAuth = async (url: URL, redirect_url: string) => {
  const CODE = url.searchParams.get('code') || '';
  const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID || '';
  const CLIENT_SECRET = process.env.REACT_APP_DISCORD_CLIENT_SECRET || '';
  const REDIRECT_URL = redirect_url;

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', CODE);
  params.append('redirect_uri', REDIRECT_URL);

  return discordGetAccessTokenApi(params).then((response) => {
    console.log('get access token', response);
    const accessToken = response?.data?.access_token;
    discordGetUserApi(accessToken)
      .then((res) => {
        console.log('get user', res);
        const data: IDiscordAuthData & {
          auth_provider: string;
        } = {
          auth_token: accessToken,
          email: res.data.email,
          auth_provider: 'discord',
        };
        setDataInLocal(data);
      })
      .catch((error) => {
        console.log('get user error', error);
      });
  });

  // try {
  //   const response = await discordGetAccessTokenApi(params);
  //   const accessToken = response.data.access_token;

  //   try {
  //     const response = await discordGetUserApi(accessToken);
  //     const data: IDiscordAuthData & {
  //       auth_provider: string;
  //     } = {
  //       auth_token: accessToken,
  //       email: response.data.email,
  //       auth_provider: 'discord',
  //     };
  //     setDataInLocal(data);
  //   } catch (error) {
  //     //handle error
  //     console.log(error);
  //   }
  // } catch (error) {
  //   //handle error
  //   console.log(error);
  // }
};
