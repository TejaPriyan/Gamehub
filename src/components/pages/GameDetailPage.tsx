import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trophy, Star, Gamepad2, Target, Zap, Shield, Sparkles } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { seedMiniGames, ExtendedMiniGame } from '@/lib/seed-data';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import GameCanvas from '@/components/games/GameCanvas';

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Instant seed fallback so "Game Not Found" is NEVER shown for existing games
  const matchedSeed = seedMiniGames.find((g) => g._id === id) || seedMiniGames[0];
  const [game, setGame] = useState<ExtendedMiniGame | null>(matchedSeed || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (id) {
      loadGame();
    }
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);
    return () => document.removeEventListener('click', enableAudio);
  }, [id]);

  const loadGame = async () => {
    try {
      const data = await BaseCrudService.getById<ExtendedMiniGame>('minigames', id!);
      if (data) {
        setGame({ ...matchedSeed, ...data });
      }
    } catch {
      // Fallback already active
    }
  };

  const playSound = (type: 'click' | 'hover') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type === 'click' ? 'square' : 'sine';
        osc.frequency.setValueAtTime(type === 'click' ? 440 : 880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      }
    } catch {}
  };

  const handleBack = () => {
    playSound('click');
    navigate('/');
  };

  const handlePlayGame = () => {
    playSound('click');
    setIsPlaying(true);
  };

  if (!game) {
    return (
      <div className="relative min-h-screen bg-dark-background text-light-foreground flex items-center justify-center">
        <div className="text-center p-8">
          <Gamepad2 className="w-20 h-20 text-accent-cyan/40 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-4">Game Not Found</h2>
          <button
            onClick={handleBack}
            className="px-6 py-3 font-mono text-sm font-bold uppercase bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-xl text-dark-background"
          >
            Back to Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-background text-light-foreground overflow-x-hidden">
      <AnimatedBackground />
      <Header playSound={playSound} />

      <div className="relative z-10 pt-28 pb-20 px-4 max-w-[120rem] mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={handleBack}
          onMouseEnter={() => playSound('hover')}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-dark-background/80 backdrop-blur-md border border-accent-cyan/30 text-accent-cyan hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all font-mono text-xs uppercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arena</span>
        </motion.button>

        {isPlaying ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <GameCanvas game={game} onExit={() => setIsPlaying(false)} playSound={playSound} />
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Game Media & Stats */}
            <motion.div
              className="lg:col-span-6 space-y-6"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-accent-cyan/40 shadow-[0_0_35px_rgba(0,255,255,0.2)] bg-[#0e0e20]">
                <Image
                  src={game.thumbnailImage || ''}
                  alt={game.gameTitle || 'Game'}
                  width={900}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/50 font-mono text-xs text-accent-cyan uppercase font-bold backdrop-blur-md">
                    {game.badge || 'HYPER SPEED'}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-dark-background/80 backdrop-blur-md border border-accent-cyan/25 text-center">
                  <Star className="w-5 h-5 text-accent-cyan fill-accent-cyan mx-auto mb-1.5" />
                  <div className="font-heading text-xl font-bold text-accent-cyan">{game.rating || 4.9}</div>
                  <div className="font-mono text-[11px] text-light-foreground/60 uppercase">Rating</div>
                </div>
                <div className="p-4 rounded-xl bg-dark-background/80 backdrop-blur-md border border-accent-magenta/25 text-center">
                  <Gamepad2 className="w-5 h-5 text-accent-magenta mx-auto mb-1.5" />
                  <div className="font-heading text-xl font-bold text-accent-magenta">{game.plays || '18K'}</div>
                  <div className="font-mono text-[11px] text-light-foreground/60 uppercase">Plays</div>
                </div>
                <div className="p-4 rounded-xl bg-dark-background/80 backdrop-blur-md border border-accent-purple/25 text-center">
                  <Trophy className="w-5 h-5 text-accent-purple mx-auto mb-1.5" />
                  <div className="font-heading text-xl font-bold text-accent-purple">{game.difficulty || 'MEDIUM'}</div>
                  <div className="font-mono text-[11px] text-light-foreground/60 uppercase">Tier</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Game Description & Launch */}
            <motion.div
              className="lg:col-span-6 space-y-8"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-accent-purple/20 border border-accent-purple/40 font-mono text-xs text-accent-purple uppercase font-bold">
                    {game.genre}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE SERVER READY
                  </span>
                </div>

                <h1 className="font-heading text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta uppercase tracking-tight">
                  {game.gameTitle}
                </h1>

                <p className="font-paragraph text-base md:text-lg text-light-foreground/75 leading-relaxed">
                  {game.gameDescription}
                </p>
              </div>

              {/* Controls Tutorial Card */}
              {game.controlsInfo && (
                <div className="p-4 rounded-xl bg-white/5 border border-accent-cyan/20 space-y-2">
                  <div className="flex items-center gap-2 text-accent-cyan font-mono text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    Controls & Objectives
                  </div>
                  <p className="font-mono text-xs text-light-foreground/80">
                    {game.controlsInfo}
                  </p>
                </div>
              )}

              {/* Action Features */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Target, label: 'Instant Responsive Canvas' },
                  { icon: Zap, label: 'Real-Time Web Audio Synth' },
                  { icon: Shield, label: 'Anti-Cheat Score System' },
                  { icon: Trophy, label: 'Local & Global High Scores' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-dark-background/60 border border-white/5 font-mono text-xs text-light-foreground/70">
                    <item.icon className="w-4 h-4 text-accent-cyan" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Big Launch Button */}
              <motion.button
                onClick={handlePlayGame}
                onMouseEnter={() => playSound('hover')}
                className="relative w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta text-dark-background font-mono text-base font-black uppercase tracking-wider overflow-hidden shadow-[0_0_35px_rgba(0,255,255,0.4)] group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Play className="w-5 h-5 fill-current" />
                  START PLAYING NOW
                </span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
