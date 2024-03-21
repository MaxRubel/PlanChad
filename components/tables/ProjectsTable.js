import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { useSaveContext } from '../../utils/context/saveManager';

export default function ProjectsTable() {
  const [projectsArray, setProjectsArray] = useState([]);
  const { user } = useAuth();
  const { allProjects } = useSaveContext();
  const router = useRouter();

  useEffect(() => {
    setProjectsArray((preVal) => allProjects);
  }, [user, allProjects]);

  return (
    <table id="projects-table" style={{ marginTop: '4%' }}>
      <thead>
        <tr
          style={{ border: '1px solid black', backgroundColor: 'rgb(171, 171, 171, 0.1)' }}
        >
          <th className="minWidth200">
            <button type="button" name="customer" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Project Name
            </button>
          </th>
          <th className="minWidth200">
            <button type="button" name="company" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Client
            </button>
          </th>
          <th className="minWidth200">
            <button type="button" id="phone-number" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Deadline
            </button>
          </th>
          <th className="minWidth200">
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
            style={{ border: '1px solid black', cursor: 'pointer' }}
            onClick={
              () => { router.push(`/project/plan/${project.projectId}`); }
            }
          >
            <td style={{ paddingLeft: '1.5%', minWidth: '300px' }}>
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
