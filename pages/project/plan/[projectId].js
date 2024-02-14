import { useRouter } from 'next/router';

export default function PlanProjectRoute() {
  const router = useRouter();
  const { projectId } = router.query;
  console.log(projectId);
}
