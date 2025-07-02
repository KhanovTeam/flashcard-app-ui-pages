import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface AuthResponse {
    token: string | null;
    errorMessage: string | null;
}

export const login = async (login: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post<string>(`${API_URL}/login`, { login, password }, {
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
