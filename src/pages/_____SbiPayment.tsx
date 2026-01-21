// import React from 'react';

// const SbiPayment = () => {
//     const handleSubmit = () => {
//         const form = document.getElementById("sbiForm") as HTMLFormElement;
//         form.submit();
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
//             <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Gateway</h1>
//                 <p className="text-gray-600 mb-8">Click the button below to proceed to SBI Payment Gateway.</p>

//                 <form
//                     id="sbiForm"
//                     method="post"
//                     action="https://test.epay.sbiuat.bank.in"
//                     onSubmit={handleSubmit}
//                 >
//                     <input
//                         type="hidden"
//                         name="EncryptTrans"
//                         value={`8fZAhpLh/uVLV2p6kbnCySzN2xpBH1Eimbgf4E8jeLtwQmmV3O0rkjBdlDHVDCqGlNr5mXd9W9CO\r\nbr8Rl0zL80vBUY8aVpMgvPT87ccU26h4NYLqrq871ezlISQTvJaVEpmtAvxPIxEDQTfFxsNujy6I\r\nP4NMx47weSpLbDw18SU=`}
//                     />

//                     <input type="hidden" name="merchIdVal" value="1000605" />

//                     <button
//                         type="submit"
//                         className="w-full bg-[#283593] hover:bg-[#1a237e] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md flex items-center justify-center gap-2"
//                     >
//                         <span>Pay Now</span>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//                         </svg>
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SbiPayment;
