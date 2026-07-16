// Ported from pages/[group]/index.tsx. getStaticPaths/getStaticProps are
// gone (no SSG in a CSR app) - `group` comes straight from the route
// param instead of being pre-computed as a page prop.
import { useParams } from 'react-router-dom';

export default function GroupHome() {
  const { group } = useParams();
  return <div>{group} Home</div>;
}
