import type { MiniGames, PlayerCards } from '@/entities';

export interface ExtendedMiniGame extends MiniGames {
  badge?: string;
  difficulty?: 'CASUAL' | 'MEDIUM' | 'HARDCORE' | 'EXTREME' | 'TACTICAL' | 'REFLEX';
  rating?: number;
  plays?: string;
  tagline?: string;
  controlsInfo?: string;
}

const gameImage = (file: string) => {
  // Use relative path from root to ensure it resolves on both Vercel and local
  return `/images/games/${file}`;
};

export const seedMiniGames: ExtendedMiniGame[] = [
  {
    _id: 'neon-dash',
    gameTitle: 'Neon Pulse: Hyper Dash',
    genre: 'Rhythm Runner',
    badge: 'HYPER SPEED',
    difficulty: 'MEDIUM',
    rating: 4.9,
    plays: '18.4K',
    thumbnailImage: gameImage('neon-dash.jpg'),
    tagline: 'Dodge EMP waves, harvest overclock gems, and trigger rainbow warp overdrive!',
    gameDescription:
      'Surf across high-speed cyber lanes through the neon skyline. Dodge electromagnetic laser walls, collect energy chips, and unleash 5-second Overdrive invulnerability for massive score multipliers!',
    controlsInfo: 'Arrows / A & D or Touch Lanes to switch lanes • Space or Tap Overdrive to trigger invincibility mode',
    playLink: '/game/neon-dash',
  },
  {
    _id: 'cyber-strike',
    gameTitle: 'Vortex Defender 360°',
    genre: 'Orbital Shooter',
    badge: 'BULLET HELL',
    difficulty: 'HARDCORE',
    rating: 4.9,
    plays: '24.1K',
    thumbnailImage: gameImage('cyber-strike.jpg'),
    tagline: '360-degree orbital defense against relentless geometric alien swarms.',
    gameDescription:
      'Rotate your orbital defense turret around the core in full 360 degrees. Blast incoming neon swarms, disintegrate armored hexagons, and trigger the screen-clearing EMP Shockwave when surrounded!',
    controlsInfo: 'Mouse Aim / Touch / Arrow Keys to rotate turret • Spacebar / Click to Fire • E / Shockwave button for EMP Blast',
    playLink: '/game/cyber-strike',
  },
  {
    _id: 'quantum-velocity',
    gameTitle: 'Quantum Drift 2099',
    genre: 'Neon Racing',
    badge: 'WARP SPEED',
    difficulty: 'EXTREME',
    rating: 4.8,
    plays: '31.2K',
    thumbnailImage: gameImage('quantum-velocity.jpg'),
    tagline: 'Weave through autonomous traffic at Mach 3 into a neon synthwave horizon.',
    gameDescription:
      'Pilot a bleeding-edge quantum hovercraft screaming down Tokyo 2099 cyber-highways. Dodge autonomous transport drones, trigger nitro boost ramps, and bank close-call bonuses without scraping the barriers!',
    controlsInfo: 'A / D or Left / Right Arrows to steer • Shift / Touch to Drift • Hit Nitro pads on the road for warp speed',
    playLink: '/game/quantum-velocity',
  },
  {
    _id: 'circuit-match',
    gameTitle: 'Hexa Matrix: Neon Link',
    genre: 'Cyber Puzzle',
    badge: 'CHAIN COMBO',
    difficulty: 'TACTICAL',
    rating: 4.7,
    plays: '15.6K',
    thumbnailImage: gameImage('circuit-match.jpg'),
    tagline: 'Rotate laser conduits and trigger explosive neural circuit cascades.',
    gameDescription:
      'Connect glowing laser conduits across a hexagonal matrix grid. Align 3 or more matching energy frequencies to trigger high-voltage chain reactions with cascading combos and screen-pulsing shockwaves!',
    controlsInfo: 'Click or Tap any hex node to rotate its lasers • Connect 3 matching nodes in a circuit to trigger combo collapse',
    playLink: '/game/circuit-match',
  },
  {
    _id: 'laser-defender',
    gameTitle: 'Cyber Slash: Blade Runner',
    genre: 'Reflex Slicer',
    badge: 'BULLET TIME',
    difficulty: 'REFLEX',
    rating: 4.9,
    plays: '22.8K',
    thumbnailImage: gameImage('laser-defender.jpg'),
    tagline: 'Slice incoming encrypted data nodes in cinematic bullet-time slowdown.',
    gameDescription:
      'Wield a high-frequency neon energy blade. Swipe and slice flying encrypted data packets and energy cores out of the neon rain. Trigger multi-slice combos, grab Chrono-Orbs for slow-motion matrix mode, and avoid glitch viruses!',
    controlsInfo: 'Click & Drag / Swipe your mouse or finger across items to slice • Slice 3+ together for Combos • Avoid red Glitch bombs',
    playLink: '/game/laser-defender',
  },
  {
    _id: 'grid-breaker',
    gameTitle: 'Grav-Runner: Zero Chrono',
    genre: 'Gravity Flip',
    badge: 'ENDLESS',
    difficulty: 'EXTREME',
    rating: 4.8,
    plays: '19.7K',
    thumbnailImage: gameImage('grid-breaker.jpg'),
    tagline: 'Invert gravity at the speed of light across cyberpunk skyscraper roofs.',
    gameDescription:
      'A pulse-pounding endless gravity runner. Run along glowing magnetic tracks and tap to instantly invert gravity between floor and ceiling. Dodge electrified spikes, laser gates, and floating minefields while snatching chrono crystals!',
    controlsInfo: 'SPACEBAR / Up Arrow / Tap Screen to flip gravity between floor & ceiling • Dodge obstacles on both sides',
    playLink: '/game/grid-breaker',
  },
];

export const seedPlayerCards: PlayerCards[] = [
  {
    _id: 'card-tp-prime',
    name: 'Teja Priyan',
    gamerTag: 'TP_APEX_PRIME',
    age: 21,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
  },
  {
    _id: 'card-cyber-valk',
    name: 'Aria Cross',
    gamerTag: 'NEON_VALKYRIE',
    age: 23,
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
  },
  {
    _id: 'card-matrix-ghost',
    name: 'Kaelen Vance',
    gamerTag: 'GHOST_RUNNER_99',
    age: 24,
    gender: 'Non-Binary',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
  },
];
