import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI_SEQ_//ALPHA_NEURAL', artist: 'SYS_ADMIN', url: 'https://www.soundhelix.com/examples/src/SoundHelix-Song-16.mp3' },
  { id: 2, title: 'AI_SEQ_//BETA_DECAY', artist: 'NODE_0x44', url: 'https://www.soundhelix.com/examples/src/SoundHelix-Song-15.mp3' },
  { id: 3, title: 'AI_SEQ_//GAMMA_FLUX', artist: 'GHOST_IN_MEMORY', url: 'https://www.soundhelix.com/examples/src/SoundHelix-Song-14.mp3' }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleTrackEnd = () => handleSkip(1);

  const handleSkip = (dir: number) => {
    let next = currentTrack + dir;
    if (next < 0) next = TRACKS.length - 1;
    if (next >= TRACKS.length) next = 0;
    setCurrentTrack(next);
    setProgress(0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md border-2 border-neon-magenta bg-[#020202] p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-full bg-[#ff00ff] opacity-5 group-hover:opacity-10 transform translate-x-8 skew-x-12 transition-all duration-300" />
      
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-neon-magenta mb-1 font-mono uppercase tracking-widest">[AUDIO_STREAM_ACTIVE]</p>
            <h3 className="text-2xl font-bold text-white truncate max-w-[240px]" title={TRACKS[currentTrack].title}>
              {TRACKS[currentTrack].title}
            </h3>
            <p className="text-sm text-neon-cyan font-mono mt-1 opacity-80">ARTIST: {TRACKS[currentTrack].artist}</p>
          </div>
          <button 
            onClick={toggleMute}
            className="text-neon-cyan hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        <div className="h-2 w-full bg-gray-900 overflow-hidden relative cursor-pointer group-hover:shadow-[0_0_8px_#ff00ff_inset]">
           <div 
             className="absolute top-0 left-0 h-full bg-neon-magenta shadow-[0_0_8px_#ff00ff] transition-all duration-75 ease-linear"
             style={{ width: `${progress}%` }}
           />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-5">
             <button onClick={() => handleSkip(-1)} className="text-white hover:text-neon-cyan transition-colors transform hover:-translate-x-1">
               <SkipBack size={28} />
             </button>
             <button 
               onClick={() => setIsPlaying(!isPlaying)} 
               className="text-[#020202] bg-neon-cyan hover:bg-white p-3 transform hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,255,255,0.6)]"
             >
               {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
             </button>
             <button onClick={() => handleSkip(1)} className="text-white hover:text-neon-magenta transition-colors transform hover:translate-x-1">
               <SkipForward size={28} />
             </button>
          </div>
          
          <div className="flex gap-1.5 items-center mr-2">
             <span className={`w-1.5 h-4 ${isPlaying ? 'bg-neon-cyan animate-pulse' : 'bg-gray-800'} block`} style={{ animationDelay: '0ms' }} />
             <span className={`w-1.5 h-7 ${isPlaying ? 'bg-neon-magenta animate-pulse' : 'bg-gray-800'} block`} style={{ animationDelay: '150ms' }} />
             <span className={`w-1.5 h-5 ${isPlaying ? 'bg-neon-cyan animate-pulse' : 'bg-gray-800'} block`} style={{ animationDelay: '300ms' }} />
             <span className={`w-1.5 h-3 ${isPlaying ? 'bg-neon-magenta animate-pulse' : 'bg-gray-800'} block`} style={{ animationDelay: '450ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
