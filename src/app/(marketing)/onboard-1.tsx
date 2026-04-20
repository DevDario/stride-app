import { OnboardSlide } from '@components/onboarding/OnboardSlide'

export default function Onboard1() {
    return (
        <OnboardSlide
            headline="Run with your new companion"
            description="Track every step, challenge every route. Stride is built for runners who want more than just a finish line."
            illustration={require('../../assets/illustrations/onboard-1.png')}
            nextRoute="/(marketing)/onboard-2"
            buttonLabel="Start"
        />
    )
}