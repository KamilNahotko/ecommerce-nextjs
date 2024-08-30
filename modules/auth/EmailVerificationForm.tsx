'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';
import { AuthCard } from './common';
import { newVerificationEmail } from '@/server/actions';
import { FormStatusMessage } from '@/components/formStatusMessage';

export const EmailVerificationForm = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError('No token found');
      return;
    }

    newVerificationEmail(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push('/auth/login');
      }
    });
  }, [error, router, success, token]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <AuthCard
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
      cardTitle='Verify your account.'
    >
      <div className='flex items-center flex-col w-full justify-center'>
        <p>{!success && !error ? 'Verifying email...' : null}</p>
        <FormStatusMessage message={success} type='success' />
        <FormStatusMessage message={error} type='error' />
      </div>
    </AuthCard>
  );
};
