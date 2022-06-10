import React from 'react';
import Header from 'components/feature/header';

import styles from './index.module.scss';

const HowToPlay = () => {
  return (
    <div className={styles.container}>
      <Header withBackButton>
        <h4>HOW TO PLAY</h4>
      </Header>
      <div className={styles.body_container}>
        <div className={styles.description}>
          Forwordle is a guessing game in which there are 5 letters making up a
          word with or without meaning related to crypto.
        </div>
        <div className={styles.description}>
          You have 10 chances to guess the correct answer.
        </div>
        <div className={styles.description}>
          Each answer will have its own color to show whether the letter is
          correct or not.
        </div>
        <div className={styles.description}>
          If a letter appears{' '}
          <span style={{ color: '#E9B433', fontWeight: 700 }}>yellow</span>, it
          means that the letter is contained in the answer, but not in the
          correct position.
        </div>
        <div className={styles.description}>
          If a letter is{' '}
          <span style={{ color: '#11C9BE', fontWeight: 700 }}>green</span>, it
          means that the letter is in the answer and in the right position.
        </div>
        <div className={styles.description}>
          If a letter is{' '}
          <span style={{ color: '#848FBE', fontWeight: 700 }}>grey</span>, it
          means that that letter is not in the answer.
        </div>
        <div className={styles.description}>
          If all 5 characters show up as green, the game is over and the fastest
          answer time is used as a score. (The less time the better)
        </div>

        <div className={styles.title}>Rules and conditions</div>
        <div className={styles.description}>
          Forwordle games will be played over 4 weeks to begin with, with prizes
          given on a daily and weekly basis.
        </div>
        <div className={styles.description}>
          Each week, there will be 7 game days with 1 game per day, starting the
          first day of the week on Monday at 12.00PM (UTC).
        </div>
        <div className={styles.description}>
          Everyone will get the same word set for that week, but not in the same
          order.
        </div>
        <div className={styles.description}>
          On each game day (Monday included), at 12.00PM (UTC) the system will
          give you 1 choice to play in that week&apos;s word set.
          <br />
          <br />
          For any game, you can start playing by yourself and it will
          immediately set the time for that game.
        </div>
        <div className={styles.description}>
          There will be only 2 hours to start playing each day&apos;s game, from
          12.00PM (UTC) to 2.00PM (UTC).
          <br />
          <br />
          After that, you can&apos;t play the game of that day, but you will be
          able to continue playing at 12.00PM (UTC) on the next day.
        </div>
        <div className={styles.description}>
          Each day, the top 10 with the fastest times will be rewarded. And for
          weekly rewards, only the top 10 players who have completed all 7 games
          (1 set) and have the lowest total time will get a weekly special
          prize.
          <br />
          <br />
          The reward will be described in the reward page.
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
