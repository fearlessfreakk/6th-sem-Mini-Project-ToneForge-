import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon, History, User, LogOut, LayoutGrid, PenTool, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ to, children, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`relative px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${active
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="navTab"
                className="absolute inset-0 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-none pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </Link>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-indigo-500/10 shadow-lg shadow-indigo-500/5'
                : 'py-6 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter font-display">
                                ToneForge<span className="text-indigo-600 group-hover:animate-pulse">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
                        {user && (
                            <>
                                <NavLink to="/editor" active={location.pathname === '/editor'}>Editor</NavLink>
                                <NavLink to="/legal" active={location.pathname === '/legal'}>Legal Analysis</NavLink>
                                <NavLink to="/negotiate" active={location.pathname === '/negotiate'}>Negotiation</NavLink>
                                <NavLink to="/history" active={location.pathname === '/history'}>History</NavLink>
                            </>
                        )}

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
                        >
                            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="relative group ml-2">
                                <button className="flex items-center gap-3 p-1 pr-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-indigo-500/5 hover:border-indigo-500/20 transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-3 w-56 glass rounded-[1.5rem] shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-indigo-500/10 scale-95 group-hover:scale-100">
                                    <div className="px-5 py-3 border-b border-indigo-500/5 mb-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated as</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors mx-2 rounded-xl">
                                        <User size={16} /> Profile Settings
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors mx-2 rounded-xl mt-1">
                                        <LogOut size={16} /> Secure Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-4">
                                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Login</Link>
                                <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">Join Forge</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button onClick={toggleTheme} className="p-2.5 rounded-xl text-gray-500">
                            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2.5 rounded-xl ${isMenuOpen ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5'}`}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-indigo-500/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-black text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tight">
                                <LayoutGrid size={20} /> Home
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/legal" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-black text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tight">
                                        <Gavel size={20} /> Legal Analysis
                                    </Link>
                                    <Link to="/negotiate" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-black text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tight">
                                        <Handshake size={20} /> Negotiation
                                    </Link>
                                    <Link to="/history" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-black text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tight">
                                        <History size={20} /> History
                                    </Link>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-black text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tight">
                                        <User size={20} /> Profile
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-lg font-black text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-tight">
                                        <LogOut size={20} /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center py-4 rounded-2xl font-black uppercase tracking-widest bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">Login</Link>
                                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center py-4 rounded-2xl font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

