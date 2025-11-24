
export enum CallStatus {
  PENDING = 'PENDING',
  DIALING = 'DIALING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  NO_ANSWER = 'NO_ANSWER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  role?: 'admin' | 'user';
}

// --- Super Admin Types ---
export interface Client {
  id: string;
  companyName: string;
  email: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Suspended' | 'Pending';
  joinedAt: string;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'Success' | 'Failed' | 'Pending';
  method: 'Card' | 'UPI' | 'NetBanking';
}
// -------------------------

export interface KnowledgeDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'synced' | 'processing' | 'failed';
  uploadedAt: string;
}

export interface AgentConfig {
  id?: string;
  name: string;
  title: string;
  avatar?: string;
  language: string;
  voiceId: string;
  characteristics: string[];
  gender?: 'Male' | 'Female' | 'Neutral';
  age?: number;
  
  // Role & Knowledge
  welcomeMessage: string;
  knowledgeBase: KnowledgeDocument[];

  // Call Settings
  callingLimit: number; // minutes per day
  maxCallDuration: number; // seconds
  silenceDetectionMs: number;
  voicemailDetection: boolean;
  voicemailAction: 'Hang up' | 'Leave a voicemail';
  voicemailMessage: string; // The message to leave
  
  // Speech Settings
  prompt: string;
  voiceSpeed: number; // 0.5 to 2.0
  interruptionSensitivity: number; // 0.0 to 1.0
  responsiveness: number; // 0.0 to 1.0
  emotionLevel: number; // 0.0 to 1.0
  backgroundNoise: 'Office' | 'Quiet' | 'Cafe' | 'Street';

  // Integrations
  voipProvider: 'Twilio' | 'BlandAI' | 'Vapi' | null;
  voipApiKey: string;
  voipSid: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string; // Mobile Number
  email: string;
  companyName: string;
  totalEmployees?: number; // Optional
  address: string;
  website?: string;
  
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  uploadedAt: string;
}

export interface CallLog {
  id: string;
  leadId: string;
  leadName: string;
  phoneNumber: string;
  status: CallStatus;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
  recordingUrl?: string; 
  transcript?: string;
  summary?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Unknown';
  
  // Detailed Metrics
  usageCost?: string;
  rating?: number; // 0-5 stars
  endReason?: string; // e.g. "The contact ended the call"
  dialStatus?: string; // e.g. "completed", "no-answer"
}

export interface DashboardStats {
  totalAgents: number;
  totalCalls: number;
  meetingsBooked: number;
  totalLeads: number;
}