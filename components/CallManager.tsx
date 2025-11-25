
import React, { useState, useEffect } from 'react';
import { Lead, CallLog, AgentConfig, CallStatus } from '../types';
import { 
  Phone, 
  Play, 
  Pause,
  Search, 
  Loader2, 
  User, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Info,
  FileText,
  Star,
  PhoneMissed,
  Plus,
  CheckSquare,
  Square,
  Download,
  RefreshCw,
  Trash2,
  Archive,
  PhoneIncoming
} from 'lucide-react';
import { generateMockTranscript, analyzeCall } from '../services/geminiService';

interface CallManagerProps {
  leads: Lead[];
  logs: CallLog[];
  setLogs: (logs: CallLog[]) => void;
  agent: AgentConfig;
}

const CallManager: React.FC<CallManagerProps> = ({ leads, logs, setLogs, agent }) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(logs.length > 0 ? logs[0].id : null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Campaign & Lead Selection State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [currentCallIndex, setCurrentCallIndex] = useState(0);
  const [campaignLeads, setCampaignLeads] = useState<Lead[]>([]);
  const [dialingLead, setDialingLead] = useState<Lead | null>(null);

  // Context Menu State
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Inbound Call Sim
  const [incomingCall, setIncomingCall] = useState<boolean>(false);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedLog = logs.find(l => l.id === selectedLogId) || null;

  const filteredLogs = logs.filter(log => 
    log.leadName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.phoneNumber.includes(searchTerm)
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    });
  };

  // --- Actions ---
  const handleRedial = () => {
     if (!selectedLog) return;
     alert(`Redialing ${selectedLog.phoneNumber}...`);
     // Logic to start a single call could go here
  };

  const handleDownloadRecording = () => {
     if (!selectedLog) return;
     alert("Downloading recording (simulated)...");
  };

  const handleDeleteLog = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     if (window.confirm("Are you sure you want to delete this call log?")) {
        const newLogs = logs.filter(l => l.id !== id);
        setLogs(newLogs);
        if (selectedLogId === id) setSelectedLogId(null);
        setMenuOpenId(null);
     }
  };

  // --- Campaign Logic ---

  const toggleLeadSelection = (id: string) => {
    const newSelection = new Set(selectedLeadIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedLeadIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === leads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(leads.map(l => l.id)));
    }
  };

  const startCampaign = () => {
    const leadsToCall = leads.filter(l => selectedLeadIds.has(l.id));
    if (leadsToCall.length === 0) return;

    setCampaignLeads(leadsToCall);
    setIsLeadModalOpen(false);
    setIsCampaignActive(true);
    setCurrentCallIndex(0);
    processNextCall(leadsToCall, 0);
  };

  const processNextCall = async (campaignList: Lead[], index: number) => {
    if (index >= campaignList.length) {
      setIsCampaignActive(false);
      setDialingLead(null);
      alert("Campaign Completed Successfully!");
      return;
    }

    const lead = campaignList[index];
    setDialingLead(lead);
    setCurrentCallIndex(index);

    // Simulate Ringing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate Conversation Generation
    const transcript = await generateMockTranscript(agent.name, agent.prompt, lead.firstName);
    
    // Simulate Call Duration
    const duration = Math.floor(Math.random() * 60) + 15; // 15-75 seconds
    await new Promise(resolve => setTimeout(resolve, duration * 50)); // Fast forward time for demo

    const analysis = await analyzeCall(transcript);
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 1000);

    const newLog: CallLog = {
      id: Math.random().toString(),
      leadId: lead.id,
      leadName: `${lead.firstName} ${lead.lastName}`,
      phoneNumber: lead.phone,
      status: CallStatus.COMPLETED,
      durationSeconds: duration,
      startedAt: startTime.toISOString(),
      endedAt: endTime.toISOString(),
      transcript: transcript,
      summary: analysis.summary,
      sentiment: analysis.sentiment as any || 'Neutral',
      usageCost: `00:${Math.floor(duration/60).toString().padStart(2, '0')}:${(duration%60).toString().padStart(2, '0')}`,
      rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
      endReason: "The contact ended the call.",
      dialStatus: "Call completed"
    };

    setLogs([newLog, ...logs]);
    setSelectedLogId(newLog.id);

    // Next call
    processNextCall(campaignList, index + 1);
  };

  // Inbound Sim
  const simulateInbound = () => {
     setIncomingCall(true);
     setTimeout(() => setIncomingCall(false), 4000);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* --- INBOUND CALL OVERLAY --- */}
      {incomingCall && (
         <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-4 animate-pulse w-80">
            <div className="bg-green-500 p-3 rounded-full animate-bounce">
               <PhoneIncoming className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-lg">Incoming Call...</h3>
               <p className="text-sm text-slate-300">+1 (555) 012-3456</p>
            </div>
            <div className="flex space-x-2">
               <button className="bg-green-600 p-2 rounded-full hover:bg-green-500"><Phone className="w-4 h-4"/></button>
               <button onClick={() => setIncomingCall(false)} className="bg-red-600 p-2 rounded-full hover:bg-red-500"><PhoneMissed className="w-4 h-4"/></button>
            </div>
         </div>
      )}

      {/* --- CAMPAIGN OVERLAY --- */}
      {isCampaignActive && dialingLead && (
        <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white z-20 px-6 py-3 shadow-md flex items-center justify-between animate-fadeIn">
           <div className="flex items-center space-x-4">
              <div className="relative">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute top-0 right-0"></div>
                 <Phone className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-bold text-sm">Auto-Dialer Active</h3>
                 <p className="text-xs text-indigo-200">Calling {dialingLead.firstName} {dialingLead.lastName} ({dialingLead.phone})...</p>
              </div>
           </div>
           <div className="flex items-center space-x-4">
              <div className="text-right">
                 <div className="text-xs font-medium opacity-80">Progress</div>
                 <div className="font-bold text-sm">{currentCallIndex + 1} / {campaignLeads.length}</div>
              </div>
              <button 
                onClick={() => setIsCampaignActive(false)} 
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Stop Campaign"
              >
                 <XCircle className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}

      {/* --- LEFT SIDEBAR: CONVERSATIONS LIST --- */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex justify-between items-center">
             <div className="flex items-center space-x-2">
                <h2 className="font-bold text-slate-800">Conversations</h2>
                <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{logs.length}</span>
             </div>
             <button onClick={simulateInbound} className="text-xs text-blue-600 hover:underline" title="Simulate Inbound Call">
                Simulate Call
             </button>
          </div>
          
          <button 
             onClick={() => setIsLeadModalOpen(true)}
             disabled={isCampaignActive}
             className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm text-sm font-medium"
          >
             {isCampaignActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
             <span>{isCampaignActive ? 'Dialing...' : 'New Campaign'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
           {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No conversations found.</div>
           ) : (
              filteredLogs.map(log => (
                 <div 
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors relative group ${selectedLogId === log.id ? 'bg-indigo-50/60 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                 >
                    <div className="flex items-start justify-between mb-1">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                             <User className="w-5 h-5" />
                          </div>
                          <div>
                             <h3 className={`text-sm font-semibold ${selectedLogId === log.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {log.phoneNumber}
                             </h3>
                             <div className="flex items-center text-xs text-slate-500 space-x-1">
                                {log.status === CallStatus.COMPLETED ? (
                                   <Phone className="w-3 h-3 text-green-500 fill-green-500" />
                                ) : (
                                   <PhoneMissed className="w-3 h-3 text-red-500" />
                                )}
                                <span>{formatDuration(log.durationSeconds)}</span>
                             </div>
                          </div>
                       </div>
                       <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(log.startedAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                       </span>
                    </div>
                    
                    {/* Context Menu Trigger */}
                    <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === log.id ? null : log.id); }} className="p-1 hover:bg-slate-200 rounded">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                       </button>
                    </div>

                    {/* Dropdown Menu */}
                    {menuOpenId === log.id && (
                       <div className="absolute right-8 top-8 bg-white shadow-lg rounded-lg border border-slate-100 z-10 w-32 py-1">
                          <button onClick={(e) => handleDeleteLog(e, log.id)} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center">
                             <Trash2 className="w-3 h-3 mr-2" /> Delete
                          </button>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center">
                             <Archive className="w-3 h-3 mr-2" /> Archive
                          </button>
                       </div>
                    )}
                 </div>
              ))
           )}
        </div>
      </div>

      {/* --- RIGHT PANEL: DETAILS VIEW --- */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {selectedLog ? (
           <>
              {/* Header */}
              <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                 <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                       <User className="w-4 h-4" />
                    </div>
                    <div>
                       <h2 className="text-base font-bold text-slate-900">{selectedLog.phoneNumber}</h2>
                       <p className="text-xs text-slate-500">{selectedLog.leadName}</p>
                    </div>
                 </div>
                 <div className="flex space-x-3">
                    <button onClick={handleRedial} className="text-slate-400 hover:text-green-600" title="Call Again">
                       <RefreshCw className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              {/* Main Content Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                 <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* Audio Player Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                             <div className={`p-2 rounded-full ${selectedLog.status === CallStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {selectedLog.status === CallStatus.COMPLETED ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                             </div>
                             <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                   {selectedLog.status === CallStatus.COMPLETED ? 'Call completed' : 'No answer'}
                                </h3>
                                <div className="flex items-center text-xs text-slate-500 space-x-2">
                                   <img src={agent.avatar} className="w-4 h-4 rounded-full" />
                                   <span>{agent.name}</span>
                                </div>
                             </div>
                          </div>
                          <div className="text-xs font-medium text-slate-400">
                             {formatDate(selectedLog.endedAt)}
                          </div>
                       </div>
                       
                       {/* Player Controls */}
                       {selectedLog.status === CallStatus.COMPLETED && (
                          <div className="bg-slate-50 rounded-lg p-3 flex items-center space-x-4 border border-slate-100">
                             <button 
                               onClick={() => setIsPlaying(!isPlaying)}
                               className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-sm"
                             >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
                             </button>
                             <div className="flex-1 h-8 flex items-center space-x-1">
                                {/* Mock Waveform */}
                                {Array.from({ length: 40 }).map((_, i) => (
                                   <div 
                                      key={i} 
                                      className={`w-1 rounded-full transition-all duration-300 ${i < 15 ? 'bg-indigo-400' : 'bg-slate-300'}`}
                                      style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
                                   />
                                ))}
                             </div>
                             <span className="text-xs font-mono text-slate-500 font-medium">
                                00:14 / {formatDuration(selectedLog.durationSeconds)}
                             </span>
                             <button onClick={handleDownloadRecording} className="p-2 text-slate-400 hover:text-slate-600" title="Download Recording">
                                <Download className="w-4 h-4" />
                             </button>
                          </div>
                       )}
                    </div>

                    {/* TABS */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="border-b border-slate-200">
                          <nav className="flex -mb-px">
                             {['Overview', 'Summary', 'Transcript'].map((tab) => (
                                <button
                                   key={tab}
                                   onClick={() => setActiveTab(tab)}
                                   className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                      activeTab === tab
                                         ? 'border-indigo-600 text-indigo-600'
                                         : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                   }`}
                                >
                                   {tab}
                                </button>
                             ))}
                          </nav>
                       </div>

                       <div className="p-6">
                          {/* --- OVERVIEW TAB --- */}
                          {activeTab === 'Overview' && (
                             <div className="space-y-8 animate-fadeIn">
                                {/* Call Information */}
                                <div>
                                   <h4 className="text-sm font-bold text-slate-900 mb-4">Call Information</h4>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Labels</span>
                                         <button className="text-indigo-600 hover:text-indigo-800"><PlusCircleIcon /></button>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Call from</span>
                                         <span className="text-sm font-medium text-slate-900">+160555253875</span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Call to</span>
                                         <span className="text-sm font-medium text-slate-900">{selectedLog.phoneNumber}</span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">AI Agent</span>
                                         <div className="flex items-center space-x-2">
                                            <img src={agent.avatar} className="w-5 h-5 rounded-full"/>
                                            <span className="text-sm font-medium text-slate-900">{agent.name}</span>
                                         </div>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Duration</span>
                                         <span className="text-sm font-medium text-slate-900">{formatDuration(selectedLog.durationSeconds)}</span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Usage</span>
                                         <span className="text-sm font-medium text-slate-900">{selectedLog.usageCost || '00:00:0'}</span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Started at</span>
                                         <span className="text-sm font-medium text-slate-900">{formatDate(selectedLog.startedAt)}</span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Ended at</span>
                                         <span className="text-sm font-medium text-slate-900">{formatDate(selectedLog.endedAt)}</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Call Analysis */}
                                <div>
                                   <h4 className="text-sm font-bold text-slate-900 mb-4">Call Analysis</h4>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500 flex items-center">Rating <Info className="w-3 h-3 ml-1 text-slate-300"/></span>
                                         <div className="flex space-x-0.5">
                                            {[1,2,3,4,5].map(star => (
                                               <Star 
                                                  key={star} 
                                                  className={`w-4 h-4 ${star <= (selectedLog.rating || 0) ? 'text-slate-800 fill-slate-800' : 'text-slate-300'}`} 
                                               />
                                            ))}
                                         </div>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Call sentiment</span>
                                         <span className={`text-sm font-medium ${selectedLog.sentiment === 'Positive' ? 'text-green-600' : 'text-slate-900'}`}>
                                            {selectedLog.sentiment || 'Unknown'}
                                         </span>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">Call status</span>
                                         <div className="flex items-center text-sm font-medium text-green-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                            {selectedLog.dialStatus || 'Call completed'}
                                         </div>
                                      </div>
                                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                         <span className="text-sm text-slate-500">End call reason</span>
                                         <div className="flex items-center text-sm font-medium text-green-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                            {selectedLog.endReason || 'The contact ended the call.'}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {/* --- SUMMARY TAB --- */}
                          {activeTab === 'Summary' && (
                             <div className="animate-fadeIn">
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                   <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                                      <FileText className="w-4 h-4 mr-2" /> AI Summary
                                   </h4>
                                   <p className="text-sm text-indigo-800 leading-relaxed">
                                      {selectedLog.summary || "No summary available for this call."}
                                   </p>
                                </div>
                             </div>
                          )}

                          {/* --- TRANSCRIPT TAB --- */}
                          {activeTab === 'Transcript' && (
                             <div className="animate-fadeIn space-y-4">
                                {selectedLog.transcript ? (
                                   selectedLog.transcript.split('\n').map((line, idx) => {
                                      const isAgent = line.toLowerCase().startsWith('agent:');
                                      const cleanLine = line.replace(/^(Agent:|Lead:)/i, '').trim();
                                      if (!cleanLine) return null;

                                      return (
                                         <div key={idx} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${isAgent ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                               <div className="text-xs opacity-70 mb-1">{isAgent ? agent.name : selectedLog.leadName}</div>
                                               {cleanLine}
                                            </div>
                                         </div>
                                      );
                                   })
                                ) : (
                                   <div className="text-center text-slate-400 py-8">No transcript available.</div>
                                )}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Phone className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a conversation to view details</p>
           </div>
        )}
      </div>

      {/* --- LEAD SELECTION MODAL --- */}
      {isLeadModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
               <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                  <div>
                     <h3 className="font-bold text-lg text-slate-900">New Campaign</h3>
                     <p className="text-sm text-slate-500">Select leads to start auto-dialing.</p>
                  </div>
                  <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                     <XCircle className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-2">
                  <table className="min-w-full divide-y divide-slate-100">
                     <thead className="bg-white sticky top-0 z-10">
                        <tr>
                           <th className="px-6 py-3 text-left">
                              <button 
                                 onClick={toggleSelectAll} 
                                 className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600"
                              >
                                 {selectedLeadIds.size === leads.length ? <CheckSquare className="w-4 h-4 mr-2 text-indigo-600" /> : <Square className="w-4 h-4 mr-2" />}
                                 Select All
                              </button>
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-slate-100">
                        {leads.length === 0 ? (
                           <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No leads found in Contacts.</td></tr>
                        ) : (
                           leads.map(lead => (
                              <tr key={lead.id} className={`hover:bg-slate-50 cursor-pointer ${selectedLeadIds.has(lead.id) ? 'bg-indigo-50/50' : ''}`} onClick={() => toggleLeadSelection(lead.id)}>
                                 <td className="px-6 py-3">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                                       {selectedLeadIds.has(lead.id) && <Plus className="w-3 h-3 rotate-45" />}
                                    </div>
                                 </td>
                                 <td className="px-6 py-3 text-sm font-medium text-slate-900">{lead.firstName} {lead.lastName}</td>
                                 <td className="px-6 py-3 text-sm text-slate-500">{lead.companyName}</td>
                                 <td className="px-6 py-3 text-sm text-slate-500 font-mono">{lead.phone}</td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>

               <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                     {selectedLeadIds.size} leads selected
                  </span>
                  <div className="flex space-x-3">
                     <button 
                        onClick={() => setIsLeadModalOpen(false)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-white"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={startCampaign}
                        disabled={selectedLeadIds.size === 0}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center"
                     >
                        <Phone className="w-4 h-4 mr-2" />
                        Start Auto-Dialer
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

const PlusCircleIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
   </svg>
);

export default CallManager;
