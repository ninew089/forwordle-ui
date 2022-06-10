import axios from './axios';

export interface IDaysOfWeek {
  word_id: number;
  week: string;
  days: string[];
}

export const ListDaysOfWeeksApi = () => {
  const URL = '/leaderboard/weeks';
  return axios.get(URL);
};

export enum LeaderboardType {
  daily = 'day',
  weekly = 'week',
}

export interface IGetLeaderboard {
  type: LeaderboardType;
  date: string;
  word_id: number;
  limit: number;
  offset: number;
}

export const GetLeaderboardApi = (data: IGetLeaderboard) => {
  const URL = '/leaderboard/';
  return axios.get(URL, { params: data });
};

export interface IGetUserScore {
  word_id: string;
}

export const GetUserScoreApi = (data: IGetUserScore) => {
  const URL = `/leaderboard/user_scores/${data.word_id}`;
  return axios.get(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('forwordle:accessToken')}`,
    },
  });
};
