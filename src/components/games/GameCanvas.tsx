import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { MiniGames } from '@/entities';

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
  const gameStateRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game based on genre
    const genre = game.genre?.toLowerCase() || 'arcade';
    
    if (genre.includes('puzzle') || genre.includes('match')) {
      initPuzzleGame(canvas, ctx);
    } else if (genre.includes('shooter') || genre.includes('action')) {
      initShooterGame(canvas, ctx);
    } else if (genre.includes('racing') || genre.includes('speed')) {
      initRacingGame(canvas, ctx);
    } else {
      initArcadeGame(canvas, ctx);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gameStateRef.current?.cleanup) {
        gameStateRef.current.cleanup();
      }
    };
  }, [game]);

  // Arcade Game (Default - Catch falling objects)
  const initArcadeGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animationId: number;
    let playerX = canvas.width / 2;
    const playerWidth = 80;
    const playerHeight = 20;
    const playerSpeed = 8;
    let objects: Array<{ x: number; y: number; speed: number; color: string }> = [];
    let currentScore = 0;
    let keys: { [key: string]: boolean } = {};

    const colors = ['#00FFFF', '#FF00FF', '#8A2BE2'];

    const spawnObject = () => {
      objects.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        speed: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.clientX - rect.left - playerWidth / 2;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    let lastSpawn = Date.now();

    const gameLoop = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update player position
      if (keys['ArrowLeft'] || keys['a']) playerX -= playerSpeed;
      if (keys['ArrowRight'] || keys['d']) playerX += playerSpeed;
      playerX = Math.max(0, Math.min(canvas.width - playerWidth, playerX));

      // Draw player
      ctx.fillStyle = '#00FFFF';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.fillRect(playerX, canvas.height - 40, playerWidth, playerHeight);
      ctx.shadowBlur = 0;

      // Spawn objects
      if (Date.now() - lastSpawn > 1000) {
        spawnObject();
        lastSpawn = Date.now();
      }

      // Update and draw objects
      objects = objects.filter((obj) => {
        obj.y += obj.speed;

        // Check collision
        if (
          obj.y + 30 >= canvas.height - 40 &&
          obj.y <= canvas.height - 20 &&
          obj.x + 30 >= playerX &&
          obj.x <= playerX + playerWidth
        ) {
          currentScore += 10;
          setScore(currentScore);
          return false;
        }

        // Remove if off screen
        if (obj.y > canvas.height) {
          setGameOver(true);
          if (currentScore > highScore) setHighScore(currentScore);
          return false;
        }

        // Draw object
        ctx.fillStyle = obj.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = obj.color;
        ctx.beginPath();
        ctx.arc(obj.x + 15, obj.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
      },
    };
  };

  // Shooter Game
  const initShooterGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animationId: number;
    let playerX = canvas.width / 2;
    let playerY = canvas.height - 80;
    const playerSize = 40;
    let bullets: Array<{ x: number; y: number }> = [];
    let enemies: Array<{ x: number; y: number; speed: number }> = [];
    let currentScore = 0;
    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (e.key === ' ') {
        bullets.push({ x: playerX, y: playerY });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let lastSpawn = Date.now();

    const gameLoop = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update player
      if (keys['ArrowLeft'] || keys['a']) playerX -= 6;
      if (keys['ArrowRight'] || keys['d']) playerX += 6;
      if (keys['ArrowUp'] || keys['w']) playerY -= 6;
      if (keys['ArrowDown'] || keys['s']) playerY += 6;

      playerX = Math.max(20, Math.min(canvas.width - 20, playerX));
      playerY = Math.max(20, Math.min(canvas.height - 20, playerY));

      // Draw player
      ctx.fillStyle = '#00FFFF';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(playerX, playerY - playerSize / 2);
      ctx.lineTo(playerX - playerSize / 2, playerY + playerSize / 2);
      ctx.lineTo(playerX + playerSize / 2, playerY + playerSize / 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Spawn enemies
      if (Date.now() - lastSpawn > 1500) {
        enemies.push({
          x: Math.random() * canvas.width,
          y: -30,
          speed: 2 + Math.random() * 2,
        });
        lastSpawn = Date.now();
      }

      // Update bullets
      bullets = bullets.filter((bullet) => {
        bullet.y -= 10;
        ctx.fillStyle = '#FF00FF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF00FF';
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 15);
        ctx.shadowBlur = 0;
        return bullet.y > 0;
      });

      // Update enemies
      enemies = enemies.filter((enemy) => {
        enemy.y += enemy.speed;

        // Check bullet collision
        const hit = bullets.some((bullet) => {
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          return Math.sqrt(dx * dx + dy * dy) < 25;
        });

        if (hit) {
          currentScore += 50;
          setScore(currentScore);
          bullets = bullets.filter((bullet) => {
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            return Math.sqrt(dx * dx + dy * dy) >= 25;
          });
          return false;
        }

        // Check player collision
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          setGameOver(true);
          if (currentScore > highScore) setHighScore(currentScore);
          return false;
        }

        if (enemy.y > canvas.height) return false;

        // Draw enemy
        ctx.fillStyle = '#FF00FF';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF00FF';
        ctx.fillRect(enemy.x - 15, enemy.y - 15, 30, 30);
        ctx.shadowBlur = 0;

        return true;
      });

      if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      },
    };
  };

  // Racing Game
  const initRacingGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animationId: number;
    let playerX = canvas.width / 2;
    const playerWidth = 50;
    const playerHeight = 80;
    let obstacles: Array<{ x: number; y: number; speed: number }> = [];
    let currentScore = 0;
    let keys: { [key: string]: boolean } = {};
    let roadOffset = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let lastSpawn = Date.now();

    const gameLoop = () => {
      ctx.fillStyle = '#1A1A2E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road
      roadOffset += 5;
      if (roadOffset > 40) roadOffset = 0;

      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 4;
      for (let i = -40; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i + roadOffset);
        ctx.lineTo(canvas.width / 2, i + roadOffset + 20);
        ctx.stroke();
      }

      // Update player
      if (keys['ArrowLeft'] || keys['a']) playerX -= 6;
      if (keys['ArrowRight'] || keys['d']) playerX += 6;
      playerX = Math.max(playerWidth / 2, Math.min(canvas.width - playerWidth / 2, playerX));

      // Draw player car
      ctx.fillStyle = '#00FFFF';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.fillRect(
        playerX - playerWidth / 2,
        canvas.height - 120,
        playerWidth,
        playerHeight
      );
      ctx.shadowBlur = 0;

      // Spawn obstacles
      if (Date.now() - lastSpawn > 1200) {
        const lane = Math.random() < 0.5 ? canvas.width / 3 : (canvas.width * 2) / 3;
        obstacles.push({
          x: lane,
          y: -80,
          speed: 5 + Math.random() * 3,
        });
        lastSpawn = Date.now();
      }

      // Update obstacles
      obstacles = obstacles.filter((obstacle) => {
        obstacle.y += obstacle.speed;

        // Check collision
        if (
          obstacle.y + 80 >= canvas.height - 120 &&
          obstacle.y <= canvas.height - 40 &&
          Math.abs(obstacle.x - playerX) < playerWidth
        ) {
          setGameOver(true);
          if (currentScore > highScore) setHighScore(currentScore);
          return false;
        }

        if (obstacle.y > canvas.height) {
          currentScore += 10;
          setScore(currentScore);
          return false;
        }

        // Draw obstacle
        ctx.fillStyle = '#FF00FF';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF00FF';
        ctx.fillRect(obstacle.x - 25, obstacle.y, 50, 80);
        ctx.shadowBlur = 0;

        return true;
      });

      if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      },
    };
  };

  // Puzzle Game
  const initPuzzleGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    let animationId: number;
    let currentScore = 0;
    const gridSize = 4;
    const cellSize = Math.min(canvas.width, canvas.height) / (gridSize + 1);
    const offsetX = (canvas.width - cellSize * gridSize) / 2;
    const offsetY = (canvas.height - cellSize * gridSize) / 2;
    let grid: number[][] = [];
    let selectedCell: { row: number; col: number } | null = null;

    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        grid[i][j] = Math.floor(Math.random() * 4);
      }
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor((x - offsetX) / cellSize);
      const row = Math.floor((y - offsetY) / cellSize);

      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        if (!selectedCell) {
          selectedCell = { row, col };
        } else {
          // Swap cells
          const temp = grid[row][col];
          grid[row][col] = grid[selectedCell.row][selectedCell.col];
          grid[selectedCell.row][selectedCell.col] = temp;
          selectedCell = null;

          // Check for matches
          checkMatches();
        }
      }
    };

    const checkMatches = () => {
      let matches = 0;
      // Check rows
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize - 2; j++) {
          if (
            grid[i][j] === grid[i][j + 1] &&
            grid[i][j] === grid[i][j + 2]
          ) {
            grid[i][j] = grid[i][j + 1] = grid[i][j + 2] = Math.floor(Math.random() * 4);
            matches++;
          }
        }
      }
      // Check columns
      for (let j = 0; j < gridSize; j++) {
        for (let i = 0; i < gridSize - 2; i++) {
          if (
            grid[i][j] === grid[i + 1][j] &&
            grid[i][j] === grid[i + 2][j]
          ) {
            grid[i][j] = grid[i + 1][j] = grid[i + 2][j] = Math.floor(Math.random() * 4);
            matches++;
          }
        }
      }
      if (matches > 0) {
        currentScore += matches * 100;
        setScore(currentScore);
      }
    };

    canvas.addEventListener('click', handleClick);

    const colors = ['#00FFFF', '#FF00FF', '#8A2BE2', '#E0E0E0'];

    const gameLoop = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = offsetX + j * cellSize;
          const y = offsetY + i * cellSize;

          ctx.fillStyle = colors[grid[i][j]];
          ctx.shadowBlur = 15;
          ctx.shadowColor = colors[grid[i][j]];
          ctx.fillRect(x + 5, y + 5, cellSize - 10, cellSize - 10);
          ctx.shadowBlur = 0;

          // Highlight selected cell
          if (selectedCell && selectedCell.row === i && selectedCell.col === j) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.strokeRect(x + 5, y + 5, cellSize - 10, cellSize - 10);
          }
        }
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    gameStateRef.current = {
      cleanup: () => {
        cancelAnimationFrame(animationId);
        canvas.removeEventListener('click', handleClick);
      },
    };
  };

  const handleRestart = () => {
    playSound('click');
    setScore(0);
    setGameOver(false);
    if (gameStateRef.current?.cleanup) {
      gameStateRef.current.cleanup();
    }
    // Re-initialize game
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const genre = game.genre?.toLowerCase() || 'arcade';
        if (genre.includes('puzzle') || genre.includes('match')) {
          initPuzzleGame(canvas, ctx);
        } else if (genre.includes('shooter') || genre.includes('action')) {
          initShooterGame(canvas, ctx);
        } else if (genre.includes('racing') || genre.includes('speed')) {
          initRacingGame(canvas, ctx);
        } else {
          initArcadeGame(canvas, ctx);
        }
      }
    }
  };

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative p-6 rounded-2xl bg-dark-background/70 backdrop-blur-xl border border-accent-cyan/20 shadow-2xl">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-heading text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
              {game.gameTitle}
            </h3>
            <div className="px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30">
              <span className="font-paragraph text-sm text-accent-cyan uppercase">
                Score: {score}
              </span>
            </div>
            {highScore > 0 && (
              <div className="px-4 py-2 rounded-lg bg-accent-magenta/10 border border-accent-magenta/30">
                <span className="font-paragraph text-sm text-accent-magenta uppercase flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Best: {highScore}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              onMouseEnter={() => playSound('hover')}
              className="p-2 rounded-lg bg-accent-purple/20 border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                playSound('click');
                onExit();
              }}
              onMouseEnter={() => playSound('hover')}
              className="p-2 rounded-lg bg-accent-magenta/20 border border-accent-magenta/30 text-accent-magenta hover:bg-accent-magenta/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl border-2 border-accent-cyan/30 shadow-lg shadow-accent-cyan/20"
            style={{ height: '600px', background: '#1A1A2E' }}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-dark-background/90 backdrop-blur-sm rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center space-y-6 p-8">
                <Trophy className="w-20 h-20 text-accent-cyan mx-auto" />
                <h3 className="font-heading text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                  GAME OVER
                </h3>
                <div className="space-y-2">
                  <p className="font-paragraph text-xl text-light-foreground">
                    Final Score: <span className="text-accent-cyan font-bold">{score}</span>
                  </p>
                  {score === highScore && score > 0 && (
                    <p className="font-paragraph text-sm text-accent-magenta">
                      🎉 New High Score!
                    </p>
                  )}
                </div>
                <button
                  onClick={handleRestart}
                  onMouseEnter={() => playSound('hover')}
                  className="px-8 py-4 font-paragraph text-sm font-bold uppercase text-primary-foreground bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-accent-cyan/30"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls Info */}
        <div className="mt-4 p-4 rounded-lg bg-dark-background/50 border border-accent-cyan/10">
          <p className="font-paragraph text-sm text-light-foreground/60 text-center">
            {game.genre?.toLowerCase().includes('puzzle')
              ? '🖱️ Click to select and swap tiles to match 3 or more'
              : game.genre?.toLowerCase().includes('shooter')
              ? '⌨️ Arrow Keys / WASD to move • SPACE to shoot'
              : game.genre?.toLowerCase().includes('racing')
              ? '⌨️ Arrow Keys / A/D to steer • Avoid obstacles'
              : '⌨️ Arrow Keys / A/D to move • 🖱️ Mouse to control • Catch falling objects'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
