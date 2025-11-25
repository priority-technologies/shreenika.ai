
import React, { useState, useRef } from 'react';
import { AgentConfig } from '../types';
import { improveAgentPrompt } from '../services/geminiService';
import { VOICE_OPTIONS, LANGUAGE_OPTIONS, NOISE_OPTIONS, CHARACTERISTIC_OPTIONS } from '../constants';
import { 
  Save, 
  Upload, 
  X,
  ChevronDown,
  Info,
  Smartphone,
  Sparkles,
  FileText,
  Trash2,
  Loader2,
  Plus,
  User,
  UserPlus,
  Headphones,
  Calendar,
  ShoppingBag
} from 'lucide-react';

interface AgentManagerProps {
  agent: AgentConfig;
  setAgent: (agent: AgentConfig) => void;
}

const AgentManager: React.FC<AgentManagerProps> = ({ agent, setAgent }) => {
  const [localAgent, setLocalAgent] = useState<AgentConfig>(agent);
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaved, setIsSaved] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Purchase State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  
  // Add Agent Type State
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);

  // Google Ask State
  const [isGoogleOpen, setIsGoogleOpen] = useState(false);
  const [googleInstruction, setGoogleInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AgentConfig, value: any) => {
    setLocalAgent(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setAgent(localAgent);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addCharacteristic = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!localAgent.characteristics.includes(newTag.trim())) {
        handleChange('characteristics', [...localAgent.characteristics, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const addCharacteristicFromList = (tag: string) => {
    if (!localAgent.characteristics.includes(tag)) {
        handleChange('characteristics', [...localAgent.characteristics, tag]);
    }
  };

  const removeCharacteristic = (tagToRemove: string) => {
    handleChange('characteristics', localAgent.characteristics.filter(tag => tag !== tagToRemove));
  };

  const handleAddAgentTypeSelection = (type: string) => {
    setIsAddTypeModalOpen(false);
    // Logic to handle adding a new agent would go here
    // For the frontend demo, we just alert
    alert(`New ${type} Agent template initialized. Switch to the new agent in the sidebar.`);
  };
  
  // --- Role Tab Handlers ---
  const handleGoogleGenerate = async () => {
    if (!googleInstruction.trim()) return;
    setIsGenerating(true);
    const improvedPrompt = await improveAgentPrompt(localAgent.prompt, googleInstruction);
    handleChange('prompt', improvedPrompt);
    setIsGenerating(false);
    setIsGoogleOpen(false);
    setGoogleInstruction('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'unknown',
        id: Math.random().toString(),
        status: 'synced' as const,
        uploadedAt: new Date().toISOString()
      };
      const currentFiles = localAgent.knowledgeBase || [];
      handleChange('knowledgeBase', [...currentFiles, newFile]);
    }
  };

  const removeFile = (index: number) => {
     const currentFiles = [...(localAgent.knowledgeBase || [])];
     currentFiles.splice(index, 1);
     handleChange('knowledgeBase', currentFiles);
  };

  return (
    // Fixed height container to manage internal scrolling
    <div className="flex h-[calc(100vh-100px)] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      
      {/* --- LEFT SIDEBAR: AGENT LIST --- */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shrink-0">
         <div className="p-4 border-b border-slate-100">
           <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Your AI Agents</h2>
           <button 
              onClick={() => setIsBuyModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
           >
              <Plus className="w-4 h-4" />
              <span>Add New Agent</span>
           </button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Active Agent Card */}
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer transition-all shadow-sm">
               <div className="relative">
                 <img src={localAgent.avatar} alt="Agent" className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm" />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{localAgent.name}</div>
                  <div className="text-xs text-blue-600 font-medium truncate">{localAgent.title}</div>
               </div>
            </div>
            
            {/* Inactive Agent Mockup 1 */}
            <div className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-slate-100">
               <div className="relative">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm">
                    <User className="w-5 h-5" />
                 </div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-600 group-hover:text-slate-900 truncate">Support Bot</div>
                  <div className="text-xs text-slate-400 truncate">Customer Service</div>
               </div>
            </div>

             {/* Inactive Agent Mockup 2 */}
             <div className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-slate-100">
               <div className="relative">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm">
                    <User className="w-5 h-5" />
                 </div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-600 group-hover:text-slate-900 truncate">Booking Asst</div>
                  <div className="text-xs text-slate-400 truncate">Reservations</div>
               </div>
            </div>
         </div>

         {/* Bottom Info */}
         <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
            <div className="flex items-center justify-between text-xs text-slate-500">
               <span>Agent Limit</span>
               <span className="font-medium text-slate-700">1 / 3 Used</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
               <div className="bg-blue-500 h-full w-1/3 rounded-full"></div>
            </div>
         </div>
      </div>

      {/* --- RIGHT CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Sticky Header */}
        <div className="h-16 border-b border-slate-200 flex justify-between items-center px-6 bg-white shrink-0 z-20">
           <div className="flex items-center space-x-4">
              <div className="lg:hidden">
                <img src={localAgent.avatar} alt="Current Agent" className="w-8 h-8 rounded-full" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 hidden sm:block">Agent Configuration</h1>
              <h1 className="text-lg font-bold text-slate-900 sm:hidden">{localAgent.name}</h1>
           </div>
           
           <div className="flex items-center space-x-3">
              {/* ADD AGENT BUTTON - Explicitly Styled & Visible */}
              <button 
                 onClick={() => setIsAddTypeModalOpen(true)}
                 className="flex items-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg text-sm font-bold transition-all mr-2"
              >
                 <UserPlus className="w-4 h-4" />
                 <span>Add Agent</span>
              </button>

              <span className={`hidden sm:inline-block px-3 py-1 rounded-md text-xs font-medium ${isSaved ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                 {isSaved ? 'Saved' : 'Unsaved changes'}
              </span>
              <button 
                 onClick={handleSave} 
                 className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
              >
                 <Save className="w-4 h-4 mr-2" />
                 Save
              </button>
           </div>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto">
           {/* Tabs */}
           <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3 z-10">
              <nav className="flex space-x-2">
                 {['Profile', 'Role'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                       activeTab === tab
                         ? 'bg-blue-600 text-white shadow-md'
                         : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                     }`}
                   >
                     {tab}
                   </button>
                 ))}
              </nav>
           </div>

           <div className="p-6 pb-32 max-w-5xl mx-auto">
              {activeTab === 'Profile' && (
                 <div className="space-y-8 animate-fadeIn">
                    
                    {/* Top Form Section */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       
                       <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                             Profile image <Info className="w-3 h-3 ml-1 text-slate-400"/>
                          </label>
                          <div className="flex items-center space-x-4">
                             <img src={localAgent.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-slate-100 shadow-sm" />
                             <button className="flex-1 border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors">
                                <Upload className="w-4 h-4 mr-2" /> Change Avatar
                             </button>
                          </div>
                       </div>

                       <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                             Name <Info className="w-3 h-3 ml-1 text-slate-400"/>
                          </label>
                          <input 
                            type="text" 
                            value={localAgent.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                          />
                       </div>

                       <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                          <input 
                            type="text" 
                            value={localAgent.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                          />
                       </div>

                       <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                          <div className="relative">
                             <select 
                               value={localAgent.language}
                               onChange={(e) => handleChange('language', e.target.value)}
                               className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-shadow"
                             >
                                {LANGUAGE_OPTIONS.map(lang => <option key={lang}>{lang}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                       </div>
                       <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Voice</label>
                          <div className="relative">
                             <select 
                                value={localAgent.voiceId}
                                onChange={(e) => handleChange('voiceId', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-shadow"
                             >
                                {VOICE_OPTIONS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                       </div>

                       <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Characteristics</label>
                          <div className="border border-slate-300 rounded-lg p-3 space-y-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
                             <div className="flex flex-wrap gap-2">
                                {localAgent.characteristics.map(tag => (
                                   <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                                      {tag}
                                      <button onClick={() => removeCharacteristic(tag)} className="ml-1.5 text-blue-400 hover:text-blue-600">
                                         <X className="w-3 h-3" />
                                      </button>
                                   </span>
                                ))}
                                <input 
                                   type="text" 
                                   value={newTag}
                                   onChange={(e) => setNewTag(e.target.value)}
                                   onKeyDown={addCharacteristic}
                                   placeholder={localAgent.characteristics.length === 0 ? "Type & Enter to add..." : ""}
                                   className="flex-1 outline-none text-sm min-w-[120px] bg-transparent py-1"
                                />
                             </div>
                             
                             {/* Suggestions */}
                             <div className="pt-2 border-t border-slate-100">
                                <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Suggestions</p>
                                <div className="flex flex-wrap gap-2">
                                   {CHARACTERISTIC_OPTIONS.map(option => (
                                      <button 
                                         key={option} 
                                         onClick={() => addCharacteristicFromList(option)}
                                         className="px-2 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors"
                                      >
                                         + {option}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Call Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <h3 className="text-base font-bold text-slate-900">Call settings</h3>
                          <button className="text-sm text-slate-400 hover:text-slate-600 underline">Reset defaults</button>
                       </div>
                       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Maximum call duration</label>
                             <div className="relative">
                                <input 
                                  type="number" 
                                  value={localAgent.maxCallDuration}
                                  onChange={(e) => handleChange('maxCallDuration', parseInt(e.target.value))}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10 transition-shadow"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">sec</span>
                             </div>
                          </div>
                          
                          {/* Voicemail Detection & Logic */}
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-slate-700">Voicemail Detection</label>
                                <button 
                                  onClick={() => handleChange('voicemailDetection', !localAgent.voicemailDetection)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${localAgent.voicemailDetection ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                   <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localAgent.voicemailDetection ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                             </div>
                             
                             {/* If enabled, show logic options */}
                             {localAgent.voicemailDetection && (
                               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3 animate-fadeIn">
                                  <div>
                                     <label className="block text-xs font-bold text-blue-800 mb-1 uppercase tracking-wide">Action on Voicemail</label>
                                     <div className="relative">
                                        <select 
                                           value={localAgent.voicemailAction}
                                           onChange={(e) => handleChange('voicemailAction', e.target.value)}
                                           className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                                        >
                                           <option value="Hang up">Hang up immediately</option>
                                           <option value="Leave a voicemail">Leave a message</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                     </div>
                                  </div>

                                  {localAgent.voicemailAction === 'Leave a voicemail' && (
                                     <div>
                                        <label className="block text-xs font-bold text-blue-800 mb-1 uppercase tracking-wide">Message to Leave</label>
                                        <textarea
                                           value={localAgent.voicemailMessage || ''}
                                           onChange={(e) => handleChange('voicemailMessage', e.target.value)}
                                           rows={3}
                                           className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                                           placeholder="Hi, this is [Name] calling..."
                                        />
                                     </div>
                                  )}
                               </div>
                             )}
                          </div>

                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">End call on silence</label>
                             <div className="relative">
                                <input 
                                  type="number" 
                                  value={localAgent.silenceDetectionMs}
                                  onChange={(e) => handleChange('silenceDetectionMs', parseInt(e.target.value))}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10 transition-shadow"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">sec</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Speech Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                          <h3 className="text-base font-bold text-slate-900">Speech settings</h3>
                          <button className="text-sm text-slate-400 hover:text-slate-600 underline">Reset defaults</button>
                       </div>
                       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-3">Voice Speed</label>
                             <div className="relative pt-1">
                                <input 
                                   type="range" min="0.5" max="2.0" step="0.25"
                                   value={localAgent.voiceSpeed}
                                   onChange={(e) => handleChange('voiceSpeed', parseFloat(e.target.value))}
                                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                                   <span>Slow (0.75x)</span>
                                   <span>Normal (1x)</span>
                                   <span>Fast (1.25x)</span>
                                </div>
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center">
                                Interruption Sensitivity
                             </label>
                             <div className="relative pt-1">
                                <input 
                                   type="range" min="0" max="1" step="0.5"
                                   value={localAgent.interruptionSensitivity}
                                   onChange={(e) => handleChange('interruptionSensitivity', parseFloat(e.target.value))}
                                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                                   <span>Low</span>
                                   <span>Normal</span>
                                   <span>High</span>
                                </div>
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center">
                                Responsiveness
                             </label>
                             <div className="relative pt-1">
                                <input 
                                   type="range" min="0" max="1" step="0.5"
                                   value={localAgent.responsiveness}
                                   onChange={(e) => handleChange('responsiveness', parseFloat(e.target.value))}
                                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                                   <span>Slow</span>
                                   <span>Normal</span>
                                   <span>Fast</span>
                                </div>
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-3">Emotions</label>
                             <div className="relative pt-1">
                                <input 
                                   type="range" min="0" max="1" step="0.5"
                                   value={localAgent.emotionLevel}
                                   onChange={(e) => handleChange('emotionLevel', parseFloat(e.target.value))}
                                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                                   <span>Calm</span>
                                   <span>Emotional</span>
                                </div>
                             </div>
                          </div>
                          <div className="col-span-1">
                             <label className="block text-sm font-medium text-slate-700 mb-2">Background Noise</label>
                             <div className="relative">
                                <select 
                                  value={localAgent.backgroundNoise}
                                  onChange={(e) => handleChange('backgroundNoise', e.target.value)}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-shadow"
                                >
                                   {NOISE_OPTIONS.map(n => <option key={n}>{n}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {/* --- ROLE TAB --- */}
              {activeTab === 'Role' && (
                <div className="max-w-6xl flex flex-col lg:flex-row gap-8 animate-fadeIn">
                   {/* Left Column: Prompt & Welcome */}
                   <div className="flex-1 space-y-6">
                      
                      {/* Welcome Message */}
                      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                         <h3 className="text-sm font-bold text-slate-900 mb-4">Welcome Message</h3>
                         <div className="relative">
                           <div className="absolute left-3 top-3 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                             AI Initiates
                           </div>
                           <input 
                             type="text"
                             value={localAgent.welcomeMessage}
                             onChange={(e) => handleChange('welcomeMessage', e.target.value)}
                             className="w-full border border-slate-300 rounded-lg pt-10 pb-3 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow font-medium text-slate-800"
                           />
                         </div>
                         <p className="text-xs text-slate-500 mt-2">The message the AI will speak to start the conversation.</p>
                      </div>

                      {/* Prompt Editor */}
                      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col h-[600px]">
                         <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-bold text-slate-900">System Prompt</h3>
                              <Info className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex space-x-2">
                               <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                  Use templates
                               </button>
                               <button 
                                  onClick={() => setIsGoogleOpen(true)}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                               >
                                  <Sparkles className="w-3 h-3 mr-1.5" />
                                  Ask Google
                               </button>
                            </div>
                         </div>
                         
                         <textarea
                           value={localAgent.prompt}
                           onChange={(e) => handleChange('prompt', e.target.value)}
                           className="flex-1 w-full border border-slate-300 rounded-lg p-4 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50"
                           placeholder="Define your agent's persona, objective, and rules here..."
                         />
                      </div>
                   </div>

                   {/* Right Column: Attachments */}
                   <div className="w-full lg:w-80 space-y-6">
                      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                         <h3 className="text-sm font-bold text-slate-900 mb-2">Knowledge Base</h3>
                         <p className="text-xs text-slate-500 mb-4">Upload documents for your agent to reference.</p>
                         
                         <div className="relative mb-6">
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              onChange={handleFileUpload}
                            />
                            <button 
                               onClick={() => fileInputRef.current?.click()}
                               className="w-full border-2 border-dashed border-slate-300 rounded-lg py-4 px-3 text-sm text-center text-slate-600 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all flex flex-col items-center justify-center space-y-2"
                            >
                               <Upload className="w-5 h-5 text-slate-400" />
                               <span>Upload Document</span>
                            </button>
                         </div>

                         {/* File List */}
                         <div className="space-y-3">
                            {localAgent.knowledgeBase?.map((file, idx) => (
                               <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
                                  <div className="flex items-center space-x-3 overflow-hidden">
                                     <div className="bg-blue-50 p-2 rounded text-blue-600">
                                        <FileText className="w-4 h-4" />
                                     </div>
                                     <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                                        <p className="text-[10px] text-slate-400">{file.size}</p>
                                     </div>
                                  </div>
                                  <button 
                                     onClick={() => removeFile(idx)}
                                     className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            ))}
                            {(!localAgent.knowledgeBase || localAgent.knowledgeBase.length === 0) && (
                               <div className="text-center py-6 text-slate-400 text-xs">
                                  No files attached yet.
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Google Ask Modal */}
        {isGoogleOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden scale-100 transition-transform">
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center text-lg">
                       <Sparkles className="w-5 h-5 mr-2" />
                       Ask Google AI
                    </h3>
                    <button onClick={() => setIsGoogleOpen(false)} className="text-blue-100 hover:text-white transition-colors">
                       <X className="w-6 h-6" />
                    </button>
                 </div>
                 <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4 font-medium">
                       Describe your agent's goal. Google Gemini will generate a professional system prompt for you.
                    </p>
                    <textarea 
                       className="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 mb-6 resize-none bg-slate-50"
                       placeholder="e.g. Create a friendly receptionist for a pizza place who takes delivery orders, checks for allergies, and upsells drinks..."
                       value={googleInstruction}
                       onChange={(e) => setGoogleInstruction(e.target.value)}
                    />
                    <div className="flex justify-end space-x-3">
                       <button 
                          onClick={() => setIsGoogleOpen(false)} 
                          className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                       >
                          Cancel
                       </button>
                       <button 
                          onClick={handleGoogleGenerate}
                          disabled={isGenerating || !googleInstruction.trim()}
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                       >
                          {isGenerating ? (
                             <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                             </>
                          ) : (
                             'Generate Prompt'
                          )}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Add Agent Type Modal (New) */}
        {isAddTypeModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Select Agent Type</h3>
                    <button onClick={() => setIsAddTypeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                       <X className="w-6 h-6" />
                    </button>
                 </div>
                 <div className="p-6 bg-slate-50">
                    <p className="text-sm text-slate-500 mb-6 text-center">
                       Choose a template to get started quickly. You can customize everything later.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[
                          { id: 'sales', label: 'Sales Representative', icon: ShoppingBag, desc: 'Qualify leads, handle objections, and book meetings.' },
                          { id: 'support', label: 'Customer Support', icon: Headphones, desc: 'Answer FAQs, troubleshoot issues, and triage tickets.' },
                          { id: 'booking', label: 'Reservationist', icon: Calendar, desc: 'Schedule appointments, manage calendar, and reminders.' },
                          { id: 'custom', label: 'Custom / Blank', icon: User, desc: 'Start from scratch with a blank persona.' },
                       ].map((type) => (
                          <button 
                             key={type.id}
                             onClick={() => handleAddAgentTypeSelection(type.label)}
                             className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-center"
                          >
                             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <type.icon className="w-6 h-6" />
                             </div>
                             <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">{type.label}</h4>
                             <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Purchase Agent Modal */}
        {isBuyModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
                 <div className="flex justify-end mb-2">
                    <button onClick={() => setIsBuyModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                 </div>
                 <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 ring-8 ring-blue-50">
                    <Smartphone className="w-10 h-10" />
                 </div>
                 <h4 className="text-2xl font-bold text-slate-900 mb-2">Add New Agent</h4>
                 <p className="text-slate-500 mb-8 px-4 leading-relaxed">
                    You have reached the limit of your <b>Starter Plan</b> (1 Agent). <br/>
                    Upgrade to Enterprise or purchase an Add-on to create more agents.
                 </p>
                 <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-3">
                    View Pricing Plans
                 </button>
                 <button onClick={() => setIsBuyModalOpen(false)} className="text-sm text-slate-500 hover:text-slate-800 font-medium">
                    Maybe Later
                 </button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default AgentManager;
