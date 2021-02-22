import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import useAuth from '@/hooks/useAuth';
import MainPanel from '@/layouts/models-layout';
import { getStaticRoutes } from '@/utils/static';
import { AppRoutes } from '@/types/routes';

interface HomeProps {
  routes: AppRoutes;
}

const About: NextPage<HomeProps> = ({ routes }) => {
  const { auth } = useAuth({ redirectTo: '/' });

  return (
    <MainPanel brand="Zendro" routes={routes}>
      {auth.error?.message ? (
        <div>Error: {auth?.error?.message}</div>
      ) : (
        <div>
          <div>Status: {auth?.status}</div>
          <div>User: {JSON.stringify(auth?.user)}</div>
        </div>
      )}
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
