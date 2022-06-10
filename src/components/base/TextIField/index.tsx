import React, { FC, ReactNode, HTMLProps } from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';

export interface ITextField extends HTMLProps<HTMLInputElement> {
  className?: string;
  error?: boolean;
  unit?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const TextField: FC<ITextField> = ({
  className,
  disabled,
  error,
  unit,
  startIcon,
  ...props
}) => {
  const classes = clsx(className, styles.wrapper);

  return (
    <div className={classes}>
      <div className={styles.startIcon}>{startIcon}</div>

      <input
        className={clsx({
          [styles.unit]: unit !== undefined,

          [styles.disabled]: disabled,
          [styles.error]: error,
        })}
        disabled={disabled}
        {...props}
      />
      {unit && <p className={styles.unit}>{unit}</p>}
    </div>
  );
};

export default TextField;
