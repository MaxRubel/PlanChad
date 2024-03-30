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
    <table id="projects-table" style={{ marginTop: '4%', width: '100%' }}>
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
          <th>
            <button type="button" name="company" className="btn btn-outline-dark rounded-0 noBorder">
              Client
            </button>
          </th>
          <th>
            <button type="button" id="phone-number" className="btn btn-outline-dark rounded-0 noBorder">
              Deadline
            </button>
          </th>
          <th>
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
  );
}
