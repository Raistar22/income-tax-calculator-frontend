import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const TaxPlanList = () => {
    const [taxPlans, setTaxPlans] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/tax-plans/')
            .then(response => setTaxPlans(response.data))
            .catch(error => console.error('Error fetching tax plans:', error));
    }, []);

    const deleteTaxPlan = (id) => {
        axios.delete(`http://localhost:3000/api/tax-plan/${id}/delete/`)
            .then(() => setTaxPlans(taxPlans.filter(plan => plan.id !== id)))
            .catch(error => console.error('Error deleting tax plan:', error));
    };

    return (
        <div>
            {taxPlans.map((plan) => (
                <div key={plan.id}>
                    <h3>Year: {plan.year}</h3>
                    <p>Income: ₹{plan.income}</p>
                    <p>Tax: ₹{plan.tax}</p>
                    <Button variant="contained" color="error" onClick={() => deleteTaxPlan(plan.id)}>
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default TaxPlanList;
