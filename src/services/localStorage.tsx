import {
  IDiscordAuthData,
  IGoogleAuthData,
  ITelegramAuthData,
} from 'api/oauth';

const DATA_NAME = 'forwordleData';

export const setDataInLocal = (
  data?: IGoogleAuthData | IDiscordAuthData | ITelegramAuthData
) => {
  localStorage.setItem(DATA_NAME, JSON.stringify(data));
};

export const clearDataInLocal = () => {
  localStorage.removeItem(DATA_NAME);
};

export const getDataFromLocalStorage = () => {
  try {
    const dataFromProvider = JSON.parse(
      localStorage.getItem('forwordleData') || ''
    );
    return dataFromProvider;
  } catch (error) {
    console.log(error);
  }
};
