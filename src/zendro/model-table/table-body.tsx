import { PropsWithChildren, ReactElement } from 'react';
import { TableBody as MuiTableBody, Fade } from '@material-ui/core';

interface TableBodyProps {
  isLoading?: boolean;
}

export default function TableBody({
  isLoading,
  ...props
}: PropsWithChildren<TableBodyProps>): ReactElement {
  return (
    <Fade in={!isLoading}>
      <MuiTableBody data-cy="record-table-body">{props.children}</MuiTableBody>
    </Fade>
  );
}
