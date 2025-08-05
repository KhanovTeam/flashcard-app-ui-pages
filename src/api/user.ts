import axios from 'axios';
import type {CreateUserDto, UserTypes} from '../types/UserTypes';
import {API_BASE_URL} from '../Constants/BaseURL';
import {authHeader} from '../Constants/AuthHeader';

/**
 * Регистрирует нового пользователя.
 *
 * Отправляет данные пользователя на сервер и возвращает информацию о созданном пользователе.
 *
 * @param data Данные для регистрации нового пользователя.
 * @returns Информацию о зарегистрированном пользователе.
 */
export const createUser = (data: CreateUserDto): Promise<UserTypes> =>
    axios.post(`${API_BASE_URL}/auth/registration`, data).then(res => res.data);

/**
 * Получает данные текущего пользователя.
 *
 * Отправляет запрос на сервер с токеном и возвращает информацию о пользователе.
 *
 * @param token Токен авторизации.
 * @returns Информацию о текущем пользователе.
 */
export const getCurrentUser = (token: string): Promise<UserTypes> =>
    axios.get(`${API_BASE_URL}/users/currentUser`, {
        headers: authHeader(token),
    }).then(res => res.data);