import { path } from 'constants/index';

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'components/navigation/layout';
import LinkAccount from 'pages/register/link-account';
import LinkedAccount from 'pages/register/linked-account';
import Login from 'pages/login';
import Landing from 'pages/landing';
import Rewards from 'pages/rewards';
import Leaderboard from 'pages/leaderboard';
import ChangeAccount from 'pages/change-account';
import AccountNotFound from 'pages/account-not-found';
import Home from 'pages/home';
import Game from 'pages/game';
import ErrorModal from 'components/base/ErrorModal';
import { useModal } from 'state/application/hooks';
import HowToPlay from 'pages/how-to-play';

const AppRouter = () => {
  const { modalDetails } = useModal();
  return (
    <Layout>
      <ErrorModal {...modalDetails} />
      <Routes>
        <Route path="/" element={<Navigate replace to={path.landing} />} />
        <Route path={path.home} element={<Home />} />
        <Route path={path.landing} element={<Landing />} />
        <Route path={path.login} element={<Login />} />
        <Route path={path.register.linkAccount} element={<LinkAccount />} />
        <Route path={path.register.linkedAccount} element={<LinkedAccount />} />
        <Route path={path.rewards} element={<Rewards />} />
        <Route path={path.leaderboard} element={<Leaderboard />} />
        <Route path={path.howToPlay} element={<HowToPlay />} />
        <Route path={path.changeAccount} element={<ChangeAccount />} />
        <Route path={path.game} element={<Game />} />
        <Route path={path.accountNotFound} element={<AccountNotFound />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;
