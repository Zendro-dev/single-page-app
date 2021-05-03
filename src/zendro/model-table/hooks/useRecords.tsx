import { DataRecordWithAssoc } from '@/types/models';
import { useMemo } from 'react';
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
  const tableRecords = useMemo(() => {
    return records.reduce<TableRecord[]>((acc, record) => {
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
  }, [records, assocName, assocPrimaryKey, assocPrimaryKeyValue]);

  return tableRecords;
}
