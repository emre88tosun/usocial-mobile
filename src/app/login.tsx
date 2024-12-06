import { useRouter } from 'expo-router';
import React from 'react';

import { useLogin } from '@/api';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar, showErrorMessage } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const { mutate: login, isPending } = useLogin();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    login(data, {
      onSuccess: (response) => {
        signIn(response);
        router.push('/');
      },
      onError: (err) => {
        showErrorMessage(err.response?.data?.message ?? err.message);
      },
    });
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
