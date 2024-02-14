import ProjectsTable from '../components/ProjectsTable';

export default function Home() {
  return (
    <div className="homePage">
      <div className="card text-bg-info mb-3">
        <div className="card-header" style={{ textAlign: 'center', fontSize: '22px' }}>
          <strong>Welcome to planChad!</strong>
        </div>
        <div className="card-body">
          <h5 className="card-title" style={{ marginTop: '2%' }}>Select a Project:</h5>
          <p className="card-text">
            <ProjectsTable />
          </p>
        </div>
      </div>
    </div>
  );
}
