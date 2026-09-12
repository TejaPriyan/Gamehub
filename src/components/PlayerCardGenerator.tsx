import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Zap, 
  Shield, 
  Download, 
  Share2, 
  Check, 
  RefreshCw, 
  Flame, 
  Cpu, 
  Award,
  ChevronRight
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { PlayerCards } from '@/entities';
import { Image } from '@/components/ui/image';

interface PlayerCardGeneratorProps {
  playSound: (type: 'click' | 'hover') => void;
}

const AVATAR_PRESETS = [
  {
    id: 'cyber-samurai',
    name: 'Cyber Samurai',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
    title: 'Blade Virtuoso',
    rank: 'MYTHIC APEX',
    stats: { reflexes: 96, overclock: 92, defense: 88, combat: 98 }
  },
  {
    id: 'netrunner',
    name: 'Netrunner Prime',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    title: 'Ghost Protocol',
    rank: 'CYBER MASTER',
    stats: { reflexes: 90, overclock: 99, defense: 84, combat: 89 }
  },
  {
    id: 'neon-valkyrie',
    name: 'Neon Valkyrie',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    title: 'Aerial Striker',
    rank: 'DIAMOND',
    stats: { reflexes: 94, overclock: 90, defense: 95, combat: 93 }
  },
  {
    id: 'glitch-assassin',
    name: 'Glitch Phantom',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    title: 'Shadow Operative',
    rank: 'PLATINUM',
    stats: { reflexes: 98, overclock: 88, defense: 80, combat: 95 }
  },
];

