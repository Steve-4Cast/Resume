'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Briefcase,
  FolderOpen,
  Mail,
  PanelLeft,
  PanelLeftClose,
  Brain,
  Target,
  FileText
} from 'lucide-react';

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Load saved desktop drawer state from localStorage, default closed on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      // Always start closed on mobile
      setIsDesktopOpen(false);
    } else {
      // On desktop, check localStorage or default to true
      const savedState = localStorage.getItem('sidebar-open');
      setIsDesktopOpen(savedState !== null ? savedState === 'true' : true);
    }
  }, []);

  // Save desktop drawer state to localStorage and dispatch event
  const toggleDesktopDrawer = () => {
    const newState = !isDesktopOpen;
    setIsDesktopOpen(newState);
    localStorage.setItem('sidebar-open', String(newState));

    // Dispatch custom event for layout to listen
    window.dispatchEvent(new CustomEvent('sidebar-toggle', {
      detail: { isOpen: newState }
    }));
  };

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Track active section on scroll - no longer needed since sections are separate pages
  // Keeping the state for potential future use
  useEffect(() => {
    // Removed section tracking since AI Philosophy, Projects, Future Vision, and Summary are now separate pages
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileOpen(false);
    }
  };

  const isActive = (path: string, section?: string) => {
    if (section) {
      return pathname === path && activeSection === section;
    }
    return pathname === path;
  };

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/about', icon: User },
    { label: 'Experience', href: '/experience', icon: Briefcase },
    { label: 'AI Philosophy', href: '/ai-philosophy', icon: Brain },
    { label: 'Projects', href: '/projects', icon: FolderOpen },
    { label: 'Future Vision', href: '/future-vision', icon: Target },
    { label: 'Summary', href: '/summary', icon: FileText },
    { label: 'Contact', href: '#contact', icon: Mail, isButton: true }
  ];

  const scrollToContact = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
      setIsMobileOpen(false);
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  const menuItemVariants = {
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }),
    closed: {
      opacity: 0,
      x: -20
    }
  };

  return (
    <>
      {/* Desktop Drawer Toggle Button - Always visible */}
      <motion.button
        onClick={toggleDesktopDrawer}
        className="hidden lg:flex fixed top-4 left-4 z-50 p-3 bg-denim text-white rounded-lg shadow-xl hover:bg-bamboo transition-all focus-visible:ring-2 focus-visible:ring-sunflower focus-visible:outline-none items-center gap-2 group"
        aria-label={isDesktopOpen ? 'Close drawer' : 'Open drawer'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          left: isDesktopOpen ? '200px' : '16px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isDesktopOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
      </motion.button>

      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-denim text-white rounded-lg shadow-xl hover:bg-bamboo transition-colors focus-visible:ring-2 focus-visible:ring-sunflower focus-visible:outline-none"
        aria-label="Toggle menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <PanelLeftClose size={24} /> : <PanelLeft size={24} />}
      </motion.button>

      {/* Mobile Overlay with Backdrop Blur */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-40"
            onClick={() => setIsMobileOpen(false)}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <AnimatePresence mode="wait">
        {(isMobileOpen || isDesktopOpen) && (
          <motion.aside
            className="fixed top-0 left-0 h-full bg-white border-r border-denim/10 z-40 w-64 lg:w-50 shadow-2xl"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                className="p-6 border-b border-denim/10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Link
                  href="/"
                  className="text-xl font-bold text-denim hover:text-bamboo transition-colors block focus-visible:ring-2 focus-visible:ring-denim focus-visible:outline-none rounded group"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="group-hover:scale-105 inline-block transition-transform">
                    Steve Dickens
                  </span>
                </Link>
                <p className="text-sm text-foreground/60 mt-1">Developer & Entrepreneur</p>
              </motion.div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const itemIsActive = isActive(item.href);

                    return (
                      <motion.li
                        key={item.label}
                        custom={index}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        {item.isButton ? (
                          <motion.button
                            onClick={scrollToContact}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-denim focus-visible:outline-none bg-denim text-white hover:bg-bamboo group"
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <Icon size={20} />
                            </motion.div>
                            <span className="font-medium">{item.label}</span>
                          </motion.button>
                        ) : (
                          <>
                            <Link
                              href={item.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                                focus-visible:ring-2 focus-visible:ring-denim focus-visible:outline-none
                                ${itemIsActive
                                  ? 'bg-denim/10 text-denim font-semibold'
                                  : 'text-foreground hover:bg-cream hover:text-denim'
                                }
                              `}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                              >
                                <Icon size={20} />
                              </motion.div>
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
