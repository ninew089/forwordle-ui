import { path } from 'constants/index';

import { ForwardLogo } from 'assets/images/navbar';
import React from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';

const Header = () => {
  const goToPage = (pathname: string) => {
    window.location.href = pathname;
  };
  return (
    <div className={clsx(styles.header, styles.bingo_header)}>
      <div onClick={() => goToPage(path.landing)}>
        <ForwardLogo />
      </div>
    </div>
  );
};

export default Header;
