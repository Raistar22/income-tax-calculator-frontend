import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, CardContent, CardActions } from '@mui/material';
import { getTaxPlans, deleteTaxPlan } from '../api/taxPlans';  // Assume these are API utilities

const CompareTaxPlans = () => {
  const [taxPlans, setTaxPlans] = useState([]);

  useEffect(() => {
    const fetchTaxPlans = async () => {
      try {
        const plans = await getTaxPlans();
        setTaxPlans(plans);
      } catch (error) {
        console.error("Error fetching tax plans:", error);
      }
    };

    fetchTaxPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTaxPlan(id);
      setTaxPlans(taxPlans.filter(plan => plan.id !== id));
    } catch (error) {
      console.error("Error deleting tax plan:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4">Compare Tax Plans</Typography>
      {taxPlans.length === 0 ? (
        <Typography>No tax plans found. Please create some tax plans.</Typography>
      ) : (
        taxPlans.map(plan => (
          <Card key={plan.id} style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6">Tax Plan for {plan.year}</Typography>
              <Typography>Income: ₹{plan.income}</Typography>
              <Typography>Deductions: ₹{plan.deductions}</Typography>
              <Typography>Calculated Tax: ₹{calculateTax(plan.income, plan.deductions, plan.year)}</Typography>
            </CardContent>
            <CardActions>
              <Button color="secondary" onClick={() => handleDelete(plan.id)}>Delete</Button>
            </CardActions>
          </Card>
        ))
      )}
    </div>
  );
};

// Add logic to calculate tax based on slabs
const calculateTax = (income, deductions, year) => {
  // Implement your tax calculation logic based on year and slabs
  // Here is an example implementation
  const slabs = {
    "2024-25": {
      old: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ],
      new: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 750000, rate: 0.10 },
        { limit: 1000000, rate: 0.15 },
        { limit: 1250000, rate: 0.20 },
        { limit: 1500000, rate: 0.25 },
        { limit: Infinity, rate: 0.30 },
      ],
    }
  };
  
  const regime = year === "2024-25" ? 'old' : 'new';
  const slabsForYear = slabs["2024-25"][regime];
  
  let tax = 0;
  let remainingIncome = income - deductions;
  
  for (let i = 0; i < slabsForYear.length; i++) {
    const slab = slabsForYear[i];
    if (remainingIncome > slab.limit) {
      const nextSlabLimit = slabsForYear[i + 1] ? slabsForYear[i + 1].limit : Infinity;
      const taxableIncome = Math.min(remainingIncome, nextSlabLimit) - slab.limit;
      tax += taxableIncome * slab.rate;
      remainingIncome -= taxableIncome;
    } else {
      break;
    }
  }
  
  return tax;
};

export default CompareTaxPlans;
