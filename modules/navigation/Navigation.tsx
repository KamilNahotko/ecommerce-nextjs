import { auth } from '@/server/auth';

export const Navigation = async () => {
  const user = await auth();

  return (
    <header className='bg-slate-500 py-4'>
      <nav>
        <ul className='flex justify-between'>
          <li>logo</li>
          <li>user</li>
        </ul>
      </nav>
    </header>
  );
};
