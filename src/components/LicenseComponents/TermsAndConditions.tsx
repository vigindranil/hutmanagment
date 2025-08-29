import React from 'react';

interface TermsAndConditionsProps {
  agreed: boolean;
  onAgreementChange: (agreed: boolean) => void;
}

export function TermsAndConditions({ agreed, onAgreementChange }: TermsAndConditionsProps) {
  const terms = [
    {
      number: 1,
      text: "The Zilla Parishad authority hereby issues this License only for conducting his/her shop/business including his/her dwelling house and for no other purpose whatever it may be at an annual rent of .......................... for a period of ten (10) years with effect from .......................... to .......................... subject to renewal of this License before the date of expiry."
    },
    {
      number: 2,
      text: "The Licensee shall pay the Annual Fees as per the Amended Bye-Law, 2021 of Jalpaiguri Zilla Parishad. Such yearly fee/fines will be payable fixed from the 1st April each year to the 31st March of the following year. Yearly rent of Jalpaiguri Zilla Parishad will be deposited in time and the Licensee shall pay this rent/fees to the Jalpaiguri Zilla Parishad in time, failing which a delayed penalty will be imposed. The Zilla Parishad reserves the right to cancel the license if the rent dues remain/become for more than six months."
    },
    {
      number: 3,
      text: "The Licensee shall not transfer the land (as scheduled in the overleaf) under this License or any part thereof to any other person without the previous specific permission of the Zilla Parishad authority in writing."
    },
    {
      number: 4,
      text: "The Licensee shall not construct his/her pucca house/building after getting prior approval from the Zilla Parishad authority in writing. For getting such approval, he/she has to apply before the Zilla Parishad authority for getting building plan approval with necessary documents. For Morigans areas the building plan shall be approved by the concerned municipality subject to No-Objection Certificate from the Jalpaiguri Zilla Parishad."
    },
    {
      number: 5,
      text: "The Licensee shall maintain his/her building/shop/house in proper condition and shall repair it all times during his said period as may require."
    },
    {
      number: 6,
      text: "The Licensee shall use the land exclusively for the purpose of carrying on his/her legally permissible business. The Licensee shall not store/operate any offensive or dangerous goods and not conduct such types of commercial activities at the said premises."
    },
    {
      number: 7,
      text: "The Licensee shall obtain appropriate / necessary license or approval or permission for doing his/her business at his/her own cost from the competent authority / govt. department as per his/her requirements."
    },
    {
      number: 8,
      text: "The Licensee shall neither sublet the premise / building in total or part thereof nor involve any partnership with any entity in the said premises."
    },
    {
      number: 9,
      text: "The Licensee shall peacefully handover possession of the land/premises to the Jalpaiguri Zilla Parishad authority at the end of the tenure of the License period as prescribed and same for further period as per the Bye-Law of the Zilla Parishad. The Licensee intending to vacate the land/premise at an earlier date shall give a notice mentioning his/her intention to the Zilla Parishad authority before the expiry of the License period as mentioned in his / her License for the said land/premise."
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
        Subject to the following terms and Conditions:
      </h3>
      
      <div className="bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {terms.map((term) => (
            <div key={term.number} className="flex space-x-3">
              <div className="flex-shrink-0">
                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {term.number}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {term.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => onAgreementChange(e.target.checked)}
            className="mt-1 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            required
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I have read, understood, and agree to all the above terms and conditions. 
            I acknowledge that this license is subject to the rules and regulations of 
            Jalpaiguri Zilla Parishad and I will comply with all requirements.
          </span>
        </label>
      </div>
    </div>
  );
}