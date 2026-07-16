import { PropsWithChildren, ReactElement } from 'react';
import {
  Fade,
  TableBody as MuiTableBody,
  TableBodyProps as MuiTableBodyProps,
} from '@mui/material';

interface TableBodyProps extends MuiTableBodyProps {
  isLoading?: boolean;
}

export default function TableBody({
  isLoading,
  ...props
}: PropsWithChildren<TableBodyProps>): ReactElement {
  return (
    <Fade in={!isLoading}>
      <MuiTableBody data-cy="record-table-body" {...props}>
        {props.children}
      </MuiTableBody>
    </Fade>
  );
}
