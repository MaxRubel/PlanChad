import { useEffect } from 'react';
import useAnimationStore from '../stores/animationsStore';

const useMinimizeCheckpoint = (hasLoaded, setFormInput) => {
  const minAll = useAnimationStore((state) => state.minAll);
  const pauseReorder = useAnimationStore((state) => state.pauseReorder);
  useEffect(() => {
    if (hasLoaded) {
      pauseReorder();
      setFormInput((prevVal) => ({ ...prevVal, expandedCal: false, expanded: false }));
    }
  }, [minAll]);
};

export default useMinimizeCheckpoint;
