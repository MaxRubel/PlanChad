import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { createNewProject, updateProject } from '../api/project';
import { useSaveContext } from '../utils/context/saveManager';

/* eslint-disable react/jsx-closing-bracket-location */
export default function NewProjectForm() {
  const [formInput, setFormInput] = useState({ name: '' });
  const { user } = useAuth();
  const { addToSaveManager } = useSaveContext();
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formInput,
      userId: user.uid,
      deadline: '',
      start_date: '',
      client: '',
      budget: '',
      description: '',
      expanded: true,
      checkpoints: null,
      tasks: null,
      progressIsShowing: false,
      hideCompletedTasks: false,
    };

    createNewProject(payload)
      .then(({ name }) => {
        const payload2 = { projectId: name };
        updateProject(payload2).then(() => {
          addToSaveManager({ ...payload, ...payload2 }, 'create', 'project');
          router.push(`/project/plan/${name}`);
        });
      });
  }

  return (
    <form
      id="new-project-form"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px3px',
      }}
      onSubmit={handleSubmit}>
      <div
        className="card text-bg-info mb-3"
        style={{
          minWidth: '400px',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px3px',
          maxWidth: '600px',
          // backgroundColor: 'red',
        }}>
        <div style={{
          textAlign: 'center',
          fontSize: '18px',
          padding: '2% 0%',
          paddingBottom: '1%',
        }}>
          <div className="card-header" style={{ textAlign: 'center', fontSize: '22px' }}>
            <h6>What would you like to call your project?</h6>
          </div>
        </div>
        <div className="card-body" style={{ textAlign: 'center' }}>
          <input
            className="form-control"
            placeholder="Project Name"
            value={formInput.name}
            name="name"
            onChange={handleChange}
            autoComplete="off"
            required />
        </div>
        <div style={{ textAlign: 'center', padding: '3% 0%', paddingTop: '1%' }}>
          <button type="submit" className="btn btn-outline-dark rounded-0">Submit</button>
        </div>
      </div>
    </form>
  );
}
