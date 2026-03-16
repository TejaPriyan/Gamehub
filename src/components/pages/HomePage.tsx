// HPI 1.7-G
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Sparkles, Zap, Trophy, Target, ChevronDown, Crosshair, Cpu, Activity } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlayerCardGenerator from '@/components/PlayerCardGenerator';
import MiniGamesArena from '@/components/MiniGamesArena';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Image } from '@/components/ui/image';

export default function HomePage() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const loreRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax Transforms
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const loreY = useTransform(scrollYProgress, [0.3, 0.6], [100, -100]);

  // InView Triggers
  const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-20%" });
  const isLoreInView = useInView(loreRef, { once: true, margin: "-20%" });

  // Play sound effect
  const playSound = (type: 'click' | 'hover') => {
    if (audioEnabled) {
      const audio = new Audio();
      if (type === 'click') {
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LdjHAU2kdXzzn0vBSF1xe/glEILElyx6OyrWBUIRJzd8sFuIwUuhM/z3I4+CRZnvO/mnVEMDU6k4PG6ZRwFNI/T8tGAMQUfcsXv45ZFCw9YrujusVsWCEKZ2/K8aygFKn/M8tyOPQkXZ7vv6aFUDA1MouDxt2YcBTGOz/PUhDQGHG/D7+aZSgwMVKzn77RfGQc9ldf0wHEqBSh+y/LajT0KGGe67+mjVgwNSp/e8bllHQUwjM7z1YU2Bhxuw+/nmksMC1Kq5u+2YRsGPJPV9L90LAUmfMry3I4+CRhnue/ro1kNDEie3fK9aB4FLYrM8tiIOQYfbcLv6JxPDBBPqOXwtmMcBjKP0vPTgjMGHXHE7+aaSQwLUqrl77RgGwY7kdTzwHQuBSR6yPLbjz8JGWe47+ylWw0MRpzb8sFsIAUshM7y2Ik3CBppu+/mnE4MDlCl4fC3YxwGNo/S88+BMgYeb8Pv5ppKDAtRqeXvtWEbBjuR1PPAdC0FI3nH8tyOPwkaZ7jv66VbDQxFm9rxwWsgBS2EzvLYiTcIG2m77+acTgwOUKXh8LdjHAU2j9Lzz4EyBh5vw+/mmkoMC1Gp5e+1YRsGO5HU88B0LQUjec';
      } else {
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LdjHAU2kdXzzn0vBSF1xe/glEILElyx6OyrWBUIRJzd8sFuIwUuhM/z3I4+CRZnvO/mnVEMDU6k4PG6ZRwFNI/T8tGAMQUfcsXv45ZFCw9YrujusVsWCEKZ2/K8aygFKn/M8tyOPQkXZ7vv6aFUDA1MouDxt2YcBTGOz/PUhDQGHG/D7+aZSgwMVKzn77RfGQc9ldf0wHEqBSh+y/LajT0KGGe67+mjVgwNSp/e8bllHQUwjM7z1YU2Bhxuw+/nmksMC1Kq5u+2YRsGPJPV9L90LAUmfMry3I4+CRhnue/ro1kNDEie3fK9aB4FLYrM8tiIOQYfbcLv6JxPDBBPqOXwtmMcBjKP0vPTgjMGHXHE7+aaSQwLUqrl77RgGwY7kdTzwHQuBSR6yPLbjz8JGWe47+ylWw0MRpzb8sFsIAUshM7y2Ik3CBppu+/mnE4MDlCl4fC3YxwGNo/S88+BMgYeb8Pv5ppKDAtRqeXvtWEbBjuR1PPAdC0FI3nH8tyOPwkaZ7jv66VbDQxFm9rxwWsgBS2EzvLYiTcIG2m77+acTgwOUKXh8LdjHAU2j9Lzz4EyBh5vw+/mmkoMC1Gp5e+1YRsGO5HU88B0LQUjec';
      }
      audio.volume = 0.15;
      audio.play().catch(() => {});
    }
  };

  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);
    return () => document.removeEventListener('click', enableAudio);
  }, []);

  const scrollToGames = () => {
    playSound('click');
    gamesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-dark-background text-light-foreground selection:bg-accent-magenta/30 selection:text-accent-cyan overflow-clip font-paragraph">
      
      {/* Global Styles for Bespoke Cyberpunk Effects */}
      <style>{`
        .cyber-scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
          pointer-events: none;
        }
        .cyber-clip-path {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
        }
        .cyber-clip-path-reverse {
          clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px);
        }
        .glitch-text-cyan {
          text-shadow: 2px 0px 4px rgba(0, 255, 255, 0.6), -2px 0px 2px rgba(255, 0, 255, 0.4);
        }
        .glitch-text-magenta {
          text-shadow: 2px 0px 4px rgba(255, 0, 255, 0.6), -2px 0px 2px rgba(0, 255, 255, 0.4);
        }
        .neon-border-glow {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 15px rgba(0, 255, 255, 0.1);
        }
        .grid-bg {
          background-image: 
            linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Global Overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
        <div className="absolute inset-0 cyber-scanlines opacity-50 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1A1A2E_100%)] opacity-80"></div>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent-cyan z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <Header playSound={playSound} />

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section 
          ref={heroRef}
          id="hero" 
          className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-10 px-4 lg:px-8 overflow-hidden"
        >
          {/* Background Grid specific to Hero */}
          <div className="absolute inset-0 grid-bg opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

          <motion.div 
            className="w-full max-w-[120rem] mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            
            {/* Left Column: Typography & Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              
              {/* System Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-flex items-center gap-3 px-4 py-2 border border-accent-cyan/30 bg-accent-cyan/5 backdrop-blur-sm cyber-clip-path-reverse self-start"
              >
                <Activity className="w-4 h-4 text-accent-cyan animate-pulse" />
                <span className="text-xs tracking-[0.2em] text-accent-cyan uppercase font-bold">
                  System.Online // Nexus.Active
                </span>
              </motion.div>

              {/* Main Headline */}
              <div className="space-y-2 relative">
                {/* Decorative background element */}
                <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-cyan via-accent-magenta to-transparent opacity-50 hidden md:block"></div>
                
                <motion.h1 
                  className="font-heading text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter uppercase"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-light-foreground/70 glitch-text-cyan">
                    Forge
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta glitch-text-magenta">
                    Your Legend
                  </span>
                </motion.h1>
              </div>

              {/* Subheadline */}
              <motion.p 
                className="text-lg md:text-xl text-light-foreground/70 max-w-2xl leading-relaxed border-l-2 border-accent-purple/50 pl-6"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Enter the digital arena. Create your unique player identity, connect with the grid, and dominate the mini-games battlefield. The neon awaits.
              </motion.p>

              {/* Action Area */}
              <motion.div 
                className="flex flex-wrap items-center gap-6 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button 
                  onClick={scrollToGames}
                  onMouseEnter={() => playSound('hover')}
                  className="group relative px-8 py-4 bg-accent-cyan text-dark-background font-heading font-bold text-lg uppercase tracking-wider cyber-clip-path overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Enter Arena <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </button>

                <div className="flex items-center gap-4 text-sm text-light-foreground/50 font-mono">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping"></span>
                    Live Servers
                  </span>
                  <span>//</span>
                  <span>v2.0.4</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Generator Component */}
            <motion.div 
              className="lg:col-span-5 relative mt-12 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={isHeroInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 50 }}
              style={{ perspective: 1000 }}
            >
              {/* Decorative framing for the generator */}
              <div className="absolute -inset-4 bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 cyber-clip-path blur-xl opacity-50 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-accent-cyan via-accent-purple to-accent-magenta cyber-clip-path opacity-30"></div>
              
              <div className="relative z-10 bg-dark-background/80 backdrop-blur-md border border-white/10 cyber-clip-path p-1 neon-border-glow">
                <div className="cyber-clip-path overflow-hidden bg-dark-background">
                  <PlayerCardGenerator playSound={playSound} />
                </div>
              </div>

              {/* Floating decorative elements */}
              <motion.div 
                className="absolute -right-8 -top-8 text-accent-cyan/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Target className="w-24 h-24" />
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
            onClick={scrollToGames}
            onMouseEnter={() => playSound('hover')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="text-xs tracking-widest text-light-foreground/50 uppercase font-mono">Scroll to initialize</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 text-accent-cyan" />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS TICKER SECTION (Sticky & Horizontal Scroll illusion) */}
        <section ref={statsRef} className="relative py-12 border-y border-white/5 bg-dark-background/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 cyber-scanlines opacity-30"></div>
          
          <div className="w-full max-w-[120rem] mx-auto px-4 relative z-10">
            <motion.div 
              className="flex flex-wrap md:flex-nowrap justify-between items-center gap-8 md:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
            >
              {[
                { icon: Zap, value: "50+", label: "Active Players", color: "text-accent-cyan" },
                { icon: Trophy, value: "10+", label: "Mini Games", color: "text-accent-magenta" },
                { icon: Target, value: "24/7", label: "Online Arena", color: "text-accent-purple" },
                { icon: Cpu, value: "<12ms", label: "Server Latency", color: "text-white" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="flex-1 flex items-center gap-4 p-6 bg-white/5 border border-white/10 cyber-clip-path hover:bg-white/10 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => playSound('hover')}
                >
                  <div className={`p-3 bg-dark-background border border-white/10 rounded-sm group-hover:border-${stat.color.split('-')[1]}/50 transition-colors`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`font-heading text-3xl font-black ${stat.color} glitch-text-${stat.color.split('-')[1] || 'cyan'}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-light-foreground/60 uppercase tracking-wider font-mono">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* THE CYBER NEXUS - Narrative Image Section */}
        <section ref={loreRef} className="relative min-h-[80svh] flex items-center justify-center overflow-hidden py-24">
          {/* Parallax Background Image */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: loreY }}
          >
            <Image 
              src="https://static.wixstatic.com/media/9b282c_f2f9312b8d5d4be0916a5cee2f885187~mv2.png?originWidth=1280&originHeight=704"
              alt="Cyberpunk cityscape background"
              className="w-full h-[120%] object-cover opacity-40 mix-blend-luminosity"
            />
            {/* Gradient Overlays for blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-dark-background/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-dark-background via-transparent to-dark-background"></div>
            <div className="absolute inset-0 bg-accent-purple/10 mix-blend-color"></div>
          </motion.div>

          <div className="w-full max-w-[120rem] mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isLoreInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-accent-magenta font-mono text-sm tracking-widest uppercase">
                <Sparkles className="w-4 h-4" />
                <span>The Architecture</span>
              </div>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase leading-none">
                Beyond <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-magenta to-accent-purple">The Grid</span>
              </h2>
              <p className="text-lg text-light-foreground/80 max-w-md border-l-2 border-accent-magenta/50 pl-6">
                Teja Gaming Hub isn't just a platform; it's a living, breathing digital ecosystem. Every interaction, every victory, shapes the neon-lit landscape of our shared reality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isLoreInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video cyber-clip-path overflow-hidden border border-white/10 group"
            >
              <Image 
                src="https://static.wixstatic.com/media/9b282c_d5e8ddd76de9403eb3a7cd863e27f901~mv2.png?originWidth=1280&originHeight=704"
                alt="Abstract digital representation"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/40 to-transparent mix-blend-overlay"></div>
              
              {/* Decorative UI overlay on image */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-xs text-white/70">
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-1 bg-accent-cyan/50"></div>)}
                  </div>
                  <div>SEC_09 // DATA_STREAM</div>
                </div>
                <div className="text-right">
                  <div>REC</div>
                  <div className="text-accent-magenta animate-pulse">●</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* MINI-GAMES ARENA SECTION */}
        <section 
          ref={gamesRef}
          id="games" 
          className="relative py-24 px-4 lg:px-8 bg-dark-background"
        >
          {/* Section Header - Sticky for narrative flow */}
          <div className="w-full max-w-[120rem] mx-auto mb-16 sticky top-24 z-20 pointer-events-none">
            <div className="inline-block bg-dark-background/90 backdrop-blur-md p-6 border-l-4 border-accent-cyan cyber-clip-path-reverse pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
                The <span className="text-accent-cyan">Arena</span>
              </h2>
              <p className="font-mono text-sm text-light-foreground/60 mt-2 tracking-widest uppercase">
                Select your battleground
              </p>
            </div>
          </div>

          {/* The actual games grid component */}
          <div className="w-full max-w-[120rem] mx-auto relative z-10">
            <MiniGamesArena playSound={playSound} />
          </div>
          
          {/* Decorative background elements for Arena */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-cyan/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent-purple/5 rounded-full blur-[120px]"></div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
