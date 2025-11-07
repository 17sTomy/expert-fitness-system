import axios from 'axios';
import { UserInput, Recommendation } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRecommendations = async (userInput: UserInput): Promise<Recommendation> => {
  const response = await api.post<Recommendation>('/api/recommendations', userInput);
  return response.data;
};

