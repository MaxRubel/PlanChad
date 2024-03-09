import { useRouter } from 'next/router';
import MainProjectView from '../../../components/MainProject';

export default function PlanProjectRoute() {
  const router = useRouter();
  const { projectId } = router.query;
  document.documentElement.style.setProperty('--background1', 'white');
  return (
    <MainProjectView projectId={projectId} />
  );
}
