import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import NewTransactionModal from '../components/NewTransactionModal';
import './Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({ active: 0, ready: 0, completed: 0, revenue: 0 });

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`);
            
            // Calculate Analytics
            const today = new Date().toISOString().split('T')[0];
            let activeCount = 0;
            let readyCount = 0;
            let completedCount = 0;
            let dailyRevenue = 0;

            res.data.forEach(tx => {
                if (tx.order_status === 'Pending' || tx.order_status === 'Processing') activeCount++;
                if (tx.order_status === 'Ready') readyCount++;
                if (tx.order_status === 'Completed') completedCount++;

                const txDate = tx.created_at ? tx.created_at.split('T')[0] : '';
                if (tx.payment_status === 'Paid' && txDate === today) {
                    dailyRevenue += parseFloat(tx.total_cost || 0);
                }
            });

            setStats({ active: activeCount, ready: readyCount, completed: completedCount, revenue: dailyRevenue });

            // Filter to show only active transactions on the main dashboard
            const activeOrders = res.data.filter(tx => 
                tx.order_status === 'Pending' || tx.order_status === 'Processing'
            );
            setTransactions(activeOrders);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTransactionAdded = () => {
        setIsModalOpen(false);
        fetchTransactions(); // Refresh list immediately after adding
    };

    return (
        <Layout>
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Active Orders</h2>
                        <p className="text-secondary text-sm font-medium">Overview of pending and processing laundry operations.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="py-3 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 transition-all flex items-center space-x-2 active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span>New Order</span>
                    </button>
                </section>

                {/* Analytics Board */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Active Orders */}
                    <div className="bg-surface-container-lowest border border-white/50 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,73,122,0.08)] flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Active Orders</p>
                            <h3 className="text-4xl font-black text-on-surface">{stats.active}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
                        </div>
                    </div>

                    {/* Ready */}
                    <div className="bg-surface-container-lowest border border-white/50 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,73,122,0.08)] flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Ready for Pickup</p>
                            <h3 className="text-4xl font-black text-tertiary">{stats.ready}</h3>
                        </div>
                        <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center text-tertiary shadow-inner">
                            <span className="material-symbols-outlined text-[24px]">check_circle</span>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-surface-container-lowest border border-white/50 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,73,122,0.08)] flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total Completed</p>
                            <h3 className="text-4xl font-black text-secondary">{stats.completed}</h3>
                        </div>
                        <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-secondary shadow-inner">
                            <span className="material-symbols-outlined text-[24px]">task_alt</span>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-surface-container-lowest border border-white/50 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,73,122,0.08)] flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Daily Revenue</p>
                            <h3 className="text-3xl font-black text-on-surface">₱{stats.revenue.toFixed(2)}</h3>
                        </div>
                        <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-[24px]">payments</span>
                        </div>
                    </div>
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
                                            No active orders right now. Click "New Order" to get started.
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <NewTransactionModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleTransactionAdded} 
                />
            )}
        </Layout>
    );
};

export default Dashboard;
