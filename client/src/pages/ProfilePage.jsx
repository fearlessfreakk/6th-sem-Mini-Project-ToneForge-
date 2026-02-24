import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, BarChart2 } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
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

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-gray-500 dark:text-gray-400">Loading profile...</div>;

    if (!profile) return <div className="min-h-screen pt-20 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-indigo-600 h-32 relative">
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1">
                                <div className="w-full h-full rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                                    {profile.email[0].toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">User Profile</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage your account details and view your activity.</p>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <Mail className="text-indigo-500 mr-4" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">Email Address</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">{profile.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <Calendar className="text-purple-500 mr-4" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">Joined On</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                                        {new Date(profile.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <BarChart2 className="text-green-500 mr-4" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">Total Conversions</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{profile.conversionCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
