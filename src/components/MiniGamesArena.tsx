import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Play, 
  Gamepad2, 
  Trophy, 
  Star, 
  Search, 
  Flame, 
  Zap, 
  Sparkles, 
  SlidersHorizontal, 
  Maximize2,
  ExternalLink,
  X,
  Target
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { seedMiniGames, ExtendedMiniGame } from '@/lib/seed-data';
import { Image } from '@/components/ui/image';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '@/components/games/GameCanvas';

interface MiniGamesArenaProps {
  playSound: (type: 'click' | 'hover') => void;
}

export default function MiniGamesArena({ playSound }: MiniGamesArenaProps) {
  // Start with seedMiniGames immediately so there is NEVER an empty or stuck state
  const [games, setGames] = useState<ExtendedMiniGame[]>(seedMiniGames);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuickPlayGame, setActiveQuickPlayGame] = useState<ExtendedMiniGame | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const result = await BaseCrudService.getAll<ExtendedMiniGame>('minigames');
      if (result && Array.isArray(result.items) && result.items.length > 0) {
        // Merge with seedMiniGames to ensure rich metadata is preserved
        const merged = result.items.map((remote) => {
          const matchedSeed = seedMiniGames.find((s) => s._id === remote._id);
          return {
            ...matchedSeed,
            ...remote,
            badge: remote.badge || matchedSeed?.badge || 'POPULAR',
            difficulty: remote.difficulty || matchedSeed?.difficulty || 'MEDIUM',
            rating: remote.rating || matchedSeed?.rating || 4.9,
            plays: remote.plays || matchedSeed?.plays || '15K',
            controlsInfo: remote.controlsInfo || matchedSeed?.controlsInfo,
          };
        });
        setGames(merged);
      }
    } catch {
      // BaseCrudService handles fallback, keep seedMiniGames intact
    }
  };

  const categories = [
    { id: 'ALL', label: 'ALL CHALLENGES', icon: Trophy },
    { id: 'RUNNER', label: 'RUNNER & SPEED', icon: Zap },
    { id: 'SHOOTER', label: 'SHOOTER & ARENA', icon: Target },
    { id: 'PUZZLE', label: 'PUZZLE & MATRIX', icon: SlidersHorizontal },
    { id: 'REFLEX', label: 'REFLEX & SLICE', icon: Flame },
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'RUNNER' && (game.genre?.toLowerCase().includes('run') || game.genre?.toLowerCase().includes('race') || game.genre?.toLowerCase().includes('speed') || game.genre?.toLowerCase().includes('drift') || game.genre?.toLowerCase().includes('cycle'))) ||
      (selectedCategory === 'SHOOTER' && (game.genre?.toLowerCase().includes('shoot') || game.genre?.toLowerCase().includes('orbital') || game.genre?.toLowerCase().includes('action') || game.genre?.toLowerCase().includes('invad') || game.genre?.toLowerCase().includes('arcade'))) ||
      (selectedCategory === 'PUZZLE' && (game.genre?.toLowerCase().includes('puzzle') || game.genre?.toLowerCase().includes('match') || game.genre?.toLowerCase().includes('matrix'))) ||
      (selectedCategory === 'REFLEX' && (game.genre?.toLowerCase().includes('reflex') || game.genre?.toLowerCase().includes('slice') || game.genre?.toLowerCase().includes('gravity')));

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      game.gameTitle?.toLowerCase().includes(query) ||
      game.genre?.toLowerCase().includes(query) ||
      game.gameDescription?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handlePlayGame = (game: ExtendedMiniGame) => {
    playSound('click');
    navigate(`/game/${game._id}`);
  };

  const handleQuickPlay = (e: React.MouseEvent, game: ExtendedMiniGame) => {
    e.stopPropagation();
    playSound('click');
    setActiveQuickPlayGame(game);
  };

  return (
    <div ref={sectionRef} className="w-full max-w-[120rem] mx-auto">
      {/* Section Header */}
      <motion.div
        className="text-center space-y-6 mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent-magenta/15 border border-accent-magenta/40 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Sparkles className="w-4 h-4 text-accent-magenta animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-mono text-xs md:text-sm text-accent-magenta tracking-widest uppercase font-bold">
            CYBERPUNK MINI-GAMES PROTOCOL
          </span>
        </motion.div>

        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta tracking-tight uppercase">
          ARCADE BATTLE ARENA
        </h2>

        <p className="font-paragraph text-base md:text-xl text-light-foreground/75 max-w-3xl mx-auto leading-relaxed">
          8 custom-built HTML5 cyber challenges. Test your reflexes, dominate high-score leaderboards, and master the digital realm with real-time sound, particle physics, and zero lag.
        </p>

        {/* Filter Bar & Search */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSound('hover');
                    setSelectedCategory(cat.id);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-dark-background font-black shadow-[0_0_20px_rgba(0,255,255,0.4)] scale-105'
                      : 'bg-dark-background/80 border border-accent-cyan/20 text-light-foreground/70 hover:border-accent-cyan/60 hover:text-accent-cyan'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-cyan/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-10 pr-4 py-2 bg-dark-background/90 border border-accent-cyan/25 rounded-xl font-mono text-xs text-light-foreground placeholder:text-light-foreground/40 focus:outline-none focus:border-accent-magenta focus:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-foreground/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Games Grid */}
      <div className="min-h-[500px]">
        {filteredGames.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredGames.map((game, index) => {
              const difficultyColors: Record<string, string> = {
                CASUAL: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                MEDIUM: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                HARDCORE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                EXTREME: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                TACTICAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                REFLEX: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
              };

              return (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="relative h-full flex flex-col justify-between p-6 rounded-2xl bg-dark-background/80 backdrop-blur-xl border border-accent-cyan/25 overflow-hidden transition-all duration-300 group-hover:border-accent-magenta/60 group-hover:shadow-[0_10px_35px_rgba(255,0,255,0.25)]">
                    {/* Glowing Cyber Accent Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Corner Reticles */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-cyan opacity-40 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-magenta opacity-40 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-2xl" />

                    <div className="relative z-10 space-y-4">
                      {/* Game Thumbnail with Badges */}
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-accent-cyan/30 group-hover:border-accent-magenta/60 transition-colors duration-300 bg-[#0c0c16]">
                        <Image
                          src={game.thumbnailImage || ''}
                          alt={game.gameTitle || 'Game'}
                          width={600}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-background via-dark-background/20 to-transparent opacity-80" />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-md bg-dark-background/90 border border-accent-cyan/40 font-mono text-[10px] text-accent-cyan uppercase tracking-wider font-bold backdrop-blur-md">
                            {game.badge || 'HYPER'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md border font-mono text-[10px] uppercase font-bold backdrop-blur-md ${difficultyColors[game.difficulty || 'MEDIUM'] || difficultyColors.MEDIUM}`}>
                            {game.difficulty || 'MEDIUM'}
                          </span>
                        </div>

                        {/* Quick Play Trigger Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-dark-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
                          <button
                            onClick={(e) => handleQuickPlay(e, game)}
                            onMouseEnter={() => playSound('hover')}
                            className="px-4 py-2 rounded-lg bg-accent-cyan text-dark-background font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:scale-105 active:scale-95 transition-transform"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Quick Play
                          </button>
                          <button
                            onClick={() => handlePlayGame(game)}
                            onMouseEnter={() => playSound('hover')}
                            className="p-2 rounded-lg bg-dark-background/90 border border-accent-magenta/60 text-accent-magenta hover:text-white hover:border-accent-magenta shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:scale-105 active:scale-95 transition-transform"
                            title="Open Full Game Arena"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Game Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-heading text-lg md:text-xl font-bold text-light-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-magenta transition-all duration-300">
                            {game.gameTitle}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-accent-purple/20 border border-accent-purple/30 font-mono text-[11px] text-accent-purple uppercase whitespace-nowrap">
                            {game.genre}
                          </span>
                        </div>

                        <p className="font-paragraph text-xs md:text-sm text-light-foreground/65 line-clamp-2 leading-relaxed">
                          {game.tagline || game.gameDescription || 'High-octane cyberpunk mini-game challenge.'}
                        </p>

                        {/* Controls info snippet */}
                        {game.controlsInfo && (
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5 font-mono text-[11px] text-accent-cyan/80 truncate">
                            🎮 {game.controlsInfo}
                          </div>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 font-mono text-xs">
                          <div className="flex items-center gap-1.5 text-accent-cyan">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold">{game.rating || 4.9}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-light-foreground/60">
                            <Gamepad2 className="w-3.5 h-3.5 text-accent-magenta" />
                            <span>{game.plays || '15K'} plays</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Play Button */}
                    <div className="mt-4 pt-2">
                      <button
                        onClick={() => handlePlayGame(game)}
                        onMouseEnter={() => playSound('hover')}
                        className="relative w-full px-6 py-3 font-mono text-xs md:text-sm font-black uppercase tracking-wider text-primary-foreground overflow-hidden rounded-xl group/btn transition-transform active:scale-[0.98]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta opacity-95 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta via-accent-purple to-accent-cyan opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Play className="w-4 h-4 fill-current" />
                          Launch Challenge
                        </span>
                        <div className="absolute inset-0 shadow-[0_0_20px_rgba(0,255,255,0.4)] group-hover/btn:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-shadow duration-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-20 border border-dashed border-accent-cyan/20 rounded-2xl bg-dark-background/40">
            <Gamepad2 className="w-16 h-16 text-accent-cyan/40 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-light-foreground mb-2">
              No matching games found
            </h3>
            <p className="font-paragraph text-sm text-light-foreground/50 mb-4">
              Try clearing your search query or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-5 py-2 rounded-lg bg-accent-cyan text-dark-background font-mono text-xs font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Play Modal Overlay */}
      <AnimatePresence>
        {activeQuickPlayGame && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-background/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveQuickPlayGame(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl bg-dark-background rounded-2xl border-2 border-accent-cyan/40 shadow-[0_0_50px_rgba(0,255,255,0.3)] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-accent-cyan/20 bg-dark-background/90">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-accent-cyan animate-ping" />
                  <h3 className="font-heading text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                    {activeQuickPlayGame.gameTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-accent-purple/20 border border-accent-purple/40 font-mono text-xs text-accent-purple">
                    {activeQuickPlayGame.genre}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayGame(activeQuickPlayGame)}
                    className="px-3 py-1.5 rounded-lg border border-accent-cyan/40 font-mono text-xs text-accent-cyan hover:bg-accent-cyan hover:text-dark-background transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Arena Details
                  </button>
                  <button
                    onClick={() => setActiveQuickPlayGame(null)}
                    className="p-1.5 rounded-lg border border-accent-magenta/40 text-accent-magenta hover:bg-accent-magenta hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <GameCanvas
                  game={activeQuickPlayGame}
                  onExit={() => setActiveQuickPlayGame(null)}
                  playSound={playSound}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
