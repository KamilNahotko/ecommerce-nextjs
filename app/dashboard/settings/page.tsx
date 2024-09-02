import { SettingsCard } from '@/modules/dashboard';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

const SettingsPage = async () => {
  const session = await auth();

  if (!session) redirect('/');
  if (session) return <SettingsCard session={session} />;
};

export default SettingsPage;
