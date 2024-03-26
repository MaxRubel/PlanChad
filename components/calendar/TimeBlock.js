import { hoursTimes } from '../../utils/hours';

/* eslint-disable react/prop-types */
export default function TimeBlock({ hour }) {
  const morningOrNight = hour < 12 ? 'AM' : 'PM';
  return (
    <div className="card-body timeRow">
      <div className="fullCenter padded">
        {hoursTimes[hour]} <div className="smallFont">&nbsp;{morningOrNight}</div>
      </div>
      <div className="fullCenter padded borderBottom">hey again</div>

    </div>
  );
}
