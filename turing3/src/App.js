import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import MainCallsPage from './MainCallsPage/MainCallsPage';
import CallDetailPage from './CallDetailPage/CallDetailPage';

function App() {
  return (
    <Router>


      <Routes>
      <Route exact path="/" element={<MainCallsPage />} />
      <Route path="/calldetailpage/:id/:token" element={<CallDetailPage></CallDetailPage>} />
      </Routes>
    </Router>
  );
}

export default App;
