import { useEffect } from 'react';

const useProgressBarAnimation = (progressIsShowing, storedTasks, checkP) => {
  useEffect(() => {
    let interval;
    if (progressIsShowing) {
      const theseTasks = storedTasks.filter((task) => task.checkpointId === checkP.localId);
      const totalTasks = theseTasks.length;
      let closedTasks = 0;
      let closedPercentage = 0;

      for (let i = 0; i < totalTasks; i++) {
        if (theseTasks[i].status === 'closed') {
          closedTasks += 1;
        }
      }
      if (totalTasks !== 0) {
        closedPercentage = Math.round((closedTasks / totalTasks) * 100);
      }
      let i = 0;
      interval = setInterval(() => {
        document.getElementById(`progressOf${checkP.localId}`).style.width = `${i}%`;
        i += 1;
        if (i > closedPercentage) {
          clearInterval(interval);
        }
      }, 20);
    } else {
      document.getElementById(`progressOf${checkP.localId}`).style.width = '0%';
    }
    return () => {
      clearInterval(interval);
    };
  }, [progressIsShowing]);
};

export default useProgressBarAnimation;
