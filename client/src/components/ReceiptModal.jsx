import React from 'react';

const ReceiptModal = ({ transaction, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    if (!transaction) return null;

    const dateStr = new Date(transaction.created_at).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm print:bg-white print:p-0">
            {/* Click outside to close (hidden in print mode) */}
            <div className="absolute inset-0 cursor-pointer print:hidden" onClick={onClose}></div>
            
            <div className="relative w-full max-w-sm bg-white rounded-none md:rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-[80mm] print:m-0 mx-auto border border-outline-variant/30 print:border-none my-8 md:my-0">
                
                {/* Print Controls - Hidden during print */}
                <div className="bg-surface-container-high p-4 flex justify-between items-center print:hidden border-b border-outline-variant/20">
                    <h3 className="font-bold text-on-surface">Digital Receipt</h3>
                    <div className="flex space-x-2">
                        <button 
                            onClick={handlePrint}
                            className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                            title="Print Local Receipt"
                        >
                            <span className="material-symbols-outlined text-[20px]">print</span>
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 bg-error/10 text-error rounded-full flex items-center justify-center hover:bg-error/20 transition-colors"
                            title="Close"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
                </div>

                {/* Receipt Content - The only thing printed! */}
                <div className="receipt-content p-8 print:p-4 bg-white text-surface-container-highest font-mono text-sm mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-6 border-b border-dashed border-outline-variant/60 pb-6">
                        <div className="flex justify-center mb-2 print:hidden">
                            <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[24px]">bubble_chart</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-1">LaundryEase</h2>
                        <p className="text-xs text-secondary mb-1">123 Fresh Valley Avenue</p>
                        <p className="text-xs text-secondary mb-1">Tel: (02) 8123-4567</p>
                        <p className="text-xs text-secondary font-bold mt-2">VAT REG TIN: 000-000-000-000</p>
                    </div>

                    {/* Metadata */}
                    <div className="mb-6 space-y-2 border-b border-dashed border-outline-variant/60 pb-6 text-on-surface text-xs font-semibold">
                        <div className="flex justify-between">
                            <span className="text-secondary">TXN#:</span>
                            <span>{String(transaction.id).padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Date:</span>
                            <span>{dateStr}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Customer:</span>
                            <span className="uppercase text-right max-w-[150px] truncate">{transaction.customer_name}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-6 border-b border-dashed border-outline-variant/60 pb-6">
                        <table className="w-full text-xs text-on-surface">
                            <thead>
                                <tr className="border-b border-solid border-outline-variant/40 pb-2 mb-2 block">
                                    <th className="text-left font-semibold pb-1 w-1/2">Service</th>
                                    <th className="text-center font-semibold pb-1 w-1/4">Qty</th>
                                    <th className="text-right font-semibold pb-1 w-1/4">Amt</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="block mt-2 font-bold">
                                    <td className="text-left w-1/2 inline-block truncate">{transaction.service_type}</td>
                                    <td className="text-center w-1/4 inline-block">
                                        {transaction.service_type === 'Comforter' ? `${transaction.quantity} pc` : `${transaction.weight} kg`}
                                    </td>
                                    <td className="text-right w-1/4 inline-block">₱{parseFloat(transaction.total_cost).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-xs font-bold text-secondary">
                            <span>Subtotal</span>
                            <span>₱{parseFloat(transaction.total_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-secondary">
                            <span>Tax (Included)</span>
                            <span>₱0.00</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-on-surface pt-2">
                            <span>TOTAL</span>
                            <span>₱{parseFloat(transaction.total_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold pt-2 mt-2 border-t border-solid border-outline-variant/40">
                            <span className="text-secondary">Payment Status:</span>
                            <span className="uppercase">{transaction.payment_status}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-secondary font-medium">
                        <p className="mb-1">Thank you for washing with us!</p>
                        <p className="mb-4">Please present this slip when claiming.</p>
                        
                        {/* Barcode Mock */}
                        <div className="font-barcode text-4xl text-on-surface opacity-80 tracking-widest mt-2 px-4 select-none">
                            *{String(transaction.id).padStart(6, '0')}*
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Hidden Barcode Font injection just for this component */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');
                .font-barcode { font-family: 'Libre Barcode 39', cursive; }
            `}} />
        </div>
    );
};

export default ReceiptModal;
