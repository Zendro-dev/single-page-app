import { useMemo } from 'react';
import { OrderDirection, QueryVariableOrder } from '@/types/queries';

export interface UseOrderProps {
  sortField?: string;
  sortDirection?: OrderDirection;
}

export default function useOrder({
  sortDirection: direction = 'ASC',
  sortField: field,
}: UseOrderProps): QueryVariableOrder | undefined {
  const order = useMemo(() => {
    if (field) return { field, order: direction };
  }, [direction, field]);

  return order;
}
