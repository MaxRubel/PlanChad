import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { createNewProject, updateProject } from '../api/project';

/* eslint-disable react/jsx-closing-bracket-location */
export default function NewProjectForm() {
  const [formInput, setFormInput] = useState({ name: '' });
  const { user } = useAuth();
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      name: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...formInput, user_id: user.uid };
    createNewProject(payload).then(({ name }) => {
      updateProject({ projectId: name }).then(() => {
        router.push(`/project/plan/${name}`);
      });
    });
  }

  return (
    <form
      id="new-project-form"
      style={{
        marginTop: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onSubmit={handleSubmit}
    >
      <div className="card text-bg-info mb-3" style={{ minWidth: '400px', maxWidth: '600px' }}>
        <div style={{
          textAlign: 'center',
          fontSize: '18px',
          padding: '2% 0%',
          paddingBottom: '1%',
        }}>
          What would you like to call your project?
        </div>
        <div className="card-body" style={{ textAlign: 'center' }}>
          <input
            className="form-control"
            placeholder="Project Name"
            value={formInput.name}
            onChange={handleChange}
          />
        </div>
        <div style={{ textAlign: 'center', padding: '3% 0%', paddingTop: '1%' }}>
          <button type="submit" className="btn btn-outline-dark rounded-0">Submit</button>
        </div>
      </div>
    </form>
  );
}
