/* eslint-disable react/jsx-closing-bracket-location */
import { useState } from 'react';

export default function ProjectsTable() {
  const [projectsArray, setProjectsArray] = useState(['item1']);

  return (
    <table id="customersTable" style={{ marginTop: '4%' }}>
      <thead>
        <tr
          id="customers-table-header"
          style={{ border: '1px solid black', backgroundColor: 'rgb(171, 171, 171, 0.1)' }}
        >
          <th className="customer-table-name">
            <button type="button" name="customer" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Project Name
            </button>
          </th>
          <th className="customer-table-company">
            <button type="button" name="company" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Client
            </button>
          </th>
          <th className="customer-table-phone">
            <button type="button" id="phone-number" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Deadline
            </button>
          </th>
          <th className="customer-table-email">
            <button type="button" name="email" className="btn btn-outline-dark rounded-0" style={{ border: 'none' }}>
              Start Date
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {projectsArray.map((customer) => (
          <tr style={{ border: '1px solid black' }}>
            <td style={{ paddingLeft: '1.5%', minWidth: '200px' }}>
              Project
            </td>
            <td style={{ paddingLeft: '1.5%', minWidth: '200px' }}>
              Client
            </td>
            <td style={{ paddingLeft: '1.5%', minWidth: '200px' }}>
              Deadline
            </td>
            <td style={{ paddingLeft: '1.5%', minWidth: '200px' }}>
              Start Date
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}
