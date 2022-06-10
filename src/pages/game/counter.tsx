import Counter from 'components/feature/counter';
import React, { FC } from 'react';

import styles from './index.module.scss';

const GameCounter: FC<{ startTime: Date }> = ({ startTime }) => {
  const { hour, minute, second, millisecond } = Counter({ startTime });
  return (
    <div>
      <div className={styles.number}>
        {hour * 60 + minute < 10 ? '0' : ''}
        {hour * 60 + minute}
      </div>
      <div>:</div>
      <div className={styles.number}>
        {second < 10 ? '0' : ''}
        {second}
      </div>
      <div>.</div>
      <div className={styles.number}>
        {millisecond < 10 ? '00' : millisecond < 100 ? '0' : ''}
        {millisecond}
      </div>
    </div>
  );
};

export default GameCounter;
