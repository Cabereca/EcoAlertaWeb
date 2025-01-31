import { TUser } from '@/utils/types/auth';
import Cookies from 'cookies';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);

  // Ler um cookie
  const authToken = cookies.get('token');
  const user = cookies.get('user');

  if (!authToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user, // Simulando dados do usuário
    },
  };
};

export default function ProfilePage({ user }: { user: TUser }) {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold">Olá, {user.name}</h1>
    </div>
  );
}
