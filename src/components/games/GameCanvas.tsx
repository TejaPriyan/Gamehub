import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  RotateCcw, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Pause,
  Play,
  Heart,
  Zap,
  Maximize2,
  Minimize2,
  ChevronLeft, 
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { MiniGames } from '@/entities';

// Web Audio API Synth for zero-dependency, ultra-low-latency arcade sound effects
class CyberAudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {}
  }

  laser() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  alienLaser() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {}
  }

  ufoSiren() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.21);
    } catch {}
  }

  explosion() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.31);
    } catch {}
  }

  pickup() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.15, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.11);
      });
    } catch {}
  }

  jump() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {}
  }

  overdrive() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [330, 440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.2, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.26);
      });
    } catch {}
  }

  slice() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  gameOverSound() {
    try {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [440, 370, 311, 261].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.25, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.22);
      });
    } catch {}
  }
}

  const audioSynth = new CyberAudioSynth();

interface GameCanvasProps {
  game: MiniGames;
  onExit: () => void;
  playSound: (type: 'click' | 'hover') => void;
}

export default function GameCanvas({ game, onExit, playSound }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [overdrivePercent, setOverdrivePercent] = useState(0);
  const [lives, setLives] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayerDossier, setShowPlayerDossier] = useState(false);
  const [activePlayer, setActivePlayer] = useState<any>(null);

  // Load Active Operative Player Identity
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cyber_player_card_active');
      if (saved) {
        setActivePlayer(JSON.parse(saved));
      } else {
        setActivePlayer({
          name: 'Operative Priya',
          gamerTag: 'CYBER_VIPER',
          cyberRole: 'High-Score Infiltrator',
          tier: 'LEGENDARY',
        });
      }
    } catch {}
  }, []);

  const gameStateRef = useRef<any>(null);
  const inputBridgeRef = useRef<{ triggerAction: (action: string) => void }>({
    triggerAction: () => {},
  });

  const gameId = game._id || 'neon-dash';

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cyber_highscore_${gameId}`);
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, [gameId]);

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      if (newScore > prev) {
        try {
          localStorage.setItem(`cyber_highscore_${gameId}`, newScore.toString());
        } catch {}
        return newScore;
      }
      return prev;
    });
  }, [gameId]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    audioSynth.enabled = !next;
    playSound('click');
  };

  // True Fullscreen Mode Toggle
  const toggleFullscreen = () => {
    playSound('click');
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      }
      setTimeout(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) updateCanvasDimensions(canvasRef.current, ctx);
        }
      }, 100);
      setTimeout(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) updateCanvasDimensions(canvasRef.current, ctx);
        }
      }, 300);
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setTimeout(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) updateCanvasDimensions(canvasRef.current, ctx);
        }
      }, 150);
    }
  };

  // Sync with document fullscreenchange (e.g. if user hits ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen]);

  // Anti-scroll Keyboard & Mouse Interceptor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const preventKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
        ' ', 'Spacebar', 
        'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'
      ];
      if (preventKeys.includes(e.key)) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Prevent scroll wheel and drag scroll over canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    canvas.addEventListener('wheel', preventScroll, { passive: false });
    canvas.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', preventScroll);
      canvas.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // Initialize active Game and scale Canvas cleanly (Event-driven only, 0% CPU in RAF loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Initialize the selected game FIRST so gameStateRef is ready to receive dimensions
    const id = gameId.toLowerCase();
    if (id.includes('invad') || id.includes('strike-swarm')) {
      initCyberInvaders(canvas, ctx);
    } else if (id.includes('lightcycle') || id.includes('cycle') || id.includes('snake')) {
      initLightcycle(canvas, ctx);
    } else if (id.includes('vortex') || id.includes('cyber-strike')) {
      initVortexDefender(canvas, ctx);
    } else if (id.includes('drift') || id.includes('quantum-velocity')) {
      initQuantumDrift(canvas, ctx);
    } else if (id.includes('hexa') || id.includes('circuit-match')) {
      initHexaMatrix(canvas, ctx);
    } else if (id.includes('slash') || id.includes('laser-defender')) {
      initCyberSlash(canvas, ctx);
    } else if (id.includes('grav') || id.includes('grid-breaker')) {
      initGravRunner(canvas, ctx);
    } else {
      initNeonPulse(canvas, ctx);
    }

    const handleResize = () => {
      updateCanvasDimensions(canvas, ctx);
    };

    // 2. Initial dimensions sync with staged timers for Framer Motion entrance animation
    handleResize();
    const t1 = setTimeout(handleResize, 50);
    const t2 = setTimeout(handleResize, 150);
    const t3 = setTimeout(handleResize, 350);
    window.addEventListener('resize', handleResize);

    const handleFsChange = () => {
      handleResize();
      setTimeout(handleResize, 100);
      setTimeout(handleResize, 300);
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      if (gameStateRef.current?.cleanup) {
        gameStateRef.current.cleanup();
      }
    };
  }, [gameId, isFullscreen]);

  // Ultra-Performant Canvas Buffer Sizing with Safe Defaults (900x560)
  const updateCanvasDimensions = (c: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    const displayW = Math.max(400, Math.floor(rect.width || c.clientWidth || 900));
    const displayH = Math.max(300, Math.floor(rect.height || c.clientHeight || 560));

    const bufferW = Math.floor(displayW * dpr);
    const bufferH = Math.floor(displayH * dpr);

    if (c.width !== bufferW || c.height !== bufferH) {
      c.width = bufferW;
      c.height = bufferH;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (gameStateRef.current?.onResize) {
      gameStateRef.current.onResize(displayW, displayH);
    }

    return { width: displayW, height: displayH };
  };

/* =========================================================================
     GAME 1: NEON PULSE (Hyper Rhythm & Lane Dash)
     ========================================================================= */
  const initNeonPulse = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);

    const numLanes = 5;
    let targetLane = 2;
    let lanePos = 2;

    let items: Array<{
      lane: number;
      y: number;
      type: 'barrier' | 'data' | 'quantum';
      color: string;
      radius: number;
      hit?: boolean;
    }> = [];

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
    }> = [];

    let curScore = 0;
    let combo = 0;
    let overdrive = 0;
    let isOverdriveActive = false;
    let overdriveTimer = 0;
    let speed = 6;
    let lastSpawn = Date.now();
    let isDead = false;

    const getLaneX = (lane: number) => {
      const laneWidth = width / numLanes;
      return laneWidth * lane + laneWidth / 2;
    };

    const activateOverdrive = () => {
      if (overdrive >= 100 && !isOverdriveActive) {
        isOverdriveActive = true;
        overdriveTimer = 300;
        audioSynth.overdrive();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (targetLane > 0) {
          targetLane--;
          audioSynth.jump();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (targetLane < numLanes - 1) {
          targetLane++;
          audioSynth.jump();
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        activateOverdrive();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    inputBridgeRef.current.triggerAction = (action: string) => {
      if (action === 'left' && targetLane > 0) {
        targetLane--;
        audioSynth.jump();
      } else if (action === 'right' && targetLane < numLanes - 1) {
        targetLane++;
        audioSynth.jump();
      } else if (action === 'action') {
        activateOverdrive();
      }
    };

    const spawnItem = () => {
      const lane = Math.floor(Math.random() * numLanes);
      const rand = Math.random();
      if (rand < 0.45) {
        items.push({ lane, y: -40, type: 'barrier', color: '#FF0055', radius: 24 });
      } else if (rand < 0.8) {
        items.push({ lane, y: -40, type: 'data', color: '#00FFFF', radius: 14 });
      } else {
        items.push({ lane, y: -40, type: 'quantum', color: '#FFDD00', radius: 18 });
      }
    };

    const loop = () => {

      ctx.fillStyle = isOverdriveActive ? 'rgba(35, 10, 45, 0.4)' : 'rgba(10, 10, 24, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const laneWidth = width / numLanes;
      for (let i = 0; i <= numLanes; i++) {
        const lx = i * laneWidth;
        ctx.strokeStyle = isOverdriveActive ? 'rgba(255, 0, 255, 0.4)' : 'rgba(0, 255, 255, 0.15)';
        ctx.lineWidth = i === 0 || i === numLanes ? 3 : 1;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, height);
        ctx.stroke();
      }

      lanePos += (targetLane - lanePos) * 0.25;
      const playerX = getLaneX(lanePos);
      const playerY = height - 90;

      if (isOverdriveActive) {
        overdriveTimer--;
        overdrive = Math.max(0, (overdriveTimer / 300) * 100);
        setOverdrivePercent(Math.floor(overdrive));
        if (overdriveTimer <= 0) {
          isOverdriveActive = false;
        }
      }

      if (Date.now() - lastSpawn > Math.max(450, 1100 - speed * 40)) {
        spawnItem();
        lastSpawn = Date.now();
        speed = Math.min(14, speed + 0.02);
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += speed * (isOverdriveActive ? 1.4 : 1);
        const itemX = getLaneX(item.lane);

        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = item.color;
        ctx.fillStyle = item.color;

        if (item.type === 'barrier') {
          ctx.beginPath();
          ctx.roundRect(itemX - 32, item.y - 12, 64, 24, 6);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (item.type === 'data') {
          ctx.beginPath();
          ctx.arc(itemX, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(itemX, item.y, item.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(itemX, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();

        const dist = Math.hypot(itemX - playerX, item.y - playerY);
        if (dist < 42 && !item.hit) {
          item.hit = true;

          if (item.type === 'barrier') {
            if (isOverdriveActive) {
              curScore += 250;
              audioSynth.explosion();
              for (let p = 0; p < 16; p++) {
                particles.push({
                  x: itemX,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 10,
                  vy: (Math.random() - 0.5) * 10,
                  color: '#FF0055',
                  life: 25,
                });
              }
              items.splice(i, 1);
              continue;
            } else {
              audioSynth.gameOverSound();
              isDead = true;
              setGameOver(true);
              updateHighScore(curScore);
              break;
            }
          } else if (item.type === 'data') {
            curScore += 100 * (combo >= 5 ? 2 : 1);
            combo++;
            overdrive = Math.min(100, overdrive + 8);
            setOverdrivePercent(Math.floor(overdrive));
            audioSynth.pickup();
            setScore(curScore);
            items.splice(i, 1);
            continue;
          } else if (item.type === 'quantum') {
            curScore += 300 * (combo >= 5 ? 2 : 1);
            combo += 2;
            overdrive = Math.min(100, overdrive + 20);
            setOverdrivePercent(Math.floor(overdrive));
            audioSynth.pickup();
            setScore(curScore);
            items.splice(i, 1);
            continue;
          }
        }

        if (item.y > height + 60) {
          if (item.type === 'barrier') {
            curScore += 15;
            setScore(curScore);
          }
          items.splice(i, 1);
        }
      }

      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.life * 0.2), 0, Math.PI * 2);
        ctx.fill();
        if (pt.life <= 0) particles.splice(p, 1);
      }

      if (!isDead) {
        ctx.save();
        ctx.shadowBlur = isOverdriveActive ? 30 : 18;
        ctx.shadowColor = isOverdriveActive ? '#FF00FF' : '#00FFFF';

        const bob = Math.sin(Date.now() * 0.008) * 4;

        ctx.fillStyle = isOverdriveActive ? '#FF00FF' : '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(playerX, playerY - 26 + bob);
        ctx.lineTo(playerX + 26, playerY + 20 + bob);
        ctx.lineTo(playerX, playerY + 12 + bob);
        ctx.lineTo(playerX - 26, playerY + 20 + bob);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(playerX, playerY + bob, 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isOverdriveActive ? '#FFDD00' : '#00AAFF';
        ctx.beginPath();
        ctx.moveTo(playerX - 10, playerY + 18 + bob);
        ctx.lineTo(playerX, playerY + 36 + bob + Math.random() * 8);
        ctx.lineTo(playerX + 10, playerY + 18 + bob);
        ctx.fill();
        ctx.restore();
      }

      if (!isDead) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('keydown', handleKeyDown);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
        bunkers = [
          { x: newW * 0.25, hp: bunkers[0]?.hp ?? 10 },
          { x: newW * 0.5, hp: bunkers[1]?.hp ?? 10 },
          { x: newW * 0.75, hp: bunkers[2]?.hp ?? 10 },
        ];
      },
    };
  };

  /* =========================================================================
     GAME 2: VORTEX DEFENDER (360° Orbital Turret Shooter)
     ========================================================================= */
  const initVortexDefender = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);

    let turretAngle = 0;
    let coreHealth = 100;
    let curScore = 0;
    let empCharge = 0;

    let bullets: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];
    let enemies: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      hp: number;
      color: string;
      type: 'swarmer' | 'heavy' | 'orb';
    }> = [];
    let shockwaves: Array<{ radius: number; maxRadius: number; alpha: number }> = [];
    let particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      turretAngle = Math.atan2(my - cy, mx - cx);
    };

    const fireBullet = () => {
      const cx = width / 2;
      const cy = height / 2;
      const barrelLen = 42;
      const bx = cx + Math.cos(turretAngle) * barrelLen;
      const by = cy + Math.sin(turretAngle) * barrelLen;
      const speed = 14;

      bullets.push({
        x: bx,
        y: by,
        vx: Math.cos(turretAngle) * speed,
        vy: Math.sin(turretAngle) * speed,
        life: 60,
      });
      audioSynth.laser();
    };

    const triggerEMP = () => {
      if (empCharge >= 100) {
        empCharge = 0;
        shockwaves.push({ radius: 10, maxRadius: Math.max(width, height), alpha: 1 });
        audioSynth.overdrive();
        enemies.forEach((en) => {
          curScore += 150;
          for (let p = 0; p < 8; p++) {
            particles.push({
              x: en.x,
              y: en.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              color: en.color,
              life: 20,
            });
          }
        });
        enemies = [];
        setScore(curScore);
      }
    };

    const handleClick = () => fireBullet();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') fireBullet();
      if (e.key === 'e' || e.key === 'E') triggerEMP();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    inputBridgeRef.current.triggerAction = (action: string) => {
      if (action === 'action' || action === 'up') fireBullet();
      if (action === 'emp') triggerEMP();
      if (action === 'left') turretAngle -= 0.3;
      if (action === 'right') turretAngle += 0.3;
    };

    let lastSpawn = Date.now();

    const loop = () => {
      
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = 'rgba(12, 12, 28, 0.35)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
      [80, 160, 240, 320].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (Date.now() - lastSpawn > 900) {
        const angle = Math.random() * Math.PI * 2;
        const spawnDist = Math.hypot(cx, cy) + 40;
        const ex = cx + Math.cos(angle) * spawnDist;
        const ey = cy + Math.sin(angle) * spawnDist;
        const speed = 1.6 + Math.random() * 1.5;
        const toCoreAngle = Math.atan2(cy - ey, cx - ex);

        const type = Math.random() > 0.7 ? 'heavy' : Math.random() > 0.4 ? 'swarmer' : 'orb';
        enemies.push({
          x: ex,
          y: ey,
          vx: Math.cos(toCoreAngle) * speed,
          vy: Math.sin(toCoreAngle) * speed,
          radius: type === 'heavy' ? 22 : type === 'swarmer' ? 12 : 16,
          hp: type === 'heavy' ? 3 : 1,
          color: type === 'heavy' ? '#FF0055' : type === 'swarmer' ? '#00FFFF' : '#FFDD00',
          type,
        });
        lastSpawn = Date.now();
      }

      for (let b = bullets.length - 1; b >= 0; b--) {
        const bul = bullets[b];
        bul.x += bul.vx;
        bul.y += bul.vy;
        bul.life--;

        ctx.fillStyle = '#00FFFF';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00FFFF';
        ctx.beginPath();
        ctx.arc(bul.x, bul.y, 4, 0, Math.PI * 2);
        ctx.fill();

        let hit = false;
        for (let e = enemies.length - 1; e >= 0; e--) {
          const en = enemies[e];
          if (Math.hypot(bul.x - en.x, bul.y - en.y) < en.radius + 4) {
            en.hp--;
            hit = true;
            if (en.hp <= 0) {
              audioSynth.explosion();
              curScore += en.type === 'heavy' ? 300 : 100;
              empCharge = Math.min(100, empCharge + 10);
              setScore(curScore);
              for (let p = 0; p < 10; p++) {
                particles.push({
                  x: en.x,
                  y: en.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: en.color,
                  life: 20,
                });
              }
              enemies.splice(e, 1);
            }
            break;
          }
        }
        if (hit || bul.life <= 0) bullets.splice(b, 1);
      }

      for (let e = enemies.length - 1; e >= 0; e--) {
        const en = enemies[e];
        en.x += en.vx;
        en.y += en.vy;

        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = en.color;
        ctx.fillStyle = en.color;
        ctx.beginPath();
        ctx.arc(en.x, en.y, en.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (Math.hypot(en.x - cx, en.y - cy) < en.radius + 28) {
          coreHealth -= en.type === 'heavy' ? 25 : 10;
          audioSynth.explosion();
          enemies.splice(e, 1);
          if (coreHealth <= 0) {
            audioSynth.gameOverSound();
            setGameOver(true);
            updateHighScore(curScore);
            return;
          }
        }
      }

      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 20;
        sw.alpha -= 0.03;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 0, 255, ${Math.max(0, sw.alpha)})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        if (sw.alpha <= 0) shockwaves.splice(s, 1);
      }

      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (pt.life <= 0) particles.splice(p, 1);
      }

      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#00FFFF';
      ctx.fillStyle = '#1A1A2E';
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = coreHealth > 40 ? '#00FFFF' : '#FF0055';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (coreHealth / 100)));
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(turretAngle);
      ctx.fillStyle = '#FF00FF';
      ctx.shadowColor = '#FF00FF';
      ctx.shadowBlur = 16;
      ctx.fillRect(10, -6, 32, 12);
      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  /* =========================================================================
     GAME 3: QUANTUM DRIFT 2099 (Highway Warp Racer)
     ========================================================================= */
  const initQuantumDrift = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);

    let carX = width / 2;
    let targetX = width / 2;
    let speed = 220;
    let curScore = 0;
    let nitro = 0;
    let isNitro = false;

    let traffic: Array<{ x: number; y: number; speed: number; color: string; width: number; height: number }> = [];
    let nitroPads: Array<{ x: number; y: number }> = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetX -= 40;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetX += 40;
      } else if (e.key === ' ' || e.key === 'Shift') {
        if (nitro >= 100) {
          isNitro = true;
          audioSynth.overdrive();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    inputBridgeRef.current.triggerAction = (action: string) => {
      if (action === 'left') targetX -= 40;
      if (action === 'right') targetX += 40;
      if (action === 'action' && nitro >= 100) {
        isNitro = true;
        audioSynth.overdrive();
      }
    };

    let lastSpawn = Date.now();

    const loop = () => {
      
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, width, height);

      const roadTopW = width * 0.3;
      const roadBottomW = width * 0.85;
      const horizonY = height * 0.25;

      ctx.fillStyle = '#121226';
      ctx.beginPath();
      ctx.moveTo(width / 2 - roadTopW / 2, horizonY);
      ctx.lineTo(width / 2 + roadTopW / 2, horizonY);
      ctx.lineTo(width / 2 + roadBottomW / 2, height);
      ctx.lineTo(width / 2 - roadBottomW / 2, height);
      ctx.fill();

      ctx.strokeStyle = isNitro ? '#FF00FF' : '#00FFFF';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 16;
      ctx.shadowColor = isNitro ? '#FF00FF' : '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(width / 2 - roadTopW / 2, horizonY);
      ctx.lineTo(width / 2 - roadBottomW / 2, height);
      ctx.moveTo(width / 2 + roadTopW / 2, horizonY);
      ctx.lineTo(width / 2 + roadBottomW / 2, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      carX += (targetX - carX) * 0.15;
      const minX = width / 2 - roadBottomW / 2 + 30;
      const maxX = width / 2 + roadBottomW / 2 - 30;
      carX = Math.max(minX, Math.min(maxX, carX));
      targetX = Math.max(minX, Math.min(maxX, targetX));

      speed = isNitro ? 380 : 240;
      curScore += Math.floor(speed / 30);
      setScore(curScore);

      if (isNitro) {
        nitro -= 0.8;
        if (nitro <= 0) isNitro = false;
      } else {
        nitro = Math.min(100, nitro + 0.1);
      }

      if (Date.now() - lastSpawn > Math.max(400, 1100 - speed * 1.5)) {
        const laneOffset = (Math.random() - 0.5) * (roadBottomW * 0.6);
        traffic.push({
          x: width / 2 + laneOffset * 0.3,
          y: horizonY,
          speed: Math.random() * 2 + 3,
          color: Math.random() > 0.5 ? '#FF0055' : '#8A2BE2',
          width: 32,
          height: 50,
        });

        if (Math.random() > 0.6) {
          nitroPads.push({
            x: width / 2 + (Math.random() - 0.5) * (roadBottomW * 0.5),
            y: horizonY,
          });
        }
        lastSpawn = Date.now();
      }

      for (let n = nitroPads.length - 1; n >= 0; n--) {
        const pad = nitroPads[n];
        pad.y += 8;
        ctx.fillStyle = '#00FF66';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00FF66';
        ctx.fillRect(pad.x - 16, pad.y, 32, 16);
        ctx.shadowBlur = 0;

        if (Math.hypot(pad.x - carX, pad.y - (height - 80)) < 36) {
          nitro = 100;
          isNitro = true;
          audioSynth.pickup();
          nitroPads.splice(n, 1);
        } else if (pad.y > height + 50) {
          nitroPads.splice(n, 1);
        }
      }

      for (let t = traffic.length - 1; t >= 0; t--) {
        const tr = traffic[t];
        tr.y += tr.speed * (isNitro ? 1.6 : 1.2);
        const scale = 0.5 + (tr.y / height) * 0.8;
        const w = tr.width * scale;
        const h = tr.height * scale;

        ctx.fillStyle = tr.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = tr.color;
        ctx.fillRect(tr.x - w / 2, tr.y, w, h);
        ctx.shadowBlur = 0;

        const carY = height - 90;
        if (
          Math.abs(tr.x - carX) < (w / 2 + 20) &&
          Math.abs(tr.y - carY) < (h / 2 + 25)
        ) {
          audioSynth.explosion();
          audioSynth.gameOverSound();
          setGameOver(true);
          updateHighScore(curScore);
          return;
        }

        if (tr.y > height + 60) traffic.splice(t, 1);
      }

      const carY = height - 90;
      ctx.save();
      ctx.shadowBlur = isNitro ? 35 : 20;
      ctx.shadowColor = isNitro ? '#FF00FF' : '#00FFFF';
      ctx.fillStyle = isNitro ? '#FF00FF' : '#00FFFF';
      ctx.fillRect(carX - 22, carY, 44, 60);

      ctx.fillStyle = '#FF0055';
      ctx.fillRect(carX - 18, carY + 54, 10, 6);
      ctx.fillRect(carX + 8, carY + 54, 10, 6);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(carX - 14, carY + 16, 28, 16);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('keydown', handleKeyDown);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  /* =========================================================================
     GAME 4: HEXA MATRIX (Hex Circuit Chain Reaction)
     ========================================================================= */
  const initHexaMatrix = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);
    const cols = 6;
    const rows = 5;
    let curScore = 0;

    const colors = ['#00FFFF', '#FF00FF', '#FFDD00', '#00FF66'];
    let grid: Array<Array<{ angle: number; colorIndex: number }>> = [];

    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          angle: Math.floor(Math.random() * 4) * 90,
          colorIndex: Math.floor(Math.random() * colors.length),
        };
      }
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cellW = (rect.width || width) / cols;
      const cellH = (rect.height || height) / rows;
      const c = Math.floor(x / cellW);
      const r = Math.floor(y / cellH);

      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid[r][c].angle = (grid[r][c].angle + 90) % 360;
        audioSynth.pickup();

        let matches = 0;
        if (c > 0 && grid[r][c].colorIndex === grid[r][c - 1].colorIndex) matches++;
        if (c < cols - 1 && grid[r][c].colorIndex === grid[r][c + 1].colorIndex) matches++;
        if (r > 0 && grid[r][c].colorIndex === grid[r - 1][c].colorIndex) matches++;
        if (r < rows - 1 && grid[r][c].colorIndex === grid[r + 1][c].colorIndex) matches++;

        if (matches >= 2) {
          curScore += matches * 200;
          setScore(curScore);
          audioSynth.overdrive();
          grid[r][c].colorIndex = Math.floor(Math.random() * colors.length);
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    const loop = () => {
      
      ctx.fillStyle = '#101024';
      ctx.fillRect(0, 0, width, height);

      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * cellW + cellW / 2;
          const cy = r * cellH + cellH / 2;
          const cell = grid[r][c];

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((cell.angle * Math.PI) / 180);

          ctx.shadowBlur = 15;
          ctx.shadowColor = colors[cell.colorIndex];
          ctx.strokeStyle = colors[cell.colorIndex];
          ctx.lineWidth = 6;

          ctx.beginPath();
          ctx.moveTo(-cellW * 0.35, 0);
          ctx.lineTo(cellW * 0.35, 0);
          ctx.moveTo(0, -cellH * 0.35);
          ctx.lineTo(0, cellH * 0.35);
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener('click', handleClick);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  /* =========================================================================
     GAME 5: CYBER SLASH: BLADE RUNNER (Reflex Data Slicer)
     ========================================================================= */
  const initCyberSlash = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);
    let curScore = 0;
    let curLives = 3;

    let items: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      isGlitch: boolean;
      sliced?: boolean;
    }> = [];

    let bladeTrail: Array<{ x: number; y: number; time: number }> = [];
    let isMouseDown = false;
    let lastSpawn = Date.now();

    const addPoint = (x: number, y: number) => {
      bladeTrail.push({ x, y, time: Date.now() });
      if (bladeTrail.length > 20) bladeTrail.shift();

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (!item.sliced && Math.hypot(item.x - x, item.y - y) < item.radius + 15) {
          item.sliced = true;
          if (item.isGlitch) {
            audioSynth.explosion();
            curLives--;
            setLives(curLives);
            if (curLives <= 0) {
              audioSynth.gameOverSound();
              setGameOver(true);
              updateHighScore(curScore);
              return;
            }
          } else {
            audioSynth.slice();
            curScore += 150;
            setScore(curScore);
          }
          items.splice(i, 1);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      const rect = canvas.getBoundingClientRect();
      addPoint(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const rect = canvas.getBoundingClientRect();
      addPoint(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const loop = () => {
      
      ctx.fillStyle = 'rgba(10, 10, 26, 0.4)';
      ctx.fillRect(0, 0, width, height);

      if (Date.now() - lastSpawn > 800) {
        const isGlitch = Math.random() < 0.25;
        items.push({
          x: Math.random() * (width - 100) + 50,
          y: height + 20,
          vx: (Math.random() - 0.5) * 6,
          vy: -(Math.random() * 5 + 13),
          radius: isGlitch ? 24 : 18,
          color: isGlitch ? '#FF0055' : Math.random() > 0.5 ? '#00FFFF' : '#FF00FF',
          isGlitch,
        });
        lastSpawn = Date.now();
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.x += it.vx;
        it.y += it.vy;
        it.vy += 0.35;

        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = it.color;
        ctx.fillStyle = it.color;
        ctx.beginPath();
        ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (it.y > height + 80 && it.vy > 0) items.splice(i, 1);
      }

      const now = Date.now();
      bladeTrail = bladeTrail.filter((p) => now - p.time < 200);
      if (bladeTrail.length > 1) {
        ctx.save();
        ctx.strokeStyle = '#00FFFF';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00FFFF';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(bladeTrail[0].x, bladeTrail[0].y);
        for (let i = 1; i < bladeTrail.length; i++) {
          ctx.lineTo(bladeTrail[i].x, bladeTrail[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  /* =========================================================================
     GAME 6: GRAV-RUNNER: ZERO CHRONO (Gravity Flipper)
     ========================================================================= */
  const initGravRunner = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);

    let gravity = 1;
    let playerY = height - 60;
    const playerX = 120;
    let curScore = 0;
    let speed = 6;

    let obstacles: Array<{ x: number; y: number; width: number; height: number; side: 'floor' | 'ceil' }> = [];
    let crystals: Array<{ x: number; y: number }> = [];
    let lastSpawn = Date.now();

    const flipGravity = () => {
      gravity = gravity === 1 ? -1 : 1;
      audioSynth.jump();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        flipGravity();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', flipGravity);

    inputBridgeRef.current.triggerAction = (action: string) => {
      if (action === 'action' || action === 'up') flipGravity();
    };

    const loop = () => {
      
      ctx.fillStyle = '#0e0e22';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(width, 40);
      ctx.moveTo(0, height - 40);
      ctx.lineTo(width, height - 40);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const targetY = gravity === 1 ? height - 64 : 44;
      playerY += (targetY - playerY) * 0.25;

      curScore += 1;
      setScore(curScore);
      speed = Math.min(13, speed + 0.003);

      if (Date.now() - lastSpawn > 900) {
        const side = Math.random() > 0.5 ? 'floor' : 'ceil';
        obstacles.push({
          x: width + 50,
          y: side === 'floor' ? height - 80 : 40,
          width: 28,
          height: 40,
          side,
        });

        if (Math.random() > 0.4) {
          crystals.push({
            x: width + 120,
            y: height / 2 + (Math.random() - 0.5) * 80,
          });
        }
        lastSpawn = Date.now();
      }

      for (let c = crystals.length - 1; c >= 0; c--) {
        const cr = crystals[c];
        cr.x -= speed;

        ctx.fillStyle = '#FFDD00';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FFDD00';
        ctx.beginPath();
        ctx.arc(cr.x, cr.y, 10, 0, Math.PI * 2);
        ctx.fill();

        if (Math.hypot(cr.x - playerX, cr.y - playerY) < 32) {
          curScore += 200;
          audioSynth.pickup();
          crystals.splice(c, 1);
        } else if (cr.x < -40) {
          crystals.splice(c, 1);
        }
      }

      for (let o = obstacles.length - 1; o >= 0; o--) {
        const ob = obstacles[o];
        ob.x -= speed;

        ctx.fillStyle = '#FF0055';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#FF0055';
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

        if (
          Math.abs(ob.x - playerX) < 26 &&
          Math.abs((ob.y + ob.height / 2) - playerY) < 28
        ) {
          audioSynth.explosion();
          audioSynth.gameOverSound();
          setGameOver(true);
          updateHighScore(curScore);
          return;
        }

        if (ob.x < -60) obstacles.splice(o, 1);
      }

      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(playerX - 16, playerY - 16, 32, 32);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('keydown', handleKeyDown);
        canvas.removeEventListener('click', flipGravity);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  /* =========================================================================
     GAME 7: CYBER INVADERS (Neon Space Defense)
     ========================================================================= */
  const initCyberInvaders = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);

    let playerX = width / 2;
    const playerSpeed = 7;
    let curScore = 0;
    let curLives = 3;

    let keys: Record<string, boolean> = {};

    let bullets: Array<{ x: number; y: number }> = [];
    let alienBullets: Array<{ x: number; y: number }> = [];

    // Swarm grid setup: 4 rows x 7 cols
    const alienRows = 4;
    const alienCols = 7;
    let aliens: Array<{ x: number; y: number; row: number; col: number; alive: boolean; color: string; score: number }> = [];

    const initSwarm = () => {
      aliens = [];
      const rowColors = ['#FF0055', '#FF00FF', '#00FFFF', '#FFDD00'];
      const rowScores = [40, 30, 20, 10];
      for (let r = 0; r < alienRows; r++) {
        for (let c = 0; c < alienCols; c++) {
          aliens.push({
            x: 50 + c * 55,
            y: 70 + r * 45,
            row: r,
            col: c,
            alive: true,
            color: rowColors[r],
            score: rowScores[r],
          });
        }
      }
    };
    initSwarm();

    let swarmDir = 1; // 1 = right, -1 = left
    let swarmSpeed = 1.4;
    let ufo: { x: number; y: number; speed: number; active: boolean } = { x: -60, y: 35, speed: 3, active: false };
    let lastUfo = Date.now();
    let lastAlienFire = Date.now();

    // 3 Defensive Bunkers
    let bunkers: Array<{ x: number; hp: number }> = [
      { x: width * 0.25, hp: 10 },
      { x: width * 0.5, hp: 10 },
      { x: width * 0.75, hp: 10 },
    ];

    const fireBullet = () => {
      if (bullets.length < 2) {
        bullets.push({ x: playerX, y: height - 60 });
        audioSynth.laser();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        fireBullet();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', fireBullet);

    inputBridgeRef.current.triggerAction = (action: string) => {
      if (action === 'left') playerX -= 30;
      if (action === 'right') playerX += 30;
      if (action === 'action' || action === 'up') fireBullet();
    };

    const loop = () => {
      
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, width, height);

      // Player Movement
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) playerX -= playerSpeed;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) playerX += playerSpeed;
      playerX = Math.max(30, Math.min(width - 30, playerX));

      // UFO Mother-ship
      if (!ufo.active && Date.now() - lastUfo > 16000) {
        ufo = { x: -60, y: 35, speed: 3.5, active: true };
        audioSynth.ufoSiren();
        lastUfo = Date.now();
      }
      if (ufo.active) {
        ufo.x += ufo.speed;
        ctx.save();
        ctx.fillStyle = '#FF0055';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF0055';
        ctx.fillRect(ufo.x - 25, ufo.y - 8, 50, 16);
        ctx.fillStyle = '#FFDD00';
        ctx.fillRect(ufo.x - 12, ufo.y - 12, 24, 6);
        ctx.restore();

        if (ufo.x > width + 60) ufo.active = false;
      }

      // Move Swarm
      let hitEdge = false;
      const aliveAliens = aliens.filter((a) => a.alive);
      if (aliveAliens.length === 0) {
        // Next Wave!
        initSwarm();
        swarmSpeed += 0.4;
        audioSynth.overdrive();
      }

      aliveAliens.forEach((a) => {
        a.x += swarmDir * swarmSpeed;
        if ((swarmDir === 1 && a.x > width - 50) || (swarmDir === -1 && a.x < 40)) {
          hitEdge = true;
        }
      });

      if (hitEdge) {
        swarmDir *= -1;
        aliveAliens.forEach((a) => {
          a.y += 18;
          if (a.y >= height - 90) {
            audioSynth.gameOverSound();
            setGameOver(true);
            updateHighScore(curScore);
            return;
          }
        });
      }

      // Alien Laser Fire
      if (Date.now() - lastAlienFire > 900 && aliveAliens.length > 0) {
        const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        alienBullets.push({ x: shooter.x, y: shooter.y + 12 });
        audioSynth.alienLaser();
        lastAlienFire = Date.now();
      }

      // Draw Aliens
      aliveAliens.forEach((a) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = a.color;
        ctx.fillStyle = a.color;
        ctx.fillRect(a.x - 16, a.y - 12, 32, 24);
        ctx.fillStyle = '#000000';
        ctx.fillRect(a.x - 10, a.y - 6, 6, 6);
        ctx.fillRect(a.x + 4, a.y - 6, 6, 6);
        ctx.restore();
      });

      // Update & Draw Player Bullets
      for (let b = bullets.length - 1; b >= 0; b--) {
        const bul = bullets[b];
        bul.y -= 12;

        ctx.fillStyle = '#00FFFF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FFFF';
        ctx.fillRect(bul.x - 2.5, bul.y - 10, 5, 14);

        // Check vs UFO
        if (ufo.active && Math.hypot(bul.x - ufo.x, bul.y - ufo.y) < 30) {
          ufo.active = false;
          curScore += 500;
          setScore(curScore);
          audioSynth.explosion();
          bullets.splice(b, 1);
          continue;
        }

        // Check vs Aliens
        let hit = false;
        for (let a of aliveAliens) {
          if (Math.abs(bul.x - a.x) < 20 && Math.abs(bul.y - a.y) < 16) {
            a.alive = false;
            curScore += a.score;
            setScore(curScore);
            audioSynth.explosion();
            hit = true;
            break;
          }
        }
        if (hit || bul.y < 0) bullets.splice(b, 1);
      }

      // Update & Draw Alien Bullets
      for (let ab = alienBullets.length - 1; ab >= 0; ab--) {
        const abul = alienBullets[ab];
        abul.y += 6;

        ctx.fillStyle = '#FF0055';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF0055';
        ctx.fillRect(abul.x - 2, abul.y, 4, 12);

        // Check vs Bunkers
        let bunkerHit = false;
        bunkers.forEach((bk) => {
          if (bk.hp > 0 && Math.abs(abul.x - bk.x) < 35 && Math.abs(abul.y - (height - 110)) < 15) {
            bk.hp--;
            bunkerHit = true;
            audioSynth.explosion();
          }
        });
        if (bunkerHit) {
          alienBullets.splice(ab, 1);
          continue;
        }

        // Check vs Player
        if (Math.abs(abul.x - playerX) < 22 && Math.abs(abul.y - (height - 50)) < 16) {
          audioSynth.explosion();
          curLives--;
          setLives(curLives);
          alienBullets.splice(ab, 1);
          if (curLives <= 0) {
            audioSynth.gameOverSound();
            setGameOver(true);
            updateHighScore(curScore);
            return;
          }
          continue;
        }

        if (abul.y > height + 20) alienBullets.splice(ab, 1);
      }

      // Draw Energy Bunkers
      bunkers.forEach((bk) => {
        if (bk.hp > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(0, 255, 255, ${bk.hp * 0.1})`;
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00FFFF';
          ctx.fillRect(bk.x - 30, height - 120, 60, 24);
          ctx.strokeRect(bk.x - 30, height - 120, 60, 24);
          ctx.restore();
        }
      });

      // Draw Player Cannon & Glowing Neon Beacon
      ctx.save();
      // Glowing under-base
      ctx.fillStyle = 'rgba(0, 255, 102, 0.25)';
      ctx.beginPath();
      ctx.ellipse(playerX, height - 38, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cannon body
      ctx.fillStyle = '#00FF66';
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#00FF66';
      ctx.fillRect(playerX - 22, height - 48, 44, 18);
      ctx.fillRect(playerX - 5, height - 60, 10, 14);

      // Cyan Barrel Tip
      ctx.fillStyle = '#00FFFF';
      ctx.shadowColor = '#00FFFF';
      ctx.fillRect(playerX - 2, height - 64, 4, 6);

      // Neon Player Beacon Tag
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#00FFFF';
      ctx.textAlign = 'center';
      ctx.fillText('▲ YOU', playerX, height - 12);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        canvas.removeEventListener('click', fireBullet);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  /* =========================================================================
     GAME 8: NEON LIGHTCYCLE (Grid Surfer / Snake Racer)
     ========================================================================= */
  const initLightcycle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = Math.max(400, canvas.clientWidth || 900);
    let height = Math.max(300, canvas.clientHeight || 560);

    const gridSize = 16;
    let cycleX = Math.floor((width / 2) / gridSize) * gridSize || 320;
    let cycleY = Math.floor((height / 2) / gridSize) * gridSize || 240;
    let dir = { x: gridSize, y: 0 };
    let nextDir = { x: gridSize, y: 0 };

    let trail: Array<{ x: number; y: number }> = [];
    let curScore = 0;
    let speedMs = 70;
    let lastMove = Date.now();
    let isTurbo = false;

    let chip = { x: 0, y: 0 };
    const spawnChip = () => {
      chip = {
        x: Math.floor(Math.random() * (width / gridSize - 4) + 2) * gridSize,
        y: Math.floor(Math.random() * (height / gridSize - 4) + 2) * gridSize,
      };
    };
    spawnChip();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dir.y === 0) {
        nextDir = { x: 0, y: -gridSize };
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dir.y === 0) {
        nextDir = { x: 0, y: gridSize };
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dir.x === 0) {
        nextDir = { x: -gridSize, y: 0 };
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dir.x === 0) {
        nextDir = { x: gridSize, y: 0 };
      } else if (e.key === ' ') {
        isTurbo = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') isTurbo = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    inputBridgeRef.current.triggerAction = (action: string) => {
      if (action === 'up' && dir.y === 0) nextDir = { x: 0, y: -gridSize };
      if (action === 'down' && dir.y === 0) nextDir = { x: 0, y: gridSize };
      if (action === 'left' && dir.x === 0) nextDir = { x: -gridSize, y: 0 };
      if (action === 'right' && dir.x === 0) nextDir = { x: gridSize, y: 0 };
      if (action === 'action') isTurbo = !isTurbo;
    };

    const loop = () => {
      
      const currentStep = isTurbo ? speedMs * 0.5 : speedMs;
      if (Date.now() - lastMove > currentStep) {
        dir = nextDir;
        trail.push({ x: cycleX, y: cycleY });

        cycleX += dir.x;
        cycleY += dir.y;
        lastMove = Date.now();

        // Boundary Crash Check (Guarded against 0 dimensions)
        if (width > 100 && height > 100 && (cycleX < 0 || cycleX >= width || cycleY < 0 || cycleY >= height)) {
          audioSynth.explosion();
          audioSynth.gameOverSound();
          setGameOver(true);
          updateHighScore(curScore);
          return;
        }

        // Self-Trail Crash Check
        for (let i = 0; i < trail.length - 2; i++) {
          if (trail[i].x === cycleX && trail[i].y === cycleY) {
            audioSynth.explosion();
            audioSynth.gameOverSound();
            setGameOver(true);
            updateHighScore(curScore);
            return;
          }
        }

        // Chip Collect
        if (Math.hypot(cycleX - chip.x, cycleY - chip.y) < gridSize * 1.2) {
          curScore += 150;
          setScore(curScore);
          audioSynth.pickup();
          spawnChip();
          speedMs = Math.max(35, speedMs - 1.5);
        }
      }

      // Draw Grid Mainframe
      ctx.fillStyle = '#080816';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Laser Trail Ribbon
      ctx.save();
      ctx.strokeStyle = isTurbo ? '#FF00FF' : '#00FFFF';
      ctx.shadowBlur = 18;
      ctx.shadowColor = isTurbo ? '#FF00FF' : '#00FFFF';
      ctx.lineWidth = gridSize - 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x + gridSize / 2, trail[0].y + gridSize / 2);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x + gridSize / 2, trail[i].y + gridSize / 2);
        }
        ctx.lineTo(cycleX + gridSize / 2, cycleY + gridSize / 2);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Data Chip
      ctx.save();
      ctx.fillStyle = '#FFDD00';
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#FFDD00';
      ctx.fillRect(chip.x + 2, chip.y + 2, gridSize - 4, gridSize - 4);
      ctx.restore();

      // Draw Lightcycle Head & Player Beacon
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 24;
      ctx.shadowColor = isTurbo ? '#FF00FF' : '#00FFFF';
      ctx.fillRect(cycleX, cycleY, gridSize, gridSize);
      ctx.fillStyle = isTurbo ? '#FF0055' : '#00FFFF';
      ctx.fillRect(cycleX + 3, cycleY + 3, gridSize - 6, gridSize - 6);

      // Player Tag
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#00FFFF';
      ctx.textAlign = 'center';
      ctx.fillText('YOU', cycleX + gridSize / 2, cycleY - 5);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      },
      onResize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
      },
    };
  };

  const handleRestart = () => {
    playSound('click');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setLives(3);
    setOverdrivePercent(0);

    if (gameStateRef.current?.cleanup) {
      gameStateRef.current.cleanup();
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const id = gameId.toLowerCase();
        if (id.includes('invad') || id.includes('strike-swarm')) {
          initCyberInvaders(canvas, ctx);
        } else if (id.includes('lightcycle') || id.includes('cycle') || id.includes('snake')) {
          initLightcycle(canvas, ctx);
        } else if (id.includes('vortex') || id.includes('cyber-strike')) {
          initVortexDefender(canvas, ctx);
        } else if (id.includes('drift') || id.includes('quantum-velocity')) {
          initQuantumDrift(canvas, ctx);
        } else if (id.includes('hexa') || id.includes('circuit-match')) {
          initHexaMatrix(canvas, ctx);
        } else if (id.includes('slash') || id.includes('laser-defender')) {
          initCyberSlash(canvas, ctx);
        } else if (id.includes('grav') || id.includes('grid-breaker')) {
          initGravRunner(canvas, ctx);
        } else {
          initNeonPulse(canvas, ctx);
        }
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full transition-all ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#070716] p-2 md:p-3 flex flex-col overflow-hidden' 
          : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`relative bg-dark-background/95 backdrop-blur-xl border-2 border-accent-cyan/30 shadow-[0_0_40px_rgba(0,255,255,0.15)] flex flex-col ${
        isFullscreen ? 'h-full w-full p-2 md:p-3 rounded-lg border-accent-magenta/50 shadow-[0_0_80px_rgba(255,0,255,0.25)] justify-between' : 'p-4 md:p-6 rounded-2xl'
      }`}>
        {/* Game Top HUD */}
        <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-accent-cyan/20 ${
          isFullscreen ? 'mb-2 pb-2' : 'mb-4 pb-3'
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-heading text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta uppercase">
              {game.gameTitle}
            </h3>
            <div className="px-3 py-1 rounded-lg bg-accent-cyan/15 border border-accent-cyan/40">
              <span className="font-mono text-xs md:text-sm text-accent-cyan font-black">
                SCORE: {score}
              </span>
            </div>
            {highScore > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-magenta/15 border border-accent-magenta/40 text-accent-magenta font-mono text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                BEST: {highScore}
              </div>
            )}
            {overdrivePercent > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 font-mono text-xs font-bold">
                <Zap className="w-3 h-3 animate-pulse" />
                <span>OVERDRIVE {overdrivePercent}%</span>
              </div>
            )}
            {(gameId.includes('slash') || gameId.includes('laser') || gameId.includes('invad')) && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold">
                <Heart className="w-3 h-3 fill-current" />
                <span>LIVES: {lives}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Active Operative / Player Identity */}
            <button
              onClick={() => setShowPlayerDossier(!showPlayerDossier)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-purple/20 border border-accent-purple/50 text-accent-purple hover:bg-accent-purple/40 hover:text-white transition-all font-mono text-xs font-bold"
              title="View Operative Identity & Stats"
            >
              <User className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-accent-cyan hidden md:inline">OPERATIVE:</span>
              <span className="text-white tracking-wider font-mono font-black">{activePlayer?.gamerTag || 'CYBER_OPERATIVE'}</span>
              <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-accent-magenta/30 text-accent-magenta text-[10px] font-black uppercase">
                {activePlayer?.tier || 'ELITE'}
              </span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-lg bg-accent-cyan/15 border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan hover:text-dark-background transition-colors flex items-center gap-1.5 font-mono text-xs font-bold"
              title="Toggle Fullscreen Mode (Press F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-light-foreground/80 hover:text-accent-cyan hover:border-accent-cyan transition-colors"
              title={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-light-foreground/80 hover:text-accent-cyan hover:border-accent-cyan transition-colors"
              title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-accent-purple/20 border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/40 transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playSound('click');
                if (isFullscreen) toggleFullscreen();
                onExit();
              }}
              className="p-2 rounded-lg bg-accent-magenta/20 border border-accent-magenta/40 text-accent-magenta hover:bg-accent-magenta/40 transition-colors"
              title="Exit Arena"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Canvas Container - Scroll Protected */}
        <div className={`relative rounded-xl overflow-hidden border border-accent-cyan/30 bg-[#0c0c1c] ${
          isFullscreen ? 'flex-1 w-full min-h-0' : ''
        }`}>
          <canvas
            ref={canvasRef}
            className="w-full block touch-none cursor-crosshair"
            style={{ 
              height: isFullscreen ? '100%' : '560px',
              touchAction: 'none',
              overscrollBehavior: 'contain',
              userSelect: 'none'
            }}
          />

          {/* Active Player Dossier Modal Overlay */}
          {showPlayerDossier && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-dark-background/90 backdrop-blur-md p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0c0c20] border-2 border-accent-cyan shadow-[0_0_50px_rgba(0,255,255,0.3)] text-left">
                <button
                  onClick={() => setShowPlayerDossier(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg border border-accent-magenta/40 text-accent-magenta hover:bg-accent-magenta hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 border border-accent-cyan flex items-center justify-center text-accent-cyan shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-magenta/20 text-accent-magenta border border-accent-magenta/40 uppercase tracking-wider font-bold">
                      {activePlayer?.tier || 'LEGENDARY OPERATIVE'}
                    </span>
                    <h3 className="font-heading text-xl font-black text-white uppercase mt-0.5">
                      {activePlayer?.gamerTag || 'CYBER_VIPER'}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-light-foreground/60">CODENAME:</span>
                    <span className="text-accent-cyan font-bold">{activePlayer?.name || 'Operative Priya'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-light-foreground/60">SPECIALIZATION:</span>
                    <span className="text-accent-magenta font-bold">{activePlayer?.cyberRole || 'Grid Infiltrator & Speed Demon'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-light-foreground/60">ARENA RECORD:</span>
                    <span className="text-yellow-400 font-bold">{Math.max(highScore, 2850)} PTS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-light-foreground/60">OPERATIVE STATUS:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE IN GRID
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-light-foreground/50">PRESS [F] FOR FULLSCREEN</span>
                  <button
                    onClick={() => setShowPlayerDossier(false)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-dark-background font-mono text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    CONTINUE MISSION
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-dark-background/95 backdrop-blur-md p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center space-y-5 max-w-md">
                <div className="w-16 h-16 rounded-full bg-accent-magenta/20 border border-accent-magenta/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,0,255,0.4)]">
                  <Trophy className="w-8 h-8 text-accent-magenta" />
                </div>
                <div>
                  <h3 className="font-heading text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta uppercase">
                    GAME OVER
                  </h3>
                  <p className="font-mono text-xs text-light-foreground/60 tracking-widest mt-1">
                    RUN TERMINATED
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono">
                  <div className="text-2xl font-black text-accent-cyan">{score} PTS</div>
                  {score >= highScore && score > 0 && (
                    <div className="text-xs text-accent-magenta font-bold mt-1 animate-pulse">
                      🔥 NEW BEST HIGH SCORE!
                    </div>
                  )}
                </div>
                <button
                  onClick={handleRestart}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-magenta text-dark-background font-mono text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(0,255,255,0.5)] hover:scale-105 active:scale-95 transition-transform"
                >
                  PLAY AGAIN
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* On-Screen Mobile Virtual Controls with Zero Scroll Interference */}
        <div className={`flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-light-foreground/70 select-none ${
          isFullscreen ? 'mt-2 pt-1.5' : 'mt-4 pt-2'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-accent-cyan font-bold">CONTROLS:</span>
            <span>Arrows / WASD / Spacebar / Touch Buttons • Press [F] for Fullscreen</span>
          </div>

          {/* Virtual Directional and Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => inputBridgeRef.current.triggerAction('left')}
              className="p-3 bg-white/10 rounded-xl active:bg-accent-cyan/30 text-accent-cyan border border-white/10 hover:border-accent-cyan"
              title="Steer Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => inputBridgeRef.current.triggerAction('up')}
              className="p-3 bg-white/10 rounded-xl active:bg-accent-cyan/30 text-accent-cyan border border-white/10 hover:border-accent-cyan"
              title="Up / Fire"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => inputBridgeRef.current.triggerAction('action')}
              className="px-5 py-3 bg-accent-magenta/20 rounded-xl active:bg-accent-magenta/40 text-accent-magenta border border-accent-magenta/40 font-bold"
              title="Action / Boost / Fire"
            >
              ACTION
            </button>
            <button
              onClick={() => inputBridgeRef.current.triggerAction('down')}
              className="p-3 bg-white/10 rounded-xl active:bg-accent-cyan/30 text-accent-cyan border border-white/10 hover:border-accent-cyan"
              title="Down"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              onClick={() => inputBridgeRef.current.triggerAction('right')}
              className="p-3 bg-white/10 rounded-xl active:bg-accent-cyan/30 text-accent-cyan border border-white/10 hover:border-accent-cyan"
              title="Steer Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
