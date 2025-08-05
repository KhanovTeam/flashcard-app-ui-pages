import {createContext, useContext} from "react";
import {AuthContextType} from "../types/authTypes.ts";

/**
 * Контекст авторизации, предоставляющий токен, пользователя и методы входа/выхода.
 * Используется в связке с `AuthProvider`.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Хук для доступа к AuthContext.
 *
 * @returns Объект авторизации с токеном, пользователем и функциями входа/выхода
 * @throws Ошибка, если хук используется вне компонента `AuthProvider`
 *
 * @example
 * ```tsx
 * const { user, logout } = useAuth();
 * ```
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};