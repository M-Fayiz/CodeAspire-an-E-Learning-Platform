import React, { useState, useEffect } from 'react';



const ThreeDIllustration: React.FC<{ mode: 'login' | 'register', role?: 'student' | 'mentor' }> = ({ mode, role }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('illustration-container')?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 20,
          y: (e.clientY - rect.top - rect.height / 2) / 20
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getIllustrationContent = () => {
    if (mode === 'login') {
      return {
        emoji: '🚀',
        title: 'Welcome Back!',
        subtitle: 'Ready to continue your coding journey?',
        elements: ['💻', '🎯', '⚡', '🌟']
      };
    }
    
    if (role === 'mentor') {
      return {
        emoji: '👨‍🏫',
        title: 'Become a Mentor',
        subtitle: 'Share your expertise and inspire others',
        elements: ['🎓', '💡', '🏆', '📈']
      };
    }
    
    return {
      emoji: '🎓',
      title: 'Start Learning',
      subtitle: 'Begin your journey to tech mastery',
      elements: ['📚', '🔥', '💎', '🎨']
    };
  };

  const content = getIllustrationContent();

  return (
    <div id="illustration-container" className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main 3D Container */}
      <div 
        className="relative transform-gpu transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
        }}
      >
        {/* Central Element */}
        <div className="relative">
          <div className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
            <div className="text-8xl mb-4 animate-bounce">
              {content.emoji}
            </div>
          </div>
          
          {/* Floating Elements */}
          {content.elements.map((element, index) => (
            <div
              key={index}
              className="absolute text-4xl animate-float"
              style={{
                top: `${20 + Math.sin(index * Math.PI / 2) * 30}%`,
                left: `${20 + Math.cos(index * Math.PI / 2) * 30}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + index * 0.5}s`
              }}
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                {element}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute bottom-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-2">{content.title}</h3>
        <p className="text-blue-200">{content.subtitle}</p>
      </div>

      
    </div>
  );
};

export default ThreeDIllustration