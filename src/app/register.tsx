import { useRouter } from 'expo-router';
import React from 'react';

import { useRegister } from '@/api';
import type { RegisterFormProps } from '@/components/register-form';
import { RegisterForm } from '@/components/register-form';
import {
  FocusAwareStatusBar,
  showErrorMessage,
  showSuccessMessage,
} from '@/components/ui';

export default function Register() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const onSubmit: RegisterFormProps['onSubmit'] = (data) => {
    register(data, {
      onSuccess: () => {
        showSuccessMessage('Registered successfully');
        router.push('/login');
      },
      onError: (err) => {
        showErrorMessage(err.response?.data?.message ?? err.message);
      },
    });
  };
  return (
    <>
      <FocusAwareStatusBar />
      <RegisterForm onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
