/* eslint-disable react/no-unstable-nested-components */
import {
  CometChatUIKit,
  type UIKitSettings,
} from '@cometchat/chat-uikit-react-native';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CardField,
  StripeProvider,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { z } from 'zod';

import { useCreateIntent, useFinalizePurchase, useMe } from '@/api';
import {
  Button,
  Checkbox,
  colors,
  ControlledInput,
  Modal,
  Pressable,
  showErrorMessage,
  showSuccessMessage,
  Text,
  useModal,
  View,
} from '@/components/ui';
import {
  Discover as DiscoverIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
  Website as WebsiteIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';
import { getToken } from '@/lib/auth/utils';

const getPermissions = () => {
  if (Platform.OS === 'android') {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  useEffect(() => {
    getPermissions();
    if (getToken()) {
      const authKey = getToken().chat_token;
      const uikitSettings: UIKitSettings = {
        appId: '2678762915abcb85',
        region: 'eu',
        authKey: '',
      };
      CometChatUIKit.init(uikitSettings)
        .then(() => {
          console.log('CometChatUiKit successfully initialized');
          CometChatUIKit.getLoggedInUser()
            .then((user) => {
              console.log('Already user logged in:', user);
            })
            .catch(() => {
              CometChatUIKit.login({
                authToken: authKey,
              })
                .then((user) => {
                  console.log('User logged in:', user);
                })
                .catch((err) => console.error({ err }));
            });
        })
        .catch((error) => {
          console.log('Initialization failed with exception:', error);
        });
    }
  }, []);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return (
    <StripeProvider publishableKey="pk_test_51QRWYcCIwJSLeHW6HlvVJ5FUk3jQzJSTTqybwNL08t4pD6skt4tNpthSvagqOWBleg0tVi5OU6ZHA4r9E8RahRam007SqGz74n">
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => <DiscoverIcon color={color} />,
            headerRight: () => <CreateNewPostLink />,
            tabBarButtonTestID: 'discover-tab',
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => <WebsiteIcon color={color} />,
            tabBarButtonTestID: 'chats-tab',
          }}
        />
        <Tabs.Screen
          name="style"
          options={{
            title: 'Style',
            tabBarIcon: ({ color }) => <StyleIcon color={color} />,
            tabBarButtonTestID: 'style-tab',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
            tabBarButtonTestID: 'settings-tab',
          }}
        />
      </Tabs>
    </StripeProvider>
  );
}

const CreateNewPostLink = () => {
  const { data } = useMe();
  const modal = useModal();
  if (!data || String(data?.role?.name) !== 'standard user') {
    return null;
  }
  return (
    <>
      <Pressable onPress={modal.present}>
        <Text className="px-3 text-primary-300">{`${data.gem_data?.amount ?? 0} Gems`}</Text>
      </Pressable>
      <GemsModal ref={modal.ref} dismiss={modal.dismiss} />
    </>
  );
};

const Schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  cardHolderName: z.string().min(1, 'Card holder name is required'),
});

type FormType = z.infer<typeof Schema>;

const GemsModal = React.forwardRef<BottomSheetModal, { dismiss: () => void }>(
  ({ dismiss }, ref) => {
    const { data: user } = useMe();
    const queryClient = useQueryClient();
    const invalidateMe = React.useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['me'] }).catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { mutateAsync: createIntent, isPending } = useCreateIntent();
    const { mutateAsync: finalizePurchase, isPending: isFinalizing } =
      useFinalizePurchase();
    const { confirmPayment, loading } = useConfirmPayment();

    const methods = useForm<FormType>({
      defaultValues: {
        amount: '10',
        cardHolderName: String(user?.name),
      },
      mode: 'all',
      reValidateMode: 'onChange',
      resolver: zodResolver(Schema),
    });

    const { handleSubmit, control, reset } = methods;
    const onSubmit = handleSubmit(async (formData) => {
      if (Number(formData.amount) < 1) return;
      try {
        const { clientSecret } = await createIntent({
          amount: Number(formData.amount),
        });
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: String(user?.name),
              email: String(user?.email),
            },
          },
        });
        if (error) {
          showErrorMessage('Something went wrong');
          console.error('An error occurred while paying:', error);
          return;
        }
        if (paymentIntent) {
          const { id, status } = paymentIntent;
          if (status === 'Succeeded') {
            const { message } = await finalizePurchase({
              paymentId: id,
              amount: Number(formData.amount),
            });
            if (message) {
              invalidateMe();
              showSuccessMessage('Purchased successfully');
              dismiss();
            }
          }
        }
      } catch (error) {
        showErrorMessage('Something went wrong');
        console.error('An error occurred:', error);
      }
    });

    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={[420]}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
        onChange={(e) => {
          if (e === -1) {
            reset({ amount: '10', cardHolderName: String(user?.name) });
          }
        }}
        enableDynamicSizing
      >
        <>
          <View className="flex flex-col gap-2 px-4">
            <Text className="text-xl font-bold">Buy Gems</Text>
            <Text>
              Select a gem package to purchase. Gems can be used to send
              messages.
            </Text>
          </View>
          <Text className="text-grey-100 mb-1 px-4 pt-2 text-lg dark:text-neutral-100">
            Amount
          </Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { value, onChange } }) => {
              return (
                <View className="mx-4  flex flex-row gap-2">
                  {['10', '20', '50', '100', '200'].map((amount) => {
                    return (
                      <Checkbox.Root
                        key={amount}
                        checked={value === amount}
                        onChange={(val) => {
                          if (val) {
                            onChange(amount);
                          }
                        }}
                        accessibilityLabel="checkbox"
                      >
                        <Checkbox.Icon checked={value === amount} />
                        <Checkbox.Label text={amount} />
                      </Checkbox.Root>
                    );
                  })}
                </View>
              );
            }}
          />
          <View className="px-4 pt-2">
            <ControlledInput
              testID="card-holder-name-input"
              control={control}
              name="cardHolderName"
              label="Card Holder Name"
            />
          </View>
          <View className="px-1">
            <Text className="text-grey-100 mb-1 px-3 text-lg dark:text-neutral-100">
              Card Details
            </Text>
            <CardField
              postalCodeEnabled={true}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            />
          </View>
          <Button
            testID="pay-button"
            label="Pay"
            onPress={onSubmit}
            loading={isPending || loading || isFinalizing}
            variant="secondary"
            className="mx-4"
          />
        </>
      </Modal>
    );
  },
);
