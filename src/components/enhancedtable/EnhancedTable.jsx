import React from 'react';
import { Table } from '@material-ui/core';
import EnhancedTableHead from './EnhancedTableHead';

export default function ModelTable({ attributes }) {
  return (
    <Table stickyHeader size="small">
      <EnhancedTableHead attributes={attributes} />
    </Table>
  );
}
