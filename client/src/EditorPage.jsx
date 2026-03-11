import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Copy, Check, ArrowLeft, Mail, Send, Wand2, GraduationCap, Building2, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToneCard = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 border ${active
            ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white scale-[1.05] z-10'
            : 'bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-500/30'
            }`}
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <Icon size={20} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        {active && (
            <motion.div
                layoutId="activeTone"
                className="absolute inset-0 border-2 border-indigo-400 rounded-2xl pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
);

const EditorPage = () => {
    const [formData, setFormData] = useState({
        raw_email: '',
        category: 'business',
        language: 'english'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
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
    }, [formData.raw_email]);

    const { user } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleCategory = (selectedCategory) => {
        setFormData({ ...formData, category: selectedCategory });
    };

    const handleConvert = async () => {
        if (!formData.raw_email.trim()) return;
        if (!user || !user.token) {
            setError("You are not properly logged in. Please log out and log back in.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:5000/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    raw_email: formData.raw_email,
                    category: formData.category,
                    language: formData.language
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(data.error || 'Session expired or invalid. Please log in again.');
                }
                throw new Error(data.error || 'Failed to convert text');
            }

            setResult(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2.5rem] shadow-2xl overflow-hidden border-indigo-500/10"
                >
                    <div className="p-8 md:p-12 space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-indigo-500/10">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 font-display">Forge Excellence</h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Draft your message and let the forge refine it.</p>
                            </div>
                            <div className="flex gap-3">
                                <ToneCard id="business" label="Business" icon={Mail} active={formData.category === 'business'} onClick={toggleCategory} />
                                <ToneCard id="academic" label="Academic" icon={GraduationCap} active={formData.category === 'academic'} onClick={toggleCategory} />
                                <ToneCard id="corporate" label="Corporate" icon={Building2} active={formData.category === 'corporate'} onClick={toggleCategory} />
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Draft Content</label>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-indigo-500/10">
                                        <Languages size={14} className="text-indigo-500" />
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 outline-none cursor-pointer"
                                        >
                                            <option value="english">English (Default)</option>
                                            <option value="spanish">Spanish</option>
                                            <option value="french">French</option>
                                            <option value="german">German</option>
                                            <option value="hindi">Hindi</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    name="raw_email"
                                    value={formData.raw_email}
                                    onChange={(e) => {
                                        handleChange(e);
                                        adjustHeight();
                                    }}
                                    placeholder="Hey Alex, hope you're good. Can you check that report? Thanks!"
                                    className="w-full min-h-[320px] px-6 py-6 bg-gray-50/50 dark:bg-gray-900/50 border border-indigo-500/5 dark:border-indigo-500/10 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all duration-300 text-gray-900 dark:text-gray-100 font-medium placeholder-gray-400 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <button
                                onClick={handleConvert}
                                disabled={loading || !formData.raw_email.trim()}
                                className="w-full md:flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Forging Brilliance...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Forge Formalization</span>
                                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-xl border border-indigo-500/5">
                                <Wand2 size={14} className="text-indigo-500" />
                                Model: Forge-V1 Elite
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Output Section */}
                <AnimatePresence mode="wait">
                    {(result || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-12 space-y-8"
                        >
                            {error ? (
                                <div className="glass rounded-[2rem] border-2 border-red-500/20 bg-red-50/50 overflow-hidden relative group">
                                    <div className="p-10 text-center text-red-500">
                                        <p className="font-black uppercase tracking-widest mb-2">Forge Interrupted</p>
                                        <p className="text-sm font-medium opacity-80">{error}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Formalized Result */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 font-display tracking-tight uppercase">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                    <Check className="text-indigo-500" size={18} />
                                                </div>
                                                Refined Formal Email
                                            </h2>
                                            <button
                                                onClick={() => handleCopy(result.email?.body || result.email)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${copied
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700'
                                                    }`}
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                {copied ? 'Copied' : 'Copy Result'}
                                            </button>
                                        </div>
                                        <div className="glass rounded-[2rem] border-2 border-indigo-500/20 bg-indigo-50/10 overflow-hidden relative group p-10 md:p-12">
                                            <div className="absolute top-4 right-4 text-[8px] font-black text-indigo-500/40 uppercase tracking-[0.3em]">Tone: {result.category}</div>
                                            <div className="prose dark:prose-invert max-w-none">
                                                {result.email?.subject && (
                                                    <div className="mb-6 p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-indigo-500/5">
                                                        <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1">Subject</p>
                                                        <p className="font-bold text-gray-900 dark:text-white">{result.email.subject}</p>
                                                    </div>
                                                )}
                                                <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed font-medium text-lg">
                                                    {result.email?.body || (typeof result.email === 'string' ? result.email : '')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Translated Result */}
                                    {result.translated_email && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 font-display tracking-tight uppercase">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                        <Languages className="text-purple-500" size={18} />
                                                    </div>
                                                    Translated ({result.translated_email.language})
                                                </h2>
                                                <button
                                                    onClick={() => handleCopy(result.translated_email.body)}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                                                >
                                                    <Copy size={14} /> Copy Translation
                                                </button>
                                            </div>
                                            <div className="glass rounded-[2rem] border-2 border-purple-500/20 bg-purple-50/10 overflow-hidden relative group p-10 md:p-12">
                                                <div className="prose dark:prose-invert max-w-none">
                                                    {result.translated_email.subject && (
                                                        <div className="mb-6 p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-purple-500/5">
                                                            <p className="text-[8px] font-black text-purple-500 uppercase tracking-widest mb-1">Subject</p>
                                                            <p className="font-bold text-gray-900 dark:text-white">{result.translated_email.subject}</p>
                                                        </div>
                                                    )}
                                                    <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed font-medium text-lg italic">
                                                        {result.translated_email.body}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EditorPage;

