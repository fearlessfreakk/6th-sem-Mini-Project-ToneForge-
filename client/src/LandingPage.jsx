import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Now with Tone Selection
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
                        Forge the Perfect <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 dark:from-indigo-400 dark:via-purple-400 dark:to-teal-300">Communication.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                        Stop overthinking your emails. ToneForgeAI uses advanced AI to instantly rewrite your text into polite, professional communication.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button
                            onClick={() => navigate('/editor')}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
                        >
                            Get Started Free <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 text-lg shadow-sm"
                        >
                            How it works
                        </button>
                    </div>

                    {/* Simple abstract visual or gradient element behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 opacity-60"></div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Professionals Choose ToneForgeAI</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Streamline your workflow with tools designed for modern communication.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="text-amber-500" size={32} />}
                            title="Instant Conversion"
                            description="Draft messy notes and get polished emails in seconds. Save hours every week."
                        />
                        <FeatureCard
                            icon={<Shield className="text-indigo-500" size={32} />}
                            title="Tailored Tones"
                            description="Choose between Business, Academic, or Corporate tones to match your professional context."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="text-green-500" size={32} />}
                            title="Communication History"
                            description="Access all your past formalizations in one secure place. Never lose a great draft."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works (Simple Steps) */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Effortless workflow for <br />
                                <span className="text-blue-600 dark:text-blue-500">busy teams.</span>
                            </h2>
                            <div className="space-y-8">
                                <Step
                                    number="01"
                                    title="Write Naturally"
                                    description="Don't worry about grammar or tone. Just jot down your thoughts as they come."
                                />
                                <Step
                                    number="02"
                                    title="Choose Your Tone"
                                    description="Select Business for emails, Academic for papers, or Corporate for internal memos."
                                />
                                <Step
                                    number="03"
                                    title="Copy & Send"
                                    description="Get the perfect email instantly. Copy it with one click and you're done."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            {/* Abstract decorative element representing the UI */}
                            <div className="relative rounded-2xl bg-gray-900 shadow-2xl overflow-hidden border border-gray-800 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-gray-800 rounded-xl p-6 h-80 flex flex-col gap-4">
                                    <div className="w-1/3 h-4 bg-gray-700 rounded-full animate-pulse"></div>
                                    <div className="w-full h-32 bg-gray-700/50 rounded-lg p-4">
                                        <div className="w-full h-full bg-gray-800 rounded-md"></div>
                                    </div>
                                    <div className="w-full h-12 bg-blue-600 rounded-lg opacity-90"></div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-blue-500/30 rounded-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-950 py-12 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                    <div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            ToneForge<span className="text-indigo-600">AI</span>
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Making professional communication accessible to everyone.
                        </p>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-600 dark:text-gray-400">
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy</a>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms</a>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 group">
        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
        </p>
    </div>
);

const Step = ({ number, title, description }) => (
    <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20">
            {number}
        </div>
        <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    </div>
);

export default LandingPage;
