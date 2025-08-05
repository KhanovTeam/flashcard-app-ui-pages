import {API_BASE_URL} from '../Constants/BaseURL';
import type {flashcardSet, NewFlashcardSet, LastSeenFlashcardSetDto} from '../types/flashcardSetTypes';
import {authHeader} from '../Constants/AuthHeader';

/**
 * Получить все наборы карточек.
 *
 * @param token JWT-токен пользователя для авторизации.
 * @returns Массив объектов {@link flashcardSet}.
 * @throws Ошибка при неуспешном HTTP-ответе.
 */
export const fetchFlashcardSets = async (token: string): Promise<flashcardSet[]> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet`, {
        headers: authHeader(token),
    });
    if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
};

/**
 * Получить конкретный набор карточек по его ID.
 *
 * @param token JWT-токен пользователя для авторизации.
 * @param id Идентификатор набора карточек.
 * @returns Объект {@link flashcardSet} с заданным ID.
 * @throws Ошибка при неуспешном HTTP-ответе.
 */
export const fetchFlashcardSetById = async (token: string, id: number): Promise<flashcardSet> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet/${id}`, {
        headers: authHeader(token),
    });
    if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
};

/**
 * Создать новый набор карточек.
 *
 * @param token JWT-токен пользователя для авторизации.
 * @param payload Объект {@link NewFlashcardSet} с данными для создания набора.
 * @returns Созданный объект {@link flashcardSet}.
 * @throws Ошибка с текстом ответа сервера при неуспешном HTTP-ответе.
 */
export const createFlashcardSet = async (
    token: string,
    payload: NewFlashcardSet
): Promise<flashcardSet> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(token),
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка сервера: ${text}`);
    }
    return res.json();
};

/**
 * Получить недавно просмотренные наборы карточек пользователя.
 *
 * @param token JWT-токен пользователя для авторизации.
 * @returns Массив объектов {@link LastSeenFlashcardSetDto}.
 * При ошибке возвращается пустой массив.
 */
export const fetchLastSeenFlashcardSets = async (
    token: string
): Promise<LastSeenFlashcardSetDto[]> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet/LastSeenSets`, {
        headers: authHeader(token),
    });
    return res.ok ? res.json() : [];
};
