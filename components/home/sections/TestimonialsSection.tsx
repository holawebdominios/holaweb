"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "María González",
      project: "Emprendimiento Digital",
      rating: 5,
      text: "Encontré el dominio perfecto para mi tienda online en minutos. El proceso es súper rápido y me mantienen informada de todo. Excelente servicio.",
      avatar: "MG"
    },
    {
      name: "Carlos Rodríguez",
      project: "Agencia de Marketing",
      rating: 5,
      text: "Gestiono más de 15 dominios de clientes con ellos. Las alertas de vencimiento me salvaron varias veces. Servicio profesional y confiable.",
      avatar: "CR"
    },
    {
      name: "Ana Martínez",
      project: "Estudio Contable",
      rating: 5,
      text: "La verificación es instantánea y muy precisa. Pude asegurar nuestro dominio .com.ar sin complicaciones. El soporte es excelente.",
      avatar: "AM"
    },
    {
      name: "Roberto Silva",
      project: "E-commerce",
      rating: 5,
      text: "Uso el plan profesional hace 2 años. Nunca tuve un problema con vencimientos gracias a sus alertas automáticas. Vale cada peso.",
      avatar: "RS"
    },
    {
      name: "Laura Fernández",
      project: "Diseño Web",
      rating: 5,
      text: "Como diseñadora web, necesito verificar dominios constantemente. Esta plataforma es la más rápida y confiable que encontré.",
      avatar: "LF"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#fff5e6' }}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className={cn([
              integralCF.className,
              "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            ])}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Confianza que Habla por Sí Misma
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Más de 500 clientes confían en nosotros para gestionar sus dominios
          </motion.p>
        </motion.div>

        {/* Desktop: Grid con cards mejoradas */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

// Componente de card de testimonio mejorado
const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => {
  const [ratingAnimation, setRatingAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRatingAnimation(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group relative h-full"
    >
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-[#ff9900]/30 h-full flex flex-col">
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff9900]/0 to-[#ff6600]/0 group-hover:from-[#ff9900]/5 group-hover:to-[#ff6600]/5 transition-all duration-500 opacity-0 group-hover:opacity-100" />
        
        {/* Icono de comillas decorativo */}
        <motion.div
          className="absolute top-6 right-6 text-[#ff9900]/10"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
        >
          <Quote className="h-16 w-16" />
        </motion.div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Rating con animación */}
          <motion.div 
            className="flex items-center mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          >
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={ratingAnimation ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 + 0.3 + i * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <Star className="h-5 w-5 text-amber-400 fill-current" />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Texto del testimonio */}
          <motion.p 
            className="text-gray-700 leading-relaxed mb-6 italic flex-1 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
          >
            "{testimonial.text}"
          </motion.p>
          
          {/* Información del cliente */}
          <motion.div 
            className="border-t border-gray-200 pt-4 flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
          >
            {/* Avatar */}
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff9900] to-[#ff6600] flex items-center justify-center text-white font-bold text-sm shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {testimonial.avatar}
            </motion.div>
            
            <div>
              <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-[#ff9900] font-medium">{testimonial.project}</p>
            </div>
          </motion.div>
        </div>

        {/* Línea decorativa animada */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9900] to-[#ff6600] rounded-b-3xl"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.6 }}
        />
      </div>
    </motion.div>
  );
};

