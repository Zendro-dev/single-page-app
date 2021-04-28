import { useEffect, useState } from 'react';
import { OrderDirection, QueryVariableOrder } from '@/types/queries';

export interface UseOrderProps {
  sortField?: string;
  sortDirection?: OrderDirection;
}

export default function useOrder({
  sortDirection: direction = 'ASC',
  sortField: field,
}: UseOrderProps): QueryVariableOrder | undefined {
  const [order, setOrder] = useState<QueryVariableOrder>();

  useEffect(() => {
    if (field) setOrder({ field, order: direction });
  }, [setOrder, direction, field]);

  return order;
}
