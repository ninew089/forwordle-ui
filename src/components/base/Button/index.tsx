import React, { FC, ReactNode, HTMLProps } from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';

export enum ButtonStyle {
  None = '',
  Default = 'default',
  Secondary = 'Secondary',
  Outlined = 'outlined',
  Contained = 'contained',
  Text = 'text',
  Destructive = 'destructive',
  Icon = 'icon',
}

export interface IButton extends HTMLProps<HTMLButtonElement> {
  children: ReactNode;
  buttonStyle?: ButtonStyle;
  className?: string;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: FC<IButton> = ({
  children,
  buttonStyle = ButtonStyle.Default,
  className,
  disabled,
  startIcon,
  endIcon,
  type = 'button',
  ...props
}) => {
  const classes = clsx(
    className,
    {
      [styles.default]: buttonStyle === ButtonStyle.Default,
      [styles.secondary]: buttonStyle === ButtonStyle.Secondary,
      [styles.outlined]: buttonStyle === ButtonStyle.Outlined,
      [styles.contained]: buttonStyle === ButtonStyle.Contained,

      [styles.icon]:
        buttonStyle === ButtonStyle.Icon ||
        startIcon !== undefined ||
        endIcon !== undefined,
      [styles.disabled]: disabled,
    },
    styles.container
  );

  return (
    <button type={type} className={classes} {...props}>
      {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
      {children}
      {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
    </button>
  );
};

export default Button;
