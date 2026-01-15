import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const amount = searchParams.get('amount') || '8,000.02';
    const txnId = searchParams.get('txnId') || '167357835'; // Keep this fallback for success screen if needed, though pending screen doesn't show it in the image
    const status = searchParams.get('status');
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

    // PENDING STATUS UI
    if (status === 'PENDING' || status === 'Pending') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative">

                    {/* Top Section - Dark Yellow/Gold for Pending */}
                    <div className="bg-[#A16207] p-8 pb-12 text-center relative overflow-hidden">
                        {/* Background Decorations */}
                        <div className="absolute top-10 left-10 w-3 h-3 bg-yellow-300 rotate-45 opacity-50"></div>
                        <div className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-200 rounded-full opacity-50"></div>

                        {/* Icon Container */}
                        <div className="relative flex items-center justify-center mb-4 z-10">
                            {/* Outer lighter yellow circle */}
                            <div className="w-24 h-24 bg-[#CA8A04] rounded-full flex items-center justify-center bg-opacity-80">
                                {/* Inner yellow circle */}
                                <div className="w-16 h-16 bg-[#EAB308] rounded-full flex items-center justify-center shadow-lg">
                                    {/* Simple Clock Icon */}
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Payment Pending</h2>
                        <p className="text-yellow-100 text-sm max-w-xs mx-auto leading-relaxed">
                            This payment is currently pending. Please try again later.
                        </p>
                    </div>

                    {/* Bottom Card Section */}
                    <div className="bg-white px-6 py-6 -mt-6 rounded-t-3xl relative z-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Details</h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Transaction ID</span>
                                <span className="font-semibold text-gray-800">{txnId}</span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-semibold text-gray-800">₹ {amount}</span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Transaction Status</span>
                                <span className="font-bold text-[#CA8A04]">Pending</span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Transaction Date/Time</span>
                                <span className="font-semibold text-gray-800">{dateTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // FAILED STATUS UI
    if (status === 'FAILED' || status === 'Failed') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative">

                    {/* Top Section - Dark Red/Pinkish for Failure */}
                    <div className="bg-[#4a101d] p-8 pb-12 text-center relative overflow-hidden">
                        {/* Icon Container with concentric circles */}
                        <div className="relative flex items-center justify-center mb-4 z-10">
                            {/* Outer lighter red circle */}
                            <div className="w-24 h-24 bg-[#b71c1c] rounded-full flex items-center justify-center bg-opacity-80">
                                {/* Inner red circle */}
                                <div className="w-16 h-16 bg-[#D32F2F] rounded-full flex items-center justify-center shadow-lg">
                                    {/* Exclamation Icon */}
                                    <span className="text-white text-5xl font-bold font-serif">!</span>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                        <p className="text-red-100 text-sm max-w-xs mx-auto leading-relaxed">
                            An unexpected error occurred while processing your request.
                        </p>
                    </div>

                    {/* Bottom Card Section */}
                    <div className="bg-white px-6 py-6 -mt-6 rounded-t-3xl relative z-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Details</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Transaction ID</span>
                                <span className="font-semibold text-gray-800">{txnId}</span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-semibold text-gray-800">₹ {amount}</span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Transaction Status</span>
                                <span className="font-bold text-[#D32F2F]">Failed</span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-500">Transaction Date/Time</span>
                                <span className="font-semibold text-gray-800">{dateTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;


