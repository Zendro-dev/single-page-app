import React, { PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import AlertCard from '@/components/alert-card';
import { useModel } from '@/hooks';
import { CrudRequest } from '@/types/requests';

interface ModelBouncerProps {
  object: string;
  action: CrudRequest;
}

export default function ModelBouncer(
  props: PropsWithChildren<ModelBouncerProps>
): ReactElement {
  const model = useModel(props.object);
  const { t } = useTranslation();

  const isAllowed = model.permissions[props.action];

  return (
    <>
      {isAllowed ? (
        props.children
      ) : (
        <AlertCard
          title={t('restricted.not-allowed-header')}
          body={t('restricted.not-allowed-info')}
          type="info"
        />
      )}
    </>
  );
}
