import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, ArrowRight, CheckCircle, Sparkles, Send, Copy, Languages, ShieldAlert, Clock, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from './context/AuthContext';

const LiveDemo = () => {
    const examples = [
        { casual: "hey can u send me that file by EOD?", formal: "Could you please send me the file by the end of the day?", tone: "Business" },
        { casual: "i'm gonna be late for the meet tomorrow sorry", formal: "I apologize, but I will be arriving late for our meeting tomorrow.", tone: "Corporate" },
        { casual: "this paper sucks i need help fixing it", formal: "I believe this manuscript requires significant revisions and would appreciate your assistance.", tone: "Academic" }
    ];

    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isFormalizing, setIsFormalizing] = useState(false);
    const [showFormal, setShowFormal] = useState(false);

    useEffect(() => {
        let timeout;
        const currentCasual = examples[index].casual;

        if (!isFormalizing && !showFormal) {
            if (displayText.length < currentCasual.length) {
                timeout = setTimeout(() => {
                    setDisplayText(currentCasual.slice(0, displayText.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setIsFormalizing(true), 1000);
            }
        }

        if (isFormalizing) {
            timeout = setTimeout(() => {
                setIsFormalizing(false);
                setShowFormal(true);
            }, 1500);
        }

        if (showFormal) {
            timeout = setTimeout(() => {
                setShowFormal(false);
                setDisplayText("");
                setIndex((prev) => (prev + 1) % examples.length);
            }, 4000);
        }

        return () => clearTimeout(timeout);
    }, [displayText, isFormalizing, showFormal, index]);

    return (
        <div className="w-full max-w-xl mx-auto glass rounded-2xl overflow-hidden shadow-2xl border-indigo-500/20">
            <div className="bg-gray-900/10 dark:bg-black/20 px-4 py-3 border-b border-indigo-500/10 flex items-center justify-between">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-indigo-500/60 dark:text-indigo-400">ToneForge Experience</div>
                <div className="w-12"></div>
            </div>
            <div className="p-6 space-y-4 h-[420px] flex flex-col justify-center">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Input</label>
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-indigo-500/5 h-[80px] text-gray-700 dark:text-gray-300 italic overflow-hidden">
                        {displayText}
                        {!isFormalizing && !showFormal && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse"></span>}
                    </div>
                </div>

                <div className="flex justify-center">
                    <motion.div
                        animate={isFormalizing ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
                        transition={isFormalizing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isFormalizing ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        <Sparkles size={20} className={isFormalizing ? 'text-white' : 'text-gray-400'} />
                    </motion.div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Formalized Result</label>
                        <AnimatePresence>
                            {showFormal && (
                                <motion.span
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                                >
                                    {examples[index].tone} Tone
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/20 h-[100px] text-gray-900 dark:text-white font-medium relative group overflow-hidden">
                        <AnimatePresence mode="wait">
                            {showFormal ? (
                                <motion.div
                                    key="formal"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="pr-8"
                                >
                                    {examples[index].formal}
                                    <Copy size={14} className="absolute right-4 top-4 text-indigo-400/50" />
                                </motion.div>
                            ) : isFormalizing ? (
                                <motion.div key="loading" className="flex gap-2 items-center text-indigo-500/60 italic text-sm">
                                    Forging excellence...
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/editor');
        } else {
            navigate('/signup');
        }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="w-full flex flex-col items-center"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100 dark:border-indigo-800">
                                <Sparkles size={14} className="animate-spin-slow" />
                                Next-Gen Tone Intelligence
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter mb-8 leading-[1.1] font-display">
                                Elite <span className="text-gradient">Professionalism.</span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                                Forget generic AI. ToneForgeAI crafts surgically precise communication that commands respect and gets results.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                                <button
                                    onClick={handleGetStarted}
                                    className="group w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                                >
                                    Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-2xl border-2 border-gray-100 dark:border-gray-800 transition-all duration-300 text-lg shadow-sm"
                                >
                                    Features
                                </button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative w-full max-w-2xl h-[450px] flex justify-center shrink-0"
                        >
                            <div className="w-full">
                                <LiveDemo />
                            </div>
                            {/* Decorative elements around demo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 rounded-full blur-[100px] -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 font-display">Engineered for Impact</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                            Every feature is designed to make your communication faster, smarter, and more effective.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <FeatureCard
                            index={0}
                            icon={<Zap className="text-indigo-500" size={28} />}
                            title="Instant Forging"
                            description="Turn rough notes into boardroom-ready emails in under 3 seconds. Speed meets quality."
                        />
                        <FeatureCard
                            index={1}
                            icon={<Languages className="text-indigo-500" size={28} />}
                            title="Global Reach"
                            description="Break language barriers with built-in professional translation for Spanish, French, German, and more."
                        />
                        <FeatureCard
                            index={2}
                            icon={<ShieldAlert className="text-indigo-500" size={28} />}
                            title="Legal Insight"
                            description="Upload contracts and let AI extract key obligations, critical deadlines, and identify hidden risks."
                        />
                        <FeatureCard
                            index={3}
                            icon={<Handshake className="text-indigo-500" size={28} />}
                            title="Strategic Negotiation"
                            description="Simulate entire negotiation rounds. Get AI-driven advice and ready-to-send counter-proposals."
                        />
                        <FeatureCard
                            index={4}
                            icon={<Clock className="text-indigo-500" size={28} />}
                            title="Audit Trail"
                            description="Experience a secure archive of every forging and legal analysis, fully synced and searchable."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-20 bg-indigo-600 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 relative z-10 font-display">Ready to sound <br /> legendary?</h2>
                        <button
                            onClick={handleGetStarted}
                            className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-lg hover:shadow-white/20 transition-all duration-300 text-xl relative z-10"
                        >
                            Start Your Journey
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-950 py-16 border-t border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="md:max-w-sm">
                        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                            ToneForge<span className="text-indigo-600">AI</span>
                        </span>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium leading-relaxed italic">
                            Redefining professional communication with surgical precision. Born to help you succeed.
                        </p>
                    </div>
                    <div className="flex gap-12 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                        <a href="#" className="hover:text-indigo-600 transition">Privacy</a>
                        <a href="#" className="hover:text-indigo-600 transition">Terms</a>
                        <a href="#" className="hover:text-indigo-600 transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="p-10 glass rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-indigo-500/5 group cursor-default w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.35rem)]"
    >
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 text-indigo-600">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter font-display">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;

