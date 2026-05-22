import { useEffect } from 'react';

// @project
import UpsertPlan from '@/sections/setting/pricing/UpsertPlan';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';

/***************************  PRICING - PLAN CREATE  ***************************/

export default function PlanCreate() {
  useEffect(() => {
    handlerBreadcrumbs(`/setting/pricing/plan-create`, [
      { title: 'setting' },
      { title: 'pricing', url: '/setting/pricing' },
      { title: 'plan-create' }
    ]);
  }, []);

  return <UpsertPlan />;
}
