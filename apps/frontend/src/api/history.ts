import type { BetHistoryItem } from '@color-bet/shared-types';
import { api } from './client';

export const fetchHistory = (page = 1) =>
  api.get<BetHistoryItem[]>(`/api/history?page=${page}`);
