import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FeedbackPage from './pages/FeedbackPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FeedbackPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default App;
