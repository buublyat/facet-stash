import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from '@/components/MatrixRain';
import { Terminal } from 'lucide-react';
import hackerCat from '@/assets/hacker-cat.png';
import hackerman from '@/assets/hackerman.png';
import hackerPepe from '@/assets/hacker-pepe.png';
import anonymousMask from '@/assets/anonymous-mask.png';

const Start = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [showMeme1, setShowMeme1] = useState(false);
  const [showMeme2, setShowMeme2] = useState(false);
  const [showMeme3, setShowMeme3] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Memes appear first with staggered timing
    const meme1Timer = setTimeout(() => setShowMeme1(true), 300);
    const meme2Timer = setTimeout(() => setShowMeme2(true), 700);
    const meme3Timer = setTimeout(() => setShowMeme3(true), 900);
    // Cat appears after 0.5s
    const catTimer = setTimeout(() => setShowCat(true), 500);
    // Logo appears after 1.5s
    const logoTimer = setTimeout(() => setShowLogo(true), 1500);
    // Button appears after 2.5s
    const buttonTimer = setTimeout(() => setShowButton(true), 2500);

    return () => {
      clearTimeout(meme1Timer);
      clearTimeout(meme2Timer);
      clearTimeout(meme3Timer);
      clearTimeout(catTimer);
      clearTimeout(logoTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleSkip = () => {
    setShowMeme1(true);
    setShowMeme2(true);
    setShowMeme3(true);
    setShowCat(true);
    setShowLogo(true);
    setShowButton(true);
  };

  const handleEnter = () => {
    navigate('/table');
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden cursor-pointer"
      onClick={!showButton ? handleSkip : undefined}
    >
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Hackerman - bottom left with floating animation */}
      <div 
        className={`fixed bottom-16 left-4 z-[15] transition-all duration-1000 pointer-events-none ${
          showMeme1 ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img 
          src={hackerman} 
          alt="Hackerman" 
          className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 animate-float-slow drop-shadow-[0_0_20px_rgba(0,255,0,0.5)]"
        />
      </div>

      {/* Hacker Pepe - top left with reverse floating animation */}
      <div 
        className={`fixed top-16 left-4 z-[15] transition-all duration-1000 pointer-events-none ${
          showMeme2 ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img 
          src={hackerPepe} 
          alt="Hacker Pepe" 
          className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 animate-float-reverse drop-shadow-[0_0_20px_rgba(0,255,0,0.4)]"
        />
      </div>

      {/* Anonymous Mask - top right with floating animation */}
      <div 
        className={`fixed top-12 right-8 z-[15] transition-all duration-1000 pointer-events-none ${
          showMeme3 ? 'opacity-45 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img 
          src={anonymousMask} 
          alt="Anonymous Mask" 
          className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 animate-float-slow drop-shadow-[0_0_20px_rgba(0,255,0,0.5)]"
        />
      </div>

      {/* Hacker Cat - bottom right with floating animation */}
      <div 
        className={`fixed bottom-12 right-8 z-[15] transition-all duration-1000 pointer-events-none ${
          showCat ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img 
          src={hackerCat} 
          alt="Hacker Cat" 
          className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 animate-float drop-shadow-[0_0_20px_rgba(0,255,0,0.6)]"
        />
      </div>

      {/* Extra right-side meme - middle right for filling space */}
      <div 
        className={`fixed top-1/2 -translate-y-1/2 right-2 z-[14] transition-all duration-1000 pointer-events-none ${
          showMeme1 ? 'opacity-35 translate-x-0' : 'opacity-0 translate-x-10'
        }`}
      >
        <img 
          src={hackerman} 
          alt="Hackerman" 
          className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 animate-float-reverse drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]"
        />
      </div>

      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      {/* Center content */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        {/* Logo container */}
        <div 
          className={`flex flex-col items-center gap-8 transition-all duration-1000 ${
            showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Terminal icon with glow */}
          <div className="p-4 terminal-border bg-background/80 backdrop-blur-sm glow-box">
            <Terminal className="h-16 w-16 text-primary glow" />
          </div>

          {/* Logo text */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary glow tracking-widest font-mono animate-logo-glow">
            DATA_MANAGER<span className="animate-blink">_</span>
          </h1>

          {/* Tagline */}
          <p className="text-muted-foreground font-mono text-sm md:text-base tracking-wider">
            <span className="text-accent">$</span> secure data management system v1.0
          </p>

          {/* Enter button */}
          <button
            onClick={handleEnter}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`
              mt-8 px-12 py-4 
              terminal-border bg-background/90 backdrop-blur-sm
              font-mono text-xl tracking-widest
              text-primary hover:text-primary-foreground
              hover:bg-primary/90 
              transition-all duration-300
              pointer-events-auto
              ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              ${isHovering ? 'animate-glitch glow-box' : ''}
            `}
            style={{ transitionDelay: showButton ? '0ms' : '500ms' }}
          >
            [ ENTER ]
          </button>

          {/* Skip hint */}
          <p 
            className={`text-muted-foreground/50 font-mono text-xs mt-4 transition-opacity duration-500 ${
              showButton ? 'opacity-0' : 'opacity-100'
            }`}
          >
            click anywhere to skip
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 text-muted-foreground/30 font-mono text-xs z-20">
        ┌──[ SYSTEM READY ]
      </div>
      <div className="fixed top-4 right-4 text-muted-foreground/30 font-mono text-xs z-20">
        [ CONNECTION: SECURE ]──┐
      </div>
      <div className="fixed bottom-4 left-4 text-muted-foreground/30 font-mono text-xs z-20">
        └──[ v1.0.0 ]
      </div>
      <div className="fixed bottom-4 right-4 text-muted-foreground/30 font-mono text-xs z-20 hidden md:block">
        [ ENCRYPTED ]──┘
      </div>
    </div>
  );
};

export default Start;
