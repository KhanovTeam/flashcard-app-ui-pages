export type flashcardSet = {
    id: number;
    name: string;
    cards?: { term: string; definition: string; id: number }[];
};

export type NewFlashcardSet = {
    name: string;
    description: string;
    cards: { term: string; definition: string }[];
};

export interface LastSeenFlashcardSetDto {
    flashcardSetId: number;
    flashcardSetName: string;
    openedAt: string;
}

export type Card = {
    term: string;
    definition: string;
};