import { path } from 'constants/index';

import React, { FC, useEffect, useState } from 'react';
import { Clock, Lock } from 'assets/icon';
import DropDown, { option } from 'components/base/DropDown';
import { GetUserScoreApi, IDaysOfWeek } from 'api/history';
import timeUsedFormat from 'services/time-used-format';

import styles from './index.module.scss';
import WaitCounter from './counter';

interface IRecord {
  day: string;
  game_no: string;
  time_used: string;
}
export interface ITotalTimeUsedData {
  word_id: number;
  total_time_used: string;
  scores: IRecord[];
}

interface WaitProps {
  week: number;
  day: number;
  listDaysOfWeeks: IDaysOfWeek[];
  startTimeMessage: string;
  startTimeDate: string;
}

const mockTotalTimeUsedData: ITotalTimeUsedData = {
  word_id: 1,
  total_time_used: '-01:14:47.432691',
  scores: [
    {
      day: 'DAY 1',
      game_no: 'GAME 2',
      time_used: '00:00:00',
    },
    {
      day: 'DAY 2',
      game_no: 'GAME 1',
      time_used: '-00:11:47.195845',
    },
    {
      day: 'DAY 3',
      game_no: 'GAME 3',
      time_used: '-00:12:00.667918',
    },
    {
      day: 'DAY 4',
      game_no: 'GAME 5',
      time_used: '-00:12:23.689769',
    },
    {
      day: 'DAY 5',
      game_no: 'GAME 4',
      time_used: '-00:12:33.704505',
    },
    {
      day: 'DAY 6',
      game_no: 'GAME 6',
      time_used: '-00:12:52.463769',
    },
    {
      day: 'DAY 7',
      game_no: 'GAME 7',
      time_used: '-00:13:09.710885',
    },
  ],
};

const Wait: FC<WaitProps> = ({
  week,
  day,
  listDaysOfWeeks,
  startTimeMessage,
  startTimeDate,
}) => {
  const [totalTimeUsedData, setTotalTimeUsedData] =
    useState<ITotalTimeUsedData>(mockTotalTimeUsedData);
  const [weekDropdown, setWeekDropdown] = useState<option>({
    value: week.toString(),
    label: `Week ${week}`,
  });

  // startTimeMessage =
  //   'Forwordle is available to play daily at 12.00 PM - 2.00 PM (UTC)';
  let startHour =
    parseInt(startTimeMessage.split('.')?.[0]?.slice(-2) || '12') % 12;
  let endHour =
    parseInt(startTimeMessage.split('.')?.[1]?.slice(-2) || '2') % 12;
  const startMidday = startTimeMessage.split(' - ')?.[0]?.slice(-2);
  const endMidday = startTimeMessage.split(' (UTC)')?.[0]?.slice(-2);

  if (startMidday === 'PM' || (startMidday !== 'AM' && startMidday !== 'PM'))
    startHour += 12;
  if (endMidday === 'PM' || (endMidday !== 'AM' && endMidday !== 'PM'))
    endHour += 12;
  let startTime;
  if (startTimeDate) {
    startTime = new Date(new Date(startTimeDate).getTime());
  } else startTime = new Date(new Date().getTime());

  // when today is after startDate (but not in available time -> before startHour)
  if (new Date().getTime() >= startTime.getTime()) {
    if (startTime.getUTCHours() > startHour)
      startTime.setUTCDate(new Date().getUTCDate() + 1);
  }

  startTime.setUTCHours(startHour);
  startTime.setUTCMinutes(0);
  startTime.setUTCSeconds(0);
  startTime.setUTCMilliseconds(0);

  const formatTotalTimeUsed = timeUsedFormat(
    totalTimeUsedData?.total_time_used || ''
  );

  useEffect(() => {
    const wordId = listDaysOfWeeks?.filter(
      (o) => o.week === `week${weekDropdown.value}`
    )?.[0]?.word_id;
    GetUserScoreApi({ word_id: `${wordId}` })
      .then((response) => {
        const responseData = response.data as ITotalTimeUsedData;
        setTotalTimeUsedData(responseData);
      })
      .catch((error) => console.log(error));
  }, [listDaysOfWeeks, weekDropdown]);

  return (
    <div className={styles.container}>
      <div className={styles.week_day}>
        <span>WEEK {week}</span>
        <span>Day {day}</span>
      </div>
      <div className={styles.countdown_container}>
        <Lock />
        <span>The game will start in</span>
        <div className={styles.time_container}>
          <WaitCounter startTime={startTime} />
        </div>
        <div className={styles.description}>
          Forwordle is available to play daily at
          <br />
          {startHour === 12 ? '12' : startHour % 12}.00 PM -{' '}
          {endHour === 12 ? '12' : endHour % 12}.00 PM (UTC)
        </div>
        <div className={styles.buttons_container}>
          <a href={path.leaderboard}>Leaderboard</a>
          <a href={path.rewards}>Rewards</a>
          <a href={path.howToPlay}>How to play</a>
        </div>
      </div>
      <div className={styles.total_time_container}>
        <span className={styles.title}>TOTAL TIME USED</span>
        <div className={styles.dropdown_container}>
          <DropDown
            options={[...Array(listDaysOfWeeks.length)].map((option, i) => {
              return { value: `${i + 1}`, label: `Week ${i + 1}` };
            })}
            selectedOption={weekDropdown}
            setSelectedOption={setWeekDropdown}
            icon={<Clock />}
          />
        </div>
        <div className={styles.time_container}>
          <div>
            <h4 className={styles.number}>
              {parseInt(formatTotalTimeUsed.hour) * 60 +
                parseInt(formatTotalTimeUsed.min)}
            </h4>
            <div className={styles.unit}>Min</div>
          </div>
          <div>
            <h4 className={styles.number}>
              {parseInt(formatTotalTimeUsed.sec)}
            </h4>
            <div className={styles.unit}>Sec</div>
          </div>
          <div>
            <h4 className={styles.number}>
              {parseInt(formatTotalTimeUsed.millisec)}
            </h4>
            <div className={styles.unit}>Millisecs</div>
          </div>
        </div>
        <div className={styles.table_container}>
          {totalTimeUsedData?.scores?.length === 0 && (
            <div className={styles.description}>
              {`You don't have any record.`}
            </div>
          )}
          {totalTimeUsedData.scores.map((rec, i) => {
            return (
              <div className={styles.row_container} key={i}>
                <div className={styles.left_container}>
                  <div>{rec.day}</div>
                  <div>{rec.game_no}</div>
                </div>
                {rec.time_used !== '00:00:00' ? (
                  <div className={styles.right_container}>
                    {timeUsedFormat(rec.time_used)?.min}:
                    {timeUsedFormat(rec.time_used)?.sec}.
                    {timeUsedFormat(rec.time_used)?.millisec}
                  </div>
                ) : (
                  <div className={styles.right_container}>-</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wait;
