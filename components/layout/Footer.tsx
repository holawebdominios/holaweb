"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Ocultar footer en checkout
  if (pathname === '/checkout') {
    return null;
  }

  const footerLinks = {
    servicios: [
      { label: 'Verificar Dominios', href: '/#verificar' },
      { label: 'Planes y Precios', href: '/planes' },
      { label: 'Preguntas Frecuentes', href: '/faq' },
      { label: 'Contacto', href: '/contacto' },
    ],
    empresa: [
      { label: 'Sobre Nosotros', href: '/#nosotros' },
      { label: 'Cómo Funciona', href: '/#como-funciona' },
      { label: 'Blog', href: '/blog' },
    ],
  };

  // Ocultar footer en checkout (después de validar pathname)
  if (pathname === '/checkout') {
    return null;
  }

  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo variant="white" size="md" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Verificación y gestión profesional de dominios argentinos con tecnología RDAP.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-brand-yellow transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-brand-yellow transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-brand-yellow transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-yellow text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-yellow text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+541112345678"
                  className="flex items-start space-x-3 text-gray-300 hover:text-brand-yellow text-sm transition-colors"
                >
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>+54 11 3497-6239</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:holawebdominios@gmail.com"
                  className="flex items-start space-x-3 text-gray-300 hover:text-brand-yellow text-sm transition-colors"
                >
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>holawebdominios@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start space-x-3 text-gray-300 text-sm">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {currentYear} Hola Empresa. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-gray-300">
              <Link href="/privacidad" className="hover:text-brand-yellow transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-brand-yellow transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

