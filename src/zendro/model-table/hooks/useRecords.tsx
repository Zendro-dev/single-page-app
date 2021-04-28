import { DataRecordWithAssoc } from '@/types/models';
import { useEffect, useState } from 'react';
import { TableRecord } from '../table';

export interface UseRecordsProps {
  assocName?: string;
  assocPrimaryKey?: string;
  assocPrimaryKeyValue?: string;
  records: DataRecordWithAssoc[];
}

export default function useRecords({
  records,
  assocName,
  assocPrimaryKey,
  assocPrimaryKeyValue,
}: UseRecordsProps): TableRecord[] {
  const [tableRecords, setTableRecords] = useState<TableRecord[]>([]);

  useEffect(() => {
    console.log({
      assocName,
      assocPrimaryKey,
      assocPrimaryKeyValue,
      records,
    });
    const tableRecords = records.reduce<TableRecord[]>((acc, record) => {
      const isAssociated =
        assocName && assocPrimaryKey && assocPrimaryKeyValue
          ? record[assocName]?.[assocPrimaryKey] === assocPrimaryKeyValue
          : true;

      const parsedRecord: TableRecord = {
        data: record,
        isAssociated,
      };

      return [...acc, parsedRecord];
    }, [] as TableRecord[]);

    setTableRecords(tableRecords);
  }, [records, assocName, assocPrimaryKey, assocPrimaryKeyValue]);

  return tableRecords;
}
