import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  Pressable,
  Text,
  View,
} from '@/components/ui';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
    password_confirmation: z
      .string()
      .min(1, 'Password confirmation is required')
      .min(6, 'Password must be at least 6 characters'),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });
    }
  });

export type FormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
};

export const RegisterForm = ({
  onSubmit = () => {},
  isLoading,
}: RegisterFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Register
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            Let's shine! 👋
          </Text>
        </View>
        <ControlledInput
          testID="name-input"
          control={control}
          name="name"
          label="Name"
        />
        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Email"
        />
        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="Password"
          placeholder="***"
          secureTextEntry={true}
        />
        <ControlledInput
          testID="password-confirmation-input"
          control={control}
          name="password_confirmation"
          label="Password Confirmation"
          placeholder="***"
          secureTextEntry={true}
        />
        <Button
          testID="register-button"
          label="Register"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          variant="secondary"
        />
        <Link href="/login" asChild>
          <Pressable>
            <Text className="ml-auto mt-4 text-xl font-bold text-primary-500">
              Back to Login
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};
