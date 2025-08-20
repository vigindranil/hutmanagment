import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  IndianRupee,
  Shield,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react';
import bgimg from '../../src/assets/Haat Image.png'

const Landing: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Vendor Management',
      description: 'Complete digital registration and management of all vendors across market complexes, roadside stalls, and HUT complexes.',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: IndianRupee,
      title: 'Tax Collection',
      description: 'Automated tax calculation, billing, and collection with multiple payment options including UPI and cash.',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive reporting and analytics for collection tracking, defaulter management, and revenue insights.',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-grade security with role-based access control and encrypted data transmission.',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Zila Parishad
                </h1>
                <p className="text-xs text-gray-500 font-medium">Jalpaiguri</p>
              </div>
            </div>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full translate-x-48 translate-y-48"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  <span>Digital Tax Management System</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Haat
                  </span>
                  <br />
                  <span className="text-gray-900">Management</span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    System
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Complete digital solution for vendor registration, tax calculation, collection, and defaulter tracking across Jalpaiguri district.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-2xl">
                      <img
                        src={bgimg}
                        alt="Indian traditional market with vendors and colorful stalls"
                        className="w-full h-full object-cover scale-110 hover:scale-125 transition-all duration-700 ease-in-out"
                      />
                    </div>
                    <div className="w-3 h-3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Zila Parishad Jalpaiguri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;