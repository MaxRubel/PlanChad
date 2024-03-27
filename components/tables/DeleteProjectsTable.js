import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import useSaveStore from '../../utils/stores/saveStore';

// eslint-disable-next-line react/prop-types
export default function DeleteProjectsTable({ handleStartDelete }) {
  const [projectsArray, setProjectsArray] = useState([]);
  const { user } = useAuth();
  const storedProjects = useSaveStore((state) => state.allProjects);
  const router = useRouter();

  useEffect(() => {
    setProjectsArray(storedProjects);
  }, [user, storedProjects]);

  return (
    <div className="card">
      <table id="projects-table">
        <thead>
          <tr
            style={{ border: 'none', backgroundColor: 'rgb(171, 171, 171, 0.1)' }}
          >
            <th>
              <button type="button" name="customer" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
                Project Name
              </button>
            </th>
            <th>
              <button type="button" name="company" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
                Client
              </button>
            </th>
            <th>
              <button type="button" id="phone-number" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
                Deadline
              </button>
            </th>
            <th>
              <button type="button" name="email" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
                Start Date
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {projectsArray.map((project) => (
            <tr
              key={project?.projectId}
              style={{
                borderTop: '1px solid black',
                cursor: 'pointer',
                transition: 'all .7s ease',
              }}
              onClick={() => {
                handleStartDelete(project.projectId);
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgb(230, 230, 230)'; }}
              onFocus={(e) => { e.currentTarget.style.backgroundColor = 'rgb(230, 230, 230)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
              onBlur={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
            >
              <td style={{ paddingLeft: '1.5%' }}>
                {project?.name}
              </td>
              <td style={{ paddingLeft: '1.5%' }}>
                {project?.client}
              </td>
              <td style={{ paddingLeft: '1.5%' }}>
                {project?.deadline}
              </td>
              <td style={{ paddingLeft: '1.5%' }}>
                {project?.start_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
