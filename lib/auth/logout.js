import { useSession, signOut } from 'next-auth/react';
import Cookies from 'universal-cookie';

const logout = async ({ router }) => {
  const { data: session } = useSession();
  const cookies = new Cookies();

  const redirectPath = router.pathname;
  cookies.remove('redirectPath');
  cookies.remove('user');
  cookies.remove('token');

  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_API + 'auth/logout/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json());

  if (session) signOut();

  router.push(redirectPath);
  return res;
};

export default logout;