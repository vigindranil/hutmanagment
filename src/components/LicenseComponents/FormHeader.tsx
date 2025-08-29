import React from 'react';
import { Building2, Mail, Globe } from 'lucide-react';

export function FormHeader() {
  return (
    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 border-b-4 border-green-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-green-600 p-3 rounded-full">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              JALPAIGURI ZILLA PARISHAD
            </h1>
            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-700">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>aeo.jalzp@gmail.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>www.jalpaigurizp.in</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-white p-2 rounded border border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LICENSE No.
            </label>
            <div className="h-8 w-32 bg-gray-50 border rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h2 className="bg-green-600 text-white py-3 px-6 rounded-full text-xl font-bold inline-block">
          LICENSE FOR SHOP KEEPERS ON THE ZILLA PARISHAD LAND
        </h2>
        <p className="mt-3 text-gray-700 font-medium">
          License for Commercial Activity for Shopkeepers on the land of Jalpaiguri Zilla Parishad is hereby issued to:
        </p>
      </div>
    </div>
  );
}