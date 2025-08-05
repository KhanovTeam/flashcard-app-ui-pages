import axios from 'axios';
import {API_BASE_URL} from '../Constants/BaseURL';
import {AuthResponse} from '../types/authTypes';

/**
 * Выполняет вход пользователя по логину и паролю.
 *
 * Отправляет POST-запрос на эндпоинт `/auth/login`, ожидая в ответ JWT-токен в виде строки.
 * В случае ошибки извлекает сообщение из ответа сервера или возвращает сообщение по умолчанию.
 *
 * @param login Логин пользователя
 * @param password Пароль пользователя
 * @returns Объект {@link AuthResponse} с токеном при успехе или сообщением об ошибке
 */
export const login = async (login: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post<string>(`${API_BASE_URL}/auth/login`, {login, password}, {responseType: 'text',});
        return {token: response.data, errorMessage: null};
    } catch (error: unknown) {
        let message = 'Ошибка входа';

        if (axios.isAxiosError(error) && error.response) {
            const raw = error.response.data;
            message = typeof raw === 'string' ? raw : raw?.message || message;
        }
        return {token: null, errorMessage: message};
    }
};
