import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Phone, Mail, MapPin, IndianRupee, AlertCircle, Loader2, ChevronLeft, AlertTriangle, Shield } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Compact Header */}
                <div className="bg-white rounded-lg shadow-md border border-blue-200 mb-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={biswaBanglaLogo}
                                    alt="Biswa Bangla"
                                    className="h-10 w-auto bg-white rounded p-1 shadow-md"
                                />
                                <div className="text-white">
                                    <h1 className="text-lg font-bold">Haat Payment Portal</h1>
                                    <p className="text-xs text-blue-100">Government of West Bengal</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                                <Shield className="w-4 h-4 text-white" />
                                <span className="text-white text-xs">Secure</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Compact Payment Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="w-4 h-4 text-white" />
                                    <h2 className="text-sm font-bold text-white">Payment Summary</h2>
                                </div>
                            </div>

                            <div className="p-3 space-y-2">
                                {landValuation && (
                                    <div className="bg-blue-50 rounded p-2 border border-blue-200">
                                        <p className="text-xs font-semibold text-blue-700 uppercase">Land Valuation</p>
                                        <p className="text-lg font-bold text-blue-900">₹{parseFloat(landValuation).toLocaleString('en-IN')}</p>
                                    </div>
                                )}

                                <div className="border-t border-dashed border-blue-200 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-600">Payment Type</span>
                                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                            {paymentType === 'initial' ? 'Initial Payment' : 'Final Payment'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded p-2 border border-green-300">
                                    <p className="text-xs font-semibold text-green-700 uppercase">Total Payable</p>
                                    <p className="text-2xl font-bold text-green-800">₹{amount ? amount.toLocaleString('en-IN') : '0'}</p>
                                </div>

                                <div className="flex items-start gap-2 bg-amber-50 rounded p-2 border-l-2 border-amber-500">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-900">IMPORTANT</p>
                                        <p className="text-xs text-amber-800">Payment once made is non-refundable. Please review all information carefully before proceeding.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Payment Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 border-b border-green-400">
                                <h2 className="text-sm font-bold text-white">Depositor Information</h2>
                                <p className="text-xs text-slate-300">Fill in your details accurately</p>
                            </div>

                            <div className="p-4">
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.depositorName}
                                                onChange={(e) => handleInputChange('depositorName', e.target.value)}
                                                onBlur={() => handleBlur('depositorName')}
                                                className={`w-full pl-8 pr-3 py-2 text-sm rounded border ${touched.depositorName && errors.depositorName
                                                    ? 'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all bg-white`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        {touched.depositorName && errors.depositorName && (
                                            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{errors.depositorName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                <Phone className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.depositorMobile}
                                                onChange={(e) => handleInputChange('depositorMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                onBlur={() => handleBlur('depositorMobile')}
                                                className={`w-full pl-8 pr-3 py-2 text-sm rounded border ${touched.depositorMobile && errors.depositorMobile
                                                    ? 'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all bg-white`}
                                                placeholder="Enter 10-digit mobile number"
                                                maxLength={10}
                                            />
                                        </div>
                                        {touched.depositorMobile && errors.depositorMobile && (
                                            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{errors.depositorMobile}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.depositorEmail}
                                                onChange={(e) => handleInputChange('depositorEmail', e.target.value)}
                                                onBlur={() => handleBlur('depositorEmail')}
                                                className={`w-full pl-8 pr-3 py-2 text-sm rounded border ${touched.depositorEmail && errors.depositorEmail
                                                    ? 'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all bg-white`}
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                        {touched.depositorEmail && errors.depositorEmail && (
                                            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{errors.depositorEmail}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-2 left-0 pl-2 flex items-start pointer-events-none">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <textarea
                                                value={formData.depositorAddress}
                                                onChange={(e) => handleInputChange('depositorAddress', e.target.value)}
                                                onBlur={() => handleBlur('depositorAddress')}
                                                rows={2}
                                                className={`w-full pl-8 pr-3 py-2 text-sm rounded border ${touched.depositorAddress && errors.depositorAddress
                                                    ? 'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-blue-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                                                    } transition-all bg-white resize-none`}
                                                placeholder="Enter your complete address"
                                            />
                                        </div>
                                        {touched.depositorAddress && errors.depositorAddress && (
                                            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{errors.depositorAddress}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                        {/* Cancel Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const statusId = paymentType === 'initial' ? '4' : '7';
                                                const title = paymentType === 'initial' ? 'Initial Payment Pending' : 'Final Payment Pending';
                                                navigate(`/survey-details?_hti=${statusId}&title=${encodeURIComponent(title)}&dashboardType=USER`);
                                            }}
                                            className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded text-sm transition-all shadow-sm hover:shadow border border-slate-300 flex items-center justify-center gap-1"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>

                                        {/* Proceed to Pay Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-2 px-4 rounded text-sm transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IndianRupee className="w-4 h-4" />
                                                    <span>Proceed to Pay</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-600">
                        © 2026 Government of West Bengal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HaatPaymentPortal;