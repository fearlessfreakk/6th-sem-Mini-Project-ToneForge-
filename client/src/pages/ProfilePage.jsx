import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, BarChart2, Shield, Settings, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center p-5 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-indigo-500/20 group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
            <Icon size={24} />
        </div>
        <div className="flex flex-col min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest leading-none mb-1">{label}</p>
            <p className="text-gray-900 dark:text-gray-100 font-bold text-lg truncate" title={value}>{value}</p>
        </div>
    </div>
);

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
            <div className="glass p-8 rounded-[2rem] text-center border-red-500/10 max-w-sm">
                <Shield size={40} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Access Error</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">We couldn't retrieve your profile data. Please try logging in again.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[3rem] overflow-hidden shadow-2xl border-indigo-500/10"
                >
                    {/* Header/Cover */}
                    <div className="h-40 bg-gradient-to-r from-indigo-600 to-indigo-800 relative">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <div className="absolute -bottom-14 left-10">
                            <div className="w-28 h-28 rounded-[2rem] bg-white dark:bg-gray-950 p-1.5 shadow-2xl rotate-3">
                                <div className="w-full h-full rounded-[1.7rem] bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-4xl font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                                    {profile.email[0].toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-10 px-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100 dark:border-indigo-800">
                                    <Sparkles size={12} />
                                    Forge Member
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter font-display">
                                    {profile.email.split('@')[0]}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight mt-1">
                                    Refining communication since {new Date(profile.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center p-5 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-indigo-500/20 group gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-indigo-500 bg-indigo-500 bg-opacity-10 shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Primary Email</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-bold text-lg break-all">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-5 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-indigo-500/20 group gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-teal-500 bg-teal-500 bg-opacity-10 shrink-0">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Forged Counts</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">{profile.conversionCount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-5 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-indigo-500/20 group gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-500 bg-purple-500 bg-opacity-10 shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Member Status</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;

