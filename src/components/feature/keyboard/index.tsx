import { Delete } from 'assets/icon';
import clsx from 'clsx';
import React, { FC } from 'react';

import styles from './index.module.scss';

export interface IHighlightKey {
  grey: string[];
  green: string[];
  yellow: string[];
}
interface KeyboardProps {
  handleKeyInput: (key: string) => void;
  handleSubmit: () => void;
  handleDelete: () => void;
  highlightKey?: IHighlightKey;
}

const Keyboard: FC<KeyboardProps> = ({
  handleKeyInput,
  handleDelete,
  handleSubmit,
  highlightKey,
}) => {
  const topRowKeys = 'qwertyuiop'.split('');
  const middleRowKeys = 'asdfghjkl'.split('');
  const bottomRowKeys = 'zxcvbnm'.split('');

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <div className={styles.row}>
          {topRowKeys.map((key) => (
            <div
              className={clsx(styles.char, {
                [styles.grey]: highlightKey?.grey.includes(key),
                [styles.green]: highlightKey?.green.includes(key),
                [styles.yellow]: highlightKey?.yellow.includes(key),
              })}
              key={key}
              onClick={() => handleKeyInput(key)}
            >
              {key.toUpperCase()}
            </div>
          ))}
        </div>
        <div className={styles.row}>
          {middleRowKeys.map((key) => (
            <div
              className={clsx(styles.char, {
                [styles.grey]: highlightKey?.grey.includes(key),
                [styles.green]: highlightKey?.green.includes(key),
                [styles.yellow]: highlightKey?.yellow.includes(key),
              })}
              key={key}
              onClick={() => handleKeyInput(key)}
            >
              {key.toUpperCase()}
            </div>
          ))}
        </div>
        <div className={styles.row}>
          <div className={styles.enter} onClick={() => handleSubmit()}>
            Enter
          </div>
          <div className={styles.keys_wrapper}>
            {bottomRowKeys.map((key) => (
              <div
                className={clsx(styles.char, {
                  [styles.grey]: highlightKey?.grey.includes(key),
                  [styles.green]: highlightKey?.green.includes(key),
                  [styles.yellow]: highlightKey?.yellow.includes(key),
                })}
                key={key}
                onClick={() => handleKeyInput(key)}
              >
                {key.toUpperCase()}
              </div>
            ))}
          </div>
          <div className={styles.delete} onClick={() => handleDelete()}>
            <Delete />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
