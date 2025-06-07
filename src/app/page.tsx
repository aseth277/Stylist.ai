import HeroSection from '@/components/sections/HeroSection';
import HowItWorksSummarySection from '@/components/sections/HowItWorksSummarySection';
import FeaturesGridSection from '@/components/sections/FeaturesGridSection';
import AiOutfitPreviewSection from '@/components/sections/AiOutfitPreviewSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import WaitlistSignupSection from '@/components/sections/WaitlistSignupSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSummarySection />
      <FeaturesGridSection />
      <AiOutfitPreviewSection />
      <TestimonialsSection />
      <WaitlistSignupSection />
    </>
  );
}
