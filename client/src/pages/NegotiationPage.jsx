import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Handshake, 
    Users, 
    MessageSquare, 
    ChevronRight, 
    AlertCircle, 
    CheckCircle2, 
    XCircle,
    ArrowRight,
    Gavel,
    Briefcase,
    Building2,
    History as HistoryIcon,
    Mail,
    Send,
    Sparkles
} from 'lucide-react';

const NegotiationPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        topic: '',
        our_position: '',
        their_position: '',
        category: 'business',
        max_rounds: 3
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'thread'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.token) {
            setError("Session expired. Please login again.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:5000/api/negotiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Negotiation analysis failed');
            }

            setResult(data);
            setActiveTab('summary');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                                <Handshake size={14} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Negotiation Forge</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 font-display">
                                Strategic Analysis
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                Outline your negotiation scenario. AI will simulate the exchange and generate the optimal response strategy.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="glass rounded-[2rem] border border-indigo-500/10 p-8 space-y-6 shadow-xl shadow-indigo-500/5">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Negotiation Topic</label>
                                <input 
                                    type="text"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Salary Increase, Vendor Pricing..."
                                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 focus:border-indigo-500/30 rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                                    <div className="relative">
                                        <select 
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full appearance-none px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 focus:border-indigo-500/30 rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 dark:text-white cursor-pointer"
                                        >
                                            <option value="business">Business</option>
                                            <option value="corporate">Corporate</option>
                                        </select>
                                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Max Rounds</label>
                                    <div className="relative">
                                        <select 
                                            name="max_rounds"
                                            value={formData.max_rounds}
                                            onChange={handleInputChange}
                                            className="w-full appearance-none px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 focus:border-indigo-500/30 rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 dark:text-white cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num} Iterations</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Our Position / Initial Offer</label>
                                <textarea 
                                    name="our_position"
                                    value={formData.our_position}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    placeholder="State your goals and initial demand..."
                                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 focus:border-indigo-500/30 rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Their Position / Counter Offer</label>
                                <textarea 
                                    name="their_position"
                                    value={formData.their_position}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    placeholder="Describe their likely resistance or current offer..."
                                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 focus:border-indigo-500/30 rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Forging Strategy...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Analyze & Generate</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-red-500 flex items-start gap-4"
                                >
                                    <AlertCircle className="shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="font-black uppercase tracking-widest text-[10px] mb-1">Analysis Error</p>
                                        <p className="text-sm font-bold">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            {result ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Tabs */}
                                    <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit">
                                        <button 
                                            onClick={() => setActiveTab('summary')}
                                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'summary' ? 'bg-white dark:bg-indigo-600 shadow-lg text-indigo-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                        >
                                            Summary
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('thread')}
                                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'thread' ? 'bg-white dark:bg-indigo-600 shadow-lg text-indigo-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                        >
                                            Email Thread
                                        </button>
                                    </div>

                                    {activeTab === 'summary' ? (
                                        <div className="space-y-6">
                                            {/* Status Card */}
                                            <div className="glass rounded-[2rem] p-8 border border-indigo-500/10 shadow-xl overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                                    {result.agreement_reached ? <CheckCircle2 size={120} /> : <Handshake size={120} />}
                                                </div>
                                                
                                                <div className="relative z-10 flex flex-col gap-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-xl ${result.agreement_reached ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                                {result.agreement_reached ? <CheckCircle2 size={24} /> : <Handshake size={24} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                                                <p className="text-xl font-black text-gray-900 dark:text-white">
                                                                    {result.agreement_reached ? 'Agreement Reached' : 'Ongoing Discussion'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Iterations</p>
                                                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{result.rounds_completed} Rounds</p>
                                                        </div>
                                                    </div>

                                                    <div className="h-px bg-indigo-500/10" />

                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Executive Summary</p>
                                                        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg leading-relaxed italic">
                                                            "{result.summary}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actionable Points */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
                                                    <Briefcase size={24} className="mb-4 text-indigo-200" />
                                                    <h3 className="font-black uppercase tracking-widest text-[10px] mb-2 opacity-80">Strategic Edge</h3>
                                                    <p className="text-sm font-bold">The AI has identified 3 key points for your next follow-up to maintain leverage.</p>
                                                </div>
                                                <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-indigo-500/10 shadow-xl">
                                                    <Users size={24} className="mb-4 text-indigo-500" />
                                                    <h3 className="font-black uppercase tracking-widest text-[10px] mb-2 text-gray-400">Tone Advice</h3>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Recommended Tone: Firm but Collaborative.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {result.email_thread.map((email, index) => (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, x: email.role === 'proposer' ? -20 : 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`max-w-[85%] ${email.role === 'proposer' ? 'mr-auto' : 'ml-auto'}`}
                                                >
                                                    <div className={`p-1 rounded-[1.5rem] ${email.role === 'proposer' ? 'bg-gradient-to-br from-indigo-500/20 to-transparent' : 'bg-gradient-to-br from-gray-200 to-transparent dark:from-white/10'}`}>
                                                        <div className="bg-white dark:bg-gray-900 rounded-[1.4rem] p-6 shadow-sm">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${email.role === 'proposer' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white'}`}>
                                                                        {email.role === 'proposer' ? <Send size={14} /> : <Mail size={14} />}
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                                        {email.role === 'proposer' ? 'Our Draft' : 'Their Response'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-black text-gray-900 dark:text-white mb-2">{email.subject}</p>
                                                            <div className="h-px bg-gray-100 dark:bg-white/5 my-3" />
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">
                                                                {email.body}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ) : !loading && (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
                                    <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6 text-gray-300 dark:text-gray-700">
                                        <Handshake size={48} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Ready to Forge?</h3>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Fill in the negotiation details on the left to see the strategic analysis and email drafts.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="text-indigo-600 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-black text-gray-900 dark:text-white animate-pulse">Running Simulation...</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Iterating through {formData.max_rounds} rounds of strategy</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NegotiationPage;
