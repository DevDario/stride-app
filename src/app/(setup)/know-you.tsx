import { BackButton } from '@components/BackButton';
import { Button } from '@components/Button';
import { DateField } from '@components/DateField';
import { OptionField, type OptionFieldOption } from '@components/OptionField';
import { Screen } from '@components/Screen';
import { Text } from '@components/Text';
import { StyledTextInput } from '@components/TextInput';
import { useOnboardingStore, type Gender } from '@store/onboardingStore';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

const GENDER_OPTIONS: OptionFieldOption<Gender>[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const EARLIEST_BIRTH_DATE = new Date(1900, 0, 1);
const TODAY = new Date();

export default function KnowYouScreen() {
  const router = useRouter();
  const { profile, setName, setBirthDate, setGender } = useOnboardingStore();

  const isValid = profile.name.trim().length > 0;

  return (
    <Screen className='px-6 pb-12 justify-between'>
      <View className='gap-6 mb-4'>
        <BackButton />

        <Text variant='title-lg'>We'd love to get to know you better</Text>

        <View className='gap-4'>
          <StyledTextInput
            label='Your name'
            value={profile.name}
            onChangeText={setName}
            autoCapitalize='words'
          />
          <DateField
            label='Birth date'
            value={profile.birthDate}
            onChange={setBirthDate}
            minimumDate={EARLIEST_BIRTH_DATE}
            maximumDate={TODAY}
          />
          <OptionField
            label='Gender'
            value={profile.gender}
            options={GENDER_OPTIONS}
            onChange={setGender}
            placeholder='Select your gender'
          />
        </View>
      </View>

      <Button
        title='Continue'
        onPress={() => router.push('/(setup)/frequency')}
        disabled={!isValid}
      />
    </Screen>
  );
}
