import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Users, Sparkles, Zap } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { PlayerCards } from '@/entities';
import { Image } from '@/components/ui/image';

interface PlayerCardGeneratorProps {
  playSound: (type: 'click' | 'hover') => void;
}

export default function PlayerCardGenerator({ playSound }: PlayerCardGeneratorProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [generatedCard, setGeneratedCard] = useState<PlayerCards | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [typingText, setTypingText] = useState('');

  // Typing animation effect
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
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [generatedCard, showCard]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');

    if (!name || !age || !gender) return;

    setIsGenerating(true);
    setShowCard(false);

    try {
      // Generate gamer tag from name
      const tag = `${name.toUpperCase().replace(/\s+/g, '_')}_${Math.floor(Math.random() * 9999)}`;

      // Create player card in database
      const newCard: PlayerCards = {
        _id: crypto.randomUUID(),
        name,
        age: parseInt(age),
        gender,
        gamerTag: gamerTag || tag,
        avatar: 'https://static.wixstatic.com/media/9b282c_f1fb29e39e1142cc9c0c98d944cfedbc~mv2.png?originWidth=256&originHeight=256',
      };

      await BaseCrudService.create('playercards', newCard);

      // Simulate generation delay for effect
      setTimeout(() => {
        setGeneratedCard(newCard);
        setIsGenerating(false);
        setShowCard(true);
      }, 1500);
    } catch (error) {
      console.error('Error creating player card:', error);
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    playSound('click');
    setName('');
    setAge('');
    setGender('');
    setGamerTag('');
    setGeneratedCard(null);
    setShowCard(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!showCard ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 rounded-2xl bg-dark-background/70 backdrop-blur-xl border border-accent-cyan/20 shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-magenta/10 pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-accent-cyan" />
                  <span className="font-paragraph text-xs text-accent-cyan uppercase">
                    Identity Forge
                  </span>
                </motion.div>

                <h2 className="font-heading text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                  CREATE YOUR PLAYER CARD
                </h2>
                <p className="font-paragraph text-sm text-light-foreground/60">
                  Enter your details to generate your unique gamer identity
                </p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-paragraph text-sm text-accent-cyan uppercase">
                    <User className="w-4 h-4" />
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => playSound('hover')}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark-background/50 border border-accent-cyan/30 text-light-foreground font-paragraph text-sm focus:outline-none focus:border-accent-cyan focus:shadow-lg focus:shadow-accent-cyan/20 transition-all duration-300"
                  />
                </div>

                {/* Age Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-paragraph text-sm text-accent-magenta uppercase">
                    <Calendar className="w-4 h-4" />
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onFocus={() => playSound('hover')}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark-background/50 border border-accent-magenta/30 text-light-foreground font-paragraph text-sm focus:outline-none focus:border-accent-magenta focus:shadow-lg focus:shadow-accent-magenta/20 transition-all duration-300"
                  />
                </div>

                {/* Gender Select */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-paragraph text-sm text-accent-purple uppercase">
                    <Users className="w-4 h-4" />
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onFocus={() => playSound('hover')}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark-background/50 border border-accent-purple/30 text-light-foreground font-paragraph text-sm focus:outline-none focus:border-accent-purple focus:shadow-lg focus:shadow-accent-purple/20 transition-all duration-300"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Gamer Tag Input (Optional) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-paragraph text-sm text-accent-cyan uppercase">
                    <Zap className="w-4 h-4" />
                    Gamer Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    onFocus={() => playSound('hover')}
                    placeholder="Auto-generated if left empty"
                    className="w-full px-4 py-3 rounded-lg bg-dark-background/50 border border-accent-cyan/30 text-light-foreground font-paragraph text-sm focus:outline-none focus:border-accent-cyan focus:shadow-lg focus:shadow-accent-cyan/20 transition-all duration-300"
                  />
                </div>

                {/* Generate Button */}
                <motion.button
                  type="submit"
                  disabled={isGenerating}
                  onMouseEnter={() => playSound('hover')}
                  className="relative w-full px-8 py-4 font-paragraph text-sm font-bold uppercase text-primary-foreground overflow-hidden rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                  whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isGenerating ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Player Card
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,255,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,0,255,0.7)] transition-shadow duration-300" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Generated Player Card */}
            <motion.div
              className="relative p-8 rounded-2xl bg-gradient-to-br from-dark-background via-dark-background to-accent-cyan/10 border border-accent-cyan/30 shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Holographic shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent-cyan rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent-magenta rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent-magenta rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent-cyan rounded-br-2xl" />

              <div className="relative z-10 space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <motion.div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent-cyan shadow-lg shadow-accent-cyan/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Image
                      src={generatedCard?.avatar || ''}
                      alt="Player Avatar"
                      width={128}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20" />
                  </motion.div>
                </div>

                {/* Player Info */}
                <div className="text-center space-y-4">
                  <div>
                    <motion.h3
                      className="font-heading text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {typingText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    </motion.h3>
                    <motion.p
                      className="font-paragraph text-sm text-accent-cyan mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      @{generatedCard?.gamerTag}
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex justify-center gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="text-center">
                      <div className="font-heading text-2xl font-bold text-accent-magenta">
                        {generatedCard?.age}
                      </div>
                      <div className="font-paragraph text-xs text-light-foreground/60 uppercase">
                        Age
                      </div>
                    </div>
                    <div className="w-px bg-accent-cyan/30" />
                    <div className="text-center">
                      <div className="font-heading text-2xl font-bold text-accent-purple">
                        {generatedCard?.gender}
                      </div>
                      <div className="font-paragraph text-xs text-light-foreground/60 uppercase">
                        Gender
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <button
                    onClick={handleReset}
                    onMouseEnter={() => playSound('hover')}
                    className="flex-1 px-6 py-3 font-paragraph text-sm font-bold uppercase text-accent-cyan border-2 border-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-accent-cyan/30"
                  >
                    Create New
                  </button>
                  <button
                    onClick={() => {
                      playSound('click');
                      const element = document.getElementById('games');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onMouseEnter={() => playSound('hover')}
                    className="flex-1 px-6 py-3 font-paragraph text-sm font-bold uppercase text-primary-foreground bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-accent-magenta/30"
                  >
                    Play Games
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
