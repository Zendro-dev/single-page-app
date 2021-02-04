import React from 'react';
import EnhancedTable from '../components/enhancedtable/EnhancedTable';

const attributes = ['attr1', 'attr2', 'attr3'];

export default function TableLayout() {
  return <EnhancedTable attributes={attributes} />;
}
