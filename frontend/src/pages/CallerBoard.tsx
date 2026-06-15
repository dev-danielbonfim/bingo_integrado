import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../lib/socket';
import confetti from 'canvas-confetti';
import { formatBingoNumber, getBingoNickname } from '../lib/utils';
import { Dices, RefreshCw, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../lib/sounds';

interface GameState {
  drawnNumbers: number[];
  lastDrawn: number | null;
  isWinner: boolean;
}

export default function CallerBoard() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({ drawnNumbers: [], lastDrawn: null, isWinner: false });
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [animatingNumber, setAnimatingNumber] = useState<number | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const toggleSound = () => {
    const newState = sounds.toggle();
    setIsSoundOn(newState);
  };

  useEffect(() => {
    if (sessionStorage.getItem('isCaller') !== 'true') {
      navigate('/sorteador');
      return;
    }

    socket.on('gameStateUpdate', (state: GameState) => {
      setGameState(prev => {
        if (state.lastDrawn && state.lastDrawn !== prev.lastDrawn && state.drawnNumbers.length > prev.drawnNumbers.length) {
          startShuffleAnimation(state.lastDrawn);
        } else if (!state.lastDrawn) {
          setDisplayNumber(null);
        } else {
          setDisplayNumber(state.lastDrawn);
        }
        return state;
      });
    });

    return () => {
      socket.off('gameStateUpdate');
    };
  }, []);

  const startShuffleAnimation = (targetNumber: number) => {
    setIsShuffling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 75) + 1);
      sounds.playTick();
      count++;
      if (count >= 15) {
        clearInterval(interval);
        setIsShuffling(false);
        setDisplayNumber(targetNumber);
        setAnimatingNumber(targetNumber);
        sounds.playTada();
        
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#f43f5e', '#10b981', '#f59e0b']
        });

        setTimeout(() => setAnimatingNumber(null), 1000);
      }
    }, 100);
  };

  const drawNumber = () => {
    if (isShuffling || gameState.isWinner) return; 
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !gameState.drawnNumbers.includes(n)
    );

    if (availableNumbers.length === 0) {
      alert("Todos os números já foram sorteados!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const drawn = availableNumbers[randomIndex];
    
    socket.emit('drawNumber', drawn);
  };

  const resetGame = () => {
    if (window.confirm("Tem certeza que deseja reiniciar o bingo? Todos os números serão limpos.")) {
      socket.emit('resetGame');
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      
      {/* Barra de Controle do Sorteador (Flutuante no Rodapé) */}
      <div className="glass-panel control-bar" style={{ zIndex: 2000 }}>
         <button onClick={() => { sessionStorage.removeItem('isCaller'); navigate('/'); }} className="btn-primary flex-center gap-1" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
           <ArrowLeft size={20} />
         </button>
         <button onClick={drawNumber} disabled={isShuffling} className="btn-primary flex-center gap-1" style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', padding: '12px 20px' }}>
           <Dices size={24} /> SORTEAR NÚMERO
         </button>
         <button onClick={resetGame} className="btn-accent flex-center gap-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
           <RefreshCw size={18} /> Reiniciar
         </button>
         <button onClick={toggleSound} className="btn-primary flex-center gap-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', background: isSoundOn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)', color: isSoundOn ? '#10b981' : 'white', borderColor: isSoundOn ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.2)' }}>
           {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />} Som
         </button>
      </div>

      {/* Topo */}
      <div className="top-section">
        <div className="glass-panel giant-number-container" style={{ position: 'relative' }}>
          <img src="/logo.webp" alt="Colégio Integrado" style={{ height: '60px', position: 'absolute', top: '1rem', left: '1.5rem', opacity: 0.9 }} />
          <h2 className="giant-number-title">
            {isShuffling ? 'Sorteando...' : 'Último Número'}
          </h2>
          <div 
            key={isShuffling ? 'shuffle' : animatingNumber} 
            className={`giant-number ${animatingNumber ? 'animate-pop' : ''}`}
            style={{ 
              color: isShuffling ? 'var(--text-muted)' : 'var(--accent)', 
              textShadow: isShuffling ? 'none' : '0 0 50px rgba(230,0,0,0.6)',
              transition: 'color 0.2s',
              marginBottom: '0.5rem'
            }}
          >
            {displayNumber ? formatBingoNumber(displayNumber) : '--'}
          </div>

          {/* Apelido do Número */}
          {displayNumber && !isShuffling && getBingoNickname(displayNumber) && (
            <div className="nickname-text animate-pop">
              "{getBingoNickname(displayNumber)}"
            </div>
          )}
        </div>

        <div className="glass-panel previous-numbers-panel">
          <h3 className="previous-numbers-title">Anteriores</h3>
          <div className="previous-numbers-list">
            {gameState.drawnNumbers.slice(-4, -1).reverse().map((num, i) => (
              <div key={num + '-' + i} className="previous-number-box" style={{ opacity: 1 - (i * 0.25) }}>
                {formatBingoNumber(num)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade completa */}
      <div className="glass-panel bingo-grid-container">
        <div className="bingo-grid">
          
          <div className="grid-letter" style={{ color: '#60a5fa' }}>B</div>
          {Array.from({ length: 15 }, (_, i) => i + 1).map(num => renderGridItem(num, gameState, isShuffling))}

          <div className="grid-letter" style={{ color: '#34d399' }}>I</div>
          {Array.from({ length: 15 }, (_, i) => i + 16).map(num => renderGridItem(num, gameState, isShuffling))}

          <div className="grid-letter" style={{ color: '#f43f5e' }}>N</div>
          {Array.from({ length: 15 }, (_, i) => i + 31).map(num => renderGridItem(num, gameState, isShuffling))}

          <div className="grid-letter" style={{ color: '#fbbf24' }}>G</div>
          {Array.from({ length: 15 }, (_, i) => i + 46).map(num => renderGridItem(num, gameState, isShuffling))}

          <div className="grid-letter" style={{ color: '#a78bfa' }}>O</div>
          {Array.from({ length: 15 }, (_, i) => i + 61).map(num => renderGridItem(num, gameState, isShuffling))}

        </div>
      </div>
    </div>
  );
}

function renderGridItem(num: number, gameState: GameState, isShuffling: boolean) {
  const isDrawn = gameState.drawnNumbers.includes(num) && (!isShuffling || num !== gameState.lastDrawn);
  const isLast = !isShuffling && gameState.lastDrawn === num;
  
  return (
    <div 
      key={num} 
      className="grid-item"
      style={{
        background: isLast ? 'var(--accent)' : isDrawn ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
        color: isDrawn ? 'white' : 'rgba(255,255,255,0.2)',
        boxShadow: isLast ? '0 0 30px var(--accent)' : isDrawn ? '0 0 15px var(--primary-color)' : 'none',
        transform: isLast ? 'scale(1.1)' : 'scale(1)',
        zIndex: isLast ? 10 : 1
      }}
    >
      {num}
    </div>
  );
}
