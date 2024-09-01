import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Grid, Button } from '@mui/material';

// TaxPlanComparison Component
const TaxPlanComparison = () => {
    const [taxPlans, setTaxPlans] = useState([]);

    useEffect(() => {
        const fetchTaxPlans = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tax-plans/');
                setTaxPlans(response.data);
            } catch (error) {
                console.error('Error fetching tax plans:', error);
            }
        };

        fetchTaxPlans();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/tax-plans/${id}`);
            setTaxPlans(taxPlans.filter(plan => plan.id !== id));
        } catch (error) {
            console.error('Error deleting tax plan:', error);
        }
    };

    const calculateTax = (income, deductions, year) => {
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

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4">Compare Tax Plans</Typography>
            <Grid container spacing={2}>
                {taxPlans.length === 0 ? (
                    <Typography>No tax plans found. Please create some tax plans.</Typography>
                ) : (
                    taxPlans.map(plan => (
                        <Grid item xs={12} md={6} lg={4} key={plan.id}>
                            <Paper elevation={3} style={{ padding: 16 }}>
                                <Typography variant="h6">Tax Plan for {plan.year}</Typography>
                                <Typography variant="body1">Income: ₹{plan.income}</Typography>
                                <Typography variant="body1">Standard Deduction: ₹{plan.standard_deduction}</Typography>
                                <Typography variant="body1">Section 80C Deduction: ₹{plan.section80C_deduction}</Typography>
                                <Typography variant="h6">Calculated Tax: ₹{calculateTax(plan.income, plan.standard_deduction + plan.section80C_deduction, plan.year)}</Typography>
                                <Button color="secondary" onClick={() => handleDelete(plan.id)}>Delete</Button>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </div>
    );
};

export default TaxPlanComparison;
