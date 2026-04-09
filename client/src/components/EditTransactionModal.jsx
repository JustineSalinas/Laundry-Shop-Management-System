import React, { useState } from 'react';
import axios from 'axios';

const RATES = {
    'Wash': 35,
    'Wash and Dry': 65,
    'Fold': 20,
    'Comforter': 150
};

const EditTransactionModal = ({ transaction, onClose, onSuccess }) => {
    const [customerName, setCustomerName] = useState(transaction?.customer_name || '');
    const [contactNumber, setContactNumber] = useState(transaction?.contact_number || '');
    const [serviceType, setServiceType] = useState(transaction?.service_type || 'Wash and Dry');
    const [weight, setWeight] = useState(transaction?.weight || '');
    const [quantity, setQuantity] = useState(transaction?.quantity || '');
    const [orderStatus, setOrderStatus] = useState(transaction?.order_status || 'Pending');
    const [paymentStatus, setPaymentStatus] = useState(transaction?.payment_status || 'Unpaid');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isWeightBased = ['Wash', 'Wash and Dry', 'Fold'].includes(serviceType);

    const totalCost = isWeightBased 
        ? (parseFloat(weight) || 0) * RATES[serviceType] 
        : (parseInt(quantity, 10) || 0) * RATES['Comforter'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const payload = {
                customer_name: customerName,
                contact_number: contactNumber,
                service_type: serviceType,
                weight: isWeightBased ? parseFloat(weight) : null,
                quantity: !isWeightBased ? parseInt(quantity, 10) : null,
                order_status: orderStatus,
                payment_status: paymentStatus
            };

            await axios.put(`${import.meta.env.VITE_API_URL}/api/transactions/${transaction.id}`, payload);
            onSuccess();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to update transaction');
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
        setIsLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/transactions/${transaction.id}`);
            onSuccess();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to delete transaction');
            setIsLoading(false);
        }
    }

    if (!transaction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
            <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm cursor-pointer" onClick={onClose}></div>
            
            <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-8 border border-white/50 modal-content">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-secondary hover:text-on-surface transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="flex justify-between items-center mb-2 pr-10">
                    <h2 className="text-2xl font-black text-on-surface">Edit Order #{transaction.id}</h2>
                    <button onClick={handleDelete} className="text-error hover:bg-error-container p-2 rounded-full flex items-center transition-colors" title="Delete Order">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
                <p className="text-sm text-secondary font-medium mb-6">Modify details or update status tracking.</p>

                {errorMsg && (
                    <div className="bg-error-container text-error text-sm p-3 rounded-lg text-center font-semibold mb-4">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Status Modifiers */}
                    <div className="grid grid-cols-2 gap-4 bg-surface-container-high/30 p-4 rounded-xl border border-outline-variant/10">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Order Status</label>
                            <select 
                                value={orderStatus} onChange={e => setOrderStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-bold text-on-surface"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Ready">Ready</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Payment Status</label>
                            <select 
                                value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-bold text-on-surface"
                            >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Customer Name *</label>
                            <input 
                                type="text" required
                                value={customerName} onChange={e => setCustomerName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Contact Number</label>
                            <input 
                                type="text"
                                value={contactNumber} onChange={e => setContactNumber(e.target.value)}
                                className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Service Type *</label>
                        <select 
                            value={serviceType} 
                            onChange={e => {
                                setServiceType(e.target.value);
                                setWeight(''); setQuantity('');
                            }}
                            className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                        >
                            <option value="Wash">Wash Only (₱35/kg)</option>
                            <option value="Wash and Dry">Wash & Dry (₱65/kg)</option>
                            <option value="Fold">Fold Only (₱20/kg)</option>
                            <option value="Comforter">Comforter (₱150/pc)</option>
                        </select>
                    </div>

                    <div className="bg-surface-container-high/30 p-4 rounded-xl border border-outline-variant/10 flex items-center justify-between mt-2">
                        {isWeightBased ? (
                            <div className="w-1/2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1 block mb-1">Weight (kg) *</label>
                                <input 
                                    type="number" step="0.1" min="0.1" max="100" required
                                    value={weight} onChange={e => setWeight(e.target.value)}
                                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-lg font-black"
                                />
                            </div>
                        ) : (
                            <div className="w-1/2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1 block mb-1">Quantity *</label>
                                <input 
                                    type="number" step="1" min="1" max="50" required
                                    value={quantity} onChange={e => setQuantity(e.target.value)}
                                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-lg font-black"
                                />
                            </div>
                        )}
                        
                        <div className="text-right pl-4">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary block mb-1">Total Cost computed</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">
                                ₱{totalCost.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full py-4 mt-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">{isLoading ? 'hourglass_empty' : 'save'}</span>
                        <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionModal;
