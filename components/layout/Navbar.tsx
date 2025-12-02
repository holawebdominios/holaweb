"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detectar sección activa
      const sections = ["servicios", "contacto"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Llamar una vez al montar
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al hacer click fuera
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navItems = [
    { href: "/", label: "Inicio", id: "" },
    { href: "/verificar", label: "Verificar", id: "verificar" },
    { href: "/planes", label: "Planes", id: "planes" },
    { href: "/faq", label: "FAQ", id: "faq" },
    { href: "/contacto", label: "Contacto", id: "contacto" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "px-0" : "px-4 sm:px-6 pt-4 sm:pt-6"
        )}
      >
        <motion.div
          className={cn(
            "transition-all duration-500",
            isScrolled
              ? "w-full backdrop-blur-xl bg-[#13314c]/95 shadow-lg shadow-black/10 rounded-none"
              : "max-w-5xl mx-auto backdrop-blur-md bg-white/90 shadow-md rounded-2xl"
          )}
          style={{
            borderBottom: isScrolled
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-500 px-4 sm:px-6 lg:px-8",
              isScrolled ? "h-14" : "h-16"
            )}
          >
            {/* Logo con animación */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "text-2xl font-bold transition-all duration-300 relative",
                  isScrolled ? "text-white" : "text-[#13314c]"
                )}
              >
                <h3 className="text-2xl font-bold mb-4">
                  👋 Hola
                  <br />
                  Web
                </h3>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#ff9900] to-[#ff6600] opacity-0 group-hover:opacity-20 blur-xl"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation con indicador activo */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === "/" && activeSection === item.id;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="relative px-4 py-2 group"
                  >
                    <motion.span
                      className={cn(
                        "font-medium text-sm relative z-10 transition-colors duration-300",
                        isScrolled
                          ? isActive
                            ? "text-[#ff9900]"
                            : "text-white/90 hover:text-[#ff9900]"
                          : isActive
                          ? "text-[#13314c]"
                          : "text-gray-700 hover:text-[#13314c]"
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.span>

                    {/* Indicador activo animado */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-[#ff9900]/20 to-[#ff6600]/20 rounded-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#ff9900]/10 to-[#ff6600]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Contact Info & Menu Button */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-4">
                <motion.a
                  href="tel:+541134976239"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                    isScrolled
                      ? "bg-[#ff9900]/20 text-white hover:bg-[#ff9900]/30 border border-[#ff9900]/30"
                      : "bg-[#13314c]/5 text-[#13314c] hover:bg-[#13314c]/10"
                  )}
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">+54 11 1234-5678</span>
                </motion.a>
              </div>

              {/* Mobile Menu Button con animación */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-all duration-300",
                  isScrolled
                    ? "text-white hover:bg-white/10"
                    : "text-[#13314c] hover:bg-gray-100"
                )}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu con backdrop blur y animación */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[-1] md:hidden"
                />

                {/* Menu Content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="md:hidden overflow-hidden"
                >
                  <div
                    className={cn(
                      "px-4 pb-6 pt-4 space-y-2",
                      isScrolled ? "bg-transparent" : "bg-transparent"
                    )}
                  >
                    {navItems.map((item, index) => {
                      const isActive =
                        pathname === "/" && activeSection === item.id;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(item.href);
                            }}
                            className={cn(
                              "block px-4 py-3 rounded-lg font-medium transition-all duration-300 relative",
                              isScrolled
                                ? isActive
                                  ? "text-[#ff9900] bg-[#ff9900]/20"
                                  : "text-white hover:text-[#ff9900] hover:bg-white/10"
                                : isActive
                                ? "text-[#13314c] bg-[#13314c]/10"
                                : "text-gray-700 hover:text-[#13314c] hover:bg-gray-100"
                            )}
                          >
                            {item.label}
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff9900] rounded-r-full"
                                initial={false}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                    <motion.a
                      href="tel:+541134976239"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navItems.length * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-3 rounded-lg mt-4 transition-all duration-300",
                        isScrolled
                          ? "bg-[#ff9900]/20 text-white border border-[#ff9900]/30"
                          : "bg-[#13314c]/10 text-[#13314c]"
                      )}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">+54 11 1234-5678</span>
                    </motion.a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Navbar;
