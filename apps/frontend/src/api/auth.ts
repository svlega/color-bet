import type { AuthPayload, AuthResponse } from '@color-bet/shared-types';
import { api } from './client';

export const register = (data: AuthPayload) =>
  api.post<AuthResponse>('/api/auth/register', data);

export const login = (data: AuthPayload) =>
  api.post<AuthResponse>('/api/auth/login', data);
