
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  LogOut, 
  Bot, 
  Menu,
  X,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPath, navigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const userStr = localStorage.getItem('voxai_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, [currentPath]);

  const handleLogout = () => {
    localStorage.removeItem('voxai_user');
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Agent Management', icon: Bot, path: '/agents' },
    { name: 'Knowledge Center', icon: BookOpen, path: '/knowledge' },
    { name: 'Contacts', icon: Users, path: '/leads' },
    { name: 'Call Management', icon: Phone, path: '/calls' },
    { name: 'Usage & Billing', icon: CreditCard, path: '/usage' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Super Admin', icon: ShieldCheck, path: '/admin' });
  }

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [currentPath]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2.5">
             {/* Logo */}
             <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 via-red-500 to-purple-600 opacity-20"></div>
                <div className="relative text-[#1d4ed8]"> 
                   <Bot className="w-6 h-6" />
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#1d4ed8] leading-none">Shreenika AI</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-0.5">Lite</span>
             </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-blue-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1 shrink-0">
          <button 
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${currentPath === '/settings' ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
            <span>Settings</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Branding Footer - SVG Logo */}
        <div className="bg-slate-900 py-4 px-4 text-center shrink-0 border-t border-slate-800">
           <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Powered by</p>
           <div className="flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
              <svg width="150" height="32" viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="priorityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" /> {/* Orange */}
                    <stop offset="50%" stopColor="#ef4444" /> {/* Red */}
                    <stop offset="100%" stopColor="#9333ea" /> {/* Purple */}
                  </linearGradient>
                </defs>
                {/* PRIORITY Text Paths */}
                <g stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* P */}
                    <path d="M10 4 h 6 c 4 0 6 3 6 6 s -2 6 -6 6 h -6 v 10" />
                    {/* R */}
                    <path d="M30 4 h 6 c 4 0 6 3 6 6 s -2 6 -6 6 h -4 l 8 10" />
                    <path d="M30 4 v 22" />
                    {/* I */}
                    <path d="M52 4 v 22" />
                    {/* O (Gradient Loop) - No stroke, fill is none, stroke used from defs */}
                    <circle cx="70" cy="15" r="9" stroke="url(#priorityGradient)" strokeWidth="3.5" />
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
              <div className="mt-2 text-[10px] text-slate-400 font-bold tracking-[0.2em]">TECHNOLOGIES INC.</div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Mobile Only) */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:hidden shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-700">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-semibold text-blue-900">Shreenika AI</span>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
