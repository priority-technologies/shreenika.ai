
import React, { useState } from 'react';
import { Bot, Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthProps {
  setIsAuthenticated: (val: boolean) => void;
  navigate: (path: string) => void;
}

const Auth: React.FC<AuthProps> = ({ setIsAuthenticated, navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Admin Logic
      const isAdmin = email.toLowerCase() === 'admin@priority.com';
      const userData = { 
         email, 
         name: email.split('@')[0],
         role: isAdmin ? 'admin' : 'user'
      };
      
      localStorage.setItem('voxai_user', JSON.stringify(userData));
      setIsAuthenticated(true);
      
      if (isAdmin) {
         navigate('/admin');
      } else {
         navigate('/onboarding');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col relative z-10 border border-slate-100 mb-8">
        <div className="p-8 text-center bg-white border-b border-slate-50">
           <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 via-red-500 to-purple-600 opacity-10"></div>
              <Bot className="w-8 h-8 text-blue-700" />
           </div>
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Shreenika AI</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Enterprise Voice Automation Platform</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-shadow hover:border-blue-300" 
                  placeholder="name@company.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-shadow hover:border-blue-300" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-200 flex items-center justify-center">
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>
            <button className="mt-4 w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-700 font-bold hover:underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {/* Branding Footer - SVG Logo */}
      <div className="z-10 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Powered by</p>
          <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm px-8 py-3 rounded-2xl border border-white/50 shadow-sm">
              <svg width="150" height="32" viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="priorityGradientAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
                {/* PRIORITY Text Paths */}
                <g stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* P */}
                    <path d="M10 4 h 6 c 4 0 6 3 6 6 s -2 6 -6 6 h -6 v 10" />
                    {/* R */}
                    <path d="M30 4 h 6 c 4 0 6 3 6 6 s -2 6 -6 6 h -4 l 8 10" />
                    <path d="M30 4 v 22" />
                    {/* I */}
                    <path d="M52 4 v 22" />
                    {/* O (Gradient Loop) */}
                    <circle cx="70" cy="15" r="9" stroke="url(#priorityGradientAuth)" strokeWidth="3.5" />
                    {/* R */}
                    <path d="M88 4 h 6 c 4 0 6 3 6 6 s -2 6 -6 6 h -4 l 8 10" />
                    <path d="M88 4 v 22" />
                    {/* I */}
                    <path d="M110 4 v 22" />
                    {/* T */}
                    <path d="M120 4 h 16" />
                    <path d="M128 4 v 22" />
                    {/* Y */}
                    <path d="M142 4 l 6 10 l 6 -10" />
                    <path d="M148 14 v 12" />
                </g>
              </svg>
              <div className="mt-2 text-[10px] text-slate-800 font-bold tracking-[0.2em]">TECHNOLOGIES INC.</div>
          </div>
      </div>
    </div>
  );
};

export default Auth;
