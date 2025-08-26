import {httpClient} from "./httpClient.ts";
import {FLASHCARD_SET_URL} from "../Constants/BaseURL.ts";
import type {FlashcardSet} from "../types/flashcardSetTypes.ts";

export const createFlashcardSet = async (flashcardSet: FlashcardSet) => {
    await httpClient<FlashcardSet>(FLASHCARD_SET_URL, {
        method: "POST",
        body: flashcardSet
    });
}

export const updateFlashcardSet = async (flashcardSet: FlashcardSet) => {
    await httpClient<FlashcardSet>(`${FLASHCARD_SET_URL}/${flashcardSet.id}`, {
        method: "PUT",
        body: flashcardSet
    });
};
