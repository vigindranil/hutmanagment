import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Phone, Mail, MapPin, IndianRupee, AlertCircle, Loader2, ChevronLeft, AlertTriangle, Lock, Shield } from 'lucide-react';
import { savePaymentInfo, SavePaymentInfoPayload, getPaymentDetailsByTxnRefID } from '../Service/surveyAPI';
import { decodeJwtToken } from '../utils/decodeToken';
import biswaBanglaLogo from '../assets/biswaBangla.png';

const HaatPaymentPortal: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get parameters from URL
    const surveyId = searchParams.get('surveyId');
    const amount = parseFloat(searchParams.get('amount') || '0');
    const paymentType = searchParams.get('type'); // 'initial' or 'final'
    const landValuation = searchParams.get('landValuation');

    // Form state
    const [formData, setFormData] = useState({
        depositorName: '',
        depositorMobile: '',
        depositorEmail: '',
        depositorAddress: '',
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobile = (mobile: string): boolean => {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(mobile);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.depositorName.trim()) {
            newErrors.depositorName = 'Full name is required';
        } else if (formData.depositorName.trim().length < 3) {
            newErrors.depositorName = 'Name must be at least 3 characters';
        }

        if (!formData.depositorMobile.trim()) {
            newErrors.depositorMobile = 'Mobile number is required';
        } else if (!validateMobile(formData.depositorMobile)) {
            newErrors.depositorMobile = 'Please enter a valid 10-digit mobile number';
        }

        if (!formData.depositorEmail.trim()) {
            newErrors.depositorEmail = 'Email address is required';
        } else if (!validateEmail(formData.depositorEmail)) {
            newErrors.depositorEmail = 'Please enter a valid email address';
        }

        if (!formData.depositorAddress.trim()) {
            newErrors.depositorAddress = 'Address is required';
        } else if (formData.depositorAddress.trim().length < 10) {
            newErrors.depositorAddress = 'Address must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            depositorName: true,
            depositorMobile: true,
            depositorEmail: true,
            depositorAddress: true,
        });

        if (!validateForm()) {
            return;
        }

        if (!surveyId || !amount) {
            alert('Missing required payment information');
            return;
        }

        setLoading(true);

        try {
            const userDetails = decodeJwtToken();

            // Step 1: Call savePaymentInfo API
            const payload: SavePaymentInfoPayload = {
                initial_or_final_payment_status: paymentType === 'initial' ? 1 : 2,
                survey_id: parseInt(surveyId),
                depositor_name: formData.depositorName.trim(),
                depositor_mobile_no: formData.depositorMobile.trim(),
                depositor_email_address: formData.depositorEmail.trim(),
                depositor_address: formData.depositorAddress.trim(),
                amount: amount,
                entry_user_id: userDetails?.UserID || 0,
            };

            const savePaymentResponse = await savePaymentInfo(payload);

            if (!savePaymentResponse || (savePaymentResponse.status !== 0 && savePaymentResponse.status !== 1)) {
                alert('Failed to save payment information. Please try again.');
                setLoading(false);
                return;
            }

            // Get txn_ref_id from response
            const txnRefId = savePaymentResponse?.data?.txn_ref_id;

            if (!txnRefId) {
                alert('Transaction reference ID not received. Please try again.');
                setLoading(false);
                return;
            }

            // Step 2: Call getPaymentDetailsByTxnRefID API
            const paymentDetailsResponse = await getPaymentDetailsByTxnRefID(txnRefId);

            if (!paymentDetailsResponse || (paymentDetailsResponse.status !== 0 && paymentDetailsResponse.status !== 1)) {
                alert('Failed to get payment details. Please try again.');
                setLoading(false);
                return;
            }

            // Get merchIdVal and encryptTrans from response
            const merchIdVal = paymentDetailsResponse?.data?.merchIdVal || '1000605';
            const encryptTrans = paymentDetailsResponse?.data?.encryptTrans;

            if (!encryptTrans) {
                alert('Encrypted transaction data not received. Please try again.');
                setLoading(false);
                return;
            }

            // Step 3: Create and submit form to SBI payment gateway
            const form = document.createElement('form');
            form.method = 'post';
            form.action = 'https://test.epay.sbiuat.bank.in/secure/AggregatorHostedListener';
            form.target = '_blank';

            // Create hidden input for encryptTrans
            const encryptTransInput = document.createElement('input');
            encryptTransInput.type = 'hidden';
            encryptTransInput.name = 'EncryptTrans';
            encryptTransInput.value = encryptTrans;
            form.appendChild(encryptTransInput);

            // Create hidden input for merchIdVal
            const merchIdValInput = document.createElement('input');
            merchIdValInput.type = 'hidden';
            merchIdValInput.name = 'merchIdVal';
            merchIdValInput.value = merchIdVal;
            form.appendChild(merchIdValInput);

            // Append form to body and submit
            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error('Payment error:', error);
            alert('An error occurred while processing your payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header with Logo */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={biswaBanglaLogo}
                                    alt="Biswa Bangla"
                                    className="h-16 w-auto bg-white rounded-lg p-2 shadow-lg"
                                />
                                <div className="text-white">
                                    <h1 className="text-3xl font-bold tracking-tight">Haat Payment Portal</h1>
                                    <p className="text-blue-100 text-sm mt-1">Government of West Bengal</p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Shield className="w-5 h-5 text-white" />
                                <span className="text-white text-sm font-medium">Secure Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Border */}
                    <div className="h-2 bg-gradient-to-r from-blue-400 via-white to-green-400"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Payment Summary Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 overflow-hidden sticky top-6">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <IndianRupee className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Payment Summary</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {landValuation && (
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Land Valuation</p>
                                        <p className="text-2xl font-bold text-blue-900">₹{parseFloat(landValuation).toLocaleString('en-IN')}</p>
                                    </div>
                                )}

                                <div className="border-t-2 border-dashed border-blue-200 pt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">Payment Type</span>
                                        <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                                            {paymentType === 'initial' ? 'Initial Payment' : 'Final Payment'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-5 border-2 border-green-300">
                                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Total Amount Payable</p>
                                    <p className="text-4xl font-bold text-green-800">₹{amount ? amount.toLocaleString('en-IN') : '0'}</p>
                                </div>

                                {/* Warning Notice */}
                                <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-900 mb-1">IMPORTANT NOTICE</p>
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            Payment once made is non-refundable. Please review all information carefully before proceeding.
                                        </p>
                                    </div>
                                </div>

                                {/* Security Badge */}
                                {/* <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <Lock className="w-4 h-4 text-slate-600" />
                                    <span className="text-xs text-slate-600 font-medium">256-bit SSL Encrypted</span>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 border-b-2 border-green-400">
                                <h2 className="text-xl font-bold text-white">Depositor Information</h2>
                                <p className="text-slate-300 text-sm mt-1">Please fill in your details accurately</p>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 md:p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.depositorName}
                                                onChange={(e) => handleInputChange('depositorName', e.target.value)}
                                                onBlur={() => handleBlur('depositorName')}
                                                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 ${touched.depositorName && errors.depositorName
                                                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all duration-200 bg-white font-medium`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        {touched.depositorName && errors.depositorName && (
                                            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.depositorName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.depositorMobile}
                                                onChange={(e) => handleInputChange('depositorMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                onBlur={() => handleBlur('depositorMobile')}
                                                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 ${touched.depositorMobile && errors.depositorMobile
                                                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all duration-200 bg-white font-medium`}
                                                placeholder="Enter 10-digit mobile number"
                                                maxLength={10}
                                            />
                                        </div>
                                        {touched.depositorMobile && errors.depositorMobile && (
                                            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.depositorMobile}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.depositorEmail}
                                                onChange={(e) => handleInputChange('depositorEmail', e.target.value)}
                                                onBlur={() => handleBlur('depositorEmail')}
                                                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 ${touched.depositorEmail && errors.depositorEmail
                                                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all duration-200 bg-white font-medium`}
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                        {touched.depositorEmail && errors.depositorEmail && (
                                            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.depositorEmail}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <textarea
                                                value={formData.depositorAddress}
                                                onChange={(e) => handleInputChange('depositorAddress', e.target.value)}
                                                onBlur={() => handleBlur('depositorAddress')}
                                                rows={3}
                                                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 ${touched.depositorAddress && errors.depositorAddress
                                                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all duration-200 bg-white resize-none font-medium`}
                                                placeholder="Enter your complete address"
                                            />
                                        </div>
                                        {touched.depositorAddress && errors.depositorAddress && (
                                            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.depositorAddress}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    {/* Action Buttons */}
                                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                        {/* Cancel Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const statusId = paymentType === 'initial' ? '4' : '7';
                                                const title = paymentType === 'initial' ? 'Initial Payment Pending' : 'Final Payment Pending';
                                                navigate(`/survey-details?_hti=${statusId}&title=${encodeURIComponent(title)}&dashboardType=USER`);
                                            }}
                                            className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border-2 border-slate-300 flex items-center justify-center gap-2"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            <span>Cancel</span>
                                        </button>

                                        {/* Proceed to Pay Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-3 border-2 border-green-800"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Processing Payment...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IndianRupee className="w-5 h-5" />
                                                    <span>Proceed to Pay</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Terms */}
                                    {/* <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
                                        By proceeding, you agree to our{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                                            Terms & Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                                            Privacy Policy
                                        </a>
                                    </p> */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-600">
                        © 2026 Government of West Bengal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HaatPaymentPortal;
