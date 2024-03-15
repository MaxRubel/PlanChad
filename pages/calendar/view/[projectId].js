/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import {
  useEffect, useRef, useState,
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
  const projectStartBox = useRef(null);
  const projectDeadlineBox = useRef(null);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const weeksArrays = useRef(initialState);
  const [layingOut, setLayingOut] = useState(true);

  // const weeksArraysWithHeights = useRef([[], [], [], [], [], []]);

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
    console.log('switched month');
    weeksArrays.current = initialState;
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

    const date = new Date(calendarData.year, calendarData.month, 1);
    const firstBoxDate = new Date(date);
    firstBoxDate.setDate(1 - startingDay);
    const firstBoxNumber = firstBoxDate.getDate();

    setCalendarData((preVal) => ({
      ...preVal, startingDay, lastDateOfMonth, lastDateOfPreviousMonth, firstBoxNumber,
    }));

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
  }, [calendarData.month, calendarData.totalDays, sortedTasks]);

  // CALCULATE PROJECT LINE
  useEffect(() => {
    if (calendarData.startingDay && saveInput.project?.projectId) {
      const [projStartYear, projStartMonth, projStartDay] = (saveInput.project.start_date ?? '').split('-');
      const [projDeadlineYear, projDeadlineMonth, projDeadlineDay] = (saveInput.project.deadline ?? '').split('-');
      const startingDay = new Date(calendarData.year, calendarData.month, 1).getDay();
      const projStartDayOnCal = (startingDay + Number(projStartDay) - 1);
      const projDeadlineDayOnCal = (startingDay + Number(projDeadlineDay) - 1);

      for (let i = 0; i < 41; i++) { // clear old colors
        const projectDiv = document.getElementById(`${i}BackG`);
        if (projectDiv) {
          projectDiv.style.backgroundColor = 'transparent';
        }
      }

      // --------PROJECT-LINE-START--------
      const startElement = document.getElementById(`${projStartDayOnCal}BackG`);
      // Put start day in correct month & year
      if (
        calendarData.month === Number(projStartMonth - 1)
        && calendarData.year === Number(projStartYear)) {
        startElement.style.backgroundColor = '#23a6d5';
        projectStartBox.current = startElement;
        // If deadline day is in current month fill to deadline
        if (
          calendarData.month === Number(projDeadlineMonth - 1)) {
          for (let i = projStartDayOnCal; i < projDeadlineDayOnCal; i++) {
            document.getElementById(`${i}BackG`).style.backgroundColor = '#23a6d5';
          }
          // Deadline is not in current month so just fill to the end of month
        } else if (saveInput.project.deadline) {
          for (let i = projStartDayOnCal; i <= 43; i++) {
            const element = document.getElementById(`${i}BackG`);
            if (element) {
              element.style.backgroundColor = '#23a6d5';
            }
          }
        }
      }

      // ---------PROJECT-LINE-END-------
      if (calendarData.month === Number(projDeadlineMonth) - 1
        && calendarData.year === Number(projDeadlineYear)) { //  Put deadline in correct month & year
        const deadlineElement = document.getElementById(`${projDeadlineDayOnCal}BackG`);
        projectDeadlineBox.current = deadlineElement;
        deadlineElement.style.backgroundColor = '#23a6d5';
        // deadlineElement.innerHTML = `${saveInput.project.name} due`;
        // deadlineElement.className = 'project-deadline-box';
        // If start date is not in current month fill all squares up to deadline
        if (calendarData.month !== Number(projStartMonth - 1)) {
          for (let i = 0; i < projDeadlineDayOnCal; i++) {
            document.getElementById(`${i}BackG`).style.backgroundColor = '#23a6d5';
          }
        }
      }

      const fillWholeMonth = () => {
        for (let i = 0; i <= 41; i++) {
          const element = document.getElementById(`${i}Num`);
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
      setLayingOut((preVal) => false);
    }
  }, [sortedTasks, calendarData.month]);

  // SORT ENTRIES INTO CALENDAR ROWS
  useEffect(() => {
    weeksArrays.current = initialState;
    const findHeightIndex = (day, taskObj) => {
      const weeksArrayCopy = [...weeksArrays.current];
      const sortedTasksCopy = [...sortedTasks];

      // loop through each week array
      for (let i = 0; i < weeksArrayCopy.length; i++) {
        const loopThroughEachDayOfTheMonth = () => {
          if (day >= i * 7 && day <= (i + 1) * 7 - 1) {
            return true;
          }
          return false;
        };
        if (loopThroughEachDayOfTheMonth()) {
          const isObjectInArray = weeksArrayCopy[i].some((obj) => obj.localId === taskObj.localId);
          const taskToAdd = sortedTasksCopy.find((obj) => obj.localId === taskObj.localId);
          if (!isObjectInArray) {
            const filtered = weeksArrayCopy[i].filter((item) => {
              const entryStartDate = new Date(`${taskToAdd.startDate}T12:00:00`);
              const entryEndDate = new Date(`${taskToAdd.deadline}T12:00:00`);
              const itemStartDate = new Date(`${item.startDate}T12:00:00`);
              const itemEndDate = new Date(`${item.deadline}T12:00:00`);
              return (
                (itemStartDate <= entryEndDate
                  && itemEndDate >= entryStartDate
                  && item.localId !== taskObj.localId)
                // || (itemStartDate <= entryEndDate
                //   || itemEndDate >= entryStartDate
                //   || item.localId !== taskObj.localId)
              );
            });
            const heightIndices = filtered.map((item) => item.heightIndex);
            console.log(heightIndices);
            let lowestAvailableIndex = 0;
            while (heightIndices.includes(lowestAvailableIndex)) {
              lowestAvailableIndex += 1;
            }

            taskToAdd.heightIndex = lowestAvailableIndex;
            weeksArrayCopy[i].push(taskToAdd);
            // taskToAdd.heightIndex = filtered.length;
            // weeksArrayCopy[i].push(taskToAdd);

            break;
          }
        }
      }

      // .filter((item) => {
      //   const itemStartDate = new Date(`${item.startDate}T12:00:00`);
      //   const itemEndDate = new Date(`${item.deadline}T12:00:00`);
      //   const entryStartDate = new Date(`${taskToAdd.startDate}T12:00:00`);
      //   const entryEndDate = new Date(`${taskToAdd.deadline}T12:00:00`);
      //   return (itemStartDate <= entryEndDate && itemEndDate >= entryStartDate && item.localId !== taskObj.localId);
      // });
      // taskToAdd.heightIndex = filtered.length

      weeksArrays.current = weeksArrayCopy;
    };
    const viewMoreMessage = document.createElement('div');

    // PRINT TASK LINES
    if (openTaskModal) return;
    const drawLine = (day, taskI, string, task) => {
      findHeightIndex(day, task);
      const element = document.getElementById(`${day}Task`);

      if (!element || day < 0 || day > 41) return;
      element.style.height = '100%';
      const lineDiv = document.createElement('div');
      const weekIndex = Math.floor(day / 7);
      const weekTasks = [...weeksArrays.current[weekIndex]];
      if (weekTasks.length === 0) return;
      const thisTask = weekTasks.find((item) => item.localId === task.localId);
      if (!thisTask) return;
      if (thisTask.heightIndex < 10) {
        lineDiv.style.backgroundColor = task.lineColor;
        lineDiv.innerHTML = '';
        lineDiv.setAttribute('id', `${task.name}-row${taskI}`);
        lineDiv.className = string;
        lineDiv.style.gridRow = `${thisTask.heightIndex + 1} / span 1`;
        element.appendChild(lineDiv);

        lineDiv.innerHTML = `
        ${task.name}
            <div id="openTask--${task.localId}" 
            class="tooltip-container">
              <div class="tooltip-trigger"></div>
              <div class="tooltip-content">
                <div>${task.name ? task.name : `Task ${task.index}`}</div>
                <div>${task.description ? task.description : ''}</div>
              </div>
            </div>
          `;
      } else {
        // const moreTasksCount = weekTasks.length - 5;
        // viewMoreMessage.innerHTML = `
        // hello
        // `;
        // +${moreTasksCount === 1 ? '1 more task...' : `${moreTasksCount} more tasks...`}
        // viewMoreMessage.setAttribute('id', `viewMore--${day}`);
        // viewMoreMessage.style.fontSize = '12px';
        // viewMoreMessage.style.textAlign = 'center';
        // viewMoreMessage.style.gridRow = 5;
        // const messageBox = document.getElementById(`${day}Task`);
        // messageBox.appendChild(viewMoreMessage);
      }
    };
    for (let day = 0; day < 42; day++) { // loop through each date box
      const element = document.getElementById(`${day}Task`);
      if (element) {
        element.innerHTML = '';
        element.style.height = '100%';
        element.style.gridTemplateRows = `repeat(${sortedTasks.length}, minmax(auto,15px));`;
        element.style.gridAutoRows = '15px';
        element.style.height = `${sortedTasks.length * 1}px`;

        // loop through each task of task array and row
        for (let task = 0; task < sortedTasks.length; task++) {
          const [taskStartYear, taskStartMonth, taskStartDay] = (sortedTasks[task].startDate ?? '').split('-');
          const [taskDeadlineYear, taskDeadlineMonth, taskDeadlineDay] = (sortedTasks[task].deadline ?? '').split('-');
          const taskStartDayOnCal = (calendarData.startingDay + Number(taskStartDay) - 1);
          const taskDeadlineOnCal = (calendarData.startingDay + Number(taskDeadlineDay) - 1);
          // const taskStartDayPrevMonth = Number(firstBoxNumber)
          const taskDeadlineIfOneMonthPlus = Number(calendarData.lastDateOfMonth) + Number(taskDeadlineDay) + Number(calendarData.startingDay - 1);
          const taskyears = [];
          for (let m = Number(taskStartYear); m <= Number(taskDeadlineYear); m++) {
            taskyears.push(m);
          }
          const startDayOnCal = (Number(taskStartDay) + (calendarData.startingDay - 1));
          const endDayOnCal = (Number(taskDeadlineDay) + (calendarData.startingDay - 1));

          const inStartYear = () => {
            if (calendarData.year === Number(taskStartYear)) { return true; }
            return false;
          };
          const inEndYear = () => {
            if (calendarData.year === Number(taskDeadlineYear)) { return true; }
            return false;
          };
          const inStartMonth = () => {
            if (
              calendarData.month === Number(taskStartMonth - 1)
              && inStartYear()
            ) {
              return true;
            }
            return false;
          };
          const inEndMonth = () => {
            if (calendarData.month === Number(taskDeadlineMonth - 1) && inEndYear()) {
              return true;
            }
            return false;
          };
          const onStartDay = () => {
            if (taskStartDayOnCal === day && inStartMonth() && inStartYear()) { return true; }
            return false;
          };
          const onEndDay = () => {
            if (taskDeadlineOnCal === day && inEndYear() && inEndMonth()) { return true; }
            return false;
          };
          const bothInSameMonth = () => {
            if (inEndMonth()
              && inStartMonth()
              && startDayOnCal < day
              && endDayOnCal > day) {
              return true;
            }
            return false;
          };
          const monthsAreTouching = () => {
            const date1 = new Date(Number(taskStartYear), Number(taskStartMonth - 1), Number(taskStartDay));
            const date2 = new Date(Number(taskDeadlineYear), Number(taskDeadlineMonth - 1), Number(taskDeadlineDay));
            const yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear());
            const monthDiff = Math.abs(date1.getMonth() - date2.getMonth());
            return (
              yearDiff === 1 && monthDiff === 11)
              || (yearDiff === 0 && monthDiff === 1);
          };
          const isMonthAfterStart = () => {
            const eventDate = new Date(Number(taskStartYear), Number(taskStartMonth) - 1, 1);
            const currentDate = new Date(calendarData.year, calendarData.month, 1);
            const prevMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
            const prevYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
            const prevMonthFirstDay = new Date(prevYear, prevMonth, 1);

            if (eventDate >= prevMonthFirstDay && eventDate < currentDate) {
              return true;
            }
            return false;
          };
          const isMonthBeforeEnd = () => {
            const currentDate = new Date(calendarData.year, calendarData.month, 1);// First day of the
            const eventDate = new Date(Number(taskDeadlineYear), Number(taskDeadlineMonth) - 1, 1);

            // Get the next month and year
            const nextMonth = currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1;
            const nextYear = currentDate.getMonth() === 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();

            const nextMonthFirstDay = new Date(nextYear, nextMonth, 1);
            const nextMonthLastDay = new Date(nextYear, nextMonth + 1, 0);

            if (eventDate >= nextMonthFirstDay && eventDate <= nextMonthLastDay) {
              return true;
            }

            return false;
          };
          const startAndEndinDifferentYears = () => {
            if (Number(taskStartYear) !== Number(taskDeadlineYear)) {
              return true;
            }
            return false;
          };
          const calendarIsBetweenTheTwoDates = () => {
            const startDate = new Date(Number(taskStartYear), Number(taskStartMonth) - 1, 1);
            const endDate = new Date(Number(taskDeadlineYear), Number(taskDeadlineMonth) - 1, 1);
            const currentDate = new Date(Number(calendarData.year), Number(calendarData.month), 1);
            if (currentDate >= startDate) {
              // Check if the current month is before the end month
              if (currentDate < endDate) {
                return true; // Current month is between start and end months
              }
            }
            return false;
          };
          const drawEndlineOverMonthBoundary = () => {
            if (taskDeadlineIfOneMonthPlus === day) {
              drawLine(day, task, 'task-deadline-box', sortedTasks[task]);
            }
            if (taskDeadlineIfOneMonthPlus > day && taskStartDayOnCal < day
            ) {
              drawLine(day, task, 'task-line', sortedTasks[task]);
            }
          };
          const drawStartlineOverMonthBoundary = () => {
            const adjustedStartDay = taskStartDay - calendarData.firstBoxNumber;
            if (day === adjustedStartDay) {
              drawLine(day, task, 'task-start-box', sortedTasks[task]);
            }
            if (day > adjustedStartDay && day < taskDeadlineOnCal
            ) {
              drawLine(day, task, 'task-line', sortedTasks[task]);
            }
          };

          if (!sortedTasks[task].startDate) break;

          // if (!sortedTasks[task].deadline) break;
          if (onStartDay() && onEndDay()) {
            drawLine(day, task, 'task-line', sortedTasks[task]);
            break;
          }
          if (onStartDay()) {
            drawLine(day, task, 'task-start-box', sortedTasks[task]);
          }
          if (!sortedTasks[task].deadline) break;
          if (onEndDay() && !onStartDay()) {
            drawLine(day, task, 'task-deadline-box', sortedTasks[task]);
          }
          if (!startAndEndinDifferentYears()) {
            if (bothInSameMonth()) {
              drawLine(day, task, 'task-line', sortedTasks[task]);
            }
            if (taskDeadlineMonth !== taskStartMonth) {
              if (inStartMonth() && !monthsAreTouching()) {
                if (day > taskStartDayOnCal) {
                  drawLine(day, task, 'task-line', sortedTasks[task]);
                }
              }
              if (inEndMonth() && !monthsAreTouching()) {
                if (day < taskDeadlineOnCal) {
                  drawLine(day, task, 'task-line', sortedTasks[task]);
                }
              }
            }
            if (monthsAreTouching()) {
              if (inStartMonth()) {
                drawEndlineOverMonthBoundary();
              }
              if (inEndMonth()) {
                drawStartlineOverMonthBoundary();
              }
            }
            if (isMonthAfterStart() && isMonthBeforeEnd()) { // special edge case
              const adjustedStartDay = taskStartDay - calendarData.firstBoxNumber;
              if (day > adjustedStartDay && day < taskDeadlineIfOneMonthPlus) {
                drawLine(day, task, 'task-line', sortedTasks[task]);
              }
              if (day === adjustedStartDay) {
                drawLine(day, task, 'task-start-box', sortedTasks[task]);
              }
              if (day === taskDeadlineIfOneMonthPlus) {
                drawLine(day, task, 'task-deadline-box', sortedTasks[task]);
              }
            }
          }

          if (startAndEndinDifferentYears()) {
            // console.log('yes');
            if (
              !inStartMonth()
              && !isMonthAfterStart()
              && !isMonthBeforeEnd()
              && !inEndMonth()
              && calendarIsBetweenTheTwoDates()
            ) {
              drawLine(day, task, 'task-line', sortedTasks[task]);
            }
            if (isMonthAfterStart() && !inEndMonth() && !isMonthBeforeEnd()) {
              if (day > taskStartDay - calendarData.firstBoxNumber) {
                drawLine(day, task, 'task-line', sortedTasks[task]);
              }
              if (day === taskStartDay - calendarData.firstBoxNumber) {
                drawLine(day, task, 'task-start-box', sortedTasks[task]);
              }
            }
            if (isMonthBeforeEnd() && !inStartMonth() && !isMonthAfterStart()) {
              if (taskDeadlineIfOneMonthPlus === day) {
                drawLine(day, task, 'task-deadline-box', sortedTasks[task]);
              }
              if (taskDeadlineIfOneMonthPlus > day
              ) {
                drawLine(day, task, 'task-line', sortedTasks[task]);
              }
            }
            if (isMonthAfterStart() && isMonthBeforeEnd()) { // special edge case
              const adjustedStartDay = taskStartDay - calendarData.firstBoxNumber;
              if (day > adjustedStartDay && day < taskDeadlineIfOneMonthPlus) {
                drawLine(day, task, 'task-line', sortedTasks[task]);
              }
              if (day === adjustedStartDay) {
                drawLine(day, task, 'task-start-box', sortedTasks[task]);
              }
              if (day === taskDeadlineIfOneMonthPlus) {
                drawLine(day, task, 'task-deadline-box', sortedTasks[task]);
              }
            }
            if (inEndMonth() && !isMonthAfterStart()) {
              if (day < taskDeadlineOnCal) {
                drawLine(day, task, 'task-line', sortedTasks[task]);
              }
            }
            if (inStartMonth() && !isMonthBeforeEnd()) {
              if (day > taskStartDayOnCal) {
                drawLine(day, task, 'task-line', sortedTasks[task]);
              }
            }
          }
        }
      }
    }
  }, [calendarData, saveInput, sortedTasks, openTaskModal, layingOut]);
  // weeksArrays.current = initialState;
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
            onClick={handleClick}
          >
            <div id="week0" className="calendar-row" style={{ borderTop: '1px solid rgb(84, 84, 84)' }}>
              <div className="calendar-day" id="0" style={{ borderLeft: 'none' }}>
                <div id="0BackG"><div id="0Num" className="date-number" /></div>
                <div id="0CheckP" className="checkP-div" />
                <div id="0Task" className="task-container" />
              </div>
              <div className="calendar-day" id="1">
                <div id="1BackG"><div id="1Num" className="date-number" /></div>
                <div id="1CheckP" className="checkP-div" />
                {/* <div id="1Task" className="task-container" /> */}
                <div id="1Task" className="task-container" />
              </div>
              <div className="calendar-day" id="2">
                <div id="2BackG"><div id="2Num" className="date-number" /></div>
                <div id="2CheckP" className="checkP-div" />
                <div id="2Task" className="task-container" />
              </div>
              <div className="calendar-day" id="3">
                <div id="3BackG"><div id="3Num" className="date-number" /></div>
                <div id="3CheckP" className="checkP-div" />
                <div id="3Task" className="task-container" />
              </div>
              <div className="calendar-day" id="4">
                <div id="4BackG"><div id="4Num" className="date-number" /></div>
                <div id="4CheckP" className="checkP-div" />
                <div id="4Task" className="task-container" />
              </div>
              <div className="calendar-day" id="5">
                <div id="5BackG"><div id="5Num" className="date-number" /></div>
                <div id="5CheckP" className="checkP-div" />
                <div id="5Task" className="task-container" />
              </div>
              <div className="calendar-day" id="6">
                <div id="6BackG"><div id="6Num" className="date-number" /></div>
                <div id="6CheckP" className="checkP-div" />
                <div id="6Task" className="task-container" />
              </div>
            </div>
            <div id="week1" className="calendar-row">
              <div className="calendar-day" id="7" style={{ borderLeft: 'none' }}>
                <div id="7BackG"><div id="7Num" className="date-number" /></div>
                <div id="7CheckP" className="checkP-div" />
                <div id="7Task" className="task-container" />
              </div>
              <div className="calendar-day" id="8">
                <div id="8BackG"><div id="8Num" className="date-number" /></div>
                <div id="8CheckP" className="checkP-div" />
                <div id="8Task" className="task-container" />
              </div>
              <div className="calendar-day" id="9">
                <div id="9BackG"><div id="9Num" className="date-number" /></div>
                <div id="9CheckP" className="checkP-div" />
                <div id="9Task" className="task-container" />
              </div>
              <div className="calendar-day" id="10">
                <div id="10BackG"><div id="10Num" className="date-number" /></div>
                <div id="10CheckP" className="checkP-div" />
                <div id="10Task" className="task-container" />
              </div>
              <div className="calendar-day" id="11">
                <div id="11BackG"><div id="11Num" className="date-number" /></div>
                <div id="11CheckP" className="checkP-div" />
                <div id="11Task" className="task-container" />
              </div>
              <div className="calendar-day" id="12">
                <div id="12BackG"><div id="12Num" className="date-number" /></div>
                <div id="12CheckP" className="checkP-div" />
                <div id="12Task" className="task-container" />
              </div>
              <div className="calendar-day" id="13">
                <div id="13BackG"><div id="13Num" className="date-number" /></div>
                <div id="13CheckP" className="checkP-div" />
                <div id="13Task" className="task-container" />
              </div>
            </div>
            <div id="week2" className="calendar-row">
              <div className="calendar-day" id="14" style={{ borderLeft: 'none' }}>
                <div id="14BackG"><div id="14Num" className="date-number" /></div>
                <div id="14CheckP" className="checkP-div" />
                <div id="14Task" className="task-container" />
              </div>
              <div className="calendar-day" id="15">
                <div id="15BackG"><div id="15Num" className="date-number" /></div>
                <div id="15CheckP" className="checkP-div" />
                <div id="15Task" className="task-container" />
              </div>
              <div className="calendar-day" id="16">
                <div id="16BackG"><div id="16Num" className="date-number" /></div>
                <div id="16CheckP" className="checkP-div" />
                <div id="16Task" className="task-container" />
              </div>
              <div className="calendar-day" id="17">
                <div id="17BackG"><div id="17Num" className="date-number" /></div>
                <div id="17CheckP" className="checkP-div" />
                <div id="17Task" className="task-container" />
              </div>
              <div className="calendar-day" id="18">
                <div id="18BackG"><div id="18Num" className="date-number" /></div>
                <div id="18CheckP" className="checkP-div" />
                <div id="18Task" className="task-container" />
              </div>
              <div className="calendar-day" id="19">
                <div id="19BackG"><div id="19Num" className="date-number" /></div>
                <div id="19CheckP" className="checkP-div" />
                <div id="19Task" className="task-container" />
              </div>
              <div className="calendar-day" id="20">
                <div id="20BackG"><div id="20Num" className="date-number" /></div>
                <div id="20CheckP" className="checkP-div" />
                <div id="20Task" className="task-container" />
              </div>
            </div>
            <div id="week3" className="calendar-row">
              <div className="calendar-day" id="21" style={{ borderLeft: 'none' }}>
                <div id="21BackG"><div id="21Num" className="date-number" /></div>
                <div id="21CheckP" className="checkP-div" />
                <div id="21Task" className="task-container" />
              </div>
              <div className="calendar-day" id="22">
                <div id="22BackG"><div id="22Num" className="date-number" /></div>
                <div id="22CheckP" className="checkP-div" />
                <div id="22Task" className="task-container" />
              </div>
              <div className="calendar-day" id="23">
                <div id="23BackG"><div id="23Num" className="date-number" /></div>
                <div id="23CheckP" className="checkP-div" />
                <div id="23Task" className="task-container" />
              </div>
              <div className="calendar-day" id="24">
                <div id="24BackG"><div id="24Num" className="date-number" /></div>
                <div id="24CheckP" className="checkP-div" />
                <div id="24Task" className="task-container" />
              </div>
              <div className="calendar-day" id="25">
                <div id="25BackG"><div id="25Num" className="date-number" /></div>
                <div id="25CheckP" className="checkP-div" />
                <div id="25Task" className="task-container" />
              </div>
              <div className="calendar-day" id="26">
                <div id="26BackG"><div id="26Num" className="date-number" /></div>
                <div id="26CheckP" className="checkP-div" />
                <div id="26Task" className="task-container" />
              </div>
              <div className="calendar-day" id="27">
                <div id="27BackG"><div id="27Num" className="date-number" /></div>
                <div id="27CheckP" className="checkP-div" />
                <div id="27Task" className="task-container" />
              </div>
            </div>
            <div id="week4" className="calendar-row">
              <div className="calendar-day" id="28" style={{ borderLeft: 'none' }}>
                <div id="28BackG"><div id="28Num" className="date-number" /></div>
                <div id="28CheckP" className="checkP-div" />
                <div id="28Task" className="task-container" />
              </div>
              <div className="calendar-day" id="29">
                <div id="29BackG"><div id="29Num" className="date-number" /></div>
                <div id="29CheckP" className="checkP-div" />
                <div id="29Task" className="task-container" />
              </div>
              <div className="calendar-day" id="30">
                <div id="30BackG"><div id="30Num" className="date-number" /></div>
                <div id="30CheckP" className="checkP-div" />
                <div id="30Task" className="task-container" />
              </div>
              <div className="calendar-day" id="31">
                <div id="31BackG"><div id="31Num" className="date-number" /></div>
                <div id="31CheckP" className="checkP-div" />
                <div id="31Task" className="task-container" />
              </div>
              <div className="calendar-day" id="32">
                <div id="32BackG"><div id="32Num" className="date-number" /></div>
                <div id="32CheckP" className="checkP-div" />
                <div id="32Task" className="task-container" />
              </div>
              <div className="calendar-day" id="33">
                <div id="33BackG"><div id="33Num" className="date-number" /></div>
                <div id="33CheckP" className="checkP-div" />
                <div id="33Task" className="task-container" />
              </div>
              <div className="calendar-day" id="34">
                <div id="34BackG"><div id="34Num" className="date-number" /></div>
                <div id="34CheckP" className="checkP-div" />
                <div id="34Task" className="task-container" />
              </div>
            </div>
            {calendarData.totalDays >= 36 && (
              <div id="week5" className="calendar-row" style={{ borderBottom: 'none' }}>
                <div className="calendar-day" id="35" style={{ borderLeft: 'none' }}>
                  <div id="35BackG"><div id="35Num" className="date-number" /></div>
                  <div id="35CheckP" className="checkP-div" />
                  <div id="35Task" className="task-container" />
                </div>
                <div className="calendar-day" id="36">
                  <div id="36BackG"><div id="36Num" className="date-number" /></div>
                  <div id="36CheckP" className="checkP-div" />
                  <div id="36Task" className="task-container" />
                </div>
                <div className="calendar-day" id="37">
                  <div id="37BackG"><div id="37Num" className="date-number" /></div>
                  <div id="37CheckP" className="checkP-div" />
                  <div id="37Task" className="task-container" />
                </div>
                <div className="calendar-day" id="38">
                  <div id="38BackG"><div id="38Num" className="date-number" /></div>
                  <div id="38CheckP" className="checkP-div" />
                  <div id="38Task" className="task-container" />
                </div>
                <div className="calendar-day" id="39">
                  <div id="39BackG"><div id="39Num" className="date-number" /></div>
                  <div id="39CheckP" className="checkP-div" />
                  <div id="39Task" className="task-container" />
                </div>
                <div className="calendar-day" id="40">
                  <div id="40BackG"><div id="40Num" className="date-number" /></div>
                  <div id="40CheckP" className="checkP-div" />
                  <div id="40Task" className="task-container" />
                </div>
                <div className="calendar-day" id="41">
                  <div id="41BackG"><div id="41Num" className="date-number" /></div>
                  <div id="41CheckP" className="checkP-div" />
                  <div id="41Task" className="task-container" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
