import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Column = ({ title, orders, statusColor, updateStatus }) => (
    <div className="flex-1 min-w-[300px] bg-surface-container-high/30 rounded-2xl p-5 border border-outline-variant/10 flex flex-col h-[calc(100vh-12rem)]">
        <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-4 flex items-center justify-between">
            <span>{title}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusColor}`}>{orders.length}</span>
        </h3>
        
        <div className="overflow-y-auto space-y-4 pr-2 flex-1 custom-scrollbar">
            {orders.length === 0 ? (
                <div className="text-center text-xs font-medium text-secondary py-10">No orders here</div>
            ) : (
                orders.map(tx => (
                    <div key={tx.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-bold text-primary mb-1 block">#{tx.id}</span>
                                <h4 className="font-bold text-on-surface text-sm">{tx.customer_name}</h4>
                            </div>
                            <button 
                                onClick={() => updateStatus(tx, 'payment_status', tx.payment_status === 'Paid' ? 'Unpaid' : 'Paid')}
                                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md transition-colors ${tx.payment_status === 'Paid' ? 'bg-tertiary-container text-tertiary' : 'bg-surface-container-high text-secondary hover:bg-error-container hover:text-error'}`}
                            >
                                {tx.payment_status}
                            </button>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mb-4">{tx.service_type} - {tx.service_type === 'Comforter' ? `${tx.quantity} pcs` : `${tx.weight} kg`}</p>
                        
                        <div className="flex space-x-2 border-t border-outline-variant/10 pt-3">
                            {tx.order_status === 'Pending' && (
                                <button onClick={() => updateStatus(tx, 'order_status', 'Processing')} className="flex-1 bg-primary-container text-on-primary-container text-xs font-bold py-2 rounded-lg hover:brightness-95">Start</button>
                            )}
                            {tx.order_status === 'Processing' && (
                                <button onClick={() => updateStatus(tx, 'order_status', 'Ready')} className="flex-1 bg-secondary-container text-on-secondary-container text-xs font-bold py-2 rounded-lg hover:brightness-95">Mark Ready</button>
                            )}
                            {tx.order_status === 'Ready' && (
                                <button onClick={() => updateStatus(tx, 'order_status', 'Completed')} className="flex-1 bg-primary text-on-primary text-xs font-bold py-2 rounded-lg hover:brightness-110">Complete Order</button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

const StatusMonitoring = () => {
    const [transactions, setTransactions] = useState([]);
    
    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`);
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStatus = async (tx, field, value) => {
        try {
            const payload = {
                ...tx,
                [field]: value
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/transactions/${tx.id}`, payload);
            fetchTransactions(); 
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status.');
        }
    };

    const pending = transactions.filter(t => t.order_status === 'Pending');
    const processing = transactions.filter(t => t.order_status === 'Processing');
    const ready = transactions.filter(t => t.order_status === 'Ready');

    return (
        <Layout>
            <div className="flex flex-col h-full gap-6">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Status Monitor</h2>
                        <p className="text-secondary text-sm font-medium">Kanban view of active processing stages & payment statuses.</p>
                    </div>
                </section>

                <div className="flex gap-6 overflow-x-auto pb-4">
                    <Column title="Pending" orders={pending} statusColor="bg-error-container text-error" updateStatus={updateStatus} />
                    <Column title="Processing" orders={processing} statusColor="bg-primary-container text-primary" updateStatus={updateStatus} />
                    <Column title="Ready for Pick-up" orders={ready} statusColor="bg-tertiary-container text-tertiary" updateStatus={updateStatus} />
                </div>
                
                <style dangerouslySetInnerHTML={{__html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 73, 122, 0.1); border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 73, 122, 0.3); }
                `}} />
            </div>
        </Layout>
    );
};

export default StatusMonitoring;
