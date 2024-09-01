// src/pages/TaxPlanForm.js
import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { getTaxPlans, createTaxPlan } from '../api/taxPlans';  // These functions now point to the internet API

const TaxPlanForm = () => {
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [year, setYear] = useState('2024-25');
  const [taxPlans, setTaxPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaxPlans = async () => {
      setLoading(true);
      try {
        const response = await getTaxPlans();
        setTaxPlans(response.data);
      } catch (error) {
        setError("Error fetching tax plans. Please try again later.");
        console.error("Error fetching tax plans from internet API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxPlans();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newPlan = { income, deductions, year };
      // Save to the backend or internet API
      const response = await createTaxPlan(newPlan);
      
      // Update local state with the newly created tax plan
      setTaxPlans([...taxPlans, response.data]);

      // Reset form fields
      setIncome('');
      setDeductions('');
      setError(null);
    } catch (error) {
      setError("Error saving tax plan. Please try again later.");
      console.error("Error saving tax plan using internet API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Tax Plan Form</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Income"
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Deductions"
        type="number"
        value={deductions}
        onChange={(e) => setDeductions(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Year"
        select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        fullWidth
        margin="normal"
        SelectProps={{
          native: true,
        }}
      >
        <option value="2024-25">2024-25</option>
        {/* Add more years as needed */}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '10px' }}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Tax Plan'}
      </Button>

      <div style={{ marginTop: '30px' }}>
        <Typography variant="h5" gutterBottom>Saved Tax Plans</Typography>
        {loading ? (
          <Typography>Loading tax plans...</Typography>
        ) : taxPlans.length === 0 ? (
          <Typography>No tax plans available. Please add a tax plan.</Typography>
        ) : (
          taxPlans.map((plan, index) => (
            <Card key={index} style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6">Tax Plan for {plan.year}</Typography>
                <Typography>Income: ₹{plan.income}</Typography>
                <Typography>Deductions: ₹{plan.deductions}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaxPlanForm;
