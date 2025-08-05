import {useState, useEffect, ReactNode} from 'react';
import {AuthContext} from '../hooks/UseAuth';

/**
 * Тип, представляющий пользователя.
 */
type User = {
    id: number;
    name: string;
};

/**
 * Провайдер контекста авторизации.
 *
 * Оборачивает приложение и предоставляет информацию о пользователе,
 * токене и методы входа/выхода через `AuthContext`.
 *
 * Загружает данные из `localStorage` при инициализации.
 *
 */
export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Загружает токен и пользователя из `localStorage` при монтировании компонента.
     */
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        setToken(storedToken);
        try {
            setUser(storedUser ? JSON.parse(storedUser) : null);
        } catch {
            setUser(null);
        }
        setLoading(false);
    }, []);

    /**
     * Выполняет вход: сохраняет токен и пользователя в `localStorage` и обновляет состояние.
     *
     * @param newToken JWT-токен
     * @param newUser Объект пользователя
     */
    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    /**
     * Выполняет выход: удаляет токен и пользователя из `localStorage` и сбрасывает состояние.
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{token, user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
