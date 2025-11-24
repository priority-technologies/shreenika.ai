
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AgentManager from './components/AgentManager';
import LeadManager from './components/LeadManager';
import CallManager from './components/CallManager';
import KnowledgeCenter from './components/KnowledgeCenter';
import UsageBilling from './components/UsageBilling';
import SuperAdmin from './components/SuperAdmin';
import ProfileSettings from './components/ProfileSettings';
import { Lead, CallLog, AgentConfig } from './types';
import { INITIAL_LEADS, MOCK_CALL_LOGS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize state from localStorage or defaults
  const [agent, setAgent] = useState<AgentConfig>(() => {
    const saved = localStorage.getItem('voxai_agent');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        welcomeMessage: parsed.welcomeMessage || "Hello, I'm calling from Shreenika AI. How are you today?",
        knowledgeBase: parsed.knowledgeBase || [],
        language: parsed.language || 'English (US)',
        characteristics: parsed.characteristics || ['Friendly', 'Professional'],
        maxCallDuration: parsed.maxCallDuration || 3600,
        voicemailDetection: parsed.voicemailDetection ?? true,
        voicemailAction: parsed.voicemailAction || 'Hang up',
        voicemailMessage: parsed.voicemailMessage || 'Hello, I was calling regarding an inquiry. Please call back.',
        voiceSpeed: parsed.voiceSpeed || 1.0,
        interruptionSensitivity: parsed.interruptionSensitivity || 0.5,
        responsiveness: parsed.responsiveness || 0.5,
        emotionLevel: parsed.emotionLevel || 0.5,
        backgroundNoise: parsed.backgroundNoise || 'Office',
      };
    }
    return {
      name: 'Shreenika AI',
      title: 'Sales Executive',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shreenika',
      language: 'English (US)',
      voiceId: 'Monika (en-IN)',
      characteristics: ['Friendly', 'Professional', 'Persuasive'],
      age: 28,
      
      // Role
      welcomeMessage: "Hello! This is Shreenika calling from the reception. How can I assist you today?",
      prompt: `## Objective
You are a voice AI agent engaging in a human-like voice conversation with the user. You will respond based on your given instruction and the provided transcript and be as human-like as possible.

## Role
Personality: Your name is Shreenika and you are a receptionist in an AI restaurant. Maintain a pleasant and friendly demeanor throughout all interactions. This approach helps in building a positive rapport with customers.

Task: As a receptionist for a restaurant, your tasks include table reservation which involves asking customers their preferred date and time to visit restaurant and asking number of people who will come.`,
      knowledgeBase: [],

      // Settings
      callingLimit: 60,
      maxCallDuration: 3600,
      silenceDetectionMs: 15,
      voicemailDetection: true,
      voicemailAction: 'Hang up',
      voicemailMessage: 'Hello, this is Shreenika. Please give us a call back when you are free.',
      voiceSpeed: 1.0,
      interruptionSensitivity: 0.5,
      responsiveness: 0.5,
      emotionLevel: 0.8,
      backgroundNoise: 'Office',
      voipProvider: null,
      voipApiKey: '',
      voipSid: ''
    };
  });
  
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('voxai_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('voxai_logs');
    return saved ? JSON.parse(saved) : MOCK_CALL_LOGS;
  });

  // Check auth on mount
  useEffect(() => {
    const user = localStorage.getItem('voxai_user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  // Simple State-Based Router
  const [route, setRoute] = useState<string>('/dashboard');

  useEffect(() => {
    if (!isAuthenticated) {
      setRoute('/login');
    } else if (isAuthenticated && route === '/login') {
      // If just authenticated, check role to decide where to go
      const userStr = localStorage.getItem('voxai_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          setRoute('/admin');
        } else {
          setRoute('/dashboard');
        }
      } else {
        setRoute('/dashboard');
      }
    }
  }, [isAuthenticated]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('voxai_agent', JSON.stringify(agent));
  }, [agent]);

  useEffect(() => {
    localStorage.setItem('voxai_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('voxai_logs', JSON.stringify(callLogs));
  }, [callLogs]);

  const navigate = (path: string) => {
    setRoute(path);
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <Auth setIsAuthenticated={setIsAuthenticated} navigate={navigate} />;
    }

    const isAdminRoute = route === '/admin';

    // Authenticated logic
    // Check if onboarding is needed, BUT SKIP if user is accessing Admin panel
    if (!isAdminRoute && !agent.voipProvider && route !== '/onboarding') {
       return <Onboarding setAgent={setAgent} navigate={navigate} />;
    }

    if (route === '/onboarding') {
       return <Onboarding setAgent={setAgent} navigate={navigate} />;
    }

    const PageContent = () => {
      switch (route) {
        case '/dashboard': return <Dashboard logs={callLogs} leadCount={leads.length} />;
        case '/agents': return <AgentManager agent={agent} setAgent={setAgent} />;
        case '/knowledge': return <KnowledgeCenter agent={agent} setAgent={setAgent} />;
        case '/leads': return <LeadManager leads={leads} setLeads={setLeads} />;
        case '/calls': return <CallManager leads={leads} logs={callLogs} setLogs={setCallLogs} agent={agent} />;
        case '/usage': return <UsageBilling />;
        case '/admin': return <SuperAdmin />;
        case '/settings': return <ProfileSettings />;
        default: return <Dashboard logs={callLogs} leadCount={leads.length} />;
      }
    };

    return (
      <Layout currentPath={route} navigate={navigate}>
        <PageContent />
      </Layout>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default App;
