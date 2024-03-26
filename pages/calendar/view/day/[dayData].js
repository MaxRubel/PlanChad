import { useRouter } from 'next/router';
import months from '../../../../utils/months';
import hours, { hoursTimes } from '../../../../utils/hours';
import TimeBlock from '../../../../components/calendar/TimeBlock';

export default function ViewCalDayPage() {
  const router = useRouter();
  const { dayData } = router.query;
  const queryObject = Object.fromEntries(new URLSearchParams(dayData));
  const projectId = queryObject.param1;
  const boxDate = new Date(queryObject.param2);
  const day = boxDate.getDate();
  const month = months[boxDate.getMonth()];
  const year = boxDate.getFullYear();

  return (

    <div className="minWidth320">
      <div id="project-top-bar" style={{ marginBottom: '1%' }}>
        <button
          id="backToProject"
          type="button"
          className="clearButton"
          onClick={() => {
            router.push(`/project/plan/${projectId}`);
          }}
        >
          Back To Project
        </button>
        <button
          id="manageCollaborators"
          type="button"
          className="clearButton"
          onClick={() => { router.push(`/calendar/view/${projectId}`); }}
        >
          Back To Calendar
        </button>
      </div>
      <div className="card" id="cal date container">
        <div style={{ display: 'grid', gridTemplateColumns: '10% 90%' }}>
          <div className="card-header" />
          <div className="card-header fullCenter">
            {month} {day}, {year}
          </div>
        </div>
        {hoursTimes.map((hour, index) => (
          <TimeBlock hour={index} />
        ))}
      </div>
    </div>

  );
}
