import type { User, LoginRequest,RegisterRequest } from '@/types';

import api from '../api';

export const authApi = {
    login: (data: LoginRequest) => api.post<User>('/auth/login', data),
    register: (data: RegisterRequest) => api.post<User>('/auth/register', data),
    logout: () => api.post('/auth/logout'),
};
