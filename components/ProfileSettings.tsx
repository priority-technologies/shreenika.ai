
import React, { useState } from 'react';
import { User, Shield, HelpCircle, Phone, Plus, CreditCard, Lock, FileText } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [user] = useState(() => {
     const u = localStorage.getItem('voxai_user');
     return u ? JSON.parse(u) : { name: 'User', email: 'user@example.com', role: 'user' };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account, integrations, and legal information.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4 space-y-1">
           {[
              { id: 'Profile', icon: User, label: 'My Profile' },
              { id: 'VOIP', icon: Phone, label: 'VOIP Integration' },
              { id: 'Legal', icon: Shield, label: 'Privacy & Terms' },
              { id: 'FAQ', icon: HelpCircle, label: 'FAQs' },
           ].map(tab => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                 }`}
              >
                 <tab.icon className="w-4 h-4" />
                 <span>{tab.label}</span>
              </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
           
           {/* --- PROFILE --- */}
           {activeTab === 'Profile' && (
              <div className="max-w-lg space-y-6">
                 <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">My Profile</h2>
                 <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                       {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                       <button className="text-sm text-blue-600 font-medium hover:underline">Change Avatar</button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                       <input type="text" value={user.name} readOnly className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-500" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                       <input type="email" value={user.email} readOnly className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-500" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                       <input type="text" value={user.role} readOnly className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-500 capitalize" />
                    </div>
                 </div>
                 <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800">
                    Update Profile
                 </button>
              </div>
           )}

           {/* --- VOIP --- */}
           {activeTab === 'VOIP' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">VOIP Integration</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center">
                       <Plus className="w-4 h-4 mr-2" /> Purchase Number
                    </button>
                 </div>
                 
                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                       <h3 className="text-sm font-bold text-blue-900">Active Provider: Twilio</h3>
                       <p className="text-sm text-blue-700 mt-1">Your account is connected. SID: AC...4829</p>
                    </div>
                 </div>

                 <h3 className="text-sm font-bold text-slate-900 pt-4">My Numbers</h3>
                 <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                       <thead className="bg-slate-50">
                          <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Number</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Region</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Capabilities</th>
                             <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 bg-white">
                          <tr>
                             <td className="px-6 py-4 text-sm font-medium text-slate-900">+1 605-552-3875</td>
                             <td className="px-6 py-4 text-sm text-slate-500">US (South Dakota)</td>
                             <td className="px-6 py-4 text-xs text-slate-500">Voice, SMS</td>
                             <td className="px-6 py-4 text-right text-sm text-red-600 hover:underline cursor-pointer">Release</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {/* --- LEGAL --- */}
           {activeTab === 'Legal' && (
              <div className="max-w-2xl space-y-8">
                 <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Privacy & Terms</h2>
                 
                 <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                       <div className="p-2 bg-slate-100 rounded text-slate-600">
                          <FileText className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900">Terms of Service</h3>
                          <p className="text-sm text-slate-500 mt-1">Read the terms and conditions for using Shreenika AI.</p>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                       <div className="p-2 bg-slate-100 rounded text-slate-600">
                          <Lock className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900">Privacy Policy</h3>
                          <p className="text-sm text-slate-500 mt-1">How we handle your data and call recordings.</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="text-xs text-slate-400">
                    Last updated: November 10, 2025
                 </div>
              </div>
           )}

           {/* --- FAQ --- */}
           {activeTab === 'FAQ' && (
              <div className="max-w-3xl space-y-6">
                 <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Frequently Asked Questions</h2>
                 <div className="space-y-4">
                    {FAQ_ITEMS.map((item, idx) => (
                       <div key={idx} className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                          <h3 className="font-bold text-slate-900 text-sm mb-2">{item.q}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
