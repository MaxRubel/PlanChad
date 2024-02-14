import { useRouter } from 'next/router';
import BigDaddyProject from '../../../components/BigDaddyProject';

export default function PlanProjectRoute() {
  const router = useRouter();
  const { projectId } = router.query;
  document.documentElement.style.setProperty('--background1', 'white');
  console.log('hey');
  return (
    <BigDaddyProject projectId={projectId} />
  );
}
