import { useEffect, useState } from 'react';

interface CounterProps {
  startTime: Date;
}

interface ITime {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const getDiffTime = (startTime: Date) => {
  const nowTime = new Date();
  let diffTime = nowTime.getTime() - startTime.getTime();
  if (diffTime < 0) diffTime = -diffTime;
  return {
    hours: Math.floor(diffTime / 1000 / 60 / 60),
    minutes: Math.floor((diffTime / 1000 / 60) % 60),
    seconds: Math.floor((diffTime / 1000) % 60),
    milliseconds: Math.floor(diffTime % 1000),
  };
};

const Counter = ({ startTime }: CounterProps) => {
  const [diffTime, setDiffTime] = useState<ITime>(getDiffTime(startTime));

  useEffect(() => {
    const id = setInterval(() => {
      const nowTime = new Date();
      let diffTime = nowTime.getTime() - startTime.getTime();
      if (diffTime < 0) diffTime = -diffTime;
      setDiffTime({
        hours: Math.floor(diffTime / 1000 / 60 / 60),
        minutes: Math.floor((diffTime / 1000 / 60) % 60),
        seconds: Math.floor((diffTime / 1000) % 60),
        milliseconds: Math.floor(diffTime % 1000),
      });
    }, 100);
    return () => {
      clearInterval(id);
    };
  }, [startTime]);

  return {
    hour: diffTime.hours,
    minute: diffTime.minutes,
    second: diffTime.seconds,
    millisecond: diffTime.milliseconds,
  };
};

export default Counter;
