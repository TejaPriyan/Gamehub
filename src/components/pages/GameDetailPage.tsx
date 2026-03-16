import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trophy, Star, Gamepad2, Target, Zap } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { MiniGames } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import GameCanvas from '@/components/games/GameCanvas';

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<MiniGames | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      const data = await BaseCrudService.getById<MiniGames>('minigames', id!);
      setGame(data);
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playSound = (type: 'click' | 'hover') => {
    if (!audioEnabled) return;
    const audio = new Audio();
    if (type === 'click') {
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LdjHAU2kdXzzn0vBSF1xe/glEILElyx6OyrWBUIRJzd8sFuIwUuhM/z3I4+CRZnvO/mnVEMDU6k4PG6ZRwFNI/T8tGAMQUfcsXv45ZFCw9YrujusVsWCEKZ2/K8aygFKn/M8tyOPQkXZ7vv6aFUDA1MouDxt2YcBTGOz/PUhDQGHG/D7+aZSgwMVKzn77RfGQc9ldf0wHEqBSh+y/LajT0KGGe67+mjVgwNSp/e8bllHQUwjM7z1YU2Bhxuw+/nmksMC1Kq5u+2YRsGPJPV9L90LAUmfMry3I4+CRhnue/ro1kNDEie3fK9aB4FLYrM8tiIOQYfbcLv6JxPDBBPqOXwtmMcBjKP0vPTgjMGHXHE7+aaSQwLUqrl77RgGwY7kdTzwHQuBSR6yPLbjz8JGWe47+ylWw0MRpzb8sFsIAUshM7y2Ik3CBppu+/mnE4MDlCl4fC3YxwGNo/S88+BMgYeb8Pv5ppKDAtRqeXvtWEbBjuR1PPAdC0FI3nH8tyOPwkaZ7jv66VbDQxFm9rxwWsgBS2EzvLYiTcIG2m77+acTgwOUKXh8LdjHAU2j9Lzz4EyBh5vw+/mmkoMC1Gp5e+1YRsGO5HU88B0LQUjec';
    } else {
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LdjHAU2kdXzzn0vBSF1xe/glEILElyx6OyrWBUIRJzd8sFuIwUuhM/z3I4+CRZnvO/mnVEMDU6k4PG6ZRwFNI/T8tGAMQUfcsXv45ZFCw9YrujusVsWCEKZ2/K8aygFKn/M8tyOPQkXZ7vv6aFUDA1MouDxt2YcBTGOz/PUhDQGHG/D7+aZSgwMVKzn77RfGQc9ldf0wHEqBSh+y/LajT0KGGe67+mjVgwNSp/e8bllHQUwjM7z1YU2Bhxuw+/nmksMC1Kq5u+2YRsGPJPV9L90LAUmfMry3I4+CRhnue/ro1kNDEie3fK9aB4FLYrM8tiIOQYfbcLv6JxPDBBPqOXwtmMcBjKP0vPTgjMGHXHE7+aaSQwLUqrl77RgGwY7kdTzwHQuBSR6yPLbjz8JGWe47+ylWw0MRpzb8sFsIAUshM7y2Ik3CBppu+/mnE4MDlCl4fC3YxwGNo/S88+BMgYeb8Pv5ppKDAtRqeXvtWEbBjuR1PPAdC0FI3nH8tyOPwkaZ7jv66VbDQxFm9rxwWsgBS2EzvLYiTcIG2m77+acTgwOUKXh8LdjHAU2j9Lzz4EyBh5vw+/mmkoMC1Gp5e+1YRsGO5HU88B0LQUjec';
    }
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const handleBack = () => {
    playSound('click');
    navigate('/');
  };

  const handlePlayGame = () => {
    playSound('click');
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-dark-background text-light-foreground">
        <AnimatedBackground />
        <Header playSound={playSound} />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <Gamepad2 className="w-24 h-24 text-accent-cyan/30 mb-6" />
          <h2 className="font-heading text-3xl font-bold text-light-foreground/50 mb-4">
            Game Not Found
          </h2>
          <button
            onClick={handleBack}
            className="px-6 py-3 font-paragraph text-sm font-bold uppercase text-primary-foreground bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Back to Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-background text-light-foreground overflow-hidden">
      <AnimatedBackground />
      <Header playSound={playSound} />

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-[120rem] mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            onMouseEnter={() => playSound('hover')}
            className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-dark-background/70 backdrop-blur-xl border border-accent-cyan/20 text-accent-cyan hover:border-accent-cyan hover:shadow-lg hover:shadow-accent-cyan/20 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-paragraph text-sm uppercase">Back to Arena</span>
          </motion.button>

          {isPlaying ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GameCanvas game={game} onExit={() => setIsPlaying(false)} playSound={playSound} />
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Game Image */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-accent-cyan/30 shadow-2xl shadow-accent-cyan/20">
                  <Image
                    src={game.thumbnailImage || ''}
                    alt={game.gameTitle || 'Game'}
                    width={800}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-transparent to-transparent opacity-40" />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-dark-background/70 backdrop-blur-xl border border-accent-cyan/20 text-center">
                    <Star className="w-6 h-6 text-accent-cyan fill-accent-cyan mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-accent-cyan">4.8</div>
                    <div className="font-paragraph text-xs text-light-foreground/60 uppercase">Rating</div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-background/70 backdrop-blur-xl border border-accent-magenta/20 text-center">
                    <Gamepad2 className="w-6 h-6 text-accent-magenta mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-accent-magenta">{Math.floor(Math.random() * 1000) + 100}</div>
                    <div className="font-paragraph text-xs text-light-foreground/60 uppercase">Plays</div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-background/70 backdrop-blur-xl border border-accent-purple/20 text-center">
                    <Trophy className="w-6 h-6 text-accent-purple mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-accent-purple">Top 10</div>
                    <div className="font-paragraph text-xs text-light-foreground/60 uppercase">Rank</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Game Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-4">
                  {game.genre && (
                    <span className="inline-block px-4 py-2 rounded-full bg-accent-purple/20 border border-accent-purple/30 font-paragraph text-sm text-accent-purple uppercase">
                      {game.genre}
                    </span>
                  )}

                  <h1 className="font-heading text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta">
                    {game.gameTitle}
                  </h1>

                  <p className="font-paragraph text-lg text-light-foreground/70 leading-relaxed">
                    {game.gameDescription || 'An exciting mini-game challenge awaits! Test your skills and climb the leaderboards.'}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold text-accent-cyan uppercase">
                    Game Features
                  </h3>
                  <div className="grid gap-3">
                    {[
                      { icon: Target, text: 'Challenging Gameplay' },
                      { icon: Zap, text: 'Fast-Paced Action' },
                      { icon: Trophy, text: 'Leaderboard Rankings' },
                      { icon: Star, text: 'Achievement System' },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-dark-background/50 border border-accent-cyan/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      >
                        <feature.icon className="w-5 h-5 text-accent-cyan" />
                        <span className="font-paragraph text-sm text-light-foreground/80">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <motion.button
                  onClick={handlePlayGame}
                  onMouseEnter={() => playSound('hover')}
                  className="relative w-full px-8 py-6 font-paragraph text-lg font-bold uppercase text-primary-foreground overflow-hidden rounded-xl group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Play className="w-6 h-6" />
                    Start Playing
                  </span>
                  <div className="absolute inset-0 shadow-[0_0_20px_rgba(0,255,255,0.5)] group-hover:shadow-[0_0_30px_rgba(255,0,255,0.7)] transition-shadow duration-300" />
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
