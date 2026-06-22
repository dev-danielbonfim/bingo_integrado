import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Play, Tv, Eye, EyeOff } from 'lucide-react';
import { socket } from '../lib/socket';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCallerLogin = () => {
    if (!password) {
      setError('Por favor, digite a senha do sorteador.');
      return;
    }
    
    // Verificação feita 100% no backend. A senha não fica exposta no código frontend.
    socket.emit('verifyAdmin', password, (success: boolean) => {
      if (success) {
        sessionStorage.setItem('isCaller', 'true');
        navigate('/caller');
      } else {
        setError('Senha incorreta para Sorteador!');
      }
    });
  };

  return (
    <div className="center-screen">
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '450px', textAlign: 'center' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.webp" alt="Logo Colégio Integrado" style={{ height: '100px', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>Bingo Colégio Integrado</h1>
          <p style={{ color: 'var(--text-muted)' }}>Painel de Controle</p>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.2rem' }}>Selecione como deseja entrar</p>

        <div className="flex-col gap-3">
          <button 
            onClick={() => navigate('/viewer')}
            className="btn-primary flex-center gap-2"
            style={{ background: 'var(--success)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', padding: '20px', fontSize: '1.3rem' }}
          >
            <Tv size={28} />
            Entrar como Projetor
          </button>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '30px 0', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-dark)', padding: '0 15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Área Restrita
            </span>
          </div>

          <div className="flex-col gap-2">
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Senha do Sorteador"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="input-field"
                style={{ paddingRight: '45px' }}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p style={{ color: 'var(--accent)', fontSize: '0.9rem', textAlign: 'left' }}>{error}</p>}
            <button 
              onClick={handleCallerLogin}
              className="btn-primary flex-center gap-1"
              style={{ padding: '16px' }}
            >
              <Play size={20} />
              Acessar Painel de Sorteio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
