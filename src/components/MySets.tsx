import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {fetchFlashcardSets} from '../api/flashcardSet';
import {useAuth} from '../hooks/UseAuth';
import type {flashcardSet} from '../types/flashcardSetTypes';

/**
 * Компонент страницы с наборами карточек текущего пользователя.
 *
 * Загружает и отображает список наборов, принадлежащих пользователю.
 */
export const MySets = () => {
    const {token} = useAuth();
    const [sets, setSets] = useState<flashcardSet[]>([]);

    useEffect(() => {
        if (!token) return;
        fetchFlashcardSets(token).then(setSets);
    }, [token]);

    return (
        <div>
            <h2>Мои наборы</h2>
            <ul>
                {sets.map(set => (
                    <li key={set.id}>
                        <Link to={`/flashcard-set/${set.id}`}>{set.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
