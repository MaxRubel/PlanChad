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
import SegmentModalForCal from '../../../components/modals/SegmentModalForCal';
import useSaveStore from '../../../utils/stores/saveStore';

export default function CalendarPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const { cancelSaveAnimation } = useSaveContext();
  const [sortedTasks, setSortedTasks] = useState([]);
  const [sortedCheckpoints, setSortedCheckpoints] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openSegmentModal, setOpenSegmentModal] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const [segmentToView, setSegmentToView] = useState(null);
  const storedTasks = useSaveStore((state) => state.tasks);
  const storedCheckpoints = useSaveStore((state) => state.checkpoints);
  const storedProject = useSaveStore((state) => state.project);
  const sendToServer = useSaveStore((state) => state.sendToServer);
  const singleProjectRunning = useSaveStore((state) => state.singleProjectRunning);
  const loadASingleProject = useSaveStore((state) => state.loadASingleProject);
  const projectsLoaded = useSaveStore((state) => state.projectsLoaded);
  const [calendarData, setCalendarData] = useState(
    {
      month: null,
      year: null,
      startingDay: null,
      totalDays: 35,
    },
  );

  useEffect(() => { // sort tasks on mount
    if (!singleProjectRunning && projectsLoaded) { // load the project if page refreshed
      loadASingleProject(projectId);
    }
    sendToServer();
    const filteredTasks = storedTasks
      .filter((item) => item.startDate || item.deadline)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const filteredCheckpoints = storedCheckpoints.filter((item) => item.startDate || item.deadline)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setSortedTasks(filteredTasks);
    setSortedCheckpoints(filteredCheckpoints);
  }, [projectsLoaded, storedTasks, storedCheckpoints]);

  // LAYOUT CALENDAR
  useEffect(() => {
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
    if (openTaskModal) { return; }
    if (calendarData.startingDay && storedProject?.projectId) {
      const [projStartYear, projStartMonth, projStartDay] = (storedProject.start_date ?? '').split('-');
      const [projEndYear, projEndMonth, projEndDay] = (storedProject.deadline ?? '').split('-');
      const projStartDate = storedProject.start_date ? new Date(projStartYear, projStartMonth - 1, projStartDay) : null;
      const projEndDate = storedProject.deadline ? new Date(projEndYear, projEndMonth - 1, projEndDay) : null;
      const thisDaysDate = new Date(calendarData.firstBoxDate);

      for (let box = 0; box <= calendarData.totalBoxes; box++) {
        const projectDiv = document.getElementById(`${box}BackG`);
        if (!projectDiv) { return; }
        if (!projEndDate && !projEndDate) { projectDiv.style.backgroundColor = 'transparent'; }

        const currentDate = new Date(thisDaysDate);
        currentDate.setDate(currentDate.getDate() + box);

        if (projStartDate && projEndDate) {
          if (currentDate >= projStartDate && currentDate <= projEndDate) {
            projectDiv.style.backgroundColor = 'rgb(35, 166, 213, .6)';
          } else {
            projectDiv.style.backgroundColor = 'transparent';
          }
        }
        if (projStartDate && !projEndDate) {
          if (projStartDate.getTime() === currentDate.getTime()) {
            projectDiv.style.backgroundColor = 'rgb(35, 166, 213, .6)';
          } else {
            projectDiv.style.backgroundColor = 'transparent';
          }
        }
        if (!projStartDate && projEndDate) {
          if (projEndDate.getTime() === currentDate.getTime()) {
            projectDiv.style.backgroundColor = 'rgb(35, 166, 213, .6)';
          } else {
            projectDiv.style.backgroundColor = 'transparent';
          }
        }
      }
    }
  }, [sortedTasks, openTaskModal, calendarData.month, calendarData.totalBoxes]);

  // Print Task Lines----------------------
  useEffect(() => {
    if (openTaskModal) return;

    const thisBoxArray = (box) => {
      const copy = [...sortedTasks];
      const dayArray = [];
      const thisDaysDate = new Date(calendarData.firstBoxDate);
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      const boxDateF = boxDate.getTime();

      for (let i = 0; i < copy.length; i++) {
        const thisTask = copy[i];
        const [taskStartYear, taskStartMonth, taskStartDay] = thisTask.startDate.split('-');
        const [taskEndYear, taskEndMonth, taskEndDay] = thisTask.deadline.split('-');
        const taskStartDate = thisTask.startDate ? new Date(taskStartYear, taskStartMonth - 1, taskStartDay).getTime() : null;
        const taskEndDate = thisTask.deadline ? new Date(taskEndYear, taskEndMonth - 1, taskEndDay).getTime() : null;

        if (taskEndDate && taskStartDate) {
          if (boxDateF >= taskStartDate && boxDateF <= taskEndDate) {
            dayArray.push({ ...thisTask });
          }
        } else if (boxDateF === taskStartDate || boxDateF === taskEndDate) {
          dayArray.push({ ...thisTask });
        }
      }

      for (let x = 0; x < dayArray.length; x++) {
        dayArray[x].heightIndex = x;
      }
      return dayArray;
    };

    // Draw Lines
    const drawLine = (box, string, task) => {
      const howManyInThisBox = thisBoxArray(box).length;
      const taskContainer = document.getElementById(`${box}Task`);
      const viewMoreDiv = document.getElementById(`${box}ViewMoreMessage`);
      if (!viewMoreDiv) { return; }
      if (!taskContainer || !viewMoreDiv) return;

      const lineDiv = document.createElement('div');
      const thisDay = thisBoxArray(box);

      const thisTask = thisDay.find((item) => item.localId === task.localId);
      const thisTaskCopy = { ...thisTask };
      if (!thisTask) return;
      if (thisTaskCopy.heightIndex < 5) {
        lineDiv.style.backgroundColor = thisTaskCopy.lineColor;
        lineDiv.setAttribute('id', `openTask--${thisTaskCopy.localId}`);
        lineDiv.className = 'task-line';
        lineDiv.style.gridRow = `${String(thisTaskCopy.heightIndex + 1)}`;
        if (thisTaskCopy.name.length > 14) {
          const shortenedName = `${thisTaskCopy.name.substring(0, 14)}...`;
          lineDiv.innerText = `${thisTask.name ? shortenedName : `Task: ${thisTask.index + 1}`}`;
        } else {
          lineDiv.innerText = `${thisTask.name ? thisTask.name : `Task: ${thisTask.index + 1}`}`;
        }

        taskContainer.appendChild(lineDiv);
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltiptext';
        tooltipDiv.innerHTML = `
        <div>
        <div>${thisTask.name ? thisTask.name : `Task ${thisTask.index + 1}`}</div>
        <div>${thisTask.description}</div>
        </div>
        `;
        lineDiv.appendChild(tooltipDiv);
        lineDiv.appendChild(tooltipDiv);
      } else {
        const moreTasksCount = howManyInThisBox - 5;
        const viewMoreMessage = `
        +${moreTasksCount === 1 ? '1 more task...' : `${moreTasksCount} more tasks...`}
        `;
        viewMoreDiv.innerHTML = viewMoreMessage;
        viewMoreDiv.className = 'viewMore';
      }
    };

    const thisDaysDate = new Date(calendarData.firstBoxDate);

    for (let box = 0; box < 42; box++) {
      const viewMoreDiv = document.getElementById(`${box}ViewMoreMessage`);
      const element = document.getElementById(`${box}Task`);
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      const boxDateF = boxDate.getTime();

      if (!element || !viewMoreDiv) { return; }
      viewMoreDiv.innerHTML = '';
      element.innerHTML = '';
      element.style.gridTemplateRows = `repeat(${sortedTasks.length}, minmax(auto,15px));`;
      element.style.height = '100%';

      for (let i = 0; i < sortedTasks.length; i++) {
        const thisTask = sortedTasks[i];
        if (!thisTask) { return; }

        const [taskStartYear, taskStartMonth, taskStartDay] = thisTask.startDate.split('-');
        const [taskEndYear, taskEndMonth, taskEndDay] = thisTask.deadline.split('-');
        const taskStartDate = thisTask.startDate ? new Date(taskStartYear, taskStartMonth - 1, taskStartDay).getTime() : null;
        const taskEndDate = thisTask.deadline ? new Date(taskEndYear, taskEndMonth - 1, taskEndDay).getTime() : null;

        if (taskStartDate && taskEndDate) {
          if (taskStartDate === taskEndDate && taskStartDate === boxDateF) {
            drawLine(box, 'task-line', thisTask);
          } else if (taskStartDate === boxDateF) {
            drawLine(box, 'task-start-box', thisTask);
          } else if (taskEndDate === boxDateF) {
            drawLine(box, 'task-deadline-box', thisTask);
          } else if (
            boxDateF > taskStartDate
            && boxDateF < taskEndDate
          ) {
            drawLine(box, 'task-line', thisTask);
          }
        } else if (taskStartDate === boxDateF) {
          drawLine(box, 'task-line', thisTask);
        } else if (taskEndDate === boxDateF) {
          drawLine(box, 'task-line', thisTask);
        }
      }
    }
  }, [calendarData, sortedTasks, openTaskModal, openTaskModal]);

  // Print Checkpoint Lines--------------------
  useEffect(() => {
    if (openSegmentModal) { return; }
    const thisBoxArray = (box) => {
      const copy = [...sortedCheckpoints];
      const dayArray = [];
      const thisDaysDate = new Date(calendarData.firstBoxDate);
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      const boxDateF = boxDate.getTime();

      for (let i = 0; i < copy.length; i++) {
        const thisSegment = copy[i];
        const [SegmentStartYear, SegmentStartMonth, SegmentStartDay] = thisSegment.startDate.split('-');
        const [SegmentEndYear, SegmentEndMonth, SegmentEndDay] = thisSegment.deadline.split('-');
        const SegmentStartDate = thisSegment.startDate ? new Date(SegmentStartYear, SegmentStartMonth - 1, SegmentStartDay).getTime() : null;
        const SegmentEndDate = thisSegment.deadline ? new Date(SegmentEndYear, SegmentEndMonth - 1, SegmentEndDay).getTime() : null;

        if (SegmentEndDate && SegmentStartDate) {
          if (boxDateF >= SegmentStartDate && boxDateF <= SegmentEndDate) {
            dayArray.push({ ...thisSegment });
          }
        } else if (boxDateF === SegmentStartDate || boxDateF === SegmentEndDate) {
          dayArray.push({ ...thisSegment });
        }
      }

      for (let x = 0; x < dayArray.length; x++) {
        dayArray[x].heightIndex = x;
      }
      return dayArray;
    };

    // Draw Lines
    const drawLine = (box, segment) => {
      const howManyInThisBox = thisBoxArray(box).length;
      const segmentContainer = document.getElementById(`${box}Seg`);
      const viewMoreDiv = document.getElementById(`${box}ViewSegments`);
      if (!viewMoreDiv) { return; }
      if (!segmentContainer || !viewMoreDiv) return;

      const lineDiv = document.createElement('div');
      const thisDay = thisBoxArray(box);
      const thisSegment = thisDay.find((item) => item.localId === segment.localId);
      if (!thisSegment) return;
      if (thisSegment.heightIndex < 3) {
        lineDiv.style.backgroundColor = segment.lineColor;
        lineDiv.setAttribute('id', `openSegment--${segment.localId}`);
        lineDiv.className = 'segment-line';
        lineDiv.style.gridRow = `${String(thisSegment.heightIndex + 1)}`;
        segmentContainer.appendChild(lineDiv);
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltiptext';
        tooltipDiv.innerHTML = `
        <div>
          <div>${thisSegment.name ? thisSegment.name : `Phase ${thisSegment.index + 1}`}</div>
          <div>${thisSegment.description}</div>
        </div>
        `;
        lineDiv.appendChild(tooltipDiv);
      } else {
        const moreTasksCount = howManyInThisBox - 3;
        const viewMoreMessage = `
        +${moreTasksCount === 1 ? '1 seg...' : `${moreTasksCount} segs...`}
        `;
        viewMoreDiv.innerHTML = viewMoreMessage;
        viewMoreDiv.className = 'viewMoreSegments';
      }
    };
    const thisDaysDate = new Date(calendarData.firstBoxDate);

    for (let box = 0; box < 42; box++) {
      const element = document.getElementById(`${box}Seg`);
      const viewMoreSegs = document.getElementById(`${box}ViewSegments`);
      const boxDate = new Date(thisDaysDate);
      boxDate.setDate(boxDate.getDate() + box);
      const boxDateF = boxDate.getTime();

      if (!element || !viewMoreSegs) { return; }
      element.innerHTML = '';
      viewMoreSegs.innerHTML = '';
      element.style.height = '100%';

      for (let i = 0; i < sortedCheckpoints.length; i++) {
        const copy = [...sortedCheckpoints];
        const thisSegment = copy[i];

        if (!thisSegment) { return; }

        const [SegmentStartYear, SegmentStartMonth, SegmentStartDay] = thisSegment.startDate.split('-');
        const [SegmentEndYear, SegmentEndMonth, SegmentEndDay] = thisSegment.deadline.split('-');
        const SegmentStartDate = thisSegment.startDate ? new Date(SegmentStartYear, SegmentStartMonth - 1, SegmentStartDay).getTime() : null;
        const SegmentEndDate = thisSegment.deadline ? new Date(SegmentEndYear, SegmentEndMonth - 1, SegmentEndDay).getTime() : null;

        if (SegmentStartDate && SegmentEndDate) {
          if (SegmentStartDate === SegmentEndDate && SegmentStartDate === boxDateF) {
            drawLine(box, thisSegment);
          } else if (SegmentStartDate === boxDateF) {
            drawLine(box, thisSegment);
          } else if (SegmentEndDate === boxDateF) {
            drawLine(box, thisSegment);
          } else if (
            boxDateF > SegmentStartDate
            && boxDateF < SegmentEndDate
          ) {
            drawLine(box, thisSegment);
          }
        } else if (SegmentStartDate === boxDateF) {
          drawLine(box, thisSegment);
        } else if (SegmentEndDate === boxDateF) {
          drawLine(box, thisSegment);
        }
      }
    }
  }, [calendarData, storedCheckpoints, openSegmentModal]);

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
      const taskObj = storedTasks.find((item) => item.localId === taskId);
      setOpenTaskModal((preVal) => true);
      setTaskToView((preVal) => taskObj);
    }
    if (id.includes('openSegment')) {
      const [, segmentId] = id.split('--');
      const segmentObj = storedCheckpoints.find((item) => item.localId === segmentId);
      setOpenSegmentModal((preVal) => true);
      setSegmentToView(segmentObj);
    }
  };

  const handleCloseModal = () => {
    setOpenTaskModal((preVal) => false);
  };
  const handleCloseSegModal = () => {
    setOpenSegmentModal((preVal) => false);
  };

  return (
    <>
      <TaskModalForCalendar
        task={taskToView}
        show={openTaskModal}
        closeModal={handleCloseModal}
      />
      <SegmentModalForCal
        segment={segmentToView}
        show={openSegmentModal}
        closeModal={handleCloseSegModal}
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
            <div id="col1" style={{ display: 'flex' }} />
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
                <div id="0BackG" className="number-header">
                  <div id="0Num" className="date-number" />
                  <div id="0ViewSegments" />
                </div>
                <div id="0Seg" className="segment-container" />
                <div id="0Task" className="task-container" />
                <div id="0ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="1">
                <div id="1BackG" className="number-header">
                  <div id="1Num" className="date-number" />
                  <div id="1ViewSegments" />
                </div>
                <div id="1Seg" className="segment-container" />
                <div id="1Task" className="task-container" />
                <div id="1ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="2">
                <div id="2BackG" className="number-header">
                  <div id="2Num" className="date-number" />
                  <div id="2ViewSegments" />
                </div>
                <div id="2Seg" className="segment-container" />
                <div id="2Task" className="task-container" />
                <div id="2ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="3">
                <div id="3BackG" className="number-header">
                  <div id="3Num" className="date-number" />
                  <div id="3ViewSegments" />
                </div>
                <div id="3Seg" className="segment-container" />
                <div id="3Task" className="task-container" />
                <div id="3ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="4">
                <div id="4BackG" className="number-header">
                  <div id="4Num" className="date-number" />
                  <div id="4ViewSegments" />
                </div>
                <div id="4Seg" className="segment-container" />
                <div id="4Task" className="task-container" />
                <div id="4ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="5">
                <div id="5BackG" className="number-header">
                  <div id="5Num" className="date-number" />
                  <div id="5ViewSegments" />
                </div>
                <div id="5Seg" className="segment-container" />
                <div id="5Task" className="task-container" />
                <div id="5ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="6">
                <div id="6BackG" className="number-header">
                  <div id="6Num" className="date-number" />
                  <div id="6ViewSegments" />
                </div>
                <div id="6Seg" className="segment-container" />
                <div id="6Task" className="task-container" />
                <div id="6ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week1" className="calendar-row">
              <div className="calendar-day" id="7" style={{ borderLeft: 'none' }}>
                <div id="7BackG" className="number-header">
                  <div id="7Num" className="date-number" />
                  <div id="7ViewSegments" />
                </div>
                <div id="7Seg" className="segment-container" />
                <div id="7Task" className="task-container" />
                <div id="7ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="8">
                <div id="8BackG" className="number-header">
                  <div id="8Num" className="date-number" />
                  <div id="8ViewSegments" />
                </div>
                <div id="8Seg" className="segment-container" />
                <div id="8Task" className="task-container" />
                <div id="8ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="9">
                <div id="9BackG" className="number-header">
                  <div id="9Num" className="date-number" />
                  <div id="9ViewSegments" />
                </div>
                <div id="9Seg" className="segment-container" />
                <div id="9Task" className="task-container" />
                <div id="9ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="10">
                <div id="10BackG" className="number-header">
                  <div id="10Num" className="date-number" />
                  <div id="10ViewSegments" />
                </div>
                <div id="10Seg" className="segment-container" />
                <div id="10Task" className="task-container" />
                <div id="10ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="11">
                <div id="11BackG" className="number-header">
                  <div id="11Num" className="date-number" />
                  <div id="11ViewSegments" />
                </div>
                <div id="11Seg" className="segment-container" />
                <div id="11Task" className="task-container" />
                <div id="11ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="12">
                <div id="12BackG" className="number-header">
                  <div id="12Num" className="date-number" />
                  <div id="12ViewSegments" />
                </div>
                <div id="12Seg" className="segment-container" />
                <div id="12Task" className="task-container" />
                <div id="12ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="13">
                <div id="13BackG" className="number-header">
                  <div id="13Num" className="date-number" />
                  <div id="13ViewSegments" />
                </div>
                <div id="13Seg" className="segment-container" />
                <div id="13Task" className="task-container" />
                <div id="13ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week2" className="calendar-row">
              <div className="calendar-day" id="14" style={{ borderLeft: 'none' }}>
                <div id="14BackG" className="number-header">
                  <div id="14Num" className="date-number" />
                  <div id="14ViewSegments" />
                </div>
                <div id="14Seg" className="segment-container" />
                <div id="14Task" className="task-container" />
                <div id="14ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="15">
                <div id="15BackG" className="number-header">
                  <div id="15Num" className="date-number" />
                  <div id="15ViewSegments" />
                </div>
                <div id="15Seg" className="segment-container" />
                <div id="15Task" className="task-container" />
                <div id="15ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="16">
                <div id="16BackG" className="number-header">
                  <div id="16Num" className="date-number" />
                  <div id="16ViewSegments" />
                </div>
                <div id="16Seg" className="segment-container" />
                <div id="16Task" className="task-container" />
                <div id="16ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="17">
                <div id="17BackG" className="number-header">
                  <div id="17Num" className="date-number" />
                  <div id="17ViewSegments" />
                </div>
                <div id="17Seg" className="segment-container" />
                <div id="17Task" className="task-container" />
                <div id="17ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="18">
                <div id="18BackG" className="number-header">
                  <div id="18Num" className="date-number" />
                  <div id="18ViewSegments" />
                </div>
                <div id="18Seg" className="segment-container" />
                <div id="18Task" className="task-container" />
                <div id="18ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="19">
                <div id="19BackG" className="number-header">
                  <div id="19Num" className="date-number" />
                  <div id="19ViewSegments" />
                </div>
                <div id="19Seg" className="segment-container" />
                <div id="19Task" className="task-container" />
                <div id="19ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="20">
                <div id="20BackG" className="number-header">
                  <div id="20Num" className="date-number" />
                  <div id="20ViewSegments" />
                </div>
                <div id="20Seg" className="segment-container" />
                <div id="20Task" className="task-container" />
                <div id="20ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week3" className="calendar-row">
              <div className="calendar-day" id="21" style={{ borderLeft: 'none' }}>
                <div id="21BackG" className="number-header">
                  <div id="21Num" className="date-number" />
                  <div id="21ViewSegments" />
                </div>
                <div id="21Seg" className="segment-container" />
                <div id="21Task" className="task-container" />
                <div id="21ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="22">
                <div id="22BackG" className="number-header">
                  <div id="22Num" className="date-number" />
                  <div id="22ViewSegments" />
                </div>
                <div id="22Seg" className="segment-container" />
                <div id="22Task" className="task-container" />
                <div id="22ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="23">
                <div id="23BackG" className="number-header">
                  <div id="23Num" className="date-number" />
                  <div id="23ViewSegments" />
                </div>
                <div id="23Seg" className="segment-container" />
                <div id="23Task" className="task-container" />
                <div id="23ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="24">
                <div id="24BackG" className="number-header">
                  <div id="24Num" className="date-number" />
                  <div id="24ViewSegments" />
                </div>
                <div id="24Seg" className="segment-container" />
                <div id="24Task" className="task-container" />
                <div id="24ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="25">
                <div id="25BackG" className="number-header">
                  <div id="25Num" className="date-number" />
                  <div id="25ViewSegments" />
                </div>
                <div id="25Seg" className="segment-container" />
                <div id="25Task" className="task-container" />
                <div id="25ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="26">
                <div id="26BackG" className="number-header">
                  <div id="26Num" className="date-number" />
                  <div id="26ViewSegments" />
                </div>
                <div id="26Seg" className="segment-container" />
                <div id="26Task" className="task-container" />
                <div id="26ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="27">
                <div id="27BackG" className="number-header">
                  <div id="27Num" className="date-number" />
                  <div id="27ViewSegments" />
                </div>
                <div id="27Seg" className="segment-container" />
                <div id="27Task" className="task-container" />
                <div id="27ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            <div id="week4" className="calendar-row">
              <div className="calendar-day" id="28" style={{ borderLeft: 'none' }}>
                <div id="28BackG" className="number-header">
                  <div id="28Num" className="date-number" />
                  <div id="28ViewSegments" />
                </div>
                <div id="28Seg" className="segment-container" />
                <div id="28Task" className="task-container" />
                <div id="28ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="29">
                <div id="29BackG" className="number-header">
                  <div id="29Num" className="date-number" />
                  <div id="29ViewSegments" />
                </div>
                <div id="29Seg" className="segment-container" />
                <div id="29Task" className="task-container" />
                <div id="29ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="30">
                <div id="30BackG" className="number-header">
                  <div id="30Num" className="date-number" />
                  <div id="30ViewSegments" />
                </div>
                <div id="30Seg" className="segment-container" />
                <div id="30Task" className="task-container" />
                <div id="30ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="31">
                <div id="31BackG" className="number-header">
                  <div id="31Num" className="date-number" />
                  <div id="31ViewSegments" />
                </div>
                <div id="31Seg" className="segment-container" />
                <div id="31Task" className="task-container" />
                <div id="31ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="32">
                <div id="32BackG" className="number-header">
                  <div id="32Num" className="date-number" />
                  <div id="32ViewSegments" />
                </div>
                <div id="32Seg" className="segment-container" />
                <div id="32Task" className="task-container" />
                <div id="32ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="33">
                <div id="33BackG" className="number-header">
                  <div id="33Num" className="date-number" />
                  <div id="33ViewSegments" />
                </div>
                <div id="33Seg" className="segment-container" />
                <div id="33Task" className="task-container" />
                <div id="33ViewMoreMessage" className="viewMore" />
              </div>
              <div className="calendar-day" id="34">
                <div id="34BackG" className="number-header">
                  <div id="34Num" className="date-number" />
                  <div id="34ViewSegments" />
                </div>
                <div id="34Seg" className="segment-container" />
                <div id="34Task" className="task-container" />
                <div id="34ViewMoreMessage" className="viewMore" />
              </div>
            </div>
            {calendarData.totalDays >= 36 && (
              <div id="week5" className="calendar-row" style={{ borderBottom: 'none' }}>
                <div className="calendar-day" id="35" style={{ borderLeft: 'none' }}>
                  <div id="35BackG" className="number-header">
                    <div id="35Num" className="date-number" />
                    <div id="35ViewSegments" />
                  </div>
                  <div id="35Seg" className="segment-container" />
                  <div id="35Task" className="task-container" />
                  <div id="35ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="36">
                  <div id="36BackG" className="number-header">
                    <div id="36Num" className="date-number" />
                    <div id="36ViewSegments" />
                  </div>
                  <div id="36Seg" className="segment-container" />
                  <div id="36Task" className="task-container" />
                  <div id="36ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="37">
                  <div id="37BackG" className="number-header">
                    <div id="37Num" className="date-number" />
                    <div id="37ViewSegments" />
                  </div>
                  <div id="37Seg" className="segment-container" />
                  <div id="37Task" className="task-container" />
                  <div id="37ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="38">
                  <div id="38BackG" className="number-header">
                    <div id="38Num" className="date-number" />
                    <div id="38ViewSegments" />
                  </div>
                  <div id="38Seg" className="segment-container" />
                  <div id="38Task" className="task-container" />
                  <div id="38ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="39">
                  <div id="39BackG" className="number-header">
                    <div id="39Num" className="date-number" />
                    <div id="39ViewSegments" />
                  </div>
                  <div id="39Seg" className="segment-container" />
                  <div id="39Task" className="task-container" />
                  <div id="39ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="40">
                  <div id="40BackG" className="number-header">
                    <div id="40Num" className="date-number" />
                    <div id="40ViewSegments" />
                  </div>
                  <div id="40Seg" className="segment-container" />
                  <div id="40Task" className="task-container" />
                  <div id="40ViewMoreMessage" className="viewMore" />
                </div>
                <div className="calendar-day" id="41">
                  <div id="41BackG" className="number-header">
                    <div id="41Num" className="date-number" />
                    <div id="41ViewSegments" />
                  </div>
                  <div id="41Seg" className="segment-container" />
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
