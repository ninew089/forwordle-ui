const timeUsedFormat = (time: string) => {
  const times = time?.split(':');

  let hour = times?.[0].replace('-', '') || '0';
  hour = parseInt(hour) < 10 ? `0${parseInt(hour)}` : hour;

  let min = times?.[1] || '0';
  min = parseInt(min) < 10 ? `0${parseInt(min)}` : min;

  let sec = times?.[2]?.split('.')?.[0] || '0';
  sec = parseInt(sec) < 10 ? `0${parseInt(sec)}` : sec;

  let millisec = times?.[2]?.split('.')?.[1]?.slice(0, 3) || '0';
  millisec =
    parseInt(millisec) < 10
      ? `00${parseInt(millisec)}`
      : parseInt(millisec) < 100
      ? `0${parseInt(millisec)}`
      : millisec;

  return { hour, min, sec, millisec };
};

export default timeUsedFormat;
