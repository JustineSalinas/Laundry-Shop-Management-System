import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import NewTransactionModal from '../components/NewTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import ReceiptModal from '../components/ReceiptModal';
import './Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [viewingTransaction, setViewingTransaction] = useState(null);
    const [stats, setStats] = useState({ active: 0, ready: 0, completed: 0, revenue: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

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

            // Show active orders (Pending + Processing + Ready)
            const activeOrders = res.data.filter(tx => 
                tx.order_status === 'Pending' || tx.order_status === 'Processing' || tx.order_status === 'Ready'
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
        fetchTransactions();
    };

    const handleEditSuccess = () => {
        setEditingTransaction(null);
        fetchTransactions();
    };

    // Filter transactions by search and status
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = searchQuery === '' || 
            tx.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.contact_number?.includes(searchQuery) ||
            String(tx.id).includes(searchQuery);
        
        const matchesStatus = statusFilter === 'All' || tx.order_status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const styles = {
            'Pending': 'dashboard-badge-pending',
            'Processing': 'dashboard-badge-processing',
            'Ready': 'dashboard-badge-ready',
            'Completed': 'dashboard-badge-completed',
        };
        return styles[status] || 'dashboard-badge-default';
    };

    const getPaymentBadge = (status) => {
        return status === 'Paid' ? 'dashboard-badge-paid' : 'dashboard-badge-unpaid';
    };

    const getServiceBadge = (service) => {
        const styles = {
            'Wash': 'dashboard-service-wash',
            'Wash and Dry': 'dashboard-service-washdry',
            'Wash and Fold': 'dashboard-service-washdry',
            'Dry Cleaning Only': 'dashboard-service-dryclean',
            'Fold': 'dashboard-service-fold',
            'Comforter': 'dashboard-service-comforter',
        };
        return styles[service] || 'dashboard-service-default';
    };

    return (
        <Layout>
            <div className="dashboard-container">
                {/* Header Section */}
                <section className="dashboard-header">
                    <div>
                        <h2 className="dashboard-title">Active Orders</h2>
                        <p className="dashboard-subtitle">Overview of pending and processing laundry operations.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="dashboard-new-order-btn"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                        <span>New Order</span>
                    </button>
                </section>

                {/* Analytics Board */}
                <section className="dashboard-stats-grid">
                    {/* Active Orders */}
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-info">
                            <p className="dashboard-stat-label">ACTIVE ORDERS</p>
                            <h3 className="dashboard-stat-value">{stats.active}</h3>
                        </div>
                        <div className="dashboard-stat-icon dashboard-stat-icon-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>local_laundry_service</span>
                        </div>
                    </div>

                    {/* Ready for Pickup */}
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-info">
                            <p className="dashboard-stat-label">READY FOR PICKUP</p>
                            <h3 className="dashboard-stat-value">{stats.ready}</h3>
                        </div>
                        <div className="dashboard-stat-icon dashboard-stat-icon-ready">
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>inventory_2</span>
                        </div>
                    </div>

                    {/* Total Completed */}
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-info">
                            <p className="dashboard-stat-label">TOTAL COMPLETED</p>
                            <h3 className="dashboard-stat-value">{stats.completed}</h3>
                        </div>
                        <div className="dashboard-stat-icon dashboard-stat-icon-completed">
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>task_alt</span>
                        </div>
                    </div>

                    {/* Daily Revenue */}
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-info">
                            <p className="dashboard-stat-label">DAILY REVENUE</p>
                            <h3 className="dashboard-stat-value dashboard-stat-value-currency">₱{stats.revenue.toFixed(2)}</h3>
                        </div>
                        <div className="dashboard-stat-icon dashboard-stat-icon-revenue">
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>payments</span>
                        </div>
                    </div>
                </section>

                {/* Search & Filter Bar */}
                <section className="dashboard-search-bar">
                    <div className="dashboard-search-input-wrapper">
                        <span className="material-symbols-outlined dashboard-search-icon">search</span>
                        <input
                            type="text"
                            placeholder="Search orders or customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="dashboard-search-input"
                        />
                    </div>
                    <div className="dashboard-filter-wrapper">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="dashboard-filter-select"
                        >
                            <option value="All">Filter by Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Ready">Ready</option>
                        </select>
                        <span className="material-symbols-outlined dashboard-filter-chevron">expand_more</span>
                    </div>
                </section>

                {/* Current Order List */}
                <section className="dashboard-table-section">
                    <h3 className="dashboard-table-title">Current Order List</h3>
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CUSTOMER</th>
                                    <th>SERVICE</th>
                                    <th>DETAILS</th>
                                    <th>PRICE</th>
                                    <th>STATUS</th>
                                    <th>PAYMENT</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="dashboard-table-empty">
                                            <span className="material-symbols-outlined" style={{ fontSize: '40px', opacity: 0.3 }}>inbox</span>
                                            <p>No active orders right now. Click "New Order" to get started.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td className="dashboard-table-id">#{tx.id}</td>
                                            <td className="dashboard-table-customer">
                                                <div className="dashboard-customer-name">{tx.customer_name}</div>
                                                <div className="dashboard-customer-contact">{tx.contact_number || 'No contact'}</div>
                                            </td>
                                            <td>
                                                <span className={`dashboard-service-badge ${getServiceBadge(tx.service_type)}`}>
                                                    {tx.service_type}
                                                </span>
                                            </td>
                                            <td className="dashboard-table-details">
                                                {tx.service_type === 'Comforter' ? `${tx.quantity} pc(s)` : `${tx.weight} kg`}
                                            </td>
                                            <td className="dashboard-table-price">
                                                ₱{parseFloat(tx.total_cost).toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`dashboard-status-badge ${getStatusBadge(tx.order_status)}`}>
                                                    {tx.order_status === 'Ready' ? 'Ready for Pickup' : tx.order_status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`dashboard-payment-badge ${getPaymentBadge(tx.payment_status)}`}>
                                                    {tx.payment_status}
                                                </span>
                                            </td>
                                            <td className="dashboard-table-actions">
                                                <button
                                                    onClick={() => setEditingTransaction(tx)}
                                                    className="dashboard-action-btn"
                                                    title="Edit Order"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setViewingTransaction(tx)}
                                                    className="dashboard-action-btn"
                                                    title="View Receipt"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
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

            {/* Modals */}
            {isModalOpen && (
                <NewTransactionModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleTransactionAdded} 
                />
            )}

            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {viewingTransaction && (
                <ReceiptModal
                    transaction={viewingTransaction}
                    onClose={() => setViewingTransaction(null)}
                />
            )}
        </Layout>
    );
};

export default Dashboard;
