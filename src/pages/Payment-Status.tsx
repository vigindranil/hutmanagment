import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const amount = searchParams.get('amount') || '8,000.02';
    const txnId = searchParams.get('txnId') || '167357835';
    const [dateTime, setDateTime] = useState('');

    useEffect(() => {
        const now = new Date();
        setDateTime(now.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Top Section - Dark Blue */}
                <div className="bg-[#003B6D] p-8 pb-12 text-center relative overflow-hidden">

                    {/* Confetti / Decorations */}
                    {/* Using simple absolute divs for confetti shapes */}
                    <div className="absolute top-10 left-10 w-3 h-3 bg-yellow-400 rotate-45 transform"></div>
                    <div className="absolute top-6 left-1/4 w-2 h-6 bg-pink-400 rotate-12 rounded-full"></div>
                    <div className="absolute top-12 right-20 w-3 h-3 bg-teal-400 rounded-full"></div>
                    <div className="absolute top-20 left-6 w-3 h-3 bg-yellow-400 rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                    <div className="absolute top-8 right-10 w-2 h-6 bg-pink-400 -rotate-45 rounded-full"></div>
                    <div className="absolute bottom-20 right-12 w-3 h-3 bg-teal-400 rounded-full"></div>
                    <div className="absolute top-24 right-1/4 w-3 h-3 bg-yellow-500 rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                    <div className="absolute bottom-12 left-12 w-2 h-5 bg-pink-400 rotate-45 rounded-sm"></div>

                    {/* Success Icon */}
                    <div className="relative z-10 mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                        <svg className="w-12 h-12 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Payment successful</h2>
                </div>

                {/* Bottom Card Section - Overlapping or just below */}
                <div className="bg-white px-6 py-6 -mt-4 rounded-t-3xl relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Details</h3>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-semibold text-[#003B6D]">{txnId}</span>
                        </div>

                        <div className="flex justify-between items-start">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-semibold text-[#003B6D]">₹ {amount}</span>
                        </div>

                        <div className="flex justify-between items-start">
                            <span className="text-gray-500">Transaction Status</span>
                            <span className="font-bold text-[#003B6D]">Success</span>
                        </div>

                        <div className="flex justify-between items-start">
                            <span className="text-gray-500">Transaction Date/Time</span>
                            <span className="font-semibold text-[#003B6D]">{dateTime}</span>
                        </div>
                    </div>

                    {/* <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-md text-blue-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-gray-600 font-medium">Payment Receipt</span>
                            </div>
                            <button className="text-[#d76b38]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
