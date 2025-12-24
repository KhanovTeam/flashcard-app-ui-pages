import Cookies from 'js-cookie';

export type FlashcardMode = 'term' | 'definition';

const modeKey = (id: string | number) => `flashcard_mode_${id}`;

export const getFlashcardMode = (id: string | number): FlashcardMode =>
    (Cookies.get(modeKey(id)) as FlashcardMode) ?? 'term';

export const setFlashcardMode = (
    id: string | number,
    mode: FlashcardMode
) => {
    Cookies.set(modeKey(id), mode, { expires: 365 });
};
