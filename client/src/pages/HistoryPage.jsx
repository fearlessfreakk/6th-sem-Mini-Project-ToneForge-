import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, Clock, Search, Mail, GraduationCap, Building2, ShieldAlert, FileText, ChevronRight, Languages, ScrollText } from 'lucide-react';
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
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto">
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
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Your archive of forged excellence and legal insights.</p>
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
                    <div className="grid grid-cols-1 gap-12">
                        {history.map((item, index) => {
                            const isLegal = item.type === 'legal';
                            const cat = (item.category || 'business').toLowerCase();
                            const info = catInfo[cat] || catInfo.business;
                            const Icon = isLegal ? ShieldAlert : info.icon;

                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass rounded-[2.5rem] shadow-xl border-indigo-500/10 overflow-hidden group"
                                >
                                    {/* Header */}
                                    <div className="bg-gray-50/50 dark:bg-black/20 px-8 py-6 border-b border-indigo-500/5 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl ${isLegal ? 'bg-red-500/10 text-red-500' : info.bg + ' ' + info.color} flex items-center justify-center shadow-inner`}>
                                                <Icon size={22} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white truncate max-w-sm font-display tracking-tight leading-none mb-2">
                                                    {isLegal ? 'Legal Analysis Report' : (item.subject || 'Untitled Forging')}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLegal ? 'text-red-500' : info.color}`}>
                                                        {isLegal ? `${item.overallRisk} Risk` : `${cat} Tone`}
                                                    </span>
                                                    {!isLegal && item.language && item.language !== 'english' && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                                            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-1">
                                                                <Languages size={10} /> {item.language}
                                                            </span>
                                                        </>
                                                    )}
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                                                        {getTimeAgo(item.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {!isLegal && (
                                            <button
                                                onClick={() => handleCopy(item.translatedBody || item.formalizedText, item._id)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${copiedId === item._id
                                                    ? 'bg-green-500 text-white shadow-green-500/20'
                                                    : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:scale-105'
                                                    }`}
                                            >
                                                {copiedId === item._id ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedId === item._id ? 'Copied' : 'Copy Final'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 md:p-10">
                                        {isLegal ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                <div className="lg:col-span-2 space-y-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                            <ScrollText size={14} /> Summary
                                                        </label>
                                                        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed italic">
                                                            "{item.plainSummary}"
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">Obligations</label>
                                                            <div className="space-y-3">
                                                                {item.obligations?.map((obj, i) => (
                                                                    <div key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium border-l-2 border-green-500/30 pl-3">
                                                                        {obj}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Deadlines</label>
                                                            <div className="space-y-3">
                                                                {item.deadlines?.map((dl, i) => (
                                                                    <div key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium border-l-2 border-amber-500/30 pl-3">
                                                                        {dl}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <label className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Risk Flags</label>
                                                    <div className="space-y-3">
                                                        {item.riskFlags?.map((flag, i) => (
                                                            <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-bold text-red-500 flex items-center gap-2">
                                                                <ChevronRight size={12} /> {flag}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                                        Original Draft
                                                    </label>
                                                    <div className="p-6 bg-gray-50/50 dark:bg-black/10 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 min-h-[150px]">
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic leading-relaxed">
                                                            "{item.originalText}"
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                        {item.translatedBody ? `Refined & Translated (${item.language})` : 'Refined Result'}
                                                    </label>
                                                    <div className={`p-6 rounded-[2rem] border-2 min-h-[150px] shadow-inner ${item.translatedBody ? 'bg-purple-500/5 border-purple-500/20' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                                                        {item.translatedSubject && (
                                                            <div className="mb-4 pb-4 border-b border-indigo-500/10">
                                                                <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1">Subject</p>
                                                                <p className="font-bold text-gray-900 dark:text-white leading-tight">{item.translatedSubject}</p>
                                                            </div>
                                                        )}
                                                        <p className={`text-gray-900 dark:text-gray-100 text-sm font-bold leading-relaxed ${item.translatedBody ? 'italic' : ''}`}>
                                                            {item.translatedBody || item.formalizedText}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
