import { useEffect } from 'react';

function useSaveButtonColorAnimation(isSaving) {
  useEffect(() => {
    let saveColorChange;
    const saveButton = document.getElementById('saveButton');
    if (!isSaving) {
      saveButton.style.color = 'white';
    }
    if (isSaving) {
      saveButton.style.color = 'rgb(16, 197, 234)';
      saveColorChange = setTimeout(() => {
        saveButton.style.color = 'white';
      }, 1000);
    }
    return () => {
      clearTimeout(saveColorChange);
    };
  }, [isSaving]);
}

export default useSaveButtonColorAnimation;
