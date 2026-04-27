import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#020202] scanlines flicker flex flex-col font-pixel relative text-[#00ffff]">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] z-40 Mix-blend-overlay"></div>

      <header className="w-full p-4 md:p-6 flex flex-col md:flex-row justify-between items-center border-b border-[#00ffff]/30 relative z-10 bg-black/60 backdrop-blur-sm gap-4">
        <div className="flex items-center gap-4">
          <Terminal className="text-[#00ffff] animate-pulse" size={36} />
          <h1 className="text-3xl md:text-5xl uppercase tracking-widest text-white mt-1">
            <span className="glitch-text" data-text="CYBER_SNAKE">CYBER_SNAKE</span>
            <span className="text-[#ff00ff] ml-3 text-lg align-top relative top-[-10px]">v.1.0</span>
          </h1>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-sm font-mono text-[#00ffff] mb-1 tracking-widest">CURRENT_SCORE_VAR</div>
          <div className="text-4xl md:text-6xl text-white drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] font-bold">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-6 gap-12 lg:gap-24 relative z-10 min-h-0">
        
        <div className="flex flex-col items-center w-full max-w-[500px]">
          <div className="mb-3 text-[#00ffff] text-sm md:text-base font-mono animate-pulse w-full text-left">
            {'>'} INITIATING_BIOLOGY_SIMULATION...
          </div>
          
          <SnakeGame onScoreChange={setScore} />
          
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-mono text-gray-400">
             <span>[W_A_S_D] OR [ARROWS] = MOVE</span>
             <span className="text-[#ff00ff]">[SPACE] = PAUSE / REBOOT</span>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full max-w-md h-full justify-center">
           <div className="border border-[#333] bg-black p-5 text-sm md:text-base font-mono text-green-500 leading-relaxed shadow-lg">
             LOG_ENTRY_0: SYSTEM BOOT SECURE.<br/>
             LOG_ENTRY_1: NEURAL LINK ESTABLISHED.<br/>
             LOG_ENTRY_2: AUDIO PROTOCOL ONLINE.<br/>
             LOG_ENTRY_3: AWAITING USER INPUT.<br/>
             <span className="animate-pulse">_</span>
           </div>
           
           <div className="mb-8">
             <MusicPlayer />
           </div>
        </div>

      </main>
    </div>
  );
}
