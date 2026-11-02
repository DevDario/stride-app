import { useSignUp, useSSO } from '@clerk/expo';
import { Button } from '@components/Button';
import { Screen } from '@components/Screen';
import { Text } from '@components/Text';
import { StyledTextInput } from '@components/TextInput';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ArrowUpRight } from 'lucide-react-native';
import { useState } from 'react';
import { View, Pressable } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = fetchStatus === 'fetching';

  async function handleSignup() {
    setError(null);

    const { error: createError } = await signUp.create({
      emailAddress: email,
      password,
    });

    if (createError) {
      setError(createError.message);
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
        navigate: () => router.push('/(setup)/know-you'),
      });
    } else {
      setError('Sign-up incomplete. Please check requirements.');
    }
  }

  async function handleOAuth(strategy: 'oauth_google' | 'oauth_facebook') {
    setError(null);
    try {
      const redirectUrl = Linking.createURL('oauth-callback', {
        scheme: 'strideapp',
      });
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      setError(err?.message || 'OAuth failed');
    }
  }

  return (
    <Screen className='px-6 justify-center gap-6'>
      <View className='flex items-left gap-px'>
        <Text variant='title-lg' className='align-left justify-start'>
          {pendingVerification ? 'Verify your email' : 'Create your account'}
        </Text>
        <Text variant='body' className='flex text-left items-start'>
          Be ready to face new challenges everyday
        </Text>
      </View>

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
            title='Create an account'
            onPress={handleSignup}
            loading={isLoading}
          />

          <Text variant='body' className='flex text-center items-center'>
            or
          </Text>

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
    </Screen>
  );
}
