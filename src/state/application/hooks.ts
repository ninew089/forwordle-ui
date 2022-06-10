import { ErrorModalProps } from 'components/base/ErrorModal';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'state/store';

import {
  closeModal,
  openModal,
  setAuthData,
  setModalData,
  stopTime as pauseTime,
  updateStopTime,
} from './index';
import { IAuthData } from './types';

export function useLogin() {
  const authData: IAuthData | undefined = useSelector(
    (state: RootState) => state.application?.authData
  );
  const dispatch = useDispatch<AppDispatch>();
  const setData = (data: IAuthData | undefined) => {
    dispatch(setAuthData(data));
    if (!data) {
      localStorage.removeItem('forwordle:accessToken');
    } else {
      localStorage.setItem('forwordle:accessToken', data?.access_token);
    }
  };
  return {
    authData,
    setAuthData: setData,
  };
}

export function useModal() {
  const isModalOpen = useSelector(
    (state: RootState) => state.application?.isOpenModal
  );

  const modalDetails = useSelector(
    (state: RootState) => state.application?.modalData
  );

  const dispatch = useDispatch<AppDispatch>();

  const setModalOpen = (isOpen: boolean) => {
    if (isOpen) dispatch(openModal());
    else dispatch(closeModal());
  };

  const setModalDetails = (data: ErrorModalProps) => {
    dispatch(setModalData(data));
  };

  return { isModalOpen, setModalOpen, modalDetails, setModalDetails };
}

export function useEventListener(
  eventType: any,
  callback: any,
  element = window
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e: any) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}

export function useTimer(startTime: Date, maxTime?: number) {
  const dispatch = useDispatch<AppDispatch>();
  const [time, setTime] = useState(0);
  const { stopTime, isCounting, stopCounting } = useStopTimeState();

  useEffect(() => {
    const id = setInterval(() => {
      setTime(Math.floor((new Date().getTime() - startTime.getTime()) / 10));
    }, 10);

    if (!isCounting) {
      dispatch(updateStopTime(time));
      clearInterval(id);
    }

    if (maxTime && time >= maxTime && isCounting) {
      dispatch(updateStopTime(maxTime));
      clearInterval(id);
      stopCounting();
    }

    return () => clearInterval(id);
  }, [dispatch, isCounting, maxTime, startTime, stopCounting, time]);

  return {
    time,
    stopTime,
    isCounting,
  };
}

export function useStopTimeState() {
  const dispatch = useDispatch<AppDispatch>();
  const isCounting: boolean = useSelector(
    (state: RootState) => state.application?.timer.isCounting || false
  );
  const stopTime: number = useSelector(
    (state: RootState) => state.application?.timer.stopTime || 0
  );

  return {
    stopCounting: () => dispatch(pauseTime(false)),
    isCounting,
    stopTime,
  };
}
