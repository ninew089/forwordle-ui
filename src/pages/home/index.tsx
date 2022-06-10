import { path } from 'constants/index';

import React, { useEffect, useState } from 'react';
import Header from 'components/feature/header';
import { useLogin, useModal } from 'state/application/hooks';
import { GetAvailableChallengesApi } from 'api/challenges';
import { useNavigate } from 'react-router-dom';
import { IDaysOfWeek, ListDaysOfWeeksApi } from 'api/history';
import Loader from 'components/base/Loader';

import styles from './index.module.scss';
import GameTime from './game-time';
import Wait from './wait';

enum ChallengeErrorStatus {
  unavailable_time = 400,
  unauthorization = 401,
  already_start_challenge = 409,
  over_limit = 429,
}

export interface IChallenge {
  word_id: number;
  position: number;
  selected: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const { authData } = useLogin();
  const [week, setWeek] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [wordId, setWordId] = useState<number>(1);
  const [listDaysOfWeeks, setListDaysOfWeeks] = useState<IDaysOfWeek[]>();
  const [timeused, setTimeUsed] = useState<string>(''); // today's time-used
  const [challenges, setChallenges] = useState<IChallenge[]>();
  const [errorStatus, setErrorStatus] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [startTimeMessage, setStartTimeMessage] = useState<string>();
  const [startTimeDate, setStartTimeDate] = useState<string>();
  const { setModalOpen, setModalDetails } = useModal();

  // set week and day and word_id
  useEffect(() => {
    if (listDaysOfWeeks) {
      const today = new Date();
      const todayMonth = today.getUTCMonth() + 1;
      const todayDate = today.getUTCDate();
      const todayYear = today.getUTCFullYear();

      let todayString = `${todayYear}-`;
      if (todayMonth < 10) todayString += '0';
      todayString += `${todayMonth}-`;
      if (todayDate < 10) todayString += '0';
      todayString += todayDate;

      listDaysOfWeeks.forEach((list) => {
        list.days.forEach((d, i) => {
          if (d === todayString) {
            const newWeek = parseInt(list.week.split('week')?.[1]) || 1;
            setWeek(newWeek);
            setDay(i + 1);
            setWordId(list.word_id);
          }
        });
      });
    }
  }, [listDaysOfWeeks]);

  useEffect(() => {
    async function fetchData() {
      await ListDaysOfWeeksApi()
        .then((response) => {
          const data = response.data as IDaysOfWeek[];
          setListDaysOfWeeks(data);
        })
        .catch((error) => {
          console.log(error);
        });

      await GetAvailableChallengesApi()
        .then((response) => {
          if (response.status === 200) {
            if (response.data?.time_used) setTimeUsed(response.data?.time_used);
            else if (Array.isArray(response.data))
              setChallenges(response.data as IChallenge[]);
          }
        })
        .catch((error) => {
          if (
            error?.response?.data?.status ===
            ChallengeErrorStatus.unauthorization
          ) {
            setModalDetails({
              title: 'Unauthorization',
              description: 'Please login before visit this page.',
              okButtonText: 'Log in',
              onOk: () => navigate(path.login),
            });
            setModalOpen(true);
          } else if (error.response?.data?.status === 'access_token_expired') {
            setModalDetails({
              title: 'Access token expired',
              description: 'Access token expired. Please login again.',
              okButtonText: 'Log in',
              onOk: () => navigate(path.login),
            });
            setModalOpen(true);
          } else if (error.response?.data?.status === 'invalid_token') {
            setModalDetails({
              title: 'Invalid token',
              description: 'Invalid token. Please login again.',
              okButtonText: 'Log in',
              onOk: () => navigate(path.login),
            });
            setModalOpen(true);
          } else {
            if (error.response?.data?.status === 'unavailable_time') {
              setStartTimeMessage(error?.response?.data?.message);
              setStartTimeDate(error?.response?.data?.fields?.available_at);
            }
            setErrorStatus(error?.response?.status);
          }
          setLoading(false);
        });
    }

    if (!authData?.player_name) {
      setModalDetails({
        title: 'Unauthorization',
        description: 'Please login before visit this page.',
        okButtonText: 'Log in',
        onOk: () => navigate(path.login),
      });
      setModalOpen(true);
      setLoading(false);
    } else {
      fetchData().then(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className={styles.container}>
      <Header
        withGameName
        playerName={authData?.player_name}
        withChangeAccount
      />
      {loading ? (
        <Loader />
      ) : errorStatus === ChallengeErrorStatus.unavailable_time && authData ? (
        <Wait
          week={week}
          day={day}
          listDaysOfWeeks={listDaysOfWeeks || []}
          startTimeMessage={startTimeMessage || ''}
          startTimeDate={startTimeDate || ''}
        />
      ) : authData ? (
        <GameTime
          week={week}
          day={day}
          wordId={wordId}
          challenges={challenges?.filter((c) => c.selected === false) || []}
          timeused={timeused}
          started={errorStatus === ChallengeErrorStatus.already_start_challenge}
          over={errorStatus === ChallengeErrorStatus.over_limit}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Home;
