import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      console.log('Login successful:', response.data);
      // Save token (we can integrate better state management later)
      localStorage.setItem('token', response.data.token);
      alert('Login Successful!');
      // TODO: Redirect to Dashboard
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Invalid login credentials.');
    }
  };

  return (
    <div className="bg-background font-body text-on-surface overflow-hidden min-h-screen relative flex items-center justify-center">
      {/* Decorative Bubbles & Depth Background */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        {/* Bokeh Circles for Depth */}
        <div className="bokeh w-[500px] h-[500px] top-[-10%] left-[-5%] bg-primary"></div>
        <div className="bokeh w-[400px] h-[400px] bottom-[-5%] right-[-10%] bg-tertiary"></div>
        <div className="bokeh w-[300px] h-[300px] top-1/4 right-1/4 bg-primary-container"></div>
        {/* 3D Soap Bubbles */}
        <div className="bubble w-48 h-48 top-10 left-[8%] animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="bubble w-24 h-24 top-40 left-[18%] animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="bubble w-64 h-64 bottom-10 left-[-5%] animate-float" style={{ animationDelay: '-4s' }}></div>
        <div className="bubble w-32 h-32 top-[15%] right-[10%] animate-float" style={{ animationDelay: '-1s' }}></div>
        <div className="bubble w-56 h-56 bottom-[15%] right-[5%] animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="bubble w-16 h-16 top-1/2 left-1/4 animate-float" style={{ animationDelay: '-5s' }}></div>
        <div className="bubble w-20 h-20 bottom-1/3 left-[40%] animate-float" style={{ animationDelay: '-6s' }}></div>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#00497a 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
      </div>
      
      {/* Login Card Container */}
      <main className="relative z-10 w-full max-w-md px-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_rgba(0,73,122,0.12)] p-10 flex flex-col items-center border border-white/50 backdrop-blur-sm">
          {/* Brand Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center mb-4 shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="bubble_chart">bubble_chart</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-on-surface">LaundryEase</h1>
            <p className="text-sm text-secondary font-medium mt-1">Management Portal Access</p>
          </div>
          
          {/* Login Form */}
          <form className="w-full space-y-6" id="login-form" onSubmit={handleLogin}>
            {errorMsg && (
                <div id="error-msg" className="bg-error-container text-error text-sm p-3 rounded-lg text-center font-semibold">
                    {errorMsg}
                </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary px-1" htmlFor="username">Staff ID / Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="badge">badge</span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60" 
                  id="username" 
                  name="username" 
                  placeholder="Enter your Username" 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary px-1" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="lock">lock</span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
              </label>
              <a className="text-sm font-semibold text-primary hover:underline underline-offset-4" href="#">Forgot Password?</a>
            </div>
            
            <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2" type="submit" id="login-btn">
              <span>Login</span>
              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </form>
          
          {/* Footer Message */}
          <div className="mt-8 pt-8 border-t border-outline-variant/10 w-full text-center">
            <p className="text-xs text-secondary leading-relaxed font-medium">
              Authorized staff only. Unauthorized access attempts <br /> are monitored and logged.
            </p>
          </div>
        </div>
      </main>
      
      {/* Help Widget */}
      <div className="fixed bottom-8 right-8 z-20">
        <button className="flex items-center space-x-3 bg-surface-container-lowest/90 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all group">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container text-lg" data-icon="help">help</span>
          </div>
          <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Help Center</span>
        </button>
      </div>
      
      {/* Bottom Signature Horizon Line */}
      <div className="fixed bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-30"></div>
    </div>
  );
};

export default Login;