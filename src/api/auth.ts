import axios from 'axios';
import { API_BASE_URL } from './config';

export interface AuthResponse {
    token: string | null;
    errorMessage: string | null;
}

export const login = async (login: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post<string>(`${API_BASE_URL}/auth/login`, { login, password }, {
            responseType: 'text',
        });
        return { token: response.data, errorMessage: null };
    } catch (error: unknown) {
        let message = 'Ошибка входа';

        if (axios.isAxiosError(error) && error.response) {
            const raw = error.response.data;
            message = typeof raw === 'string' ? raw : raw?.message || message;
        }
        return { token: null, errorMessage: message };
    }
};
