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
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            color: '#171c1f',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f6fafe 0%, #edf4fb 40%, #f0f4f8 100%)',
        }}>
            {/* Subtle background pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                userSelect: 'none',
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.015,
                    backgroundImage: 'radial-gradient(#00497a 0.5px, transparent 0.5px)',
                    backgroundSize: '32px 32px',
                }}></div>
                <div className="bokeh" style={{ width: '600px', height: '600px', top: '-15%', left: '-8%', background: '#0062a1' }}></div>
                <div className="bokeh" style={{ width: '400px', height: '400px', bottom: '-10%', right: '-5%', background: '#23486f' }}></div>
            </div>

            {/* Sidebar Navigation */}
            <div style={{ position: 'relative', zIndex: 20 }}>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                overflowY: 'auto',
                height: '100vh',
            }}>
                <div style={{
                    width: '100%',
                    padding: '36px 40px',
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
