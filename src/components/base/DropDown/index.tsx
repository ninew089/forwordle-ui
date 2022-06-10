import React, { FC, useState, HTMLProps, ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowDown, ArrowUp } from 'assets/icon';

import styles from './index.module.scss';

export type option = {
  value: string;
  label: string;
};

interface IDropDown extends HTMLProps<HTMLDivElement> {
  className?: string;
  options: option[];
  selectedOption: option;
  setSelectedOption: React.Dispatch<React.SetStateAction<option>>;
  startIconDisable?: boolean;
  icon: ReactNode;
}

const DropDown: FC<IDropDown> = ({
  className,
  options,
  selectedOption,
  setSelectedOption,
  startIconDisable = false,
  icon,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={clsx(styles.dropdown, className)}
      onClick={() => {
        setOpen((value) => !value);
      }}
    >
      {!startIconDisable && <div className={styles.icon}>{icon}</div>}
      <p>{selectedOption.label}</p>
      {open ? <ArrowUp /> : <ArrowDown />}
      {/* <div
        className={clsx({
          [styles.up]: open,
          [styles.down]: !open,
        })}
      /> */}
      {open && (
        <div className={styles.list}>
          {options.map((option: option) => (
            <div
              className={clsx(styles.item, {
                [styles.active]: selectedOption.value === option.value,
              })}
              key={option.value}
              onClick={() => setSelectedOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
