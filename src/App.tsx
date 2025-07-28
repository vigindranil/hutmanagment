import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;