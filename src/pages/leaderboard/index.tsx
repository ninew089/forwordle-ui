import { path } from 'constants/index';

import React, { useCallback, useEffect, useState } from 'react';
import Header from 'components/feature/header';
import DropDown, { option } from 'components/base/DropDown';
import { Calendar, Clock } from 'assets/icon';
import {
  GetLeaderboardApi,
  IDaysOfWeek,
  IGetLeaderboard,
  LeaderboardType,
  ListDaysOfWeeksApi,
} from 'api/history';
import { useNavigate } from 'react-router-dom';
import { useModal } from 'state/application/hooks';
import Loader from 'components/base/Loader';

import styles from './index.module.scss';

interface IRecord {
  player_name: string;
  time_used: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { setModalOpen, setModalDetails } = useModal();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<LeaderboardType>(LeaderboardType.daily);
  const [week, setWeek] = useState<option>({ value: '1', label: 'Week 1' });
  const [day, setDay] = useState<option>({ value: '1', label: 'Day 1' });
  const [wordId, setWordId] = useState<number>(1);
  const [listDaysOfWeeks, setListDaysOfWeeks] = useState<IDaysOfWeek[]>();
  const [data, setData] = useState<IRecord[]>();

  const handleError = useCallback(
    (error: any) => {
      setModalDetails({
        title: 'Something went wrong',
        description: `Error code : ${error?.response?.status}`,
        okButtonText: 'OK',
        onOk: () => navigate(path.landing),
      });
      setModalOpen(true);
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  const getWordId = useCallback(
    (w: option) => {
      return (
        listDaysOfWeeks?.filter((o) => o.week === `week${w.value}`)?.[0]
          ?.word_id || 1
      );
    },
    [listDaysOfWeeks]
  );

  const getWeeklyData = useCallback(() => {
    const params: IGetLeaderboard = {
      date: listDaysOfWeeks?.[parseInt(week.value) - 1]?.days?.[0] || '1',
      type: LeaderboardType.weekly,
      word_id: getWordId(week),
      limit: 0,
      offset: 0,
    };
    GetLeaderboardApi(params)
      .then((response) => {
        const data = response.data?.datas as IRecord[];
        setData(data);
        setLoading(false);
      })
      .catch((error) => handleError(error));
  }, [listDaysOfWeeks, week, getWordId, handleError]);

  const getDailyData = useCallback(() => {
    const params: IGetLeaderboard = {
      date:
        listDaysOfWeeks?.[parseInt(week.value) - 1]?.days?.[
          parseInt(day.value) - 1
        ] || '1',
      type: LeaderboardType.daily,
      word_id: getWordId(week),
      limit: 0,
      offset: 0,
    };
    GetLeaderboardApi(params)
      .then((response) => {
        const data = response.data?.datas as IRecord[];
        setData(data);
        setLoading(false);
      })
      .catch((error) => handleError(error));
  }, [listDaysOfWeeks, week, day.value, getWordId, handleError]);

  useEffect(() => {
    ListDaysOfWeeksApi()
      .then((response) => {
        const data = response.data as IDaysOfWeek[];
        setListDaysOfWeeks(data);

        const today = new Date();
        const todayMonth = today.getUTCMonth() + 1;
        const todayDate = today.getUTCDate();
        const todayYear = today.getUTCFullYear();

        let todayString = `${todayYear}-`;
        if (todayMonth < 10) todayString += '0';
        todayString += `${todayMonth}-`;
        if (todayDate < 10) todayString += '0';
        todayString += todayDate;

        data.forEach((list) => {
          list.days.forEach((d, i) => {
            if (d === todayString) {
              const newWeek = parseInt(list.week.split('week')?.[1]) || 1;
              setWeek({ value: `${newWeek}`, label: `Week ${newWeek}` });
              setDay({ value: `${i + 1}`, label: `Day ${i + 1}` });
              setWordId(list.word_id);
            }
          });
        });
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => handleError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listDaysOfWeeks) {
      if (page === LeaderboardType.weekly) {
        getWeeklyData();
      } else {
        getDailyData();
      }
    }
  }, [page, listDaysOfWeeks, getDailyData, getWeeklyData]);

  const handleChangePage = (p: LeaderboardType) => {
    setPage(p);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header withBackButton>
            <h4>LEADERBOARD</h4>
            <div className={styles.tab}>
              <div
                onClick={() => handleChangePage(LeaderboardType.daily)}
                className={
                  page === LeaderboardType.daily ? styles.selected : ''
                }
              >
                Daily
              </div>
              <div className={styles.divider} />
              <div
                onClick={() => handleChangePage(LeaderboardType.weekly)}
                className={
                  page === LeaderboardType.weekly ? styles.selected : ''
                }
              >
                Weekly
              </div>
            </div>
          </Header>
          <div className={styles.body_container}>
            <div className={styles.dropdowns_container}>
              <div className={styles.dropdown}>
                <span>Week</span>
                <DropDown
                  options={[...Array(listDaysOfWeeks?.length)].map(
                    (option, i) => {
                      return { value: `${i + 1}`, label: `Week ${i + 1}` };
                    }
                  )}
                  selectedOption={week}
                  setSelectedOption={setWeek}
                  icon={<Clock />}
                />
              </div>
              {page === LeaderboardType.daily && (
                <div className={styles.dropdown}>
                  <span>Day</span>
                  <DropDown
                    options={[
                      ...Array(
                        listDaysOfWeeks?.[parseInt(week.value) - 1]?.days
                          ?.length
                      ),
                    ].map((option, i) => {
                      return { value: `${i + 1}`, label: `Day ${i + 1}` };
                    })}
                    selectedOption={day}
                    setSelectedOption={setDay}
                    icon={<Calendar />}
                  />
                </div>
              )}
            </div>
            {data && data.length > 0 ? (
              <div className={styles.table}>
                <thead>#</thead>
                <thead>Name</thead>
                <thead>Time used</thead>
                {data.map((r, i) => {
                  const hour = parseInt(r?.time_used?.split(':')?.[0]);
                  const min = parseInt(r?.time_used?.split(':')?.[1]);
                  const sec = parseFloat(r?.time_used?.split(':')?.[2]).toFixed(
                    2
                  );
                  return (
                    <>
                      <td>{i + 1}</td>
                      <td>{r.player_name}</td>
                      <td className={styles.time}>
                        {hour * 60 + min}:{sec}
                        <div className={styles.space} />
                        <span className={styles.sec}>min</span>
                      </td>
                    </>
                  );
                })}
              </div>
            ) : (
              <div className={styles.description}>no records</div>
            )}
            <a href={path.rewards} className={styles.bottom_link}>
              View Rewards
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
