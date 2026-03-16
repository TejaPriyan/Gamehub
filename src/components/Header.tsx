import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  playSound: (type: 'click' | 'hover') => void;
}

export default function Header({ playSound }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    playSound('click');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-background/80 backdrop-blur-xl border-b border-accent-cyan/20 shadow-lg shadow-accent-cyan/5'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent-cyan blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <Gamepad2 className="w-10 h-10 text-accent-cyan relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                TEJA
              </h1>
              <p className="font-paragraph text-xs text-light-foreground/60 -mt-1">
                GAMING HUB
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              onMouseEnter={() => playSound('hover')}
              className="font-paragraph text-sm uppercase text-light-foreground/80 hover:text-accent-cyan transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-cyan group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('games')}
              onMouseEnter={() => playSound('hover')}
              className="font-paragraph text-sm uppercase text-light-foreground/80 hover:text-accent-magenta transition-colors duration-300 relative group"
            >
              Games Arena
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-magenta group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => {
                playSound('click');
                scrollToSection('hero');
              }}
              onMouseEnter={() => playSound('hover')}
              className="relative px-6 py-3 font-paragraph text-sm font-bold uppercase text-primary-foreground overflow-hidden rounded-lg group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Create Card
              </span>
              <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,255,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,0,255,0.7)] transition-shadow duration-300" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              playSound('click');
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="md:hidden p-2 text-accent-cyan hover:text-accent-magenta transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-dark-background/95 backdrop-blur-xl border-t border-accent-cyan/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col gap-4 px-4 py-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="font-paragraph text-sm uppercase text-light-foreground/80 hover:text-accent-cyan transition-colors duration-300 text-left py-2 border-b border-accent-cyan/10"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('games')}
              className="font-paragraph text-sm uppercase text-light-foreground/80 hover:text-accent-magenta transition-colors duration-300 text-left py-2 border-b border-accent-magenta/10"
            >
              Games Arena
            </button>
            <button
              onClick={() => {
                playSound('click');
                scrollToSection('hero');
              }}
              className="relative px-6 py-3 font-paragraph text-sm font-bold uppercase text-primary-foreground overflow-hidden rounded-lg mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Create Card
              </span>
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
