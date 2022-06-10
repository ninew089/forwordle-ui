import { path } from 'constants/index';

import React, { FC, useCallback, useEffect, useState } from 'react';
import Header from 'components/feature/header';
import { useEventListener, useLogin, useModal } from 'state/application/hooks';
import clsx from 'clsx';
import Keyboard, { IHighlightKey } from 'components/feature/keyboard';
import {
  CheckAnswerApi,
  GetAnswerHistoryApi,
  GetAnswerHistoryResponse,
  GetAvailableChallengesApi,
  IAnswer,
  IResultDetails,
} from 'api/challenges';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/base/Loader';

import styles from './index.module.scss';
import GameCounter from './counter';

const mockResAnswer: IAnswer[] = [
  {
    answer: 'start',
    result: {
      '0': { char: 's', mathced: false, contain: false },
      '1': { char: 't', mathced: false, contain: false },
      '2': { char: 'a', mathced: true, contain: true },
      '3': { char: 'r', mathced: false, contain: false },
      '4': { char: 't', mathced: false, contain: false },
    },
    answer_at: '2022-05-31T13:52:20.917792757Z',
  },
  {
    answer: 'aaaaa',
    result: {
      '0': { char: 'a', mathced: false, contain: true },
      '1': { char: 'a', mathced: false, contain: false },
      '2': { char: 'a', mathced: true, contain: true },
      '3': { char: 'a', mathced: false, contain: false },
      '4': { char: 'a', mathced: false, contain: false },
    },
    answer_at: '2022-05-31T13:52:26.364450977Z',
  },
];

