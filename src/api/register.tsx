import axios from './axios';
import { IDiscordAuthData, IGoogleAuthData, ITelegramAuthData } from './oauth';

export enum EnumAuthProvider {
  google = 'google',
  discord = 'discord',
  telegram = 'telegram',
}

export interface IRegister {
  auth_provider: EnumAuthProvider;
  bsc_address: string;
  player_name: string;
}

export const RegisterApi = (
  data: (IDiscordAuthData | IGoogleAuthData | ITelegramAuthData) & IRegister
) => {
  const URL = '/register';
  return axios.post(URL, data);
};
