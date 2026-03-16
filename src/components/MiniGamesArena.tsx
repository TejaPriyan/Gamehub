import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Gamepad2, Trophy, Star } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { MiniGames } from '@/entities';
import { Image } from '@/components/ui/image';
import { useNavigate } from 'react-router-dom';

interface MiniGamesArenaProps {
  playSound: (type: 'click' | 'hover') => void;
}

export default function MiniGamesArena({ playSound }: MiniGamesArenaProps) {
  const [games, setGames] = useState<MiniGames[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<MiniGames>('minigames');
      setGames(result.items);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayGame = (game: MiniGames) => {
    playSound('click');
    navigate(`/game/${game._id}`);
  };

  return (
    <div ref={sectionRef} className="w-full max-w-[120rem] mx-auto">
      {/* Section Header */}
      <motion.div
        className="text-center space-y-6 mb-16"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-magenta/10 border border-accent-magenta/30"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Trophy className="w-5 h-5 text-accent-magenta" />
          <span className="font-paragraph text-sm text-accent-magenta uppercase">
            Mini-Games Arena
          </span>
        </motion.div>

        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-magenta via-accent-purple to-accent-cyan">
          BATTLE ARENA
        </h2>

        <p className="font-paragraph text-lg md:text-xl text-light-foreground/70 max-w-3xl mx-auto">
          Choose your challenge and prove your skills. Each game is a new opportunity to dominate the leaderboards.
        </p>
      </motion.div>

      {/* Games Grid */}
      <div className="min-h-[600px]">
        {isLoading ? null : games.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {games.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative h-full p-6 rounded-2xl bg-dark-background/70 backdrop-blur-xl border border-accent-cyan/20 overflow-hidden transition-all duration-300 group-hover:border-accent-magenta/50 group-hover:shadow-2xl group-hover:shadow-accent-magenta/20">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-2xl" />

                  <div className="relative z-10 space-y-4">
                    {/* Game Thumbnail */}
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-accent-cyan/30 group-hover:border-accent-magenta/50 transition-colors duration-300">
                      <Image
                        src={game.thumbnailImage || ''}
                        alt={game.gameTitle || 'Game'}
                        width={400}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-transparent to-transparent opacity-60" />
                      
                      {/* Play overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-dark-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta flex items-center justify-center shadow-lg shadow-accent-cyan/50">
                          <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Game Info */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-xl font-bold text-light-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-magenta transition-all duration-300">
                          {game.gameTitle}
                        </h3>
                        {game.genre && (
                          <span className="px-3 py-1 rounded-full bg-accent-purple/20 border border-accent-purple/30 font-paragraph text-xs text-accent-purple uppercase whitespace-nowrap">
                            {game.genre}
                          </span>
                        )}
                      </div>

                      <p className="font-paragraph text-sm text-light-foreground/60 line-clamp-2">
                        {game.gameDescription || 'An exciting mini-game challenge awaits!'}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent-cyan fill-accent-cyan" />
                          <span className="font-paragraph text-xs text-light-foreground/60">
                            4.8
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gamepad2 className="w-4 h-4 text-accent-magenta" />
                          <span className="font-paragraph text-xs text-light-foreground/60">
                            {Math.floor(Math.random() * 1000) + 100} plays
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayGame(game)}
                      onMouseEnter={() => playSound('hover')}
                      className="relative w-full px-6 py-3 font-paragraph text-sm font-bold uppercase text-primary-foreground overflow-hidden rounded-lg group/btn"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta opacity-100 group-hover/btn:opacity-90 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Play Now
                      </span>
                      <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,255,255,0.5)] group-hover/btn:shadow-[0_0_25px_rgba(255,0,255,0.7)] transition-shadow duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Gamepad2 className="w-20 h-20 text-accent-cyan/30 mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-light-foreground/50 mb-2">
              No Games Available
            </h3>
            <p className="font-paragraph text-sm text-light-foreground/40">
              Check back soon for exciting new challenges!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
