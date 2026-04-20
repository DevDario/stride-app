import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { StyledTextInput } from '@components/TextInput';
import { useOnboardingStore } from '@store/onboardingStore';

export default function KnowYouScreen() {
  const router = useRouter();
  const { profile, setName, setBirthDate, setGender } = useOnboardingStore();

  const isValid = profile.name.trim().length > 0;

  return (
    <View className='flex-1 bg-neutral-0 px-6 pt-16 pb-12 justify-between'>
      <View className='gap-6'>
        <Text variant='title-lg'>We'd love to get to know you better</Text>

        <View className='gap-4'>
          <StyledTextInput
            label='Your name'
            value={profile.name}
            onChangeText={setName}
            autoCapitalize='words'
          />
          <StyledTextInput
            label='Birth date'
            value={profile.birthDate ?? ''}
            onChangeText={setBirthDate}
            placeholder='YYYY-MM-DD'
            keyboardType='numeric'
          />
          {/* replace with picker later */}
          <StyledTextInput
            label='Gender'
            value={profile.gender ?? ''}
            onChangeText={(v) => setGender(v as never)}
            placeholder='male / female / non_binary / prefer_not_to_say'
            autoCapitalize='none'
          />
        </View>
      </View>

      <Button
        title='Continue'
        onPress={() => router.push('/(setup)/frequency')}
        disabled={!isValid}
      />
    </View>
  );
}
