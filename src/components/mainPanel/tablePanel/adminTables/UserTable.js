import React from 'react';
import model from '../../../../models/user'
import EnhancedTable from '../../table/EnhancedTable'

export default function UserTable() {

    return (
        <EnhancedTable model={model} />
    )
}