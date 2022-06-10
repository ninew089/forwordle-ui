import axios from './axios';
import { IDiscordAuthData, IGoogleAuthData, ITelegramAuthData } from './oauth';
import { EnumAuthProvider } from './register';

export const LoginApi = (
  data: (IGoogleAuthData | IDiscordAuthData | ITelegramAuthData) & {
    auth_provider: EnumAuthProvider;
  }
) => {
  const URL = '/login';
  return axios.post(URL, data);
};
