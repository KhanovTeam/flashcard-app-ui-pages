import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {fetchFlashcardSetById} from '../api/flashcardSet';
import {useAuth} from '../hooks/UseAuth';
import type {flashcardSet} from '../types/flashcardSetTypes';

/**
 * Компонент для отображения набора карточек по ID из URL.
 *
 * Загружает набор с сервера используя токен авторизации.
 * Отображает состояния загрузки, ошибки и результат.
 *
 * @returns JSX элемент с информацией о наборе карточек.
 */
export const FlashcardSet = () => {
    const {id} = useParams<{ id: string }>();
    const {token} = useAuth();
    const [setData, setSetData] = useState<flashcardSet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !token) return;
        const loadSet = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchFlashcardSetById(token, Number(id));
                setSetData(data);
            } catch {
                setError('Не удалось загрузить набор');
            } finally {
                setLoading(false);
            }
        };

        loadSet();
    }, [id, token]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{color: 'red'}}>{error}</div>;
    if (!setData) return <div>Набор не найден</div>;

    return (
        <div>
            <h2>{setData.name}</h2>
            {setData.cards?.length ? (
                <ul>
                    {setData.cards.map(card => (
                        <li key={card.id}>
                            <strong>{card.term}:</strong> {card.definition}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Карточки отсутствуют</p>
            )}
        </div>
    );
};
