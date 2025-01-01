import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkHoursProvider } from './context/WorkHoursContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddWorkHours from './pages/WorkHours/AddWorkHours';
import EditWorkHours from './pages/WorkHours/EditWorkHours';
import WorkHoursList from './pages/WorkHours/WorkHoursList';
import FilterWorkHours from './pages/WorkHours/FilterWorkHours';
import CompleteWorkHours from './pages/WorkHours/CompleteWorkHours';
import HeadingsManagement from './pages/Headings/HeadingsManagement';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <WorkHoursProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/work-hours/add" element={<AddWorkHours />} />
              <Route path="/work-hours/edit/:id" element={<EditWorkHours />} />
              <Route path="/work-hours/list" element={<WorkHoursList />} />
              <Route path="/work-hours/filter" element={<FilterWorkHours />} />
              <Route path="/work-hours/complete" element={<CompleteWorkHours />} />
              <Route path="/headings" element={<HeadingsManagement />} />
            </Routes>
          </Layout>
        </WorkHoursProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;