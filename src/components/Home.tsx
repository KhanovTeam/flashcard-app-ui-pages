import { useEffect, useState } from 'react';
import { fetchflashcardSet, flashcardSet } from '../api/flashcardSet.ts';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();
    const [flashcardSet, setFlashcardSet] = useState<flashcardSet[]>([]);

    useEffect(() => {
        const loadFlashcardSet = async () => {
            const token = localStorage.getItem('token') || '';
            try {
                const data = await fetchflashcardSet(token);
                setFlashcardSet(data);
            } catch (e) {
                console.error('Ошибка загрузки списков:', e);
                alert('Ошибка загрузки списков');
            }
        };

        loadFlashcardSet();
    }, []);

    return (
        <div>
            <h2>Ваши списки слов:</h2>
            <ul>
                {flashcardSet.map(list => (
                    <li key={list.id}>
                        <Link to={`/flashcard-set/${list.id}`}>{list.name}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/add-flashcard-set')} style={{ marginTop: 20 }}>
                Добавить новый набор
            </button>
        </div>
    );
};
