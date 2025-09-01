import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Survey from './pages/Survey';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import TaxManagement from './pages/TaxManagement';
import Payments from './pages/Payments';
import Defaulters from './pages/Defaulters';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UserDashboard from './pages/UserDashboard';
import SurveyTable from './pages/SurveyDetails';
import ApprovalOfficerReports from './pages/ApprovalOfficerReports';
import { Navigate, useLocation } from 'react-router-dom';


function isAuthenticated() {
  // Check for token in localStorage or cookies
  return !!localStorage.getItem('token') || !!document.cookie.match(/token=/);
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  return (
    <BrowserRouter basename='/HaatManagement'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/survey" element={
          <ProtectedRoute>
            <Layout>
              <Survey />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendors" element={
          <ProtectedRoute>
            <Layout>
              <Vendors />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/tax-management" element={
          <ProtectedRoute>
            <Layout>
              <TaxManagement />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <Layout>
              <Payments />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/defaulters" element={
          <ProtectedRoute>
            <Layout>
              <Defaulters />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/user-dashboard" element={
          <ProtectedRoute>
            <Layout>
              <UserDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/survey-details" element={
          <ProtectedRoute>
            <Layout>
              <SurveyTable />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/approvalofficerreport" element={
          <ProtectedRoute>
            <Layout>
              <ApprovalOfficerReports />
            </Layout>
          </ProtectedRoute>
        } />

      
      </Routes>


    </BrowserRouter>
  );
}

export default App;