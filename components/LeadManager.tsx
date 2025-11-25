
import React, { useState, useRef } from 'react';
import { Lead } from '../types';
import { Upload, Plus, Search } from 'lucide-react';

interface LeadManagerProps {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
}

const LeadManager: React.FC<LeadManagerProps> = ({ leads, setLeads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New lead form state - matching requirements
  const [newLead, setNewLead] = useState({ 
    firstName: '', 
    lastName: '', 
    phone: '',
    email: '', 
    companyName: '',
    totalEmployees: '',
    address: '',
    website: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate CSV parsing
      setTimeout(() => {
        const mockParsedLeads: Lead[] = [
          { id: Math.random().toString(), firstName: 'Alice', lastName: 'Wonder', email: 'alice@test.com', phone: '+15559999', companyName: 'Alice Corp', address: 'Wonderland', status: 'New', uploadedAt: new Date().toISOString() },
          { id: Math.random().toString(), firstName: 'Bob', lastName: 'Builder', email: 'bob@test.com', phone: '+15558888', companyName: 'Bob Construction', address: 'Builder Lane', status: 'New', uploadedAt: new Date().toISOString() },
        ];
        setLeads([...leads, ...mockParsedLeads]);
        alert(`Successfully imported ${mockParsedLeads.length} leads from ${file.name}`);
      }, 1000);
    }
  };

  const handleAddManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      id: Math.random().toString(),
      firstName: newLead.firstName,
      lastName: newLead.lastName,
      email: newLead.email,
      phone: newLead.phone,
      companyName: newLead.companyName,
      address: newLead.address,
      website: newLead.website,
      totalEmployees: newLead.totalEmployees ? parseInt(newLead.totalEmployees) : undefined,
      status: 'New',
      uploadedAt: new Date().toISOString()
    };
    setLeads([...leads, lead]);
    setNewLead({ 
      firstName: '', lastName: '', phone: '', email: '', 
      companyName: '', totalEmployees: '', address: '', website: '' 
    });
    setIsUploadModalOpen(false);
  };

  const filteredLeads = leads.filter(l => 
    l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500">Upload and manage your contact lists.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
          <div className="relative">
             <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               accept=".csv"
               onChange={handleFileUpload}
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors font-medium"
             >
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {leads.length === 0 ? (
           // Empty State
           <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                 {/* Illustration Placeholder */}
                 <div className="w-32 h-32 text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                       <circle cx="9" cy="7" r="4"></circle>
                       <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                       <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                 </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Contacts Yet</h3>
              <p className="text-slate-500 max-w-sm mb-8">Add your first contact or import a list to get started.</p>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center"
              >
                 <Plus className="w-5 h-5 mr-2" />
                 Add Contact
              </button>
           </div>
        ) : (
           <>
            <div className="p-4 border-b border-slate-200 flex items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search contacts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full rounded-md border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="ml-auto text-sm text-slate-500">
                Total: {filteredLeads.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company & Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{lead.firstName} {lead.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{lead.companyName}</div>
                        {lead.totalEmployees && <div className="text-xs text-slate-500">{lead.totalEmployees} employees</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{lead.email}</div>
                        <div className="text-sm text-slate-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         {lead.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : ''}
                          ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : ''}
                          ${lead.status === 'Closed' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </>
        )}
      </div>

      {/* Manual Add Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 m-4 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add contact</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleAddManualLead} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name*</label>
                  <input required type="text" value={newLead.firstName} onChange={e => setNewLead({...newLead, firstName: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Last Name*</label>
                  <input required type="text" value={newLead.lastName} onChange={e => setNewLead({...newLead, lastName: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number*</label>
                    <input required type="tel" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address*</label>
                    <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Company Name*</label>
                 <input required type="text" value={newLead.companyName} onChange={e => setNewLead({...newLead, companyName: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Total Employees (Optional)</label>
                 <input type="number" value={newLead.totalEmployees} onChange={e => setNewLead({...newLead, totalEmployees: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Office Address*</label>
                 <input required type="text" value={newLead.address} onChange={e => setNewLead({...newLead, address: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                 <input type="url" value={newLead.website} onChange={e => setNewLead({...newLead, website: e.target.value})} placeholder="https://" className="w-full border border-slate-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 font-medium transition-colors">
                   Add contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManager;
