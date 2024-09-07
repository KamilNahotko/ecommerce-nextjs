import { Button } from '@/components/ui/button';
import { auth } from '@/server/auth';
import { LogIn, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from './components';

export const Navigation = async () => {
  const session = await auth();

  return (
    <header className='py-8'>
      <nav>
        <ul className='flex justify-between items-center md:gap-8 gap-4'>
          <li className='flex flex-1'>
            <Link href='/' aria-label='logo' className='flex gap-2'>
              <ShoppingBag />
              <p>Ecommerce NEXT JS</p>
            </Link>
          </li>
          {!session ? (
            <li className='flex items-center justify-center'>
              <Button asChild>
                <Link className='flex gap-2' href='/auth/login'>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className='flex items-center justify-center'>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