const Game = () => {
  const { authData } = useLogin();
  const gameName = 'Game1';
  const week = 1;
  const day = 1;
  const wordWidth = 5;
  const attemptWidth = 10;
  const navigate = useNavigate();
  const { isModalOpen, setModalOpen, setModalDetails } = useModal();
  const [loading, setLoading] = useState<boolean>(true);
  const [iAttempt, setIAttempt] = useState<number>(0);
  const [wordsInblock, setWordsInBlock] = useState<IAnswer[]>();
  const [isShaking, setShaking] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [highlightKey, setHighlightKey] = useState<IHighlightKey>({
    grey: [],
    green: [],
    yellow: [],
  });

  const handleError = (error: string) => {
    setShaking(true);
    setErrorText(error);

    setTimeout(() => {
      setShaking(false);
    }, 500);
  };

  const handleSubmit = () => {
    const word = wordsInblock?.[iAttempt]?.answer || '';
    if (word.length === 5) {
      // call api check word
      CheckAnswerApi({ answer: word })
        .then((response) => {
          if (response.data?.total_time) {
            setModalDetails({
              children: endModal({ timeUsed: response.data?.total_time }),
            });
            setModalOpen(true);
          } else {
            const newWordsInBlock: IAnswer[] = response.data as IAnswer[];
            if (iAttempt < 9) {
              setWordsInBlock(newWordsInBlock);
              setIAttempt(newWordsInBlock.length);
            } else {
              setModalDetails({
                children: overModal(),
              });
              setModalOpen(true);
            }
          }
        })
        .catch((error) => {
          setModalDetails({
            title: 'Something went wrong',
            description: `Error code : ${error?.response?.status}`,
            okButtonText: 'OK',
            onOk: () => navigate(path.home),
          });
          setModalOpen(true);
        });
    } else {
      handleError('Too short');
    }
  };

  const handleDelete = () => {
    const newWordsInBlock: IAnswer[] = wordsInblock || [];
    if (newWordsInBlock?.[iAttempt]) {
      const oldAnswer = newWordsInBlock?.[iAttempt]?.answer || '';
      newWordsInBlock.pop();
      newWordsInBlock.push({
        answer: oldAnswer.slice(0, -1),
      });
    }
    setWordsInBlock([...newWordsInBlock]);
  };

  const handleKeyInput = (key: string) => {
    const newWordsInBlock: IAnswer[] = wordsInblock || [];
    if (!newWordsInBlock?.[iAttempt]) {
      newWordsInBlock.push({ answer: key });
      setWordsInBlock([...newWordsInBlock]);
    } else if (newWordsInBlock?.[iAttempt]?.answer?.length < wordWidth) {
      const newAnswer = newWordsInBlock?.[iAttempt]?.answer + key;
      newWordsInBlock.pop();
      newWordsInBlock.push({ answer: newAnswer });
      setWordsInBlock([...newWordsInBlock]);
    }
  };

  useEventListener('keyup', (e: KeyboardEvent) => {
    const { key } = e;
    const onlyWordRegex = /^[a-zA-Z]$/gi;

    if (key === 'Enter') handleSubmit();
    else if (key === 'Backspace') handleDelete();
    else if (onlyWordRegex.test(key)) handleKeyInput(key);
  });

  useEffect(() => {
    const checkKey = (obj: IResultDetails | undefined) => {
      if (obj) {
        const key = obj?.char;
        const khl: IHighlightKey = {
          ...highlightKey,
        } as IHighlightKey;

        if (obj?.mathced && !highlightKey?.green.includes(key)) {
          khl.green.push(key);
        } else if (
          obj?.contain &&
          !obj?.mathced &&
          !highlightKey?.yellow.includes(key)
        )
          khl.yellow.push(key);
        else if (
          obj?.contain === false &&
          obj?.mathced === false &&
          !highlightKey?.grey.includes(key)
        )
          khl.grey.push(key);

        khl.yellow = khl.yellow.filter((x) => !highlightKey?.green.includes(x));
        khl.grey = khl.grey.filter(
          (x) =>
            !highlightKey?.green.includes(x) &&
            !highlightKey?.yellow.includes(x)
        );
        setHighlightKey({ ...khl });
      }
    };

    wordsInblock?.map((word) => {
      checkKey(word.result?.[0]);
      checkKey(word.result?.[1]);
      checkKey(word.result?.[2]);
      checkKey(word.result?.[3]);
      checkKey(word.result?.[4]);
    });
  }, [wordsInblock]);

  useEffect(() => {
    async function fetchData() {
      if (!authData?.player_name) {
        setModalDetails({
          title: 'Unauthorization',
          description: 'Please login before visit this page.',
          okButtonText: 'Log in',
          onOk: () => navigate(path.login),
        });
        setModalOpen(true);
        setLoading(false);
      } else {
        await GetAvailableChallengesApi()
          .then((response) => {
            // already finished this game
            if (response.data?.time_used) {
              setModalDetails({
                children: endModal({ timeUsed: response.data?.time_used }),
              });
              setModalOpen(true);
            }
          })
          .catch((error) => {
            if (error.response?.data?.status === 'already_start_challenge') {
              console.log('game started');
            } else if (
              error.response?.data?.status === 'access_token_expired'
            ) {
              setModalDetails({
                title: 'Access token expired',
                description: 'Access token expired. Please login again.',
                okButtonText: 'Log in',
                onOk: () => navigate(path.login),
              });
              setModalOpen(true);
            } else if (error.response?.data?.status === 'invalid_token') {
              setModalDetails({
                title: 'Invalid token',
                description: 'Invalid token. Please login again.',
                okButtonText: 'Log in',
                onOk: () => navigate(path.login),
              });
              setModalOpen(true);
            } else if (error.response?.data?.status === 'unavailable_time') {
              setModalDetails({
                title: 'Unavailable time',
                description: error.response?.data?.message,
                okButtonText: 'OK',
                onOk: () => navigate(path.home),
              });
              setModalOpen(true);
            } else if (error.response?.data?.status === 'over_limit') {
              setModalDetails({
                children: overModal(),
              });
              setModalOpen(true);
            } else {
              setModalDetails({
                title: 'Something went wrong',
                description: `Error code : ${error?.response?.status}`,
                okButtonText: 'OK',
                onOk: () => navigate(path.home),
              });
              setModalOpen(true);
            }
          });

        await GetAnswerHistoryApi()
          .then((response) => {
            const responseData = response.data as GetAnswerHistoryResponse;
            if (responseData?.started_at)
              setStartTime(new Date(responseData?.started_at));
            else setStartTime(new Date());
            setWordsInBlock(responseData?.histories);
            setIAttempt(responseData?.histories?.length || 0);
          })
          .catch((error) => {
            if (error.response?.data?.status === 'access_token_expired') {
              setModalDetails({
                title: 'Access token expired',
                description: 'Access token expired. Please login again.',
                okButtonText: 'Log in',
                onOk: () => navigate(path.login),
              });
              setModalOpen(true);
            } else if (error.response?.data?.status === 'invalid_token') {
              setModalDetails({
                title: 'Invalid token',
                description: 'Invalid token. Please login again.',
                okButtonText: 'Log in',
                onOk: () => navigate(path.login),
              });
              setModalOpen(true);
            } else if (error.response?.data?.status === 'unavailable_time') {
              setModalDetails({
                title: 'Unavailable time',
                description: error.response?.data?.message,
                okButtonText: 'OK',
                onOk: () => navigate(path.home),
              });
              setModalOpen(true);
            } else {
              setModalDetails({
                title: 'Something went wrong',
                description: `Error code : ${error?.response?.status}`,
                okButtonText: 'OK',
                onOk: () => navigate(path.home),
              });
              setModalOpen(true);
            }
            setLoading(false);
          });

        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const endModal: FC<{ timeUsed: string }> = ({ timeUsed }) => {
    return (
      <div className={styles.modal_container}>
        <div className={clsx(styles.modal_title, styles.gold)}>Great Job !</div>
        <div className={styles.modal_time_used}>
          <span>Time used</span>
          <span>{timeUsed}</span>
        </div>
        <div className={styles.modal_description}>
          You have completed today challenge,
          <br />
          Please wait for the next round.
        </div>
        <a href={path.home}>Back to Mainpage</a>
      </div>
    );
  };

  const overModal = () => {
    return (
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>Try again</div>
        <div className={styles.modal_description}>
          You have completed today challenge,
          <br />
          Please wait for the next round.
        </div>
        <a href={path.home}>Back to Mainpage</a>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header withGameName playerName={authData?.player_name} />
          <div className={styles.body_container}>
            <div className={styles.title_container}>
              <div>
                <div className={styles.week}>WEEK {week}</div>
                <div className={styles.day}>Day {day}</div>
              </div>
              <div>
                <div className={styles.game_name}>{gameName}</div>
                <div className={styles.counter_container}>
                  <span>Time</span>
                  {isModalOpen ? (
                    '00:00.00'
                  ) : (
                    <GameCounter startTime={startTime} />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.attempts_container}>
              {[...Array(attemptWidth)].map((att, i) => {
                return (
                  <div key={i} className={styles.blocks_container}>
                    {[...Array(wordWidth)].map((word, j) => {
                      let result: IResultDetails | undefined;
                      switch (j) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                          result = wordsInblock?.[i]?.result?.[j];
                          break;
                        default:
                          result = wordsInblock?.[i]?.result?.[0];
                          break;
                      }
                      return (
                        <div
                          key={j}
                          className={clsx(styles.block, {
                            [styles.shake]: i === iAttempt && isShaking,
                            [styles.green]: result?.mathced,
                            [styles.yellow]:
                              result?.contain && !result?.mathced,
                            [styles.grey]:
                              result?.contain === false &&
                              result?.mathced === false,
                          })}
                        >
                          <h4>{wordsInblock?.[i]?.answer?.[j]}</h4>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <Keyboard
            handleKeyInput={handleKeyInput}
            handleDelete={handleDelete}
            handleSubmit={handleSubmit}
            highlightKey={highlightKey}
          />
        </>
      )}
    </div>
  );
};

export default Game;
