import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TaxForm from './components/TaxForm';
import Login from './components/Login';
import TaxPlanComparison from './components/TaxPlanComparison';
import CompareTaxPlans from './pages/CompareTaxPlans';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<TaxForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/compare" element={<TaxPlanComparison />} />
                    <Route path="/compare-tax-plans" element={<CompareTaxPlans />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
