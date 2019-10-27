import React from 'react';
import model from '../../../../models/role'
import EnhancedTable from '../../table/EnhancedTable'

export default function RoleTable() {

    return (
        <EnhancedTable model={model} />
    )
}