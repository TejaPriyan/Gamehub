import type { MiniGames, PlayerCards } from '@/entities';

/**
 * Local fallback data for "Teja Priyan World".
 *
 * When the site runs standalone (no Wix runtime), the data layer falls back
 * to these collections so the arena and player cards still work end-to-end.
 * When Wix is available, these are ignored and live CMS data is used instead.
 */

const gameImage = (file: string) => `${import.meta.env.BASE_URL}images/games/${file}`;

export const seedMiniGames: MiniGames[] = [
  {
    _id: 'neon-dash',
    gameTitle: 'Neon Dash',
    genre: 'Arcade',
    thumbnailImage: gameImage('neon-dash.jpg'),
    gameDescription:
      'Catch the falling neon orbs and rack up your score before the grid swallows them. Simple to learn, hard to master.',
    playLink: '',
  },
  {
    _id: 'cyber-strike',
    gameTitle: 'Cyber Strike',
    genre: 'Shooter',
    thumbnailImage: gameImage('cyber-strike.jpg'),
    gameDescription:
      'Pilot your fighter through waves of hostile drones. Dodge, weave and blast your way to the top of the leaderboard.',
    playLink: '',
  },
  {
    _id: 'grid-breaker',
    gameTitle: 'Grid Breaker',
    genre: 'Puzzle',
    thumbnailImage: gameImage('grid-breaker.jpg'),
    gameDescription:
      'Match three or more tiles in the glowing grid. Chain combos for massive score multipliers.',
    playLink: '',
  },
  {
    _id: 'quantum-velocity',
    gameTitle: 'Quantum Velocity',
    genre: 'Racing',
    thumbnailImage: gameImage('quantum-velocity.jpg'),
    gameDescription:
      'Weave through oncoming traffic at impossible speed. One mistake ends the run — how far can you go?',
    playLink: '',
  },
  {
    _id: 'laser-defender',
    gameTitle: 'Laser Defender',
    genre: 'Action',
    thumbnailImage: gameImage('laser-defender.jpg'),
    gameDescription:
      'Hold the line against the swarm. Blast enemies before they breach your position in this arcade defense duel.',
    playLink: '',
  },
  {
    _id: 'circuit-match',
    gameTitle: 'Circuit Match',
    genre: 'Match',
    thumbnailImage: gameImage('circuit-match.jpg'),
    gameDescription:
      'Rewire the circuit board by matching colored nodes. A brain-bending puzzle with a neon twist.',
    playLink: '',
  },
];

export const seedPlayerCards: PlayerCards[] = [];
