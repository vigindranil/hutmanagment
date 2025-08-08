import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Users,
  BarChart3,
  CheckCircle
} from 'lucide-react';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';


const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);


    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": email,
      "password": password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(BASE_API_URL + "auth/authentication", requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response?.status}`);
      }

      const result = await response.json();
      if (result?.status == 0) {
        Cookies.set('token', result?.data?.access_token);
        const decoded_data = jwtDecode<any>(result?.data?.access_token || "");
        const user_details = JSON.parse(decoded_data?.userDetails);

        if (loginType === 'admin' && user_details?.UserTypeID == 100){ // for admin
          navigate('/dashboard');
        } else if(loginType === 'user' && user_details?.UserTypeID == 1) { // for user
          navigate('/user-dashboard');
        } else {
          Swal?.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid login type or credentials',
            confirmButtonColor: '#d33'
          });
        }

      } else {
        Swal?.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result?.message || 'Please check your credentials and try again.',
          confirmButtonColor: '#d33'
        });
      }
      
      console.log("Token Response:", result);
      setIsLoading(false);
    }
      catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      alert("Login failed. Please check your credentials and try again.");
    }
  };


  const features = [
    {
      icon: Users,
      title: 'Vendor Management',
      description: 'Complete digital registration and tracking'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time collection insights and reports'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-grade security and data protection'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Zila Parishad
                </h1>
                <p className="text-sm text-gray-500 font-medium">Jalpaiguri</p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access the Vendor Tax Management System</p>
            </div>
          </div>

          {/* Login Type Switch */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => setLoginType('user')}
              className={`px-4 py-2 rounded-l-xl border border-blue-600 font-semibold transition-colors ${
                loginType === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`px-4 py-2 rounded-r-xl border border-blue-600 font-semibold transition-colors ${
                loginType === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              Admin Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                  {loginType === 'admin' ? 'Admin Id' : 'User Id'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    autoComplete="off"
                    required
                    value={email}
                    onChange={(e) => setEmail(String(e?.target?.value))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder={loginType === 'admin' ? 'Enter your Admin Id' : 'Enter your User Id'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e?.target?.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                loginType === 'admin' ? 'Sign in as Admin' : 'Sign in as User '
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-36 -translate-x-36"></div>

        <div className="relative flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Modern Tax Management
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Streamline your vendor tax collection process with our comprehensive digital platform designed for Zila Parishad operations.
            </p>
          </div>

          <div className="space-y-8">
            {features?.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{feature?.title}</h3>
                  <p className="text-blue-100">{feature?.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-semibold">Trusted by Government</span>
            </div>
            <p className="text-blue-100 text-sm">
              Built specifically for Zila Parishad operations with compliance to government standards and security protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;