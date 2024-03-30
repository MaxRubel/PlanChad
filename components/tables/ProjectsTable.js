import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import useSaveStore from '../../utils/stores/saveStore';

export default function ProjectsTable() {
  const [projectsArray, setProjectsArray] = useState([]);
  const { user } = useAuth();
  const storedProjects = useSaveStore((state) => state.allProjects);
  const router = useRouter();

  useEffect(() => {
    setProjectsArray(storedProjects);
  }, [user, storedProjects]);

  return (
    <table className="projects-table">
      <thead>
        <tr
          style={{
            border: '1px solid black',
            backgroundColor: 'rgb(171, 171, 171, 0.1)',
          }}
        >
          <th>
            <button type="button" name="customer" className="btn btn-outline-dark rounded-0 noBorder">
              Project
            </button>
          </th>
          <th className="hide">
            <button type="button" name="company" className="btn btn-outline-dark rounded-0 noBorder">
              Client
            </button>
          </th>
          <th className="hide">
            <button type="button" id="phone-number" className="btn btn-outline-dark rounded-0 noBorder">
              Deadline
            </button>
          </th>
          <th className="hide">
            <button type="button" name="email" className="btn btn-outline-dark rounded-0 noBorder">
              Start Date
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {projectsArray.map((project) => (
          <tr
            key={project?.projectId}
            style={{ border: '1px solid black', cursor: 'pointer' }}
            onClick={
              () => { router.push(`/project/plan/${project.projectId}`); }
            }
          >
            <td style={{ paddingLeft: '1.5%' }}>
              {project?.name}
            </td>
            <td
              className="hide"
              style={{ paddingLeft: '1.5%' }}
            >
              {project?.client}
            </td>
            <td
              className="hide"
              style={{ paddingLeft: '1.5%' }}
            >
              {project?.deadline}
            </td>
            <td
              className="hide"
              style={{ paddingLeft: '1.5%' }}
            >
              {project?.start_date}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
