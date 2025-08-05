import {useEffect, useState} from 'react';
import {fetchLastSeenFlashcardSets} from '../api/flashcardSet';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../hooks/UseAuth';
import type {LastSeenFlashcardSetDto} from '../types/flashcardSetTypes';

/**
 * Компонент главной страницы.
 *
 * Отображает недавно просмотренные наборы карточек.
 * Позволяет перейти к созданию нового набора.
 */
export const Home = () => {
    const navigate = useNavigate();
    const {token} = useAuth();
    const [recentSets, setRecentSets] = useState<LastSeenFlashcardSetDto[]>([]);

    useEffect(() => {
        if (!token) return;
        fetchLastSeenFlashcardSets(token).then(setRecentSets);
    }, [token]);

    return (
        <div>
            <h2>Recent</h2>
            {recentSets.length === 0 ? (
                <p>Вы пока не открывали ни одного набора карточек.</p>
            ) : (
                <ul>
                    {recentSets.map(set => (
                        <li key={set.flashcardSetId}>
                            <Link to={`/flashcard-set/${set.flashcardSetId}`}>
                                {set.flashcardSetName}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate('/add-flashcard-set')} style={{marginTop: 20}}>
                Добавить новый набор
            </button>
        </div>
    );
};
