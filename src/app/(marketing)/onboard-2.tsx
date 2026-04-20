import { OnboardSlide } from '@components/onboarding/OnboardSlide';

export default function Onboard2() {
  return (
    <OnboardSlide
      headline='Spot challenges around the city and start running!'
      description='Find live challenges near you, jump in, and see how you stack up against the city.'
      illustration={require('../../assets/illustrations/onboard-2.png')}
      nextRoute='/(marketing)/onboard-3'
    />
  );
}
