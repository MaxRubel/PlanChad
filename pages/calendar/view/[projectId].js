/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { useSaveContext } from '../../../utils/context/saveManager';
import { caretLeft, caretRight } from '../../../public/icons';
import chooseMonth from '../../../utils/chooseMonth';
import TaskModalForCalendar from '../../../components/modals/TaskModalForCal';

export default function CalendarPage() {
  const initialState = ([[], [], [], [], [], []]);
  const router = useRouter();
  const { projectId } = router.query;
  const { cancelSaveAnimation } = useSaveContext();
  const {
    saveInput, singleProjectRunning, loadProject, projectsLoaded,
  } = useSaveContext();
  const [sortedTasks, setSortedTasks] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const weeksArrays = useRef(initialState);
  const [calendarData, setCalendarData] = useState(
    {
      month: null,
      year: null,
      startingDay: null,
      totalDays: 35,
    },
  );

  useEffect(() => { // sort tasks on mount
    const tasks = [...saveInput.tasks];
    const filteredTasks = tasks
      .filter((item) => item.startDate || item.deadline)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setSortedTasks(filteredTasks);
    if (!singleProjectRunning && projectsLoaded) { // load the project if page refreshed
      loadProject(projectId);
    }
  }, [saveInput, projectsLoaded]);

  // LAYOUT CALENDAR
  useEffect(() => {
    weeksArrays.current = initialState;
    const userViewingDate = new Date();
    const currentYear = userViewingDate.getFullYear();
    const currentMonth = userViewingDate.getMonth();
    if (calendarData.month === null) { // set calendar to todays date if null
      setCalendarData((preVal) => ({ ...preVal, month: currentMonth }));
    }
    if (calendarData.year === null) {
      setCalendarData((preVal) => ({ ...preVal, year: currentYear }));
    }

    const startingDay = new Date(calendarData.year, calendarData.month, 1).getDay();
    const lastDateOfMonth = new Date(calendarData.year, calendarData.month + 1, 0).getDate();
    const lastDateOfPreviousMonth = new Date(calendarData.year, calendarData.month, 0).getDate();
    const date = new Date(calendarData.year, calendarData.month, 1);
    const firstBoxDate = new Date(date);
    firstBoxDate.setDate(1 - startingDay);
    const firstBoxNumber = firstBoxDate.getDate();
    const lastBox = new Date(calendarData.firstBoxDate);
    lastBox.setDate(firstBoxDate.getDate() + calendarData.totalBoxes);

    setCalendarData((preVal) => ({
      ...preVal, startingDay, lastDateOfMonth, lastDateOfPreviousMonth, firstBoxNumber, firstBoxDate, lastBox,
    }));

    const total = startingDay + lastDateOfMonth;
    const thisDaysDate = new Date(calendarData.firstBoxDate);
    const totalBoxes = total >= 36 ? 41 : 34;
    setCalendarData(((preVal) => ({ ...preVal, totalDays: total, totalBoxes })));

    // Print Date Numbers on Calendar
    for (let box = 0; box <= totalBoxes; box++) {
      const dateNumberAssign = document.getElementById(`${box}Num`);
      if (!dateNumberAssign) { return; }
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      dateNumberAssign.innerHTML = boxDate.getDate();
    }
  }, [calendarData.month, calendarData.totalDays, sortedTasks]);

  // Print Project Line
  useEffect(() => {
    if (calendarData.startingDay && saveInput.project?.projectId) {
      const [projStartYear, projStartMonth, projStartDay] = (saveInput.project.start_date ?? '').split('-');
      const [projEndYear, projEndMonth, projEndDay] = (saveInput.project.deadline ?? '').split('-');
      const projStartDate = saveInput.project.start_date ? new Date(projStartYear, projStartMonth - 1, projStartDay) : null;
      const projEndDate = saveInput.project.deadline ? new Date(projEndYear, projEndMonth - 1, projEndDay) : null;
      const thisDaysDate = new Date(calendarData.firstBoxDate);

      for (let box = 0; box <= calendarData.totalBoxes; box++) {
        const projectDiv = document.getElementById(`${box}BackG`);
        const messageBox = document.getElementById(`${box}ViewMoreMessage`);
        const element = document.getElementById(`${box}Task`);
        if (!projectDiv) { return; }
        if (!projEndDate && !projEndDate) { projectDiv.style.backgroundColor = 'transparent'; }
        if (!messageBox) { return; }
        if (!element) { return; }
        element.innerHTML = '';
        messageBox.innerHTML = '';
        const currentDate = new Date(thisDaysDate);
        currentDate.setDate(currentDate.getDate() + box);

        if (projStartDate && projEndDate) {
          if (currentDate >= projStartDate && currentDate <= projEndDate) {
            projectDiv.style.backgroundColor = 'rgb(35, 166, 213, .4)';
          } else {
            projectDiv.style.backgroundColor = 'transparent';
          }
        }
        if (projStartDate && !projEndDate) {
          if (projStartDate.getTime() === currentDate.getTime()) {
            projectDiv.style.backgroundColor = 'rgb(35, 166, 213)';
          } else {
            projectDiv.style.backgroundColor = 'transparent';
          }
        }
        if (!projStartDate && projEndDate) {
          if (projEndDate.getTime() === currentDate.getTime()) {
            projectDiv.style.backgroundColor = 'rgb(35, 166, 213)';
          } else {
            projectDiv.style.backgroundColor = 'transparent';
          }
        }
      }
    }
  }, [sortedTasks, calendarData.month, calendarData.firstBoxDate, calendarData.totalDays, calendarData.totalBoxes]);

  // Print Task Lines----------------------
  useEffect(() => {
    weeksArrays.current = initialState;
    if (openTaskModal) return;
    const findHeightIndex = (day, taskObj) => {
      const weeksArrayCopy = [...weeksArrays.current];
      const sortedTasksCopy = [...sortedTasks];

      // loop through each week array
      for (let week = 0; week < weeksArrayCopy.length; week++) {
        const loopThroughEachDayOfTheMonth = () => {
          if (day >= week * 7 && day <= (week + 1) * 7 - 1) {
            return true;
          }
          return false;
        };
        if (loopThroughEachDayOfTheMonth()) {
          const isObjectInArray = weeksArrayCopy[week].some((obj) => obj.localId === taskObj.localId);
          const taskToAdd = sortedTasksCopy.find((obj) => obj.localId === taskObj.localId);
          if (!isObjectInArray) {
            const filtered = weeksArrayCopy[week].filter((item) => {
              const entryStartDate = taskToAdd.startDate
                ? new Date(`${taskToAdd.startDate}T12:00:00`)
                : new Date(`${taskToAdd.deadline}T12:00:00`);
              const entryEndDate = taskToAdd.deadline
                ? new Date(`${taskToAdd.deadline}T12:00:00`)
                : new Date(`${taskToAdd.startDate}T12:00:00`);
              const itemStartDate = item.startDate
                ? new Date(`${item.startDate}T12:00:00`)
                : new Date(`${item.deadline}T12:00:00`);
              const itemEndDate = item.deadline
                ? new Date(`${item.deadline}T12:00:00`)
                : new Date(`${item.startDate}T12:00:00`);

              return (
                (itemStartDate <= entryEndDate
                  && itemEndDate >= entryStartDate
                  && item.localId !== taskObj.localId)
              );
            });
            const sorted = filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            const heightIndices = filtered.map((item) => item.heightIndex);
            let lowestAvailableIndex = 0;
            while (heightIndices.includes(lowestAvailableIndex)) {
              lowestAvailableIndex += 1;
            }

            taskToAdd.heightIndex = lowestAvailableIndex;
            weeksArrayCopy[week].push(taskToAdd);
            break;
          }
        }
      }
      weeksArrays.current = weeksArrayCopy;
    };

    const findHowManyInBox = (box) => {
      const copy = [...sortedTasks];
      const filteredArray = [];
      const thisDaysDate = new Date(calendarData.firstBoxDate);
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      const boxDateF = boxDate.getTime();
      for (let i = 0; i < copy.length; i++) {
        const thisTask = sortedTasks[i];
        const [taskStartYear, taskStartMonth, taskStartDay] = thisTask.startDate.split('-');
        const [taskEndYear, taskEndMonth, taskEndDay] = thisTask.deadline.split('-');
        const taskStartDate = thisTask.startDate ? new Date(taskStartYear, taskStartMonth - 1, taskStartDay).getTime() : null;
        const taskEndDate = thisTask.deadline ? new Date(taskEndYear, taskEndMonth - 1, taskEndDay).getTime() : null;
        if (taskStartDate && taskEndDate) {
          if (taskStartDate >= boxDateF && taskEndDate <= boxDateF) {
            filteredArray.push(thisTask);
          }
        } else if (taskStartDate && taskStartDate === boxDateF) {
          filteredArray.push(thisTask);
        } else if (taskEndDate && taskEndDate === boxDateF) {
          filteredArray.push(thisTask);
        }
      }
      return filteredArray.length;
    };

    // Draw Lines
    const drawLine = (box, string, task) => {
      findHeightIndex(box, task);
      console.log('drawing');
      const element = document.getElementById(`${box}Task`);
      const messageBox = document.getElementById(`${box}ViewMoreMessage`);
      const howManyInThisBox = findHowManyInBox(box);
      if (box === 9) { console.log('how many: ', howManyInThisBox); }
      if (!messageBox) { return; }
      if (!element) return;
      element.style.height = '100%';
      const lineDiv = document.createElement('div');
      const weekIndex = Math.floor(box / 7);
      const thisWeek = [...weeksArrays.current[weekIndex]];

      if (thisWeek.length === 0) return;
      const thisTask = thisWeek.find((item) => item.localId === task.localId);
      if (!thisTask) return;

      if (thisTask.heightIndex < 6) {
        lineDiv.style.backgroundColor = task.lineColor;
        lineDiv.setAttribute('id', `openTask--${task.localId}`);
        lineDiv.className = string;
        lineDiv.style.gridRow = `${String(thisTask.heightIndex)} / span 1`;
        element.appendChild(lineDiv);
        lineDiv.innerHTML = `
            <div id="openTask--${task.localId}"
            class="tooltip-container">
              <div class="tooltip-trigger"></div>
              <div class="tooltip-content">
                <div>${task.name ? task.name : `Task ${task.index + 1}`}</div>
                <div>${task.description ? task.description : ''}</div>
              </div>
            </div>
          `;
      }
      // else {
      //   const moreTasksCount = howManyInThisBox - 6;
      //   const viewMoreMessage = `
      //   +${moreTasksCount === 1 ? '1 more task...' : `${moreTasksCount} more tasks...`}
      //   `;
      //   messageBox.innerHTML = viewMoreMessage;
      //   messageBox.setAttribute('id', `viewMore--${box}`);
      // }
    };
    const thisDaysDate = new Date(calendarData.firstBoxDate);

    for (let box = 0; box < 42; box++) {
      const element = document.getElementById(`${box}Task`);
      const messageBox = document.getElementById(`${box}ViewMoreMessage`);
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      const boxDateF = boxDate.getTime();
      if (!element || !messageBox) { return; }
      messageBox.innerHTML = '';
      element.style.height = '100%';
      // element.style.gridTemplateRows = `repeat(${sortedTasks.length}, minmax(auto,8px));`;
      // element.style.height = `${sortedTasks.length * 1}px`;

      for (let i = 0; i < sortedTasks.length; i++) {
        const thisTask = sortedTasks[i];
        if (!thisTask) { return; }

        const [taskStartYear, taskStartMonth, taskStartDay] = thisTask.startDate.split('-');
        const [taskEndYear, taskEndMonth, taskEndDay] = thisTask.deadline.split('-');
        const taskStartDate = thisTask.startDate ? new Date(taskStartYear, taskStartMonth - 1, taskStartDay).getTime() : null;
        const taskEndDate = thisTask.deadline ? new Date(taskEndYear, taskEndMonth - 1, taskEndDay).getTime() : null;

        if (taskStartDate && taskEndDate) {
          if (taskStartDate === boxDateF) {
            drawLine(box, 'task-start-box', thisTask);
          }
          if (taskEndDate === boxDateF) {
            drawLine(box, 'task-deadline-box', thisTask);
          }
          if (
            boxDateF > taskStartDate
            && boxDateF < taskEndDate
          ) {
            drawLine(box, 'task-line', thisTask);
          }
        } else if (taskStartDate) {
          if (taskStartDate === boxDateF) {
            drawLine(box, 'task-line', thisTask);
          }
        } else if (taskEndDate) {
          if (taskEndDate === boxDateF) {
            drawLine(box, 'task-line', thisTask);
          }
        }
      }
    }
  }, [calendarData.month, saveInput, sortedTasks, openTaskModal]);

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

  const handleClick = (e) => {
    const { id } = e.target;
    if (id.includes('openTask')) {
      const [, taskId] = id.split('--');
      const taskObj = saveInput.tasks.find((item) => item.localId === taskId);
      setOpenTaskModal((preVal) => true);
      setTaskToView((preVal) => taskObj);
    }
  };

  const handleCloseModal = () => {
    setOpenTaskModal((preVal) => false);
  };

  return (
    <>
      <TaskModalForCalendar
        task={taskToView}
        show={openTaskModal}
        closeModal={handleCloseModal}
      />
      <div id="project-container" style={{ paddingBottom: '40vh' }}>
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
              year
            </div>
            <div id="col2" style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="button" id="decrementMonth" onClick={handleDateCounter} className="clearButton">
                {caretLeft}
              </button>
              <div style={{ width: '150px', textAlign: 'center' }}>{chooseMonth(calendarData.month)} &nbsp;{calendarData.year}</div>
              <button type="button" id="incrementMonth" onClick={handleDateCounter} className="clearButton">
                {caretRight}
              </button>
            </div>
            <div id="col3" style={{ textAlign: 'right' }}>
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
            onClick={handleClick}
          >
            <div id="week0" className="calendar-row" style={{ borderTop: '1px solid rgb(84, 84, 84)' }}>
              <div className="calendar-day" id="0" style={{ borderLeft: 'none' }}>
                <div id="0BackG"><div id="0Num" className="date-number" /></div>
                <div id="0Task" className="task-container" />
                <div id="0ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="1">
                <div id="1BackG"><div id="1Num" className="date-number" /></div>
                <div id="1Task" className="task-container" />
                <div id="1ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="2">
                <div id="2BackG"><div id="2Num" className="date-number" /></div>
                <div id="2Task" className="task-container" />
                <div id="2ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="3">
                <div id="3BackG"><div id="3Num" className="date-number" /></div>
                <div id="3Task" className="task-container" />
                <div id="3ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="4">
                <div id="4BackG"><div id="4Num" className="date-number" /></div>
                <div id="4Task" className="task-container" />
                <div id="4ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="5">
                <div id="5BackG"><div id="5Num" className="date-number" /></div>
                <div id="5Task" className="task-container" />
                <div id="5ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="6">
                <div id="6BackG"><div id="6Num" className="date-number" /></div>
                <div id="6Task" className="task-container" />
                <div id="6ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week1" className="calendar-row">
              <div className="calendar-day" id="7" style={{ borderLeft: 'none' }}>
                <div id="7BackG"><div id="7Num" className="date-number" /></div>
                <div id="7Task" className="task-container" />
                <div id="7ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="8">
                <div id="8BackG"><div id="8Num" className="date-number" /></div>
                <div id="8Task" className="task-container" />
                <div id="8ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="9">
                <div id="9BackG"><div id="9Num" className="date-number" /></div>
                <div id="9Task" className="task-container" />
                <div id="9ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="10">
                <div id="10BackG"><div id="10Num" className="date-number" /></div>
                <div id="10Task" className="task-container" />
                <div id="10ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="11">
                <div id="11BackG"><div id="11Num" className="date-number" /></div>
                <div id="11Task" className="task-container" />
                <div id="11ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="12">
                <div id="12BackG"><div id="12Num" className="date-number" /></div>
                <div id="12Task" className="task-container" />
                <div id="12ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="13">
                <div id="13BackG"><div id="13Num" className="date-number" /></div>
                <div id="13Task" className="task-container" />
                <div id="13ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week2" className="calendar-row">
              <div className="calendar-day" id="14" style={{ borderLeft: 'none' }}>
                <div id="14BackG"><div id="14Num" className="date-number" /></div>
                <div id="14Task" className="task-container" />
                <div id="14ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="15">
                <div id="15BackG"><div id="15Num" className="date-number" /></div>
                <div id="15Task" className="task-container" />
                <div id="15ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="16">
                <div id="16BackG"><div id="16Num" className="date-number" /></div>
                <div id="16Task" className="task-container" />
                <div id="16ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="17">
                <div id="17BackG"><div id="17Num" className="date-number" /></div>
                <div id="17Task" className="task-container" />
                <div id="17ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="18">
                <div id="18BackG"><div id="18Num" className="date-number" /></div>
                <div id="18Task" className="task-container" />
                <div id="18ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="19">
                <div id="19BackG"><div id="19Num" className="date-number" /></div>
                <div id="19Task" className="task-container" />
                <div id="19ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="20">
                <div id="20BackG"><div id="20Num" className="date-number" /></div>
                <div id="20Task" className="task-container" />
                <div id="20ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week3" className="calendar-row">
              <div className="calendar-day" id="21" style={{ borderLeft: 'none' }}>
                <div id="21BackG"><div id="21Num" className="date-number" /></div>
                <div id="21Task" className="task-container" />
                <div id="21ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="22">
                <div id="22BackG"><div id="22Num" className="date-number" /></div>
                <div id="22Task" className="task-container" />
                <div id="22ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="23">
                <div id="23BackG"><div id="23Num" className="date-number" /></div>
                <div id="23Task" className="task-container" />
                <div id="23ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="24">
                <div id="24BackG"><div id="24Num" className="date-number" /></div>
                <div id="24Task" className="task-container" />
                <div id="23ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="25">
                <div id="25BackG"><div id="25Num" className="date-number" /></div>
                <div id="25Task" className="task-container" />
                <div id="25ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="26">
                <div id="26BackG"><div id="26Num" className="date-number" /></div>
                <div id="26Task" className="task-container" />
                <div id="26ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="27">
                <div id="27BackG"><div id="27Num" className="date-number" /></div>
                <div id="27Task" className="task-container" />
                <div id="27ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week4" className="calendar-row">
              <div className="calendar-day" id="28" style={{ borderLeft: 'none' }}>
                <div id="28BackG"><div id="28Num" className="date-number" /></div>
                <div id="28Task" className="task-container" />
                <div id="28ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="29">
                <div id="29BackG"><div id="29Num" className="date-number" /></div>
                <div id="29Task" className="task-container" />
                <div id="29ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="30">
                <div id="30BackG"><div id="30Num" className="date-number" /></div>
                <div id="30Task" className="task-container" />
                <div id="30ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="31">
                <div id="31BackG"><div id="31Num" className="date-number" /></div>
                <div id="31Task" className="task-container" />
                <div id="31ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="32">
                <div id="32BackG"><div id="32Num" className="date-number" /></div>
                <div id="32Task" className="task-container" />
                <div id="32ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="33">
                <div id="33BackG"><div id="33Num" className="date-number" /></div>
                <div id="33Task" className="task-container" />
                <div id="33ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="34">
                <div id="34BackG"><div id="34Num" className="date-number" /></div>
                <div id="34Task" className="task-container" />
                <div id="34ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            {calendarData.totalDays >= 36 && (
              <div id="week5" className="calendar-row" style={{ borderBottom: 'none' }}>
                <div className="calendar-day" id="35" style={{ borderLeft: 'none' }}>
                  <div id="35BackG"><div id="35Num" className="date-number" /></div>
                  <div id="35Task" className="task-container" />
                  <div id="35ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="36">
                  <div id="36BackG"><div id="36Num" className="date-number" /></div>
                  <div id="36Task" className="task-container" />
                  <div id="36ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="37">
                  <div id="37BackG"><div id="37Num" className="date-number" /></div>
                  <div id="37Task" className="task-container" />
                  <div id="37ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="38">
                  <div id="38BackG"><div id="38Num" className="date-number" /></div>
                  <div id="38Task" className="task-container" />
                  <div id="38ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="39">
                  <div id="39BackG"><div id="39Num" className="date-number" /></div>
                  <div id="39Task" className="task-container" />
                  <div id="39ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="40">
                  <div id="40BackG"><div id="40Num" className="date-number" /></div>
                  <div id="40Task" className="task-container" />
                  <div id="40ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="41">
                  <div id="41BackG"><div id="41Num" className="date-number" /></div>
                  <div id="41Task" className="task-container" />
                  <div id="41ViewMoreMessage" className="viewMore" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
