import { API_BASE_URL } from './config';

export type flashcardSet = {
    id: number;
    name: string;
};

export type NewFlashcardSet = {
    name: string;
    description: string;
    cards: { term: string; definition: string }[];
    userId: number;
};

// Получить список всех наборов
export const fetchflashcardSet = async (token: string): Promise<flashcardSet[]> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
};

// Получить набор по ID
export const fetchFlashcardSetById = async (token: string, id: number): Promise<flashcardSet> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
    }
    return res.json();
};

// Создать новый набор
export const createFlashcardSet = async (
    token: string,
    payload: NewFlashcardSet
): Promise<flashcardSet> => {
    const res = await fetch(`${API_BASE_URL}/flashcardSet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Ошибка сервера: ${res.statusText}`);
    }

    return res.json();
};
