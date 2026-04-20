import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { ArrowUpRight } from 'lucide-react-native';
import { StyledTextInput } from '@components/TextInput';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

global.CustomEvent =
  global.CustomEvent ||
  class CustomEvent {
    constructor(event: string, params: any = {}) {
      this.type = event;
      this.detail = params.detail || {};
    }
    type: string;
    detail: any;
  };

export default function LoginScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = fetchStatus === 'fetching';

  async function handleLogin() {
    setError(null);

    const { error: loginError } = await signIn.password({
      identifier: email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const destination = '/(tabs)';
          const url = decorateUrl(destination);
          router.replace(url.startsWith('http') ? url : (destination as any));
        },
      });
    } else if (signIn.status === 'needs_client_trust') {
      await signIn.mfa.sendEmailCode();
      setPendingVerification(true);
    } else if (signIn.status === 'needs_second_factor') {
      const factor = signIn.supportedSecondFactors.find(
        (f) => f.strategy === 'phone_code' || f.strategy === 'email_code'
      );
      if (factor?.strategy === 'phone_code') await signIn.mfa.sendPhoneCode();
      else await signIn.mfa.sendEmailCode();

      setPendingVerification(true);
    } else {
      setError(`Sign-in status: ${signIn.status}. Additional steps required.`);
    }
  }

  async function handleVerifyCode() {
    setError(null);

    let result = await signIn.mfa.verifyEmailCode({ code });

    if (
      result.error &&
      signIn.supportedSecondFactors.some((f) => f.strategy === 'phone_code')
    ) {
      result = await signIn.mfa.verifyPhoneCode({ code });
    }

    const verifyError = result.error;

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const destination = '/(tabs)';
          const url = decorateUrl(destination);

          router.replace(url.startsWith('http') ? url : (destination as any));
        },
      });
    }
  }

  async function handleOAuth(strategy: 'oauth_google' | 'oauth_facebook') {
    setError(null);
    const { error: oauthError } = await signIn.sso({
      strategy,
      redirectUrl: 'strideapp://oauth-callback',
      redirectCallbackUrl: 'strideapp://oauth-callback',
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <View className='flex-1 bg-neutral-0 px-6 justify-center gap-6'>
      <Text variant='title-lg' className='flex text-center items-center'>
        {pendingVerification ? 'Verification Required' : 'Login'}
      </Text>

      {pendingVerification ? (
        <View className='gap-4'>
          <Text variant='body-sm' className='text-neutral-500'>
            Please enter the verification code sent to your email or phone.
          </Text>
          <StyledTextInput
            label='Verification Code'
            value={code}
            onChangeText={setCode}
            keyboardType='number-pad'
          />
          {error && (
            <Text variant='body-sm' className='text-error'>
              {error}
            </Text>
          )}
          <Button
            title='Verify & Login'
            onPress={handleVerifyCode}
            loading={isLoading}
          />
          <Button
            title='Cancel'
            variant='secondary'
            onPress={() => {
              setPendingVerification(false);
              signIn.reset();
            }}
          />
        </View>
      ) : (
        <>
          <View className='gap-4'>
            <StyledTextInput
              label='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <StyledTextInput
              label='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && (
            <Text variant='body-sm' className='text-error'>
              {error}
            </Text>
          )}

          <Button title='Login' onPress={handleLogin} loading={isLoading} />

          <View className='gap-3'>
            <Button
              title='Continue with Google'
              onPress={() => handleOAuth('oauth_google')}
              loading={isLoading}
              variant='secondary'
              icon={ArrowUpRight}
            />
            <Button
              title='Continue with Facebook'
              onPress={() => handleOAuth('oauth_facebook')}
              loading={isLoading}
              variant='secondary'
              icon={ArrowUpRight}
            />
          </View>

          <Pressable onPress={() => router.push('/(marketing)/signup')}>
            <Text variant='body-sm' className='text-center text-neutral-500'>
              Need an account?{' '}
              <Text
                variant='body-sm'
                className='text-primary-500 font-sans-semi'
              >
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
