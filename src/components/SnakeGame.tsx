import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (s: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef(snake);
  const dirRef = useRef(direction);
  const gameOverRef = useRef(gameOver);
  const pauseRef = useRef(isPaused);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { dirRef.current = direction; }, [direction]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { pauseRef.current = isPaused; }, [isPaused]);

  const generateFood = useCallback((currentSnake: {x:number, y:number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && currentDir.y !== 1) setDirection({ x: 0, y: -1 });
      if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && currentDir.y !== -1) setDirection({ x: 0, y: 1 });
      if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && currentDir.x !== 1) setDirection({ x: -1, y: 0 });
      if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && currentDir.x !== -1) setDirection({ x: 1, y: 0 });
      if (e.key === ' ' || e.key === 'Enter') {
        if (gameOverRef.current) resetGame();
        else setIsPaused(!pauseRef.current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOverRef.current || pauseRef.current) return;

      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const currentDir = dirRef.current;

      head.x += currentDir.x;
      head.y += currentDir.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(currentSnake));
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [food, score, onScoreChange, generateFood]);

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className="relative border-4 border-[#00ffff] bg-[#020202] grid"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: '100%',
          maxWidth: '500px',
          aspectRatio: '1/1',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = !isSnakeHead && snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          let cellClass = "";
          if (isSnakeHead) cellClass = "bg-[#ffffff] shadow-[0_0_10px_#ffffff] z-10";
          else if (isSnakeBody) cellClass = "bg-[#00ffff] opacity-80 border border-[#008888]";
          else if (isFood) cellClass = "bg-[#ff00ff] transform scale-75 animate-pulse";
          else cellClass = "bg-transparent border border-[#0a0a0a] opacity-50";

          return <div key={i} className={`w-full h-full ${cellClass}`} />;
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center z-20">
            <h2 className="text-4xl text-[#ff00ff] mb-4 glitch-text font-bold" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
            <p className="text-[#00ffff] mb-4 text-xl">FINAL SCORE // {score}</p>
            <p className="text-white text-md animate-pulse cursor-pointer hover:text-[#00ffff]" onClick={resetGame}>
              [PRESS SPACE TO REBOOT]
            </p>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center z-20">
             <h2 className="text-4xl text-[#00ffff] mb-6 glitch-text font-bold" data-text="PAUSED">PAUSED</h2>
             <p className="text-white text-md animate-pulse cursor-pointer hover:text-[#ff00ff]" onClick={() => setIsPaused(false)}>
              [PRESS SPACE TO RESUME]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
