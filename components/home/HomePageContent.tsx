"use client";

import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import BenefitsSection from './sections/BenefitsSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FeaturedPlansSection from './sections/FeaturedPlansSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';

const HomePageContent = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5491112345678";
    const message = "Hola! Me gustaría conocer más sobre el servicio de verificación de dominios.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero + Verificador integrado */}
      <HeroSection />
      
      {/* 2. Planes - Mostrar oferta inmediatamente */}
      <FeaturedPlansSection />
      
      {/* 3. Cómo Funciona - Educar al usuario */}
      <HowItWorksSection />
      
      {/* 4. Beneficios - Por qué elegirnos */}
      <BenefitsSection />
      
      {/* 5. Estadísticas - Prueba social con números */}
      <StatsSection />
      
      {/* 6. Testimonios - Prueba social con experiencias */}
      <TestimonialsSection />
      
      {/* 7. CTA Final */}
      <CTASection onWhatsAppClick={handleWhatsAppClick} />
    </div>
  );
};

export default HomePageContent;

