import { cn } from '@/lib/utils';
import { integralCF } from '@/styles/fonts';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  const sizes = {
    sm: {
      emoji: 'text-2xl',
      text: 'text-lg',
    },
    md: {
      emoji: 'text-3xl',
      text: 'text-xl',
    },
    lg: {
      emoji: 'text-4xl',
      text: 'text-2xl',
    },
  };

  const colors = {
    default: 'text-brand-blue',
    white: 'text-white',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Emoji de mano */}
      <span className={sizes[size].emoji}>👋</span>
      
      {/* Texto */}
      <div className={cn(integralCF.className, 'font-bold leading-tight', colors[variant])}>
        <div className={sizes[size].text}>Hola</div>
        <div className={sizes[size].text}>Empresa</div>
      </div>
    </div>
  );
}

