import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Menu, X, Sparkles, Activity, Shield, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  playSound: (type: 'click' | 'hover') => void;
}

export default function Header({ playSound }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
          ? 'bg-dark-background/90 backdrop-blur-xl border-b border-accent-cyan/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent-cyan blur-xl opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 w-11 h-11 rounded-xl bg-dark-background/80 border border-accent-cyan/50 flex items-center justify-center group-hover:scale-105 group-hover:border-accent-magenta transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  <Gamepad2 className="w-6 h-6 text-accent-cyan group-hover:text-accent-magenta transition-colors" />
                </div>
              </div>
              <div>
                <h1 className="font-heading text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta tracking-tight">
                  TEJA PRIYAN
                </h1>
                <p className="font-mono text-[10px] text-light-foreground/60 tracking-widest uppercase -mt-0.5">
                  WORLD • CYBER ARCADE
                </p>
              </div>
            </Link>

            {/* Live Status Beacon */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[11px] text-light-foreground/70">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
              <span className="text-accent-cyan font-bold">120 FPS</span>
              <span className="text-light-foreground/30">//</span>
              <span>8 ARENA GAMES LIVE</span>
            </div>
          </div>

          {/* Desktop Navigation - Cleaned of external portfolio/github */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('games')}
              onMouseEnter={() => playSound('hover')}
              className="font-mono text-xs uppercase tracking-wider text-light-foreground/75 hover:text-accent-cyan transition-colors py-1 relative group flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-accent-cyan" />
              Battle Arena
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-cyan group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('hero')}
              onMouseEnter={() => playSound('hover')}
              className="font-mono text-xs uppercase tracking-wider text-light-foreground/75 hover:text-accent-magenta transition-colors py-1 relative group flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-accent-magenta" />
              Operative Card
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-magenta group-hover:w-full transition-all duration-300" />
            </button>

            {/* Create Card CTA Button */}
            <button
              onClick={() => {
                playSound('click');
                scrollToSection('hero');
              }}
              onMouseEnter={() => playSound('hover')}
              className="relative px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-dark-background overflow-hidden rounded-xl group shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta" />
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Forge Card
              </span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              playSound('click');
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-accent-cyan hover:text-accent-magenta transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-dark-background/95 backdrop-blur-2xl border-t border-accent-cyan/20 px-6 py-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => scrollToSection('games')}
              className="w-full text-left font-mono text-sm uppercase text-light-foreground/80 hover:text-accent-cyan py-2 border-b border-white/5 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-accent-cyan" />
              Battle Arena (8 Playable Games)
            </button>
            <button
              onClick={() => scrollToSection('hero')}
              className="w-full text-left font-mono text-sm uppercase text-light-foreground/80 hover:text-accent-magenta py-2 border-b border-white/5 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-accent-magenta" />
              Forge Operative Card
            </button>
            <button
              onClick={() => {
                playSound('click');
                scrollToSection('hero');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta text-dark-background font-mono text-xs font-black uppercase text-center mt-2 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
            >
              Forge Operative Card
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
