import React, { useState } from 'react';
import axios from 'axios';

const RATES = {
    'Wash': 35,
    'Wash and Dry': 65,
    'Fold': 20,
    'Comforter': 150
};

const NewTransactionModal = ({ onClose, onSuccess }) => {
    const [customerName, setCustomerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [serviceType, setServiceType] = useState('Wash and Dry');
    const [weight, setWeight] = useState('');
    const [quantity, setQuantity] = useState('');
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
                quantity: !isWeightBased ? parseInt(quantity, 10) : null
            };

            await axios.post('https://dazzlingly-unemerged-sean.ngrok-free.dev/api/transactions', payload);
            onSuccess();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to create transaction');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-secondary/40 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-8 border border-white/50 modal-content">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-secondary hover:text-on-surface transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <h2 className="text-2xl font-black text-on-surface mb-2">New Order</h2>
                <p className="text-sm text-secondary font-medium mb-6">Enter customer and service details to compute the cost.</p>

                {errorMsg && (
                    <div className="bg-error-container text-error text-sm p-3 rounded-lg text-center font-semibold mb-4">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Customer Layout */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Customer Name *</label>
                            <input 
                                type="text" required
                                value={customerName} onChange={e => setCustomerName(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm font-medium"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Contact Number</label>
                            <input 
                                type="text"
                                value={contactNumber} onChange={e => setContactNumber(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm font-medium"
                                placeholder="09XX-XXX-XXXX"
                            />
                        </div>
                    </div>

                    <hr className="border-outline-variant/30 my-2" />

                    {/* Service Type Selection */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Service Type *</label>
                        <select 
                            value={serviceType} 
                            onChange={e => {
                                setServiceType(e.target.value);
                                setWeight('');
                                setQuantity('');
                            }}
                            className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-sm font-bold text-on-surface appearance-none cursor-pointer"
                        >
                            <option value="Wash">Wash Only (₱35/kg)</option>
                            <option value="Wash and Dry">Wash & Dry (₱65/kg)</option>
                            <option value="Fold">Fold Only (₱20/kg)</option>
                            <option value="Comforter">Comforter (₱150/pc)</option>
                        </select>
                    </div>

                    {/* Dynamic Input based on selection */}
                    <div className="bg-surface-container-high/30 p-4 rounded-xl border border-outline-variant/10 flex items-center justify-between">
                        {isWeightBased ? (
                            <div className="w-1/2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1 block mb-1">Weight (kg) *</label>
                                <div className="relative">
                                    <input 
                                        type="number" step="0.1" min="0.1" required
                                        value={weight} onChange={e => setWeight(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-lg font-black"
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="w-1/2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1 block mb-1">Quantity *</label>
                                <input 
                                    type="number" step="1" min="1" required
                                    value={quantity} onChange={e => setQuantity(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-lg font-black"
                                    placeholder="1"
                                />
                            </div>
                        )}
                        
                        {/* Live Price Preview */}
                        <div className="text-right pl-4 border-l border-outline-variant/20">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary block mb-1">Total Cost computed</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">
                                ₱{totalCost.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 mt-6 bg-primary cursor-pointer disabled:opacity-50 text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">{isLoading ? 'hourglass_empty' : 'check_circle'}</span>
                        <span>{isLoading ? 'Processing...' : 'Confirm Request'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewTransactionModal;
