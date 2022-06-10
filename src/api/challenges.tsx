import axios from './axios';

export const GetAvailableChallengesApi = () => {
  const URL = '/challenge/';
  return axios.get(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('forwordle:accessToken')}`,
    },
  });
};

export interface ISelectChallenge {
  word_id: number;
  position: number;
}

export const SelectChallengeApi = (data: ISelectChallenge) => {
  const URL = '/challenge/';
  return axios.post(URL, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('forwordle:accessToken')}`,
    },
  });
};

export interface ICheckAnswer {
  answer: string;
}

export const CheckAnswerApi = (data: ICheckAnswer) => {
  const URL = '/challenge/answer';
  return axios.post(URL, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('forwordle:accessToken')}`,
    },
  });
};

export interface IResultDetails {
  char: string;
  mathced: boolean;
  contain: boolean;
}

export interface IResult {
  '0': IResultDetails;
  '1': IResultDetails;
  '2': IResultDetails;
  '3': IResultDetails;
  '4': IResultDetails;
}

export interface IAnswer {
  answer: string;
  result?: IResult;
  answer_at?: string;
}
export interface GetAnswerHistoryResponse {
  started_at: string;
  histories: IAnswer[];
}

export const GetAnswerHistoryApi = () => {
  const URL = '/challenge/answer-history';
  return axios.get(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('forwordle:accessToken')}`,
    },
  });
};

export interface ICheckValidWord {
  word: string;
}

export const CheckValidWordApi = (data: ICheckValidWord) => {
  const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${data.word}`;
  return axios.get(URL);
};
