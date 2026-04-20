import { OnboardSlide } from '@components/onboarding/OnboardSlide';

export default function Onboard4() {

  return (
    <OnboardSlide
      headline='Create your own challenges around the city!'
      description='Set the pace, pick the route, and dare others to beat it. Your city, your rules.'
      illustration={require('../../assets/illustrations/onboard-4.png')}
      nextRoute='/(marketing)/login'
      buttonLabel='Enter'
    />
  );
}
