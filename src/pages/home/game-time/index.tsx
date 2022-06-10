import { path } from 'constants/index';

import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timeUsedFormat from 'services/time-used-format';
import { SelectChallengeApi } from 'api/challenges';
import { useModal } from 'state/application/hooks';

import { IChallenge } from '..';

import styles from './index.module.scss';

interface GameTimeProps {
  week: number;
  day: number;
  wordId: number;
  started: boolean;
  over: boolean;
  challenges?: IChallenge[];
  timeused?: string;
}

const GameTime: FC<GameTimeProps> = ({
  week,
  day,
  wordId,
  started,
  over,
  challenges,
  timeused,
}) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState<number>(
    challenges?.[0]?.position || 1
  );
  const { hour, min, sec, millisec } = timeUsedFormat(timeused || '');
  const { setModalOpen, setModalDetails } = useModal();

  const handleStartGame = () => {
    SelectChallengeApi({ position, word_id: wordId })
      .then(() => {
        navigate(path.game);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setModalDetails({
            title: 'Unauthorization',
            description: 'Please login before visit this page.',
            okButtonText: 'Log in',
            onOk: () => navigate(path.login),
          });
          setModalOpen(true);
        }
        if (error.response?.status === 400) {
          setModalDetails({
            title: 'Unavailable time',
            description: error.response?.data?.message,
            okButtonText: 'OK',
            onOk: () => navigate(path.home),
          });
          setModalOpen(true);
        }
        if (error.response?.status === 409) navigate(path.game);
      });
  };

  const card = () => {
    if (over) {
      //game over
      return (
        <div className={styles.card}>
          <div>Try again</div>
          <div>
            You have complete today challenge, Please wait for the next round.
          </div>
        </div>
      );
    }
    if (started) {
      //can continue
      return (
        <div className={styles.card}>
          <div>Game started</div>
          <div>You can continue this game by clicking the button below</div>
        </div>
      );
    }
    if (timeused) {
      // resolved
      return (
        <div className={styles.card}>
          <div className={styles.congratulations}>Congratulations</div>
          <div>Time used</div>
          <div>{`${
            parseInt(hour) * 60 + parseInt(min)
          }:${sec}.${millisec} min`}</div>
          <div>
            You have complete today challenge, Please wait for the next round.
          </div>
        </div>
      );
    }
    // haven't started yet
    if (challenges)
      return (
        <div className={clsx(styles.card, styles.game_on)}>
          <h4>Game on !</h4>
          <div>
            Today’s Forwordle has start,
            <br />
            Good luck fellows forwardians.
          </div>
        </div>
      );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.week_day}>
          <span>WEEK {week}</span>
          <span>Day {day}</span>
        </div>
        {!(over || started || timeused !== '') && (
          <>
            <span className={styles.head_description}>
              Choose any game that you want to play
            </span>
            {!started && !over && challenges && challenges?.length > 0 && (
              <div className={styles.tab_container}>
                <div className={styles.tab}>
                  {challenges?.map((c) => {
                    return (
                      <div
                        key={c.position}
                        onClick={() => setPosition(c.position)}
                        className={clsx(styles.position, {
                          [styles.selected]: c.position === position,
                        })}
                      >
                        <span>Game</span>
                        <span>{c.position}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        {card()}
        <button
          className={styles.play}
          disabled={(over || timeused !== '') && !started}
          onClick={handleStartGame}
        >
          Play Forwordle
        </button>
        <div className={styles.buttons_container}>
          <a href={path.leaderboard}>Leaderboard</a>
          <a href={path.rewards}>Rewards</a>
          <a href={path.howToPlay}>How to play</a>
        </div>
      </div>
    </>
  );
};

export default GameTime;
