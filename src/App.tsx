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

function App() {
  return (
    
  // <BrowserRouter>
     <BrowserRouter basename='/HutManagement'>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/survey" element={
            <Layout>
              <Survey />
            </Layout>
          } />
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/vendors" element={
            <Layout>
              <Vendors />
            </Layout>
          } />
          <Route path="/tax-management" element={
            <Layout>
              <TaxManagement />
            </Layout>
          } />
          <Route path="/payments" element={
            <Layout>
              <Payments />
            </Layout>
          } />
          <Route path="/defaulters" element={
            <Layout>
              <Defaulters />
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="/user-dashboard" element={
            <Layout>
              <UserDashboard />
            </Layout>
          } />
          <Route path="/survey-details" element={
            <Layout>
              <SurveyTable />
            </Layout>
          } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;