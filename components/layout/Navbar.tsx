"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, User, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth-service";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const { user, loading } = useAuth();

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
    { href: "/#inicio", label: "Inicio", id: "inicio" },
    { href: "/#planes", label: "Planes", id: "planes" },
    { href: "/#como-funciona", label: "Cómo Funciona", id: "como-funciona" },
    { href: "/#beneficios", label: "Beneficios", id: "beneficios" },
    { href: "/#contacto", label: "Contacto", id: "contacto" },
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

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      toast.success('Sesión cerrada exitosamente');
      router.push('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  // Ocultar navbar en checkout (después de todos los hooks)
  if (pathname === '/checkout') {
    return null;
  }

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
              ? "w-full backdrop-blur-xl bg-brand-blue/95 shadow-lg shadow-black/10 rounded-none"
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
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Logo 
                  variant={isScrolled ? 'white' : 'default'} 
                  size="sm"
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
                            ? "text-brand-yellow"
                            : "text-white/90 hover:text-brand-yellow"
                          : isActive
                          ? "text-brand-blue"
                          : "text-gray-700 hover:text-brand-blue"
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.span>

                    {/* Indicador activo animado */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-[brand-yellow]/20 to-[#ff6600]/20 rounded-lg"
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
                      className="absolute inset-0 bg-gradient-to-r from-[brand-yellow]/10 to-[#ff6600]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Contact Info & Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Menu / Login Button */}
              <div className="hidden md:flex items-center space-x-3">
                {loading ? (
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                ) : user ? (
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                        isScrolled
                          ? "bg-brand-yellow/20 text-white hover:bg-brand-yellow/30 border border-brand-yellow/30"
                          : "bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"
                      )}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          {/* Overlay to close menu */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100"
                          >
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-semibold text-gray-900">
                                {user.displayName || 'Usuario'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>

                            <Link
                              href="/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Mi Dashboard</span>
                            </Link>

                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">Cerrar Sesión</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                        isScrolled
                          ? "bg-brand-yellow/20 text-white hover:bg-brand-yellow/30 border border-brand-yellow/30"
                          : "bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"
                      )}
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="text-sm font-medium">Iniciar Sesión</span>
                    </motion.button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button con animación */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-all duration-300",
                  isScrolled
                    ? "text-white hover:bg-white/10"
                    : "text-brand-blue hover:bg-gray-100"
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
                                  ? "text-brand-yellow bg-brand-yellow/20"
                                  : "text-white hover:text-brand-yellow hover:bg-white/10"
                                : isActive
                                ? "text-brand-blue bg-brand-blue/10"
                                : "text-gray-700 hover:text-brand-blue hover:bg-gray-100"
                            )}
                          >
                            {item.label}
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-brand-yellow rounded-r-full"
                                initial={false}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                    {/* Separador */}
                    <div className="border-t border-gray-200 my-4" />

                    {/* User Options Mobile */}
                    {user ? (
                      <>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: navItems.length * 0.1 }}
                          className={cn(
                            "px-4 py-3 rounded-lg",
                            isScrolled
                              ? "bg-white/5 text-white"
                              : "bg-gray-100 text-gray-900"
                          )}
                        >
                          <p className="text-sm font-semibold">{user.displayName || 'Usuario'}</p>
                          <p className="text-xs opacity-75 truncate">{user.email}</p>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: (navItems.length + 1) * 0.1 }}
                        >
                          <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300",
                              isScrolled
                                ? "bg-brand-yellow/20 text-white hover:bg-brand-yellow/30 border border-brand-yellow/30"
                                : "bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"
                            )}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="font-medium">Mi Dashboard</span>
                          </Link>
                        </motion.div>

                        <motion.button
                          onClick={handleLogout}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: (navItems.length + 2) * 0.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="font-medium">Cerrar Sesión</span>
                        </motion.button>
                      </>
                    ) : (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: navItems.length * 0.1 }}
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300",
                            isScrolled
                              ? "bg-brand-yellow/20 text-white hover:bg-brand-yellow/30 border border-brand-yellow/30"
                              : "bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"
                          )}
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="font-medium">Iniciar Sesión</span>
                        </Link>
                      </motion.div>
                    )}
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
