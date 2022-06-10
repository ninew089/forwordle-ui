import axios from 'axios';

export interface ITelegramAuthData {
  telegram_id: number;
  first_name: string;
  last_name: string;
  auth_date: number;
  hash: string;
  username?: string;
  photo_url?: string;
}
export interface IGoogleAuthData {
  email: string;
  auth_token: string;
  token_id: string;
}
export interface IDiscordAuthData {
  auth_token: string;
  email: string;
}

export const discordGetAccessTokenApi = (params: URLSearchParams) => {
  const URL = 'https://discord.com/api/v10/oauth2/token';
  return axios.post(URL, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      // Accept: 'application/json',
    },
  });
};

export const discordGetUserApi = (accessToken: string) => {
  const URL = 'https://discord.com/api/v9/users/@me';
  return axios.get(URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
