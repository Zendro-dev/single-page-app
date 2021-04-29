import Table from './table';
import TableBody from './table-body';
import TableColumn from './table-column';
import TableHeader from './table-header';
import TableRow from './table-row';
import TablePagination from './table-pagination';
import TableSearch from './table-search';
//
import useTableOrder from './hooks/useOrder';
import useTablePagination from './hooks/usePagination';
import useTableSearch from './hooks/useSearch';

/* DEPRECATED */
import useVariables from './hooks/useVariables';
import useTable from './hooks/useTable';
/* END DEPRECATED */

export * from './table';
export * from './table-row';
export * from './hooks/useOrder';
export * from './hooks/usePagination';
export * from './hooks/useSearch';

export {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TablePagination,
  TableSearch,
  useTableOrder,
  useTablePagination,
  useTableSearch,
  // DEPRECATED
  useTable,
  useVariables,
};
