import axios from 'axios';

const API_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-similarities';  // Replace with your actual API URL

export const createTaxPlan = (taxPlan) => {
  return axios.post(`${API_URL}`, taxPlan);
};

export const getTaxPlans = (taxPlan) => {
  return axios.get(`${API_URL}`,taxPlan);
};



export const deleteTaxPlan = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
