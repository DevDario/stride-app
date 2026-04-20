import { OnboardSlide } from '@components/onboarding/OnboardSlide';

export default function Onboard3() {
  return (
    <OnboardSlide
      headline='Explore your area without leaving home.'
      description='Scope out routes, check area ratings, and plan your next run — all before you lace up.'
      illustration={require('../../assets/illustrations/onboard-3.png')}
      nextRoute='/(marketing)/onboard-4'
      buttonLabel='Almost there'
    />
  );
}