export default function PlayerCardGenerator({ playSound }: PlayerCardGeneratorProps) {
  const [name, setName] = useState('Teja Priyan');
  const [age, setAge] = useState('21');
  const [gender, setGender] = useState('Male');
  const [gamerTag, setGamerTag] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [generatedCard, setGeneratedCard] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [copied, setCopied] = useState(false);

  // 3D Card tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Load existing card if in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cyber_player_card_active');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setGeneratedCard(parsed);
          setShowCard(true);
        }
      }
    } catch {}
  }, []);

  // Typing animation effect on card reveal
  useEffect(() => {
    if (generatedCard && showCard) {
      const fullText = generatedCard.name || '';
      let currentIndex = 0;
      setTypingText('');

      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypingText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 70);

      return () => clearInterval(typingInterval);
    }
  }, [generatedCard, showCard]);

  // Card Mouse Move Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');

    if (!name.trim()) return;

    setIsGenerating(true);
    setShowCard(false);

    const cleanTag = gamerTag.trim()
      ? gamerTag.trim().toUpperCase().replace(/\s+/g, '_')
      : `${name.trim().toUpperCase().replace(/\s+/g, '_')}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newCard = {
      _id: `card_${Date.now()}`,
      name: name.trim(),
      age: parseInt(age) || 21,
      gender: gender || 'Operative',
      gamerTag: cleanTag,
      avatar: selectedAvatar.url,
      archetype: selectedAvatar.name,
      title: selectedAvatar.title,
      rank: selectedAvatar.rank,
      stats: selectedAvatar.stats,
    };

    try {
      await BaseCrudService.create('playercards', newCard);
    } catch {
      // safe fallback
    }

    try {
      localStorage.setItem('cyber_player_card_active', JSON.stringify(newCard));
    } catch {}

    setTimeout(() => {
      setGeneratedCard(newCard);
      setIsGenerating(false);
      setShowCard(true);
      playSound('click');
    }, 1200);
  };

  const handleReset = () => {
    playSound('click');
    setShowCard(false);
    setGeneratedCard(null);
  };

  const handleCopyTag = () => {
    playSound('click');
    if (generatedCard?.gamerTag) {
      navigator.clipboard.writeText(`https://tejapriyanhub.vercel.app/#player=${generatedCard.gamerTag}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download Card as PNG Image
  const handleDownloadCard = () => {
    playSound('click');
    if (!generatedCard) return;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark cyberpunk background
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 800);
    bgGrad.addColorStop(0, '#0c0c1a');
    bgGrad.addColorStop(0.5, '#12122b');
    bgGrad.addColorStop(1, '#080812');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 800);

    // Neon Border
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 560, 760);

    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 544, 744);

    // Header Branding
    ctx.fillStyle = '#00FFFF';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('TEJA PRIYAN WORLD // OPERATIVE CARD', 50, 70);

    // Player Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 36px sans-serif';
    ctx.fillText(generatedCard.name.toUpperCase(), 50, 140);

    // Gamer Tag & Rank
    ctx.fillStyle = '#FF00FF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`@${generatedCard.gamerTag}`, 50, 180);

    ctx.fillStyle = '#00FF66';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`RANK: ${generatedCard.rank || 'MYTHIC APEX'}`, 50, 215);

    // Stats Grid
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(50, 260, 500, 200);

    ctx.fillStyle = '#00FFFF';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`REFLEXES: ${generatedCard.stats?.reflexes || 96}%`, 80, 310);
    ctx.fillText(`OVERCLOCK: ${generatedCard.stats?.overclock || 92}%`, 80, 360);
    ctx.fillText(`DEFENSE: ${generatedCard.stats?.defense || 88}%`, 80, 410);

    ctx.fillStyle = '#FFDD00';
    ctx.fillText(`CLASS: ${generatedCard.archetype || 'Cyber Samurai'}`, 320, 310);
    ctx.fillText(`AGE: ${generatedCard.age || 21}`, 320, 360);
    ctx.fillText(`STATUS: VERIFIED`, 320, 410);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px monospace';
    ctx.fillText('AUTHENTICATED ON TEJAPRIYAN WORLD • CYBERNETIC PROTOCOL', 50, 730);

    // Trigger download
    const link = document.createElement('a');
    link.download = `${generatedCard.gamerTag}_PlayerCard.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!showCard ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="relative p-6 md:p-8 rounded-2xl bg-dark-background/90 backdrop-blur-xl border-2 border-accent-cyan/30 shadow-[0_0_40px_rgba(0,255,255,0.15)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-accent-cyan/20">
                <div className="p-2 rounded-lg bg-accent-cyan/15 border border-accent-cyan/40 text-accent-cyan">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta uppercase">
                    CYBER IDENTITY FORGE
                  </h3>
                  <p className="font-mono text-xs text-light-foreground/60 tracking-wider">
                    Generate your bespoke holographic player card
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-accent-cyan uppercase tracking-wider font-bold">
                    Operative Codename / Real Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-cyan/60" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Teja Priyan"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-background/80 border border-accent-cyan/30 rounded-xl font-mono text-sm text-light-foreground focus:outline-none focus:border-accent-magenta focus:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
                    />
                  </div>
                </div>

                {/* Gamer Tag Custom Override */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-accent-magenta uppercase tracking-wider font-bold">
                    Custom Gamer Tag (Optional)
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-magenta/60" />
                    <input
                      type="text"
                      value={gamerTag}
                      onChange={(e) => setGamerTag(e.target.value)}
                      placeholder="e.g. TP_CYBER_APEX (auto-generated if blank)"
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-background/80 border border-accent-magenta/30 rounded-xl font-mono text-sm text-light-foreground focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                    />
                  </div>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-light-foreground/70 uppercase tracking-wider">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="10"
                      max="99"
                      className="w-full px-4 py-2.5 bg-dark-background/80 border border-white/10 rounded-xl font-mono text-sm text-light-foreground focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-light-foreground/70 uppercase tracking-wider">
                      Gender / Identity
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 bg-dark-background/80 border border-white/10 rounded-xl font-mono text-sm text-light-foreground focus:outline-none focus:border-accent-cyan"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Cyber Cyborg">Cyber Cyborg</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Archetype Selection */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-accent-cyan uppercase tracking-wider font-bold">
                    Select Cyberpunk Archetype
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = selectedAvatar.id === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            playSound('hover');
                            setSelectedAvatar(preset);
                          }}
                          className={`cursor-pointer p-2 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-accent-cyan/20 border-accent-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)] scale-105'
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-1 border border-white/20">
                            <Image
                              src={preset.url}
                              alt={preset.name}
                              width={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="font-mono text-[10px] font-bold text-light-foreground truncate">
                            {preset.name}
                          </div>
                          <div className="font-mono text-[9px] text-accent-cyan">
                            {preset.rank}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isGenerating}
                  onMouseEnter={() => playSound('hover')}
                  className="relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta text-dark-background font-mono text-sm font-black uppercase tracking-wider overflow-hidden shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        SYNTHESIZING HOLOGRAPHIC CARD...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-current" />
                        FORGE OPERATIVE CARD
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative"
            style={{ perspective: 1200 }}
          >
            {/* 3D Interactive Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
              }}
              className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#121226] via-[#1a1a36] to-[#0a0a18] border-2 border-accent-cyan/50 shadow-[0_20px_60px_rgba(0,255,255,0.25)] overflow-hidden select-none"
            >
              {/* Dynamic Holographic Glare */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,0,255,0.8) 0%, rgba(0,255,255,0.5) 40%, transparent 70%)`,
                }}
              />

              {/* Shimmer Rainbow Foil Line */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Corner Tech Reticles */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-accent-cyan" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent-magenta" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-accent-magenta" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-accent-cyan" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-accent-cyan font-bold">
                  <Shield className="w-4 h-4" />
                  <span>TP WORLD // CARD_ID_{generatedCard?.age || 21}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-accent-magenta/20 border border-accent-magenta/50 font-mono text-[10px] text-accent-magenta font-black uppercase">
                  {generatedCard?.rank || 'MYTHIC APEX'}
                </span>
              </div>

              {/* Avatar and Persona */}
              <div className="relative z-10 py-6 text-center space-y-4">
                <div className="relative w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-accent-cyan via-accent-purple to-accent-magenta shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={generatedCard?.avatar || ''}
                      alt="Player Avatar"
                      width={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-cyan to-accent-magenta tracking-tight">
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </h3>
                  <div className="font-mono text-sm text-accent-cyan font-bold mt-1">
                    @{generatedCard?.gamerTag}
                  </div>
                  <div className="font-mono text-xs text-light-foreground/60 uppercase tracking-widest mt-0.5">
                    {generatedCard?.archetype || 'Cyber Samurai'} • {generatedCard?.gender || 'Operative'}
                  </div>
                </div>

                {/* Attributes Hex Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 max-w-sm mx-auto">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-left">
                    <div className="text-[10px] text-light-foreground/50 uppercase">Reflexes</div>
                    <div className="text-accent-cyan font-black text-base">{generatedCard?.stats?.reflexes || 96}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-left">
                    <div className="text-[10px] text-light-foreground/50 uppercase">Overclock</div>
                    <div className="text-accent-magenta font-black text-base">{generatedCard?.stats?.overclock || 92}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-left">
                    <div className="text-[10px] text-light-foreground/50 uppercase">Defense</div>
                    <div className="text-accent-purple font-black text-base">{generatedCard?.stats?.defense || 88}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-left">
                    <div className="text-[10px] text-light-foreground/50 uppercase">Combat</div>
                    <div className="text-emerald-400 font-black text-base">{generatedCard?.stats?.combat || 98}%</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 pt-4 flex flex-wrap gap-2.5 border-t border-white/10">
                <button
                  onClick={handleDownloadCard}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-accent-cyan text-dark-background font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 hover:opacity-90 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save PNG
                </button>
                <button
                  onClick={handleCopyTag}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-dark-background/80 border border-accent-magenta/50 text-accent-magenta font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 hover:bg-accent-magenta/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Share Card'}
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-light-foreground/70 font-mono text-xs hover:text-white"
                  title="Forge New Card"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
