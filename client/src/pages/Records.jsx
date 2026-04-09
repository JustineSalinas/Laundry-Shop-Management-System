import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import EditTransactionModal from '../components/EditTransactionModal';

const Records = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/transactions');
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTransactionUpdated = () => {
        setSelectedTransaction(null);
        fetchTransactions();
    };

    const filteredTransactions = transactions.filter(tx => {
        const nameMatch = tx?.customer_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
        const idMatch = tx?.id?.toString()?.includes(searchTerm) || false;
        return nameMatch || idMatch;
    });

    return (
        <Layout>
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Records History</h2>
                        <p className="text-secondary text-sm font-medium">Search, filter, and manage all past and present orders.</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-72">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                        <input 
                            type="text" 
                            placeholder="Search Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm font-medium"
                        />
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
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Payment</th>
                                    <th className="p-4 text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-10 text-center text-secondary font-medium">
                                            No records found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                                            <td className="p-4 pl-6 font-semibold text-primary">#{tx.id}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-on-surface">{tx.customer_name}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-on-surface-variant">
                                                    {tx.service_type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${tx.order_status === 'Pending' ? 'bg-error-container text-error' : tx.order_status === 'Completed' ? 'bg-primary-container text-primary' : 'bg-secondary-container text-secondary'}`}>
                                                    {tx.order_status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${tx.payment_status === 'Paid' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container-high text-secondary'}`}>
                                                    {tx.payment_status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <button 
                                                    onClick={() => setSelectedTransaction(tx)}
                                                    className="px-4 py-2 bg-primary-fixed/20 text-primary hover:bg-primary-fixed/40 font-bold rounded-lg text-xs transition-colors"
                                                >
                                                    View / Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {selectedTransaction && (
                <EditTransactionModal 
                    transaction={selectedTransaction} 
                    onClose={() => setSelectedTransaction(null)} 
                    onSuccess={handleTransactionUpdated} 
                />
            )}
        </Layout>
    );
};

export default Records;
