import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  RotateCcw, 
  Trophy, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { MiniGames } from '@/entities';

// Web Audio API Synth for zero-dependency, ultra-low-latency arcade sound effects
class CyberAudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  laser() {
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
  }

  explosion() {
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
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.31);
  }

  pickup() {
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
  }

  jump() {
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
  }

  overdrive() {
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
  }

  slice() {
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
  }

  gameOverSound() {
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
  }
}

const audioSynth = new CyberAudioSynth();

interface GameCanvasProps {
  game: MiniGames;
  onExit: () => void;
  playSound: (type: 'click' | 'hover') => void;
}

export default function GameCanvas({ game, onExit, playSound }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [overdrivePercent, setOverdrivePercent] = useState(0);
  const [lives, setLives] = useState(3);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

    // Check touch support
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crispness
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize the specific game engine
    const id = gameId.toLowerCase();
    if (id.includes('vortex') || id.includes('cyber-strike')) {
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
      // Default: Neon Pulse Hyper Dash
      initNeonPulse(canvas, ctx);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gameStateRef.current?.cleanup) {
        gameStateRef.current.cleanup();
      }
    };
  }, [gameId]);

  /* =========================================================================
     GAME 1: NEON PULSE (Hyper Rhythm & Lane Dash)
     ========================================================================= */
  const initNeonPulse = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const numLanes = 5;
    let currentLane = 2; // 0 to 4
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
    let overdrive = 0; // 0 to 100
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
        overdriveTimer = 300; // ~5 seconds at 60fps
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
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      // Dark futuristic background
      ctx.fillStyle = isOverdriveActive ? 'rgba(35, 10, 45, 0.4)' : 'rgba(10, 10, 24, 0.35)';
      ctx.fillRect(0, 0, width, height);

      // Draw futuristic perspective lanes
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

      // Smooth lane movement
      lanePos += (targetLane - lanePos) * 0.25;
      const playerX = getLaneX(lanePos);
      const playerY = height - 90;

      // Update overdrive
      if (isOverdriveActive) {
        overdriveTimer--;
        overdrive = Math.max(0, (overdriveTimer / 300) * 100);
        setOverdrivePercent(Math.floor(overdrive));
        if (overdriveTimer <= 0) {
          isOverdriveActive = false;
        }
      }

      // Spawn items
      if (Date.now() - lastSpawn > Math.max(450, 1100 - speed * 40)) {
        spawnItem();
        lastSpawn = Date.now();
        speed = Math.min(14, speed + 0.02);
      }

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += speed * (isOverdriveActive ? 1.4 : 1);
        const itemX = getLaneX(item.lane);

        // Render item
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
          // Quantum Star
          ctx.beginPath();
          ctx.arc(itemX, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();

        // Collision Check
        const dist = Math.hypot(itemX - playerX, item.y - playerY);
        if (dist < 42 && !item.hit) {
          item.hit = true;

          if (item.type === 'barrier') {
            if (isOverdriveActive) {
              // Destroy barrier!
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
              // Hit barrier -> Game Over
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

        // Off screen cleanup
        if (item.y > height + 60) {
          if (item.type === 'barrier') {
            curScore += 15;
            setScore(curScore);
          }
          items.splice(i, 1);
        }
      }

      // Draw Particles
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

      // Draw Player Cyber Pod
      if (!isDead) {
        ctx.save();
        ctx.shadowBlur = isOverdriveActive ? 30 : 18;
        ctx.shadowColor = isOverdriveActive ? '#FF00FF' : '#00FFFF';

        // Hover effect bob
        const bob = Math.sin(Date.now() * 0.008) * 4;

        // Pod Base
        ctx.fillStyle = isOverdriveActive ? '#FF00FF' : '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(playerX, playerY - 26 + bob);
        ctx.lineTo(playerX + 26, playerY + 20 + bob);
        ctx.lineTo(playerX, playerY + 12 + bob);
        ctx.lineTo(playerX - 26, playerY + 20 + bob);
        ctx.closePath();
        ctx.fill();

        // Pod Cockpit
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(playerX, playerY + bob, 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Jet thruster flames
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
    };
  };

  /* =========================================================================
     GAME 2: VORTEX DEFENDER (360° Orbital Turret Shooter)
     ========================================================================= */
  const initVortexDefender = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

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
        // Vaporize all enemies
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
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = 'rgba(12, 12, 28, 0.35)';
      ctx.fillRect(0, 0, width, height);

      // Radar rings
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
      [80, 160, 240, 320].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Spawn Enemies from outside canvas
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

      // Update Bullets
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

        // Check bullet vs enemy collision
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

      // Update & Draw Enemies
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

        // Hit Central Core
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

      // Draw Shockwaves
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

      // Draw Particles
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

      // Draw Central Core
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

      // Core Health Meter Ring
      ctx.strokeStyle = coreHealth > 40 ? '#00FFFF' : '#FF0055';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (coreHealth / 100)));
      ctx.stroke();

      // Orbital Turret Cannon
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
    };
  };

  /* =========================================================================
     GAME 3: QUANTUM DRIFT 2099 (Highway Warp Racer)
     ========================================================================= */
  const initQuantumDrift = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    let carX = width / 2;
    let targetX = width / 2;
    let speed = 220; // km/h
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
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, width, height);

      // Perspective road
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

      // Road boundary neon glow lines
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

      // Update Car Position
      carX += (targetX - carX) * 0.15;
      const minX = width / 2 - roadBottomW / 2 + 30;
      const maxX = width / 2 + roadBottomW / 2 - 30;
      carX = Math.max(minX, Math.min(maxX, carX));
      targetX = Math.max(minX, Math.min(maxX, targetX));

      // Speed & Score
      speed = isNitro ? 380 : 240;
      curScore += Math.floor(speed / 30);
      setScore(curScore);

      if (isNitro) {
        nitro -= 0.8;
        if (nitro <= 0) isNitro = false;
      } else {
        nitro = Math.min(100, nitro + 0.1);
      }

      // Spawn Traffic
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

      // Draw Nitro Pads
      for (let n = nitroPads.length - 1; n >= 0; n--) {
        const pad = nitroPads[n];
        pad.y += 8;
        ctx.fillStyle = '#00FF66';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00FF66';
        ctx.fillRect(pad.x - 16, pad.y, 32, 16);
        ctx.shadowBlur = 0;

        // Collect Nitro
        if (Math.hypot(pad.x - carX, pad.y - (height - 80)) < 36) {
          nitro = 100;
          isNitro = true;
          audioSynth.pickup();
          nitroPads.splice(n, 1);
        } else if (pad.y > height + 50) {
          nitroPads.splice(n, 1);
        }
      }

      // Draw & Update Traffic
      for (let t = traffic.length - 1; t >= 0; t--) {
        const tr = traffic[t];
        tr.y += tr.speed * (isNitro ? 1.6 : 1.2);
        // Expand as it gets closer for 3D illusion
        const scale = 0.5 + (tr.y / height) * 0.8;
        const w = tr.width * scale;
        const h = tr.height * scale;

        ctx.fillStyle = tr.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = tr.color;
        ctx.fillRect(tr.x - w / 2, tr.y, w, h);
        ctx.shadowBlur = 0;

        // Collision Check
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

      // Draw Player Hover Car
      const carY = height - 90;
      ctx.save();
      ctx.shadowBlur = isNitro ? 35 : 20;
      ctx.shadowColor = isNitro ? '#FF00FF' : '#00FFFF';
      ctx.fillStyle = isNitro ? '#FF00FF' : '#00FFFF';
      ctx.fillRect(carX - 22, carY, 44, 60);

      // Tail lights
      ctx.fillStyle = '#FF0055';
      ctx.fillRect(carX - 18, carY + 54, 10, 6);
      ctx.fillRect(carX + 8, carY + 54, 10, 6);

      // Windshield
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
    };
  };

  /* =========================================================================
     GAME 4: HEXA MATRIX (Hex Circuit Chain Reaction)
     ========================================================================= */
  const initHexaMatrix = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    const cols = 6;
    const rows = 5;
    let curScore = 0;

    const colors = ['#00FFFF', '#FF00FF', '#FFDD00', '#00FF66'];
    let grid: Array<Array<{ angle: number; colorIndex: number; pulsing?: boolean }>> = [];

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

      const cellW = canvas.clientWidth / cols;
      const cellH = canvas.clientHeight / rows;
      const c = Math.floor(x / cellW);
      const r = Math.floor(y / cellH);

      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid[r][c].angle = (grid[r][c].angle + 90) % 360;
        audioSynth.pickup();

        // Check for matching adjacent connections
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
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
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

          // Cross Laser Conduits
          ctx.beginPath();
          ctx.moveTo(-cellW * 0.35, 0);
          ctx.lineTo(cellW * 0.35, 0);
          ctx.moveTo(0, -cellH * 0.35);
          ctx.lineTo(0, cellH * 0.35);
          ctx.stroke();

          // Center Node
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
    };
  };

  /* =========================================================================
     GAME 5: CYBER SLASH: BLADE RUNNER (Reflex Data Slicer)
     ========================================================================= */
  const initCyberSlash = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
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

      // Check collision with airborne items
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
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      ctx.fillStyle = 'rgba(10, 10, 26, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Spawn packets upwards
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

      // Update & Draw Packets with Gravity
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.x += it.vx;
        it.y += it.vy;
        it.vy += 0.35; // Gravity pull

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

      // Draw Laser Blade Trail
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
    };
  };

  /* =========================================================================
     GAME 6: GRAV-RUNNER: ZERO CHRONO (Gravity Flipper)
     ========================================================================= */
  const initGravRunner = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animId: number;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    let gravity = 1; // 1 = floor, -1 = ceiling
    let playerY = height - 60;
    const playerX = 120;
    let curScore = 0;
    let speed = 6;

    let obstacles: Array<{ x: number; y: number; width: number; height: number; side: 'floor' | 'ceil' }> = [];
    let crystals: Array<{ x: number; y: number; collected?: boolean }> = [];
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
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      ctx.fillStyle = '#0e0e22';
      ctx.fillRect(0, 0, width, height);

      // Rails
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(width, 40); // Ceiling
      ctx.moveTo(0, height - 40);
      ctx.lineTo(width, height - 40); // Floor
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Player Movement
      const targetY = gravity === 1 ? height - 64 : 44;
      playerY += (targetY - playerY) * 0.25;

      curScore += 1;
      setScore(curScore);
      speed = Math.min(13, speed + 0.003);

      // Spawn Obstacles & Crystals
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

      // Draw Crystals
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

      // Draw Obstacles
      for (let o = obstacles.length - 1; o >= 0; o--) {
        const ob = obstacles[o];
        ob.x -= speed;

        ctx.fillStyle = '#FF0055';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#FF0055';
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

        // Check Collision
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

      // Draw Player Runner
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
        if (id.includes('vortex') || id.includes('cyber-strike')) {
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
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative p-4 md:p-6 rounded-2xl bg-dark-background/90 backdrop-blur-xl border-2 border-accent-cyan/30 shadow-[0_0_40px_rgba(0,255,255,0.15)]">
        {/* Game Top HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-accent-cyan/20">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-2">
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
                onExit();
              }}
              className="p-2 rounded-lg bg-accent-magenta/20 border border-accent-magenta/40 text-accent-magenta hover:bg-accent-magenta/40 transition-colors"
              title="Exit Arena"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative rounded-xl overflow-hidden border border-accent-cyan/30 bg-[#0c0c1c]">
          <canvas
            ref={canvasRef}
            className="w-full block touch-none cursor-crosshair"
            style={{ height: '560px' }}
          />

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

        {/* On-Screen Mobile Virtual Controls */}
        <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-light-foreground/70">
          <div className="flex items-center gap-2">
            <span className="text-accent-cyan font-bold">CONTROLS:</span>
            <span>Keyboard (Arrow keys / WASD / Spacebar) or Mouse / Touch</span>
          </div>

          {/* Virtual Buttons for Touch/Mobile */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => inputBridgeRef.current.triggerAction('left')}
              className="p-3 bg-white/10 rounded-xl active:bg-accent-cyan/30 text-accent-cyan border border-white/10"
              title="Steer Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => inputBridgeRef.current.triggerAction('action')}
              className="px-5 py-3 bg-accent-magenta/20 rounded-xl active:bg-accent-magenta/40 text-accent-magenta border border-accent-magenta/40 font-bold"
              title="Action / Overdrive / Jump / Fire"
            >
              ACTION / BOOST
            </button>
            <button
              onClick={() => inputBridgeRef.current.triggerAction('right')}
              className="p-3 bg-white/10 rounded-xl active:bg-accent-cyan/30 text-accent-cyan border border-white/10"
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
