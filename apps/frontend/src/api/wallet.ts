import { api } from './client';

export const fetchWallet = () => api.get<{ balance: number }>('/api/wallet');
