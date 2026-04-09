import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="bg-background min-h-screen font-body text-on-surface flex relative overflow-hidden">
            {/* Background elements to match the unified aesthetics slightly scaled down */}
            <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#00497a 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
                <div className="bokeh w-[600px] h-[600px] top-[-20%] left-[-10%] bg-primary"></div>
                <div className="bokeh w-[500px] h-[500px] bottom-[-10%] right-[-10%] bg-tertiary"></div>
            </div>

            {/* Sidebar Navigation */}
            <div className="relative z-20">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 overflow-y-auto h-screen">
                <div className="w-full max-w-7xl mx-auto px-10 py-10">
                    {children}
                </div>
                
                {/* Bottom signature line */}
                <div className="fixed bottom-0 left-64 w-[calc(100%-16rem)] h-[3px] bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-30 z-30 pointer-events-none"></div>
            </main>
        </div>
    );
};

export default Layout;
