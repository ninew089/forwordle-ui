import Counter from 'components/feature/counter';
import React, { FC } from 'react';

import styles from './index.module.scss';

const WaitCounter: FC<{ startTime: Date }> = ({ startTime }) => {
  const { hour, minute, second } = Counter({ startTime });

  if (hour === 0 && minute === 0 && second === 0) location.reload();

  return (
    <>
      <div>
        <h4 className={styles.number}>{hour}</h4>
        <div className={styles.unit}>Hours</div>
      </div>
      <h4>:</h4>
      <div>
        <h4 className={styles.number}>{minute}</h4>
        <div className={styles.unit}>Min</div>
      </div>
      <h4>:</h4>
      <div>
        <h4 className={styles.number}>{second}</h4>
        <div className={styles.unit}>Sec</div>
      </div>
    </>
  );
};

export default WaitCounter;
