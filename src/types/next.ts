import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';

export interface NextStaticPropsContext<Q extends ParsedUrlQuery>
  extends GetStaticPropsContext<Q> {
  params: Q;
}

export type NextStaticProps<P, Q extends ParsedUrlQuery> = (
  context: NextStaticPropsContext<Q>
) => Promise<GetStaticPropsResult<P>>;

// export const getStaticProps: NextStaticProps<RecordProps, Params> = async (
//   context
// ) => {
//   return {
//     props: {
//       model: context.params.model,
//       record: context.params.record,
//     },
//   };
// };
