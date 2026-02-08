import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from '@/components/MatrixRain';
import { Terminal } from 'lucide-react';
import hackerCat from '@/assets/hacker-cat.png';

const Start = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Cat appears after 0.5s
    const catTimer = setTimeout(() => setShowCat(true), 500);
    // Logo appears after 1.5s
    const logoTimer = setTimeout(() => setShowLogo(true), 1500);
    // Button appears after 2.5s
    const buttonTimer = setTimeout(() => setShowButton(true), 2500);

    return () => {
      clearTimeout(catTimer);
      clearTimeout(logoTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleSkip = () => {
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

      {/* Hacker Cat - bottom right with floating animation */}
      <div 
        className={`fixed bottom-4 right-4 z-15 transition-all duration-1000 pointer-events-none ${
          showCat ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img 
          src={hackerCat} 
          alt="Hacker Cat" 
          className="w-72 h-72 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] animate-float drop-shadow-[0_0_30px_rgba(0,255,0,0.6)]"
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
