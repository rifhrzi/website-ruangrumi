import HeroSection from '@/components/landing/hero-section';
import BestSellerSection from '@/components/landing/best-seller-section';
import FeaturesSection from '@/components/landing/features-section';
import PromoSection from '@/components/landing/promo-section';
import AmbienceSection from '@/components/landing/ambience-section';
import TestimonialSection from '@/components/landing/testimonial-section';
import CtaSection from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BestSellerSection />
      <FeaturesSection />
      <PromoSection />
      <AmbienceSection />
      <TestimonialSection />
      <CtaSection />
    </>
  );
}
