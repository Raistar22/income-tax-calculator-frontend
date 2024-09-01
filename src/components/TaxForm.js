import React, { useState } from 'react';
import { Button, TextField, MenuItem, Typography, Grid, Container, Paper } from '@mui/material';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { createTaxPlan } from '../api/taxPlans'; // Assume this is an API utility for creating tax plans

const TaxForm = () => {
    const [year, setYear] = useState(2024);
    const [income, setIncome] = useState(0);
    const [deductions, setDeductions] = useState({ standard: 0, section80C: 0, section80D: 0 });
    const [calculatedTax, setCalculatedTax] = useState(null);
    const [error, setError] = useState('');
    const [regime, setRegime] = useState('old');  // Add state to track selected tax regime
    const navigate = useNavigate();

    // Define tax slabs for different years and regimes
    const taxSlabs = {
        2024: {
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
        },
        2023: {
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
        },
        // Add more years and their slabs as needed
    };

    const calculateTax = () => {
        try {
            const slabs = taxSlabs[year]?.[regime]; // Use the selected year and regime
            if (!slabs) {
                throw new Error('Tax slabs not defined for the selected year and regime.');
            }

            const taxableIncome = income - deductions.standard - deductions.section80C - deductions.section80D;

            let tax = 0;
            let prevLimit = 0;

            for (const slab of slabs) {
                if (taxableIncome > slab.limit) {
                    tax += (slab.limit - prevLimit) * slab.rate;
                    prevLimit = slab.limit;
                } else {
                    tax += (taxableIncome - prevLimit) * slab.rate;
                    break;
                }
            }

            setCalculatedTax(tax);
            setError('');
        } catch (e) {
            console.error('Error calculating tax:', e);
            setError('Could not calculate tax. Please check your inputs.');
            setCalculatedTax(null);
        }
    };

    const handlePDFExport = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Tax Plan Report', 20, 20);

        doc.setFontSize(14);
        doc.text(`Year: ${year}`, 20, 40);
        doc.text(`Income: ₹${income}`, 20, 50);
        doc.text(`Standard Deduction: ₹${deductions.standard}`, 20, 60);
        doc.text(`Section 80C Deduction: ₹${deductions.section80C}`, 20, 70);
        doc.text(`Section 80D Deduction: ₹${deductions.section80D}`, 20, 80);
        doc.text(`Calculated Tax: ₹${calculatedTax !== null ? calculatedTax : 'N/A'}`, 20, 90);

        doc.save('tax-plan-report.pdf');
    };

    const handleSubmit = async () => {
        try {
            await createTaxPlan({ income, deductions, year, regime });
            navigate('/compare-tax-plans'); // Navigate to comparison page after saving
        } catch (error) {
            console.error("Error saving tax plan:", error);
        }
    };

    return (
        <Container className="tax-form-container">
            <Paper elevation={3} className="tax-form-paper">
                <Typography variant="h4" gutterBottom className="tax-form-title">
                    Tax Plan Form
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Year"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        >
                            <MenuItem value={2024}>2024-25</MenuItem>
                            <MenuItem value={2023}>2023-24</MenuItem>
                            <MenuItem value={2022}>2022-23</MenuItem>
                            <MenuItem value={2021}>2021-22</MenuItem>
                            {/* Add other years if needed */}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Tax Regime"
                            value={regime}
                            onChange={(e) => setRegime(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        >
                            <MenuItem value="old">Old Regime</MenuItem>
                            <MenuItem value="new">New Regime</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Income"
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Standard Deduction"
                            type="number"
                            value={deductions.standard}
                            onChange={(e) => setDeductions({ ...deductions, standard: Number(e.target.value) })}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Section 80C Deduction"
                            type="number"
                            value={deductions.section80C}
                            onChange={(e) => setDeductions({ ...deductions, section80C: Number(e.target.value) })}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Section 80D Deduction"
                            type="number"
                            value={deductions.section80D}
                            onChange={(e) => setDeductions({ ...deductions, section80D: Number(e.target.value) })}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={calculateTax} fullWidth>
                            Calculate Tax
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="secondary" onClick={handleSubmit} fullWidth>
                            Save Tax Plan
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="default" onClick={handlePDFExport} disabled={calculatedTax === null} fullWidth>
                            Export as PDF
                        </Button>
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        </Grid>
                    )}
                    {calculatedTax !== null && (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                Calculated Tax: ₹{calculatedTax}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default TaxForm;
