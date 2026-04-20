import { useSignUp } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
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

export default function SignupScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = fetchStatus === 'fetching';

  async function handleSignup() {
    setError(null);

    const { error: passwordError } = await signUp.password({
      emailAddress: email,
      password,
    });

    if (passwordError) {
      setError(passwordError.message);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.message);
      return;
    }

    setPendingVerification(true);
  }

  async function handleVerify() {
    setError(null);
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const destination = '/(setup)/know-you';
          const url = decorateUrl(destination);

          router.replace(url.startsWith('http') ? url : (destination as any));
        },
      });
    } else {
      setError('Sign-up incomplete. Please check requirements.');
    }
  }

  async function handleOAuth(
    strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook'
  ) {
    setError(null);
    const { error: oauthError } = await signUp.sso({
      strategy,
      redirectUrl: 'strideapp://oauth-callback',
      redirectCallbackUrl: 'strideapp://oauth-callback',
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <View className='flex-1 bg-neutral-0 px-6 justify-center gap-6'>
      <Text variant='title-lg'>
        {pendingVerification ? 'Verify your email' : 'Create an account'}
      </Text>

      {pendingVerification ? (
        <View className='gap-4'>
          <Text variant='body-sm' className='text-neutral-500'>
            We've sent a verification code to {email}
          </Text>
          <StyledTextInput
            label='Verification Code'
            value={code}
            onChangeText={setCode}
            keyboardType='number-pad'
            placeholder='Enter 6-digit code'
          />
          {error && (
            <Text variant='body-sm' className='text-error'>
              {error}
            </Text>
          )}
          <Button
            title='Verify Account'
            onPress={handleVerify}
            loading={isLoading}
          />
          <Pressable
            onPress={() => signUp.verifications.sendEmailCode()}
            disabled={isLoading}
          >
            <Text variant='body-sm' className='text-center text-primary-500'>
              I didn't receive a code
            </Text>
          </Pressable>
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

          <Button
            title='Create account'
            onPress={handleSignup}
            loading={isLoading}
          />

          <View className='gap-3'>
            <Button
              title='Continue with Google'
              onPress={() => handleOAuth('oauth_google')}
              loading={isLoading}
              variant='secondary'
            />
            <Button
              title='Continue with Facebook'
              onPress={() => handleOAuth('oauth_facebook')}
              loading={isLoading}
              variant='secondary'
            />
            <Button
              title='Continue with Apple'
              onPress={() => handleOAuth('oauth_apple')}
              loading={isLoading}
              variant='secondary'
            />
          </View>

          <Pressable onPress={() => router.push('/(marketing)/login')}>
            <Text variant='body-sm' className='text-center text-neutral-500'>
              Already have an account?{' '}
              <Text
                variant='body-sm'
                className='text-primary-500 font-sans-semi'
              >
                Log In
              </Text>
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
