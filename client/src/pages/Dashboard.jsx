import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NewTransactionModal from '../components/NewTransactionModal';
import './Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/transactions');
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchTransactions();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleTransactionAdded = () => {
        setIsModalOpen(false);
        fetchTransactions(); // Refresh list immediately after adding
    };

    return (
        <div className="bg-background min-h-screen font-body text-on-surface flex flex-col relative overflow-hidden">
            {/* Background elements to match the unified aesthetics slightly scaled down */}
            <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#00497a 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
                <div className="bokeh w-[600px] h-[600px] top-[-20%] left-[-10%] bg-primary"></div>
                <div className="bokeh w-[500px] h-[500px] bottom-[-10%] right-[-10%] bg-tertiary"></div>
            </div>

            {/* Navbar */}
            <header className="relative z-10 w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-white/20 shadow-sm px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-primary text-2xl" data-icon="bubble_chart">bubble_chart</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-on-surface">LaundryEase</h1>
                </div>
                <div className="flex items-center space-x-6">
                    <button onClick={handleLogout} className="flex items-center space-x-2 text-sm font-semibold text-error hover:text-error-container transition-colors">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-8 py-10 flex flex-col gap-8">
                
                {/* Header Section */}
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Transaction Management</h2>
                        <p className="text-secondary text-sm font-medium">Overview of all active and completed laundry orders.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="py-3 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 transition-all flex items-center space-x-2 active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span>New Order</span>
                    </button>
                </section>

                {/* Data Table */}
                <section className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_30px_rgba(0,73,122,0.08)] border border-white/50 overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-xs uppercase tracking-wider text-secondary font-bold">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Service</th>
                                    <th className="p-4">Details</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 pr-6">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-10 text-center text-secondary font-medium">
                                            No transactions found. Click "New Order" to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                                            <td className="p-4 pl-6 font-semibold text-primary">#{tx.id}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-on-surface">{tx.customer_name}</div>
                                                <div className="text-xs text-secondary mt-0.5">{tx.contact_number || 'No contact'}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary-fixed/20 text-primary border border-primary/10">
                                                    {tx.service_type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-on-surface-variant font-medium">
                                                {tx.service_type === 'Comforter' ? `${tx.quantity} pc(s)` : `${tx.weight} kg`}
                                            </td>
                                            <td className="p-4 font-black text-on-surface">
                                                ₱{parseFloat(tx.total_cost).toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${tx.order_status === 'Pending' ? 'bg-error-container text-error' : 'bg-primary-container text-on-primary-container'}`}>
                                                    {tx.order_status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6">
                                                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${tx.payment_status === 'Paid' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container-high text-secondary'}`}>
                                                    {tx.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <NewTransactionModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleTransactionAdded} 
                />
            )}
            
             {/* Bottom signature line */}
            <div className="mt-auto w-full h-[3px] bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-30"></div>
        </div>
    );
};

export default Dashboard;
