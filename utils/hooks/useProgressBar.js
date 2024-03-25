import { useEffect } from 'react';

const useProgressBar = (progressIsShowing, storedTasks, checkP) => {
  useEffect(() => {
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
      document.getElementById(`progressOf${checkP.localId}`).style.width = `${closedPercentage}%`;
    } else {
      document.getElementById(`progressOf${checkP.localId}`).style.width = '0%';
    }
  }, [storedTasks]);
};

export default useProgressBar;
