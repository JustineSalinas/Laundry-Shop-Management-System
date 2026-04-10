import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const [role, setRole] = React.useState(localStorage.getItem('role') || 'staff');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: 'space_dashboard', label: 'Active Orders' },
        { path: '/records', icon: 'receipt_long', label: 'Records History' },
        { path: '/status', icon: 'timeline', label: 'Status Monitor' },
    ];

    if (role === 'admin') {
        navItems.push({ path: '/staff', icon: 'admin_panel_settings', label: 'Staff Management' });
    }

    return (
        <aside className="sidebar-container">
            {/* Header / Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#0062a1' }}>bubble_chart</span>
                </div>
                <h1 className="sidebar-app-name">LaundryEase</h1>
                <p className="sidebar-portal-label">STAFF PORTAL</p>
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
                        }
                    >
                        <span className="material-symbols-outlined sidebar-nav-icon">{item.icon}</span>
                        <span className="sidebar-nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="sidebar-footer">
                <button 
                    onClick={handleLogout} 
                    className="sidebar-logout-btn"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
