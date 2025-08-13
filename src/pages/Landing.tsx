import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  IndianRupee, 
  Shield, 
  BarChart3, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

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

  const stats = [
    { number: '1,247', label: 'Registered Vendors', icon: Users },
    { number: '₹2.8L', label: 'Monthly Collection', icon: IndianRupee },
    { number: '92.8%', label: 'Collection Rate', icon: BarChart3 },
    { number: '24/7', label: 'System Uptime', icon: Clock }
  ];

  const benefits = [
    'Digital vendor registration with geolocation',
    'Automated tax calculation and billing',
    'Multiple payment gateway integration',
    'Real-time collection tracking',
    'Defaulter management system',
    'Mobile app for vendors and surveyors',
    'Comprehensive reporting dashboard',
    'SMS/WhatsApp notifications'
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
                <button className="bg-white/70 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:shadow-lg transition-all duration-300 border border-white/20">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Dashboard Overview</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <stat.icon className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-500">{stat.label}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{stat.number}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Tax Management</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your haat collection process with our comprehensive digital platform designed specifically for Zila Parishad operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 inline-block`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Our
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Tax Management System?</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Built specifically for Zila Parishad operations with features that address real-world challenges in vendor tax collection and management.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-8 h-8" />
                    <h3 className="text-xl font-bold">Mobile-First Design</h3>
                  </div>
                  <p className="text-emerald-100">
                    Access the system from anywhere with our responsive web application and dedicated mobile apps for vendors and surveyors.
                  </p>
                  <div className="flex items-center space-x-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">GPS Integration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Secure Payments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Tax Collection Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the digital revolution in vendor tax management. Start collecting taxes more efficiently today.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <span>Start Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Zila Parishad</h3>
                  <p className="text-sm text-gray-400">Jalpaiguri</p>
                </div>
              </div>
              <p className="text-gray-400">
                Digital vendor tax management system for efficient collection and tracking across Jalpaiguri district.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Zila Parishad Office</p>
                <p>Jalpaiguri District</p>
                <p>West Bengal - 735101</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Admin Login
                </Link>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Vendor Portal
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Zila Parishad Jalpaiguri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;