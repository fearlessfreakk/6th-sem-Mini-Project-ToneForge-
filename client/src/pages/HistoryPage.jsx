import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, Clock } from 'lucide-react';

const HistoryPage = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const catColors = {
        business: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30',
        academic: 'bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30',
        corporate: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30',
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

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-gray-500 dark:text-gray-400">Loading history...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Clock className="text-indigo-600" /> Forge History
                </h1>

                {history.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No entries yet.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Go to the editor to start forging!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {history.map((item) => (
                            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${catColors[item.category || 'business'] || 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/30'
                                            }`}>
                                            {item.category || item.tone || 'business'}
                                        </span>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-xs">
                                            {item.subject || 'No Subject'}
                                        </h3>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Original Body</h3>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm border border-gray-100 dark:border-gray-700 h-full">
                                            {item.originalText}
                                        </p>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Forged Text</h3>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/20 h-full">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm pr-8 whitespace-pre-wrap">
                                                {item.formalizedText}
                                            </p>
                                            <button
                                                onClick={() => handleCopy(item.formalizedText, item._id)}
                                                className="absolute top-8 right-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                                title="Copy to clipboard"
                                            >
                                                {copiedId === item._id ? <Check size={18} className="text-teal-500" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
