import { useRouter } from 'next/router';
import {
  useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore,
} from 'react';
import { useSaveContext } from '../../../utils/context/saveManager';
import { caretLeft, caretRight } from '../../../public/icons';
import chooseMonth from '../../../utils/chooseMonth';
import choseAColor from '../../../utils/chooseAcolor';

export default function CalendarPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const { cancelSaveAnimation } = useSaveContext();
  const { singleProjectRunning, saveInput } = useSaveContext();
  const projectStartBox = useRef(null);
  const projectDeadlineBox = useRef(null);
  const [lineArray, setLineArray] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [calendarData, setCalendarData] = useState(
    {
      month: null, year: null, startingDay: null, totalDays: 35,
    },
  );

  // LAYOUT CALENDAR
  useLayoutEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    if (calendarData.month === null) { // set calendar to todays date if null
      setCalendarData((preVal) => ({ ...preVal, month: currentMonth }));
    }
    if (calendarData.year === null) {
      setCalendarData((preVal) => ({ ...preVal, year: currentYear }));
    }
    const startingDay = new Date(calendarData.year, calendarData.month, 1).getDay();
    const lastDateOfMonth = new Date(calendarData.year, calendarData.month + 1, 0).getDate();
    const lastDateOfPreviousMonth = new Date(calendarData.year, calendarData.month, 0).getDate();
    const startingDayOfPrevMonth = (lastDateOfPreviousMonth - startingDay + 1);

    setCalendarData((preVal) => ({ ...preVal, startingDay }));

    const total = startingDay + lastDateOfMonth;

    // PRINT DATES ON CALENDAR
    for (let y = 0; y <= startingDay; y++) { // before month starts
      const dateNumberAssign = document.getElementById(`${y}Num`);
      if (dateNumberAssign) {
        dateNumberAssign.innerHTML = startingDayOfPrevMonth + y;
      }
    }
    for (let i = startingDay; i < lastDateOfMonth + startingDay; i++) { // during month
      const dateNumberAssign = document.getElementById(`${i}Num`);
      if (dateNumberAssign) {
        dateNumberAssign.innerHTML = i - startingDay + 1;
      }
    }
    let x = 1;
    for (let z = lastDateOfMonth + startingDay; z <= 41; z++) { // after month ends
      const dateNumberAssign = document.getElementById(`${z}Num`);
      if (dateNumberAssign) {
        dateNumberAssign.innerHTML = x;
        x += 1;
      }
    }
    setCalendarData(((preVal) => ({ ...preVal, totalDays: total })));
  }, [calendarData.month, calendarData.totalDays, saveInput]);

  // CALCULATE PROJECT LINE
  useEffect(() => {
    if (calendarData.startingDay && saveInput.project.projectId) {
      const [projStartYear, projStartMonth, projStartDay] = (saveInput.project.start_date ?? '').split('-');
      const [projDeadlineYear, projDeadlineMonth, projDeadlineDay] = (saveInput.project.deadline ?? '').split('-');
      const startingDay = new Date(calendarData.year, calendarData.month, 1).getDay();
      const projStartDayOnCal = (startingDay + Number(projStartDay) - 1);
      const projDeadlineDayOnCal = (startingDay + Number(projDeadlineDay) - 1);

      for (let i = 0; i < 41; i++) { // clear old colors
        const projectDiv = document.getElementById(`${i}Project`);
        if (projectDiv) {
          projectDiv.style.backgroundColor = 'transparent';
        }
      }

      // ----CLEAR-DAYS-WHEN-MONTH-CHANGES---
      if (projectStartBox.current) { // clear old start day box
        projectStartBox.current.innerHTML = '';
        projectStartBox.current.className = 'project-div';
        projectStartBox.current.style.backgroundColor = 'transparent';
        projectStartBox.current = null;
      }
      if (projectDeadlineBox.current) { // clear old deadline box
        projectDeadlineBox.current.innerHTML = '';
        projectDeadlineBox.current.className = 'project-div';
        projectDeadlineBox.current.style.backgroundColor = 'transparent';
        projectDeadlineBox.current = null;
      }
      // --------PROJECT-LINE-START--------
      const startElement = document.getElementById(`${projStartDayOnCal}Project`);
      // Put start day in correct month & year
      if (
        calendarData.month === Number(projStartMonth - 1)
        && calendarData.year === Number(projStartYear)) {
        startElement.style.backgroundColor = '#23a6d5';
        startElement.className = 'project-start-box';
        startElement.innerHTML = `${saveInput.project.name}`;
        projectStartBox.current = startElement;
        // If deadline day is in current month fill to deadline
        if (
          calendarData.month === Number(projDeadlineMonth - 1)) {
          for (let i = projStartDayOnCal; i < projDeadlineDayOnCal; i++) {
            document.getElementById(`${i}Project`).style.backgroundColor = '#23a6d5';
          }
          // Deadline is not in current month so just fill to the end of month
        } else if (saveInput.project.deadline) {
          for (let i = projStartDayOnCal; i <= 43; i++) {
            const element = document.getElementById(`${i}Project`);
            if (element) {
              element.style.backgroundColor = '#23a6d5';
            }
          }
        }
      }

      // ---------PROJECT-LINE-END-------
      if (calendarData.month === Number(projDeadlineMonth) - 1
        && calendarData.year === Number(projDeadlineYear)) { //  Put deadline in correct month & year
        const deadlineElement = document.getElementById(`${projDeadlineDayOnCal}Project`);
        projectDeadlineBox.current = deadlineElement;
        deadlineElement.style.backgroundColor = '#23a6d5';
        deadlineElement.innerHTML = `${saveInput.project.name} due`;
        deadlineElement.className = 'project-deadline-box';
        // If start date is not in current month fill all squares up to deadline
        if (calendarData.month !== Number(projStartMonth - 1)) {
          for (let i = 0; i < projDeadlineDayOnCal; i++) {
            document.getElementById(`${i}Project`).style.backgroundColor = '#23a6d5';
          }
        }
      }

      const fillWholeMonth = () => {
        for (let i = 0; i <= 41; i++) {
          const element = document.getElementById(`${i}Project`);
          if (element) {
            element.style.backgroundColor = '#23a6d5';
          }
        }
      };

      const projectYears = [Number(projStartYear)];
      for (let i = Number(projStartYear); i < Number(projDeadlineYear); i++) {
        const newYear = i + 1;
        projectYears.push(newYear);
      }

      // --------FILL-WHOLE-MONTH--------
      if (calendarData.year === Number(projStartYear)
        && calendarData.year === Number(projDeadlineYear)) { // project starts and ends in the same year
        if (calendarData.month > Number(projStartMonth - 1) // greater than start month
          && calendarData.month < Number(projDeadlineMonth - 1) // less than deadline month
        ) {
          fillWholeMonth();
        }
      } else if (saveInput.project.deadline) { // project does not start and end in the same year
        if (calendarData.year === projectYears[0] // the start year of project
          && calendarData.month > Number(projStartMonth - 1)) { // month is later than the starting month
          fillWholeMonth();
        }
        if (calendarData.year === projectYears[projectYears.length - 1] // the last year of project
          && calendarData.month < Number(projDeadlineMonth - 1)) { // month is earlier than the deadline month
          fillWholeMonth();
        }
        if (projectYears.includes(calendarData.year) // selected year is in project
          && calendarData.year !== Number(projStartYear) // it is not the start year
          && calendarData.year !== Number(projDeadlineYear)) { // it is also not the end year
          fillWholeMonth();
        }
      }
    }
  }, [calendarData.startingDay, saveInput, calendarData.month]);

  useEffect(() => { // sort tasks
    const tasks = [...saveInput.tasks];
    const filteredTasks = tasks.filter((item) => item.startDate || item.deadline);
    // const sortedByIndex = filteredTasks.sort((a, b) => a.index - b.index);
    // const sortedbyDate = sorted.sort((a, b) => {
    //   const startDateA = a.startDate;
    //   const startDateB = b.startDate;
    //   return startDateA.localeCompare(startDateB); // Compare dates as strings
    // });
    setSortedTasks((preVal) => filteredTasks);
  }, [saveInput]);

  // CACLULATE TASK LINES
  useLayoutEffect(() => {
    const drawLine = (i, y, string) => { // line algo
      const element = document.getElementById(`${i}Task`);
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', `${sortedTasks[y].name}-row${y}`);
      newDiv.className = (string);
      newDiv.style.gridRow = `${y + 1} / span 1`;
      element.appendChild(newDiv);
      newDiv.style.backgroundColor = sortedTasks[y].lineColor;
    };

    for (let i = 0; i < 43; i++) { // loop through each date box
      const element = document.getElementById(`${i}Task`);
      if (element) {
        element.innerHTML = '';
        element.style.backgroundColor = 'transparent';
        element.style.gridTemplateRows = `repeat(${sortedTasks.length}, 8px)`;
        element.style.height = `${sortedTasks.length * 1}px`;

        // loop through each task of task array and row
        for (let y = 0; y < sortedTasks.length; y++) {
          const [taskStartYear, taskStartMonth, taskStartDay] = (sortedTasks[y].startDate ?? '').split('-');
          const [taskDeadlineYear, taskDeadlineMonth, taskDeadlineDay] = (sortedTasks[y].deadline ?? '').split('-');
          const taskStartDayOnCal = (calendarData.startingDay + Number(taskStartDay) - 1);
          const taskDeadlineOnCal = (calendarData.startingDay + Number(taskDeadlineDay) - 1);

          // draw start day:
          if (calendarData.month === Number(taskStartMonth - 1)
            && calendarData.year === Number(taskStartYear)
            && taskStartDayOnCal === i) {
            drawLine(i, y, 'task-start-box');
          }

          // draw deadline day:
          if (sortedTasks[y].deadline) {
            if (
              calendarData.month === Number(taskDeadlineMonth - 1)
              && calendarData.year === Number(taskDeadlineYear)
              && taskDeadlineOnCal === i) {
              drawLine(i, y, 'task-deadline-box');
            }

            // fill to deadline if start is in the same month as deadline:
            if (
              calendarData.year === Number(taskDeadlineYear)
              && calendarData.year === Number(taskStartYear)
              && calendarData.month === Number(taskStartMonth - 1)
              && calendarData.month === Number(taskDeadlineMonth - 1)
              && (Number(taskStartDay) + (calendarData.startingDay - 1)) < i
              && (Number(taskDeadlineDay) + (calendarData.startingDay - 1)) > i
            ) { drawLine(i, y, 'task-line'); }

            // draw to end of first month if deadline in different month:
            if (
              taskDeadlineMonth
              && calendarData.year === Number(taskStartYear)
              && calendarData.month === Number(taskStartMonth - 1)
              && i > taskStartDayOnCal
              && taskStartMonth !== taskDeadlineMonth
            ) { drawLine(i, y, 'task-line'); }

            // draw to deadline if deadline in different month:
            if (
              taskDeadlineMonth
              && calendarData.year === Number(taskDeadlineYear)
              && calendarData.month === Number(taskDeadlineMonth - 1)
              && i < taskDeadlineOnCal
              && taskStartMonth !== taskDeadlineMonth

            ) { drawLine(i, y, 'task-line'); }

            // draw whole month if in the same year as deadline and between start and finish:
            if (
              calendarData.year === Number(taskDeadlineYear)
              && calendarData.year === Number(taskStartYear)
              && calendarData.month > Number(taskStartMonth - 1)
              && calendarData.month < Number(taskDeadlineMonth - 1)
            ) { drawLine(i, y, 'task-line'); }

            // if start and finish years are not the same!
            if (taskStartYear !== taskDeadlineYear) {
              const taskyears = [];
              for (let m = Number(taskStartYear); m <= Number(taskDeadlineYear); m++) {
                taskyears.push(m);
              }
              // fill remaining months of start year:
              if (
                calendarData.year === taskyears[0]
                && calendarData.month > Number(taskStartMonth - 1)
              ) { drawLine(i, y, 'task-line'); }
              // fill up to deadline of deadline year
              if (
                calendarData.year === taskyears[taskyears.length - 1]
                && calendarData.month < Number(taskDeadlineMonth - 1)
              ) { drawLine(i, y, 'task-line'); }
              // fill entire year if in between start and end years
              if (
                calendarData.year > taskyears[0]
                && calendarData.year < taskyears[taskyears.length - 1]
              ) { drawLine(i, y, 'task-line'); }
              // draw to end of first month if deadline in different month:
              if (
                taskDeadlineMonth
              && calendarData.year === Number(taskStartYear)
              && taskStartMonth === taskDeadlineMonth
              && calendarData.month === Number(taskStartMonth - 1)
              && i > taskStartDayOnCal
              ) { drawLine(i, y, 'task-line'); }
              if (
                taskDeadlineMonth
              && calendarData.year === Number(taskDeadlineYear)
              && taskStartMonth === taskDeadlineMonth
              && calendarData.month === Number(taskDeadlineMonth - 1)
              && i < taskDeadlineOnCal
              ) { drawLine(i, y, 'task-line'); }
            }
          }
        }
      }
    }
  }, [calendarData]);

  const handleDateCounter = (e) => {
    const { id } = e.target;
    if (id === 'incrementMonth') {
      if (calendarData.month < 11) {
        setCalendarData((preVal) => ({ ...preVal, month: preVal.month + 1 }));
      } else {
        setCalendarData((preVal) => ({ ...preVal, month: 0, year: preVal.year + 1 }));
      }
    }
    if (id === 'decrementMonth') {
      if (calendarData.month > 0) {
        setCalendarData((preVal) => ({ ...preVal, month: preVal.month - 1 }));
      } else {
        setCalendarData((preVal) => ({ ...preVal, month: 11, year: preVal.year - 1 }));
      }
    }
  };

  const handleToday = () => {
    setCalendarData((preVal) => ({ ...preVal, month: null, year: null }));
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
            <div style={{ width: '150px', textAlign: 'center' }}>{chooseMonth(calendarData.month)} &nbsp;{calendarData.year}</div>
            <button type="button" id="incrementMonth" onClick={handleDateCounter} className="clearButton">
              {caretRight}
            </button>
          </div>
          <div id="col2" style={{ textAlign: 'right' }}>
            <button type="button" className="clearButton" style={{ color: 'white', padding: '8px', border: '1px solid rgb(84, 84, 84)' }} onClick={handleToday}>
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
              <div id="0Num" className="date-number" />
              <div id="0Project" className="project-div" />
              <div id="0CheckP" className="checkP-div" />
              <div id="0Task" className="task-container" />
            </div>
            <div className="calendar-day" id="1">
              <div id="1Num" className="date-number" />
              <div id="1Project" className="project-div" />
              <div id="1CheckP" className="checkP-div" />
              <div id="1Task" className="task-container" />
            </div>
            <div className="calendar-day" id="2">
              <div id="2Num" className="date-number" />
              <div id="2Project" className="project-div" />
              <div id="2CheckP" className="checkP-div" />
              <div id="2Task" className="task-container" />
            </div>
            <div className="calendar-day" id="3">
              <div id="3Num" className="date-number" />
              <div id="3Project" className="project-div" />
              <div id="3CheckP" className="checkP-div" />
              <div id="3Task" className="task-container" />
            </div>
            <div className="calendar-day" id="4">
              <div id="4Num" className="date-number" />
              <div id="4Project" className="project-div" />
              <div id="4CheckP" className="checkP-div" />
              <div id="4Task" className="task-container" />
            </div>
            <div className="calendar-day" id="5">
              <div id="5Num" className="date-number" />
              <div id="5Project" className="project-div" />
              <div id="5CheckP" className="checkP-div" />
              <div id="5Task" className="task-container" />
            </div>
            <div className="calendar-day" id="6">
              <div id="6Num" className="date-number" />
              <div id="6Project" className="project-div" />
              <div id="6CheckP" className="checkP-div" />
              <div id="6Task" className="task-container" />
            </div>
          </div>
          <div id="week1" className="calendar-row">
            <div className="calendar-day" id="7" style={{ borderLeft: 'none' }}>
              <div id="7Num" className="date-number" />
              <div id="7Project" className="project-div" />
              <div id="7CheckP" className="checkP-div" />
              <div id="7Task" className="task-container" />
            </div>
            <div className="calendar-day" id="8">
              <div id="8Num" className="date-number" />
              <div id="8Project" className="project-div" />
              <div id="8CheckP" className="checkP-div" />
              <div id="8Task" className="task-container" />
            </div>
            <div className="calendar-day" id="9">
              <div id="9Num" className="date-number" />
              <div id="9Project" className="project-div" />
              <div id="9CheckP" className="checkP-div" />
              <div id="9Task" className="task-container" />
            </div>
            <div className="calendar-day" id="10">
              <div id="10Num" className="date-number" />
              <div id="10Project" className="project-div" />
              <div id="10CheckP" className="checkP-div" />
              <div id="10Task" className="task-container" />
            </div>
            <div className="calendar-day" id="11">
              <div id="11Num" className="date-number" />
              <div id="11Project" className="project-div" />
              <div id="11CheckP" className="checkP-div" />
              <div id="11Task" className="task-container" />
            </div>
            <div className="calendar-day" id="12">
              <div id="12Num" className="date-number" />
              <div id="12Project" className="project-div" />
              <div id="12CheckP" className="checkP-div" />
              <div id="12Task" className="task-container" />
            </div>
            <div className="calendar-day" id="13">
              <div id="13Num" className="date-number" />
              <div id="13Project" className="project-div" />
              <div id="13CheckP" className="checkP-div" />
              <div id="13Task" className="task-container" />
            </div>
          </div>
          <div id="week2" className="calendar-row">
            <div className="calendar-day" id="14" style={{ borderLeft: 'none' }}>
              <div id="14Num" className="date-number" />
              <div id="14Project" className="project-div" />
              <div id="14CheckP" className="checkP-div" />
              <div id="14Task" className="task-container" />
            </div>
            <div className="calendar-day" id="15">
              <div id="15Num" className="date-number" />
              <div id="15Project" className="project-div" />
              <div id="15CheckP" className="checkP-div" />
              <div id="15Task" className="task-container" />
            </div>
            <div className="calendar-day" id="16">
              <div id="16Num" className="date-number" />
              <div id="16Project" className="project-div" />
              <div id="16CheckP" className="checkP-div" />
              <div id="16Task" className="task-container" />
            </div>
            <div className="calendar-day" id="17">
              <div id="17Num" className="date-number" />
              <div id="17Project" className="project-div" />
              <div id="17CheckP" className="checkP-div" />
              <div id="17Task" className="task-container" />
            </div>
            <div className="calendar-day" id="18">
              <div id="18Num" className="date-number" />
              <div id="18Project" className="project-div" />
              <div id="18CheckP" className="checkP-div" />
              <div id="18Task" className="task-container" />
            </div>
            <div className="calendar-day" id="19">
              <div id="19Num" className="date-number" />
              <div id="19Project" className="project-div" />
              <div id="19CheckP" className="checkP-div" />
              <div id="19Task" className="task-container" />
            </div>
            <div className="calendar-day" id="20">
              <div id="20Num" className="date-number" />
              <div id="20Project" className="project-div" />
              <div id="20CheckP" className="checkP-div" />
              <div id="20Task" className="task-container" />
            </div>
          </div>
          <div id="week3" className="calendar-row">
            <div className="calendar-day" id="21" style={{ borderLeft: 'none' }}>
              <div id="21Num" className="date-number" />
              <div id="21Project" className="project-div" />
              <div id="21CheckP" className="checkP-div" />
              <div id="21Task" className="task-container" />
            </div>
            <div className="calendar-day" id="22">
              <div id="22Num" className="date-number" />
              <div id="22Project" className="project-div" />
              <div id="22CheckP" className="checkP-div" />
              <div id="22Task" className="task-container" />
            </div>
            <div className="calendar-day" id="23">
              <div id="23Num" className="date-number" />
              <div id="23Project" className="project-div" />
              <div id="23CheckP" className="checkP-div" />
              <div id="23Task" className="task-container" />
            </div>
            <div className="calendar-day" id="24">
              <div id="24Num" className="date-number" />
              <div id="24Project" className="project-div" />
              <div id="24CheckP" className="checkP-div" />
              <div id="24Task" className="task-container" />
            </div>
            <div className="calendar-day" id="25">
              <div id="25Num" className="date-number" />
              <div id="25Project" className="project-div" />
              <div id="25CheckP" className="checkP-div" />
              <div id="25Task" className="task-container" />
            </div>
            <div className="calendar-day" id="26">
              <div id="26Num" className="date-number" />
              <div id="26Project" className="project-div" />
              <div id="26CheckP" className="checkP-div" />
              <div id="26Task" className="task-container" />
            </div>
            <div className="calendar-day" id="27">
              <div id="27Num" className="date-number" />
              <div id="27Project" className="project-div" />
              <div id="27CheckP" className="checkP-div" />
              <div id="27Task" className="task-container" />
            </div>
          </div>
          <div id="week4" className="calendar-row">
            <div className="calendar-day" id="28" style={{ borderLeft: 'none' }}>
              <div id="28Num" className="date-number" />
              <div id="28Project" className="project-div" />
              <div id="28CheckP" className="checkP-div" />
              <div id="28Task" className="task-container" />
            </div>
            <div className="calendar-day" id="29">
              <div id="29Num" className="date-number" />
              <div id="29Project" className="project-div" />
              <div id="29CheckP" className="checkP-div" />
              <div id="29Task" className="task-container" />
            </div>
            <div className="calendar-day" id="30">
              <div id="30Num" className="date-number" />
              <div id="30Project" className="project-div" />
              <div id="30CheckP" className="checkP-div" />
              <div id="30Task" className="task-container" />
            </div>
            <div className="calendar-day" id="31">
              <div id="31Num" className="date-number" />
              <div id="31Project" className="project-div" />
              <div id="31CheckP" className="checkP-div" />
              <div id="31Task" className="task-container" />
            </div>
            <div className="calendar-day" id="32">
              <div id="32Num" className="date-number" />
              <div id="32Project" className="project-div" />
              <div id="32CheckP" className="checkP-div" />
              <div id="32Task" className="task-container" />
            </div>
            <div className="calendar-day" id="33">
              <div id="33Num" className="date-number" />
              <div id="33Project" className="project-div" />
              <div id="33CheckP" className="checkP-div" />
              <div id="33Task" className="task-container" />
            </div>
            <div className="calendar-day" id="34">
              <div id="34Num" className="date-number" />
              <div id="34Project" className="project-div" />
              <div id="34CheckP" className="checkP-div" />
              <div id="34Task" className="task-container" />
            </div>
          </div>
          {calendarData.totalDays >= 36 && (
            <div id="week5" className="calendar-row" style={{ borderBottom: 'none' }}>
              <div className="calendar-day" id="35" style={{ borderLeft: 'none' }}>
                <div id="35Num" className="date-number" />
                <div id="35Project" className="project-div" />
                <div id="35CheckP" className="checkP-div" />
                <div id="35Task" className="task-container" />
              </div>
              <div className="calendar-day" id="36">
                <div id="36Num" className="date-number" />
                <div id="36Project" className="project-div" />
                <div id="36CheckP" className="checkP-div" />
                <div id="36Task" className="task-container" />
              </div>
              <div className="calendar-day" id="37">
                <div id="37Num" className="date-number" />
                <div id="37Project" className="project-div" />
                <div id="37CheckP" className="checkP-div" />
                <div id="37Task" className="task-container" />
              </div>
              <div className="calendar-day" id="38">
                <div id="38Num" className="date-number" />
                <div id="38Project" className="project-div" />
                <div id="38CheckP" className="checkP-div" />
                <div id="38Task" className="task-container" />
              </div>
              <div className="calendar-day" id="39">
                <div id="39Num" className="date-number" />
                <div id="39Project" className="project-div" />
                <div id="39CheckP" className="checkP-div" />
                <div id="39Task" className="task-container" />
              </div>
              <div className="calendar-day" id="40">
                <div id="40Num" className="date-number" />
                <div id="40Project" className="project-div" />
                <div id="40CheckP" className="checkP-div" />
                <div id="40Task" className="task-container" />
              </div>
              <div className="calendar-day" id="41">
                <div id="41Num" className="date-number" />
                <div id="41Project" className="project-div" />
                <div id="41CheckP" className="checkP-div" />
                <div id="41Task" className="task-container" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
