import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Copy, Check, ArrowLeft, Mail } from 'lucide-react';

const EditorPage = () => {
    const [formData, setFormData] = useState({
        subject: '',
        recipient: '',
        sender: '',
        raw_email: '',
        category: 'business' // Default category
    });
    const [outputText, setOutputText] = useState('');
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

        setLoading(true);
        setError('');
        setOutputText('');

        try {
            const response = await fetch('http://localhost:5000/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to convert text');
            }

            setOutputText(data.formal_text || data.converted_text || JSON.stringify(data));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <Link
                    to="/"
                    className="mb-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition flex items-center gap-2 inline-block font-medium"
                >
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Header Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="quick question about the weekend!!"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</label>
                                    <input
                                        type="text"
                                        name="recipient"
                                        value={formData.recipient}
                                        onChange={handleChange}
                                        placeholder="Alex"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sender</label>
                                    <input
                                        type="text"
                                        name="sender"
                                        value={formData.sender}
                                        onChange={handleChange}
                                        placeholder="Jamie"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Body Input */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Body</label>
                            <textarea
                                ref={textareaRef}
                                name="raw_email"
                                value={formData.raw_email}
                                onChange={(e) => {
                                    handleChange(e);
                                    adjustHeight();
                                }}
                                placeholder="Hey Alex! Hope you're doing good. I was just wondering if we're still on for that hike on Saturday?..."
                                className="w-full min-h-[160px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-inner"
                            />
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 italic">
                                💡 Tip: Type <span className="font-mono font-bold text-indigo-500">MOCK_TEST</span> to receive a dummy response for verification.
                            </p>
                        </div>

                        {/* Transformation Mode */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Tone (Category)</label>
                            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                                {['business', 'academic', 'corporate'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 capitalize ${formData.category === cat
                                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg scale-[1.02]' // Active state
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {cat === 'business' && <Mail size={16} />}
                                        {cat === 'academic' && <Sparkles size={16} />}
                                        {cat === 'corporate' && <MessageSquare size={16} />}
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleConvert}
                            disabled={loading || !formData.raw_email.trim()}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                    Forging your perfect email...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Forge Email <Sparkles size={18} />
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                {(outputText || error) && (
                    <div className="mt-8 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Mail className="text-indigo-500" /> Transformed Email
                            </h2>
                            {outputText && !error && (
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Sparkles size={12} /> Generated Successfully
                                </div>
                            )}
                        </div>

                        <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border ${error ? 'border-red-200 dark:border-red-900' : 'border-gray-100 dark:border-gray-700'} overflow-hidden`}>
                            {error ? (
                                <div className="p-8 text-center text-red-500 dark:text-red-400">
                                    <p className="font-semibold">Transformation Failed</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors"
                                        >
                                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="p-8">
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-sans text-base">
                                                {outputText}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorPage;
