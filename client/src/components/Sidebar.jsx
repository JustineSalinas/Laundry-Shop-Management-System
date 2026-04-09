import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: 'space_dashboard', label: 'Active Orders' },
        { path: '/records', icon: 'receipt_long', label: 'Records History' },
        { path: '/status', icon: 'timeline', label: 'Status Monitor' },
    ];

    return (
        <aside className="w-64 bg-surface-container-lowest/80 backdrop-blur-md border-r border-white/20 shadow-sm flex flex-col h-full sticky top-0">
            {/* Header / Brand */}
            <div className="p-8 flex flex-col items-center border-b border-outline-variant/10">
                <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <span className="material-symbols-outlined text-primary text-3xl" data-icon="bubble_chart">bubble_chart</span>
                </div>
                <h1 className="text-xl font-black tracking-tighter text-on-surface">LaundryEase</h1>
                <p className="text-xs text-secondary font-medium tracking-widest uppercase mt-1">Staff Portal</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                                isActive 
                                    ? 'bg-primary-container/40 text-primary shadow-sm border border-primary/10' 
                                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-6 border-t border-outline-variant/10">
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-error hover:bg-error-container/50 px-4 py-3 rounded-xl transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
