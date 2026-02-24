import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, Clock, Search, Filter, Mail, GraduationCap, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const catInfo = {
        business: { color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Mail },
        academic: { color: 'text-teal-500', bg: 'bg-teal-500/10', icon: GraduationCap },
        corporate: { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Building2 },
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/history', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-4 font-display">
                            <Clock className="text-indigo-600" size={40} />
                            Audit Trail
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Your archive of forged excellence.</p>
                    </div>
                </motion.div>

                {history.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 glass rounded-[3rem] border-indigo-500/10"
                    >
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xl font-bold uppercase tracking-widest">The forge is cool.</p>
                        <p className="text-gray-400 dark:text-gray-500 font-medium mt-2">Start a new conversion to fill your history.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {history.map((item, index) => {
                            const cat = (item.category || 'business').toLowerCase();
                            const info = catInfo[cat] || catInfo.business;
                            const Icon = info.icon;

                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass rounded-[2rem] shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 border-indigo-500/10 overflow-hidden group"
                                >
                                    <div className="bg-gray-50/50 dark:bg-black/20 px-8 py-5 border-b border-indigo-500/5 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${info.bg} flex items-center justify-center ${info.color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white truncate max-w-xs font-display tracking-tight leading-none mb-1">
                                                    {item.subject || 'Untitled Forging'}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${info.color}`}>
                                                        {cat} Tone
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                        {getTimeAgo(item.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleCopy(item.formalizedText, item._id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${copiedId === item._id
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/10'
                                                }`}
                                        >
                                            {copiedId === item._id ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedId === item._id ? 'Copied' : 'Copy Forged'}
                                        </button>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                                Original Draft
                                            </label>
                                            <div className="p-5 bg-gray-50/50 dark:bg-black/10 rounded-2xl border border-gray-100 dark:border-gray-800/50 min-h-[120px]">
                                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic">
                                                    "{item.originalText}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                Refined Result
                                            </label>
                                            <div className="p-5 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10 min-h-[120px]">
                                                <p className="text-gray-900 dark:text-gray-100 text-sm font-bold leading-relaxed">
                                                    {item.formalizedText}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

