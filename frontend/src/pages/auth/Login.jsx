import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{maxWidth:'400px',width:'100%'}}>
        <div style={{textAlign:'center',marginBottom:'30px'}}>
          <div style={{display:'inline-flex',width:'80px',height:'80px',background:'white',borderRadius:'20px',marginBottom:'20px',boxShadow:'0 10px 30px rgba(0,0,0,0.2)',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:'40px'}}>🚀</span>
          </div>
          <h1 style={{color:'white',fontSize:'36px',margin:'10px 0'}}>TudoGestão+</h1>
          <p style={{color:'rgba(255,255,255,0.9)'}}>Sistema ERP Completo</p>
        </div>

        <div style={{background:'white',borderRadius:'20px',padding:'40px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
          <h2 style={{fontSize:'24px',marginBottom:'30px',textAlign:'center'}}>Entrar no Sistema</h2>

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',marginBottom:'8px',fontWeight:'500'}}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
                placeholder="admin@demostore.com" 
                style={{width:'100%',padding:'12px',border:'2px solid #ddd',borderRadius:'8px',fontSize:'16px',outline:'none'}}
              />
            </div>

            <div style={{marginBottom:'25px'}}>
              <label style={{display:'block',marginBottom:'8px',fontWeight:'500'}}>Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
                placeholder="••••••••" 
                style={{width:'100%',padding:'12px',border:'2px solid #ddd',borderRadius:'8px',fontSize:'16px',outline:'none'}}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{width:'100%',padding:'14px',background:loading?'#ccc':'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',fontWeight:'600',cursor:loading?'not-allowed':'pointer'}}
            >
              {loading?'Entrando...':'Entrar'}
            </button>
          </form>

          <div style={{marginTop:'25px',padding:'15px',background:'#f0f7ff',borderRadius:'8px'}}>
            <p style={{fontSize:'14px',fontWeight:'600',marginBottom:'10px'}}>📧 Credenciais de Demonstração:</p>
            <p style={{fontSize:'13px',margin:'5px 0'}}>Admin: admin@demostore.com / admin123</p>
            <p style={{fontSize:'13px',margin:'5px 0'}}>Gerente: gerente@demostore.com / gerente123</p>
            <p style={{fontSize:'13px',margin:'5px 0'}}>Vendedor: vendedor@demostore.com / vendedor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}