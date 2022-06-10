import React, { ReactNode, FC } from 'react';

import Header from './header';
import styles from './index.module.scss';

interface IContainer {
  children: ReactNode;
}

const Layout: FC<IContainer> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
