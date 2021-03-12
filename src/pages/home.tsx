import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import useAuth from '@/hooks/useAuth';
import MainPanel from '@/layouts/models';
import { getStaticRoutes } from '@/utils/static';
import { AppRoutes } from '@/types/routes';

interface HomeProps {
  routes: AppRoutes;
}

const About: NextPage<HomeProps> = ({ routes }) => {
  const { auth } = useAuth({ redirectTo: '/' });

  return (
    <MainPanel brand="Zendro" routes={routes}>
      {auth?.user
        ? Object.entries(auth.user).map(([key, value]) => (
            <div key={key}>
              <span>{key}: </span>
              <span>{JSON.stringify(value)}</span>
            </div>
          ))
        : null}
      {auth.error?.message && <div>Error: {auth?.error?.message}</div>}
    </MainPanel>
  );
};
export default About;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const routes = await getStaticRoutes();

  return {
    props: {
      routes,
    },
  };
};
