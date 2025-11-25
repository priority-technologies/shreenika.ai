
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  CreditCard, 
  X, 
  Smartphone, 
  Landmark, 
  Globe, 
  CheckCircle2, 
  Loader2,
  Lock,
  ArrowUpRight,
  Package,
  Check,
  Zap,
  Shield,
  HardDrive
} from 'lucide-react';

const UsageBilling: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'gateway'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock Data for the Cost Breakdown Chart
  const usageData = [
    { name: 'Jun 2025', LLM: 120, STT: 80, TTS: 90, VOIP: 200, Server: 50 },
    { name: 'Jul 2025', LLM: 150, STT: 100, TTS: 110, VOIP: 220, Server: 50 },
    { name: 'Aug 2025', LLM: 180, STT: 120, TTS: 130, VOIP: 250, Server: 55 },
    { name: 'Sep 2025', LLM: 200, STT: 140, TTS: 150, VOIP: 280, Server: 60 },
    { name: 'Oct 2025', LLM: 340, STT: 200, TTS: 210, VOIP: 400, Server: 70 },
    { name: 'Nov 2025', LLM: 450, STT: 300, TTS: 320, VOIP: 580, Server: 80 }, // Current (partial)
  ];

  const services = [
    { key: 'VOIP', color: '#6366f1', label: 'Telephony (VOIP)' },
    { key: 'LLM', color: '#8b5cf6', label: 'AI Model (LLM)' },
    { key: 'STT', color: '#ec4899', label: 'Speech-to-Text' },
    { key: 'TTS', color: '#10b981', label: 'Text-to-Speech' },
    { key: 'Server', color: '#f59e0b', label: 'Infrastructure' },
  ];

  // Mock Subscribed Services Data
  const [currentPlan, setCurrentPlan] = useState('Starter');
  const [addons, setAddons] = useState({ storage: true, agent: true });

  const plans = [
     { id: 'Starter', price: 29, features: ['1 AI Agent', '1,000 mins/mo', 'Standard Support'] },
     { id: 'Pro', price: 99, features: ['5 AI Agents', '5,000 mins/mo', 'Priority Support', 'Advanced Analytics'] },
     { id: 'Enterprise', price: 299, features: ['Unlimited Agents', '20,000 mins/mo', 'Dedicated Account Manager', 'SLA'] },
  ];

  const calculateTotal = () => {
     let total = plans.find(p => p.id === currentPlan)?.price || 0;
     if (addons.storage) total += 10;
     if (addons.agent) total += 15;
     return total;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Reset after success
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentModal(false);
      }, 3000);
    }, 2000);
  };

  const handleUpdateSubscription = () => {
     setIsProcessing(true);
     setTimeout(() => {
        setIsProcessing(false);
        setShowSubscriptionModal(false);
        alert("Subscription updated successfully!");
     }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Usage & Billing</h1>
            <p className="text-slate-500">Monitor your consumption and manage forecast budgets.</p>
         </div>
         <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white bg-slate-50">
            View Invoice
         </button>
      </div>

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Cost Summary Card */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
               <h2 className="text-lg font-bold text-slate-900">Cost summary</h2>
               <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Info</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Month-to-date */}
               <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Month-to-date cost</p>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">$1,094.60</h3>
                  <div className="flex items-center text-xs text-slate-500">
                     <ArrowUpRight className="w-3 h-3 text-slate-900 mr-1" />
                     <span className="font-medium text-slate-900">720%</span>
                     <span className="ml-1">compared to last month</span>
                  </div>
               </div>

               {/* Last month comparison */}
               <div className="border-l border-slate-100 pl-6 md:pl-8">
                  <p className="text-sm font-medium text-slate-600 mb-1">Last month's cost for same period</p>
                  <h3 className="text-2xl font-bold text-blue-500 mb-2">$133.51</h3>
                  <p className="text-xs text-slate-400">Oct 1 – 24</p>
               </div>

               {/* Forecast */}
               <div className="pt-4 md:pt-0">
                  <p className="text-sm font-medium text-slate-600 mb-1">Total forecasted cost for current month</p>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">$1,413.28</h3>
                  <div className="flex items-center text-xs text-slate-500">
                     <ArrowUpRight className="w-3 h-3 text-slate-900 mr-1" />
                     <span className="font-medium text-slate-900">316%</span>
                     <span className="ml-1">compared to last month's total</span>
                  </div>
               </div>

               {/* Last month total */}
               <div className="border-l border-slate-100 pl-6 md:pl-8 pt-4 md:pt-0">
                  <p className="text-sm font-medium text-slate-600 mb-1">Last month's total cost</p>
                  <h3 className="text-2xl font-bold text-blue-500 underline mb-2 decoration-blue-200 underline-offset-4 cursor-pointer">$340.08</h3>
               </div>
            </div>
         </div>

         {/* Services Enrolled */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
               <Package className="w-5 h-5 text-blue-600" />
               <h2 className="text-lg font-bold text-slate-900">Services Enrolled</h2>
            </div>

            <div className="flex-1 space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <div>
                       <p className="text-sm font-bold text-slate-800">{currentPlan} Plan</p>
                       <div className="flex items-center space-x-2">
                         <span className="text-xs text-slate-500">Monthly</span>
                         <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">Active</span>
                       </div>
                   </div>
                   <div className="text-sm font-bold text-slate-900">${plans.find(p => p.id === currentPlan)?.price.toFixed(2)}</div>
               </div>
               {addons.storage && (
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                       <div>
                           <p className="text-sm font-bold text-slate-800">Storage Add-on (50GB)</p>
                           <span className="text-xs text-slate-500">Monthly</span>
                       </div>
                       <div className="text-sm font-bold text-slate-900">$10.00</div>
                   </div>
               )}
               {addons.agent && (
                   <div className="flex justify-between items-center py-2 border-b border-slate-50">
                       <div>
                           <p className="text-sm font-bold text-slate-800">Extra Agent Slot</p>
                           <span className="text-xs text-slate-500">Monthly</span>
                       </div>
                       <div className="text-sm font-bold text-slate-900">$15.00</div>
                   </div>
               )}
            </div>

            <div className="pt-4 mt-auto border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-600">Total Monthly Fixed</span>
                    <span className="text-xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
                </div>
                
                <button 
                    onClick={() => setShowSubscriptionModal(true)}
                    className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50 py-2.5 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                >
                    Manage Subscriptions
                </button>
            </div>
         </div>
      </div>

      {/* --- CHART SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-slate-900">Cost breakdown</h2>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Info</span>
               </div>
               
               <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">Group costs by</span>
                  <select className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500">
                     <option>Service</option>
                     <option>Date</option>
                  </select>
               </div>
            </div>

            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                     data={usageData}
                     margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                     <Tooltip 
                        formatter={(value) => [`$${value}`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f8fafc'}}
                     />
                     <Legend 
                        iconType="circle" 
                        wrapperStyle={{ paddingTop: '20px' }}
                     />
                     {services.map((service) => (
                        <Bar 
                           key={service.key} 
                           dataKey={service.key} 
                           name={service.label} 
                           stackId="a" 
                           fill={service.color} 
                        />
                     ))}
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Payment Section */}
         <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col justify-between">
               <div>
                  <div className="flex items-center space-x-2 mb-4">
                     <h2 className="text-lg font-bold text-slate-900">Payment & Invoices</h2>
                     <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Secure</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mb-6">
                     <p className="text-sm font-medium text-slate-500 mb-2">Total Amount Due</p>
                     <h3 className="text-4xl font-bold text-slate-900">$1,094.60</h3>
                     <p className="text-xs text-red-500 mt-2 font-medium">Due by Nov 30, 2025</p>
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                        <span>Invoice #INV-2025-001</span>
                        <span className="text-slate-400">$340.08 (Paid)</span>
                     </div>
                     <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                         <span>Invoice #INV-2025-002</span>
                         <span className="text-red-500 font-medium">Unpaid</span>
                     </div>
                  </div>
               </div>
               
               <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors mt-6 flex items-center justify-center shadow-lg shadow-indigo-100"
               >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Your Bill
               </button>
            </div>
         </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center">
                 <Lock className="w-4 h-4 mr-2 text-green-400" />
                 Secure Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-12 text-center">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                 <p className="text-slate-500">Transaction ID: TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                 <p className="text-slate-500 mt-2 text-sm">Thank you for your payment.</p>
              </div>
            ) : (
              <div className="flex">
                <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-2 space-y-1">
                   {[
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI / VPA', icon: Smartphone },
                      { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                      { id: 'gateway', label: 'Payment Gateway', icon: Globe },
                   ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-xs font-medium flex items-center space-x-3 transition-colors ${
                           paymentMethod === m.id ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                         <m.icon className="w-4 h-4" />
                         <span>{m.label}</span>
                      </button>
                   ))}
                </div>

                <div className="w-2/3 p-6">
                   <div className="mb-6">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Paying Amount</p>
                      <div className="text-2xl font-bold text-slate-900">$1,094.60</div>
                   </div>

                   <form onSubmit={handlePay} className="space-y-4">
                      {paymentMethod === 'card' && (
                         <div className="space-y-3 animate-fadeIn">
                            <div>
                               <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                               <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                               <div>
                                  <label className="block text-xs font-medium text-slate-700 mb-1">Expiry</label>
                                  <input required type="text" placeholder="MM/YY" className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                               </div>
                               <div>
                                  <label className="block text-xs font-medium text-slate-700 mb-1">CVV</label>
                                  <input required type="text" placeholder="123" maxLength={3} className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                               </div>
                            </div>
                         </div>
                      )}
                      
                      {/* Simplified other methods for brevity */}
                      {(paymentMethod === 'upi' || paymentMethod === 'netbanking') && (
                          <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded">
                             Redirecting to secure gateway...
                          </div>
                      )}

                      <div className="pt-4">
                         <button 
                           type="submit" 
                           disabled={isProcessing}
                           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                         >
                            {isProcessing ? (
                               <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                               </>
                            ) : (
                               'Pay Now'
                            )}
                         </button>
                      </div>
                   </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUBSCRIPTION MANAGEMENT MODAL --- */}
      {showSubscriptionModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden h-[90vh] flex flex-col">
               <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center shrink-0">
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900">Manage Subscription</h2>
                     <p className="text-slate-500">Upgrade your plan to unlock more agents and features.</p>
                  </div>
                  <button onClick={() => setShowSubscriptionModal(false)} className="text-slate-400 hover:text-slate-600">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                  
                  {/* Plan Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     {plans.map(plan => (
                        <div 
                           key={plan.id}
                           onClick={() => setCurrentPlan(plan.id)}
                           className={`relative rounded-2xl p-6 cursor-pointer transition-all ${
                              currentPlan === plan.id 
                                 ? 'bg-white border-2 border-blue-600 shadow-xl scale-105 z-10' 
                                 : 'bg-white border border-slate-200 hover:border-blue-300 opacity-80 hover:opacity-100'
                           }`}
                        >
                           {currentPlan === plan.id && (
                              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                 <div className="bg-blue-600 text-white rounded-full p-1 shadow-md">
                                    <Check className="w-4 h-4" />
                                 </div>
                              </div>
                           )}
                           <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.id}</h3>
                           <div className="flex items-baseline mb-6">
                              <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                              <span className="text-slate-500 ml-1">/mo</span>
                           </div>
                           <ul className="space-y-3 mb-6">
                              {plan.features.map((feat, i) => (
                                 <li key={i} className="flex items-center text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                                    {feat}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}
                  </div>

                  {/* Add-ons */}
                  <div className="max-w-3xl mx-auto">
                     <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        Power-Ups & Add-ons
                     </h3>
                     <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                                 <HardDrive className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900">50GB Cloud Storage</h4>
                                 <p className="text-sm text-slate-500">Store more call recordings and knowledge base files.</p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-4">
                              <span className="font-bold text-slate-900">$10/mo</span>
                              <button 
                                 onClick={() => setAddons(prev => ({...prev, storage: !prev.storage}))}
                                 className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${addons.storage ? 'bg-blue-600' : 'bg-slate-200'}`}
                              >
                                 <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${addons.storage ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                           </div>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <div className="p-2 bg-green-50 rounded text-green-600">
                                 <Smartphone className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900">Extra AI Agent Slot</h4>
                                 <p className="text-sm text-slate-500">Deploy an additional autonomous agent.</p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-4">
                              <span className="font-bold text-slate-900">$15/mo</span>
                              <button 
                                 onClick={() => setAddons(prev => ({...prev, agent: !prev.agent}))}
                                 className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${addons.agent ? 'bg-blue-600' : 'bg-slate-200'}`}
                              >
                                 <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${addons.agent ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Footer / Checkout Bar */}
               <div className="bg-white border-t border-slate-200 p-6 flex justify-between items-center shrink-0">
                  <div>
                     <p className="text-sm font-medium text-slate-500">New Monthly Total</p>
                     <p className="text-3xl font-bold text-slate-900">${calculateTotal().toFixed(2)}</p>
                  </div>
                  <div className="flex space-x-3">
                     <button 
                        onClick={() => setShowSubscriptionModal(false)}
                        className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleUpdateSubscription}
                        disabled={isProcessing}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center disabled:opacity-70"
                     >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                        Confirm Changes
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default UsageBilling;
