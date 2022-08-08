import { GetStaticPaths, GetStaticProps } from 'next';
import { ModelLayout, PageWithLayout } from '@/layouts';
import { GroupUrlQuery } from '@/types/routes';

import { useSession } from 'next-auth/react';

export const getStaticPaths: GetStaticPaths<GroupUrlQuery> = async () => {
  return {
    paths: [{ params: { group: 'models' } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<GroupUrlQuery> = async (
  context
) => {
  const { group } = context.params as GroupUrlQuery;

  return {
    props: {
      key: group,
      group,
    },
  };
};

const ModelsHome: PageWithLayout<GroupUrlQuery> = ({ group }) => {
  useSession();
  return <div>{group} Home</div>;
};
ModelsHome.layout = ModelLayout;
export default ModelsHome;
