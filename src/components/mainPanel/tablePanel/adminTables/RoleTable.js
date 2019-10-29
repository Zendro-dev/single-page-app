import React from 'react';
import model from '../../../../models/role'
import EnhancedTable from '../../table/EnhancedTable'

export default function UserTable() {

    return (
        <EnhancedTable model={model} />
    )
}