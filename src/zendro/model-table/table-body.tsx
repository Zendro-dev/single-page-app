import { PropsWithChildren, ReactElement } from 'react';
import {
  Fade,
  TableBody as MuiTableBody,
  TableBodyProps as MuiTableBodyProps,
} from '@material-ui/core';

interface TableBodyProps extends MuiTableBodyProps {
  isLoading?: boolean;
}

export default function TableBody({
  isLoading,
  ...props
}: PropsWithChildren<TableBodyProps>): ReactElement {
  return (
    <Fade in={!isLoading}>
      <MuiTableBody {...props}>{props.children}</MuiTableBody>
    </Fade>
  );
}
