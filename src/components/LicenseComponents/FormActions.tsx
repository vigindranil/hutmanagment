import React from 'react';
import { FileText, Printer, Send } from 'lucide-react';

export function FormActions() {
  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsDraft = () => {
    alert('Form saved as draft!');
  };

  return (
    <div className="border-t-2 border-gray-200 pt-8">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Save as Draft</span>
          </button>
          
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Printer className="w-5 h-5" />
            <span>Print Form</span>
          </button>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Send className="w-5 h-5" />
          <span>Submit Application</span>
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          For any queries, please contact: <strong>aeo.jalzp@gmail.com</strong> or visit{' '}
          <strong>www.jalpaigurizp.in</strong>
        </p>
      </div>
    </div>
  );
}