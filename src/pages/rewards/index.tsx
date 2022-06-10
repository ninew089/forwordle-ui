import { path } from 'constants/index';

import React from 'react';
import Header from 'components/feature/header';
import clsx from 'clsx';

import styles from './index.module.scss';

const Rewards = () => {
  const dailyPlacesComponent = (
    <div className={styles.places_container}>
      <div className={clsx(styles.place_container, styles.p1)}>
        <span>1st place</span>
        <div>
          <span>3,500</span>
          <span>FORW</span>
        </div>
      </div>
      <div className={clsx(styles.place_container, styles.p2)}>
        <span>2nd place</span>
        <div>
          <span>2,500</span>
          <span>FORW</span>
        </div>
      </div>
      <div className={clsx(styles.place_container, styles.p3)}>
        <span>3rd place</span>
        <div>
          <span>2,000</span>
          <span>FORW</span>
        </div>
      </div>
      <div className={clsx(styles.place_container, styles.p4)}>
        <span>4th - 10th place</span>
        <div>
          <span>1,000</span>
          <span>FORW</span>
        </div>
      </div>
    </div>
  );

  const weeklyPlacesComponent = (
    <div className={styles.places_container}>
      <div className={clsx(styles.place_container, styles.p1)}>
        <span>1st place</span>
        <div>
          <span>4,000</span>
          <span>FORW</span>
        </div>
      </div>
      <div className={clsx(styles.place_container, styles.p2)}>
        <span>2nd place</span>
        <div>
          <span>3,000</span>
          <span>FORW</span>
        </div>
      </div>
      <div className={clsx(styles.place_container, styles.p3)}>
        <span>3rd place</span>
        <div>
          <span>2,500</span>
          <span>FORW</span>
        </div>
      </div>
      <div className={clsx(styles.place_container, styles.p4)}>
        <span>4th - 10th place</span>
        <div>
          <span>1,500</span>
          <span>FORW</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Header withBackButton>
        <h4>REWARDS</h4>
      </Header>
      <div className={styles.body_container}>
        <div>
          <div className={styles.title}>Daily Rewards</div>
          <div className={styles.description}>
            For each day, Top 10 forwardians who win the game with the least
            time
            <br />
            will receive forward token as specified below.
          </div>
        </div>
        {dailyPlacesComponent}
        <div className={styles.divider} />
        <div>
          <div className={styles.title}>Weekly Rewards</div>
          <div className={styles.description}>
            For each week, Top 10 forwardians who win all the 7 games with the
            least total time
            <br />
            will receive forward token as specified below.
          </div>
        </div>
        {weeklyPlacesComponent}
        <a href={path.leaderboard} className={styles.bottom_link}>
          View Leaderboard
        </a>
      </div>
    </div>
  );
};

export default Rewards;
