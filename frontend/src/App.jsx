import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleList from './pages/VehicleList';
import VehicleDetails from './pages/VehicleDetails';
import Alerts from './pages/Alerts';
import Fuel from './pages/Fuel';
import Services from './pages/Services';
import Expenses from './pages/Expenses';
import Modifications from './pages/Modifications';
import Tires from './pages/Tires';
import Documents from './pages/Documents';
import RunningChart from './pages/RunningChart';
import Reports from './pages/Reports';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import Users from './pages/Users';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicles" element={<VehicleList />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="services" element={<Services />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="modifications" element={<Modifications />} />
            <Route path="tires" element={<Tires />} />
            <Route path="documents" element={<Documents />} />
            <Route path="journeys" element={<RunningChart />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
