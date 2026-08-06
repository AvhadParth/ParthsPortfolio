import React, { useEffect, useState } from 'react';

export function EditorialCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hoverText, setHoverText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check hover targets for interactive prompts
      const target = e.target.closest('button, a, .cursor-pointer');
      if (target) {
        setIsHovered(true);
        if (target.dataset.cursor) {
          setHoverText(target.dataset.cursor);
        } else if (target.tagName === 'A') {
          setHoverText('LINK');
        } else if (target.tagName === 'BUTTON') {
          setHoverText('SELECT');
        } else {
          setHoverText('READ');
        }
      } else {
        setIsHovered(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden lg:block"
      style={{ 
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: -20,
        top: -20
      }}
    >
      <div 
        className={`w-10 h-10 rounded-full border border-graphite dark:border-paper-ivory flex items-center justify-center font-mono-editorial text-[9px] font-bold uppercase transition-all duration-300 ${
          isHovered 
            ? 'scale-150 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite border-transparent shadow-lg' 
            : 'scale-100 bg-transparent text-graphite dark:text-paper-ivory opacity-60'
        }`}
      >
        {hoverText || 'PA'}
      </div>
    </div>
  );
}
