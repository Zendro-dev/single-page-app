import { GetStaticPaths, GetStaticProps } from 'next';
import { ModelsLayout, PageWithLayout } from '@/layouts';
import { GroupUrlQuery } from '@/types/routes';

export const getStaticPaths: GetStaticPaths<GroupUrlQuery> = async () => {
  return {
    paths: [{ params: { group: 'admin' } }, { params: { group: 'models' } }],
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
  return <div>{group} Home</div>;
};
ModelsHome.layout = ModelsLayout;
export default ModelsHome;
