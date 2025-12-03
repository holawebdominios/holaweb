"use client";

import { useRef, useEffect, useState } from 'react';
import { Users, Award, Star, Tag } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugin de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook personalizado para contador animado con GSAP
function useCountUp(end: number, duration: number = 1.5, start: number = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const obj = { value: start };
          gsap.to(obj, {
            value: end,
            duration: duration,
            ease: "power2.out",
            onUpdate: function() {
              setCount(Math.floor(obj.value));
            },
            onComplete: () => {
              setCount(end);
            }
          });
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [end, duration, start]);

  return { count, ref, countRef };
}

const StatCard = ({ 
  icon: Icon, 
  value, 
  suffix = '', 
  label, 
  delay = 0,
  color = '#FFCC4D'
}: { 
  icon: any; 
  value: number; 
  suffix?: string; 
  label: string; 
  delay?: number;
  color?: string;
}) => {
  const { count, ref, countRef } = useCountUp(value, 1.5, 0);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Animación de entrada con GSAP
      gsap.fromTo(cardRef.current, 
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.9 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Animación del icono
      if (iconRef.current) {
        gsap.fromTo(iconRef.current,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            delay: delay + 0.2,
            ease: "back.out(1.7)"
          }
        );
      }

      // Animación de la línea
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            delay: delay + 0.4,
            ease: "power2.out"
          }
        );
      }

      // Hover effect con GSAP
      const card = cardRef.current;
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
        if (iconRef.current) {
          gsap.to(iconRef.current, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      };
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        if (iconRef.current) {
          gsap.to(iconRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      };

      card?.addEventListener('mouseenter', handleMouseEnter);
      card?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card?.removeEventListener('mouseenter', handleMouseEnter);
        card?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className="group relative">
      <div 
        ref={cardRef}
        className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-white/50 hover:border-[#FFCC4D]/30 h-full"
      >
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFCC4D]/0 to-[#F6A823]/0 group-hover:from-[#FFCC4D]/10 group-hover:to-[#F6A823]/5 transition-all duration-500 opacity-0 group-hover:opacity-100" />
        
        {/* Icono con animación GSAP */}
        <div 
          ref={iconRef}
          className="flex justify-center mb-3 sm:mb-4 relative z-10"
        >
          <div 
            className="p-2 sm:p-3 rounded-xl relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
          </div>
              </div>
        
        {/* Contador animado */}
        <h3 
          ref={countRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative z-10"
          style={{ color: '#13314c' }}
        >
          {count.toLocaleString()}{suffix}
        </h3>
        
        <p 
          className="text-xs sm:text-sm text-gray-600 font-medium relative z-10"
          style={{ color: '#13314c' }}
        >
          {label}
        </p>
        
        {/* Línea decorativa animada */}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFCC4D] to-[#F6A823] rounded-b-xl origin-left"
        />
              </div>
            </div>
  );
};

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    {
      icon: Users,
      value: 500,
      suffix: '+',
      label: 'Clientes Satisfechos',
      delay: 0,
    },
    {
      icon: Award,
      value: 1000,
      suffix: '+',
      label: 'Dominios Verificados',
      delay: 0.1,
    },
    {
      icon: Star,
      value: 24,
      suffix: '/7',
      label: 'Monitoreo Activo',
      delay: 0.2,
    },
    {
      icon: Tag,
      value: 4,
      suffix: '',
      label: 'Planes Disponibles',
      delay: 0.3,
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animación suave de la sección completa
      gsap.fromTo(sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-8 sm:py-12 md:py-16 relative overflow-hidden"
      style={{ backgroundColor: '#fff5e6' }}
    >
      {/* Fondo con gradiente mesh animado */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
          </div>
      </div>
    </section>
  );
}

