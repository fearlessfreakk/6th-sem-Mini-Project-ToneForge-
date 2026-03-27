import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Copy, Check, AlertTriangle, Clock, ShieldAlert, ScrollText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RiskBadge = ({ level }) => {
    const colors = {
        low: 'bg-green-500/10 text-green-500 border-green-500/20',
        medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        high: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${colors[level.toLowerCase()] || colors.medium}`}>
            {level} Risk
        </span>
    );
};

const LegalPage = () => {
    const [rawEmail, setRawEmail] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [rawEmail]);

    const { user } = useAuth();

    const handleParse = async () => {
        if (!rawEmail.trim()) return;
        if (!user || !user.token) {
            setError("You are not properly logged in.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            console.log("Starting analysis for:", rawEmail.substring(0, 50) + "...");
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/parse_legal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ raw_email: rawEmail }),
            });

            console.log("Response status:", response.status);
            const contentType = response.headers.get("content-type");
            let data;
            
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
            }

            if (!response.ok) {
                console.error("Backend error:", data);
                throw new Error(data.error || data.message || `Error ${response.status}: ${JSON.stringify(data)}`);
            }

            setResult(data);
            console.log("Analysis successful");

        } catch (err) {
            console.error("Parsing failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2.5rem] shadow-2xl overflow-hidden border-indigo-500/10 mb-12"
                >
                    <div className="p-8 md:p-12 space-y-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 font-display">Legal Analysis</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Upload contracts or legal emails to extract key terms and risks.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Legal Content</label>
                                <textarea
                                    ref={textareaRef}
                                    name="raw_email"
                                    value={rawEmail}
                                    onChange={(e) => {
                                        setRawEmail(e.target.value);
                                        adjustHeight();
                                    }}
                                    placeholder="Paste the contract text or legal email here..."
                                    className="w-full min-h-[200px] px-6 py-6 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 dark:border-indigo-500/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all duration-300 text-gray-900 dark:text-gray-100 font-medium placeholder-gray-400 shadow-inner"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleParse}
                            disabled={loading || !rawEmail.trim()}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Analyzing Legal Terms...</span>
                                </>
                            ) : (
                                <>
                                    <span>Analyze Legal Content</span>
                                    <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {(result || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-8"
                        >
                            {error ? (
                                <div className="glass rounded-[2rem] border-2 border-red-500/20 bg-red-50/50 overflow-hidden p-10 text-center text-red-500">
                                    <p className="font-black uppercase tracking-widest mb-2">Analysis Failed</p>
                                    <p className="text-sm font-medium opacity-80">{error}</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Top Section: Executive Summary Full Width */}
                                    <div className="glass rounded-[2.5rem] border-2 border-indigo-500/10 overflow-hidden flex flex-col shadow-xl">
                                        <div className="p-8 border-b border-indigo-500/5 flex items-center justify-between bg-indigo-50/10">
                                            <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                                <ScrollText className="text-indigo-500" size={20} />
                                                Executive Summary
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overall Risk</span>
                                                <RiskBadge level={result.overall_risk} />
                                            </div>
                                        </div>
                                        <div className="p-8 md:p-10">
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl font-medium italic">
                                                "{result.plain_summary}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Grid Section: Obligations, Deadlines, Risks */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Obligations */}
                                        <div className="glass rounded-[2rem] border-2 border-indigo-500/10 overflow-hidden min-h-[250px] shadow-lg">
                                            <div className="p-6 border-b border-indigo-500/5 bg-indigo-50/30 dark:bg-indigo-950/20">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                                    <Check size={16} /> Key Obligations
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                {result.obligations.length > 0 ? result.obligations.slice(0, 5).map((item, i) => (
                                                    <div key={i} className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                        <div className="mt-1 w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                                                        {item}
                                                    </div>
                                                )) : <p className="text-[10px] text-gray-400 italic">No specific obligations identified.</p>}
                                                {result.obligations.length > 5 && <p className="text-[10px] text-indigo-500 font-bold">+ {result.obligations.length - 5} more...</p>}
                                            </div>
                                        </div>

                                        {/* Deadlines */}
                                        <div className="glass rounded-[2rem] border-2 border-amber-500/10 overflow-hidden min-h-[250px] shadow-lg">
                                            <div className="p-6 border-b border-amber-500/5 bg-amber-50/30 dark:bg-amber-950/20">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                                    <Clock size={16} /> Deadlines
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                {result.deadlines.length > 0 ? result.deadlines.slice(0, 5).map((item, i) => (
                                                    <div key={i} className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                        <div className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                                        {item}
                                                    </div>
                                                )) : <p className="text-[10px] text-gray-400 italic">No specific deadlines identified.</p>}
                                                {result.deadlines.length > 5 && <p className="text-[10px] text-amber-500 font-bold">+ {result.deadlines.length - 5} more...</p>}
                                            </div>
                                        </div>

                                        {/* Risk Flags */}
                                        <div className="glass rounded-[2rem] border-2 border-red-500/10 overflow-hidden min-h-[250px] shadow-lg">
                                            <div className="p-6 border-b border-red-500/5 bg-red-50/30 dark:bg-red-950/20">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400 flex items-center gap-2">
                                                    <AlertTriangle size={16} /> Risk Flags
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-3">
                                                {result.risk_flags.length > 0 ? result.risk_flags.slice(0, 5).map((item, i) => (
                                                    <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                                        <ChevronRight size={10} /> {item}
                                                    </div>
                                                )) : <p className="text-[10px] text-gray-400 italic text-center py-4">No major risk flags detected.</p>}
                                                {result.risk_flags.length > 5 && <p className="text-[10px] text-red-500 font-bold text-center">+ {result.risk_flags.length - 5} more...</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Scanned Clauses Horizontal Box */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-4">
                                            <FileText className="text-purple-500" size={20} />
                                            <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white font-display">
                                                Scanned Clauses
                                            </h3>
                                            <div className="h-[1px] bg-indigo-500/10 flex-grow ml-4"></div>
                                        </div>
                                        
                                        <div className="relative group/scroll">
                                            <div className="flex overflow-x-auto gap-6 pb-8 px-4 custom-horizontal-scrollbar snap-x">
                                                {result.clauses.length > 0 ? result.clauses.map((clause, i) => (
                                                    <motion.div 
                                                        key={i} 
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="min-w-[320px] md:min-w-[400px] bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-[2rem] border border-indigo-500/10 p-6 flex flex-col gap-4 shadow-xl snap-center hover:border-purple-500/30 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                                    <ScrollText size={12} />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase text-purple-500 tracking-widest">{clause.clause_type}</span>
                                                            </div>
                                                            <RiskBadge level={clause.risk_level} />
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-purple-500/20 rounded-full"></div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic pl-4">
                                                                "{clause.text}"
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )) : (
                                                    <div className="w-full py-12 text-center text-gray-400 glass rounded-[2rem] italic text-sm">
                                                        No specific legal clauses extracted for display.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <style sx>{`
                .custom-horizontal-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-horizontal-scrollbar::-webkit-scrollbar-track {
                    background: rgba(99, 102, 241, 0.05);
                    border-radius: 10px;
                    margin: 0 40px;
                }
                .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.2);
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.4);
                }
            `}</style>
        </div>
    );
};

export default LegalPage;
