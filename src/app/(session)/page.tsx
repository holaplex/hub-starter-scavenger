import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Home from './Home';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return <Home session={session} />;
}
