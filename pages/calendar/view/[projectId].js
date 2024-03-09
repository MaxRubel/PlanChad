import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSaveContext } from '../../../utils/context/saveManager';
import { caretLeft, caretRight } from '../../../public/icons';
import chooseMonth from '../../../utils/chooseMonth';

export default function CalendarPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const { cancelSaveAnimation } = useSaveContext();
  const [calendarData, setCalendarData] = useState({ month: 2, totalDays: 35 });

  useLayoutEffect(() => {
    const startingDay = new Date(2024, calendarData.month, 1).getDay();
    const LastDateOfMonth = new Date(2024, calendarData.month + 1, 0).getDate();
    const lastDateOfPreviousMonth = new Date(2024, calendarData.month, 0).getDate();
    const startingDayOfPrevMonth = (lastDateOfPreviousMonth - startingDay + 1);
    setCalendarData((preVal) => ({ ...preVal, monthStartingDay: startingDay }));
    // console.log('starting day: ', startingDay);
    // console.log('last date of month: ', LastDateOfMonth);
    const total = startingDay + LastDateOfMonth;
    for (let y = 0; y <= startingDay; y++) { // before month
      const dateNumberAssign = document.getElementById(`${y}Num`);
      if (dateNumberAssign) {
        dateNumberAssign.innerHTML = startingDayOfPrevMonth + y;
      }
    }
    for (let i = startingDay; i < LastDateOfMonth + startingDay; i++) { // during month
      const dateNumberAssign = document.getElementById(`${i}Num`);
      if (dateNumberAssign) {
        dateNumberAssign.innerHTML = i - startingDay + 1;
      }
    }
    let x = 1;
    for (let z = LastDateOfMonth + startingDay; z <= 41; z++) {
      const dateNumberAssign = document.getElementById(`${z}Num`);
      if (dateNumberAssign) {
        dateNumberAssign.innerHTML = x;
        x += 1;
      }
    }
    setCalendarData(((preVal) => ({ ...preVal, totalDays: total })));
    // console.log('total squares: ', total);
  }, [calendarData.month, calendarData.totalDays]);

  const handleDateCounter = (e) => {
    const { id } = e.target;
    if (id === 'incrementMonth') {
      if (calendarData.month < 11) {
        setCalendarData((preVal) => ({ ...preVal, month: preVal.month + 1 }));
      }
    }
    if (id === 'decrementMonth') {
      if (calendarData.month > 0) {
        setCalendarData((preVal) => ({ ...preVal, month: preVal.month - 1 }));
      }
    }
  };

  return (
    <div id="project-container">
      <div id="project-top-bar" style={{ marginBottom: '1%' }}>
        <button
          id="backToProj"
          type="button"
          className="clearButton"
          style={{ color: 'rgb(200, 200, 200)' }}
          onClick={() => {
            cancelSaveAnimation();
            router.push(`/project/plan/${projectId}`);
          }}
        >
          Back to Project
        </button>
      </div>
      <div id="calendar-container">

        {/* ----------------header---------------------- */}
        <div id="calendar-header" className="verticalCenter">
          <div id="col1" style={{ display: 'flex' }}>
            <button type="button" id="decrementMonth" onClick={handleDateCounter} className="clearButton">
              {caretLeft}
            </button>
            <div style={{ width: '80px', textAlign: 'center' }}>{chooseMonth(calendarData.month)}</div>
            <button type="button" id="incrementMonth" onClick={handleDateCounter} className="clearButton">
              {caretRight}
            </button>
          </div>
          <div id="col2" style={{ textAlign: 'right' }}>
            <button type="button" className="clearButton" style={{ color: 'white' }}>
              Today
            </button>
          </div>
        </div>
        <div id="day-header">
          <div id="sun" className="day-label">Sunday</div>
          <div id="mon" className="day-label">Monday</div>
          <div id="tues" className="day-label">Tuesday</div>
          <div id="weds" className="day-label">Wednesday</div>
          <div id="thurs" className="day-label">Thursday</div>
          <div id="fri" className="day-label">Friday</div>
          <div id="sat" className="day-label">Saturday</div>
        </div>
        {/* ---------------dates-box---------------------------- */}
        <div
          id="dates-container"
          style={{ gridTemplateRows: calendarData.totalDays < 36 && 'repeat(5, 1fr)' }}
        >
          <div id="week0" className="calendar-row" style={{ borderTop: '1px solid rgb(84, 84, 84)' }}>
            <div className="calendar-day" id="0" style={{ borderLeft: 'none' }}>
              <div id="0Num">0</div>
            </div>
            <div className="calendar-day" id="1">
              <div id="1Num">1</div>
            </div>
            <div className="calendar-day" id="2">
              <div id="2Num">2</div>
            </div>
            <div className="calendar-day" id="3">
              <div id="3Num">3</div>
            </div>
            <div className="calendar-day" id="4">
              <div id="4Num">4</div>
            </div>
            <div className="calendar-day" id="5">
              <div id="5Num">5</div>
            </div>
            <div className="calendar-day" id="6">
              <div id="6Num">6</div>
            </div>
          </div>
          <div id="week1" className="calendar-row">
            <div className="calendar-day" id="7" style={{ borderLeft: 'none' }}>
              <div id="7Num">7</div>
            </div>
            <div className="calendar-day" id="8">
              <div id="8Num">8</div>
            </div>
            <div className="calendar-day" id="9">
              <div id="9Num">9</div>
            </div>
            <div className="calendar-day" id="10">
              <div id="10Num">10</div>
            </div>
            <div className="calendar-day" id="11">
              <div id="11Num">11</div>
            </div>
            <div className="calendar-day" id="12">
              <div id="12Num">12</div>
            </div>
            <div className="calendar-day" id="13">
              <div id="13Num">13</div>
            </div>
          </div>
          <div id="week2" className="calendar-row">
            <div className="calendar-day" id="14" style={{ borderLeft: 'none' }}>
              <div id="14Num">14</div>
            </div>
            <div className="calendar-day" id="15">
              <div id="15Num">15</div>
            </div>
            <div className="calendar-day" id="16">
              <div id="16Num">16</div>
            </div>
            <div className="calendar-day" id="17">
              <div id="17Num">17</div>
            </div>
            <div className="calendar-day" id="18">
              <div id="18Num">18</div>
            </div>
            <div className="calendar-day" id="19">
              <div id="19Num">19</div>
            </div>
            <div className="calendar-day" id="20">
              <div id="20Num">20</div>
            </div>
          </div>
          <div id="week3" className="calendar-row">
            <div className="calendar-day" id="21" style={{ borderLeft: 'none' }}>
              <div id="21Num">21</div>
            </div>
            <div className="calendar-day" id="22">
              <div id="22Num">22</div>
            </div>
            <div className="calendar-day" id="23">
              <div id="23Num">23</div>
            </div>
            <div className="calendar-day" id="24">
              <div id="24Num">24</div>
            </div>
            <div className="calendar-day" id="25">
              <div id="25Num">25</div>
            </div>
            <div className="calendar-day" id="26">
              <div id="26Num">26</div>
            </div>
            <div className="calendar-day" id="27">
              <div id="27Num">27</div>
            </div>
          </div>
          <div id="week4" className="calendar-row">
            <div className="calendar-day" id="28" style={{ borderLeft: 'none' }}>
              <div id="28Num">28</div>
            </div>
            <div className="calendar-day" id="29">
              <div id="29Num">29</div>
            </div>
            <div className="calendar-day" id="30">
              <div id="30Num">30</div>
            </div>
            <div className="calendar-day" id="31">
              <div id="31Num">31</div>
            </div>
            <div className="calendar-day" id="32">
              <div id="32Num">32</div>
            </div>
            <div className="calendar-day" id="33">
              <div id="33Num">33</div>
            </div>
            <div className="calendar-day" id="34">
              <div id="34Num">34</div>
            </div>
          </div>
          {calendarData.totalDays >= 36 && (
          <div id="week5" className="calendar-row" style={{ borderBottom: 'none' }}>
            <div className="calendar-day" id="35" style={{ borderLeft: 'none' }}>
              <div id="35Num">35</div>
            </div>
            <div className="calendar-day" id="36">
              <div id="36Num">36</div>
            </div>
            <div className="calendar-day" id="37">
              <div id="37Num">37</div>
            </div>
            <div className="calendar-day" id="38">
              <div id="38Num">38</div>
            </div>
            <div className="calendar-day" id="39">
              <div id="39Num">39</div>
            </div>
            <div className="calendar-day" id="40">
              <div id="40Num">40</div>
            </div>
            <div className="calendar-day" id="41">
              <div id="41Num">41</div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
