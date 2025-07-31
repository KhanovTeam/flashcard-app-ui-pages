import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchFlashcardSetById, flashcardSet } from '../api/flashcardSet.ts'; // Функция для загрузки по id
import { useAuth } from '../hooks/UseAuth.ts';

export const FlashcardSetPage = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const [setData, setSetData] = useState<flashcardSet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadSet = async () => {
            setLoading(true);
            const numericId = Number(id); // преобразуем id в число
            const data = await fetchFlashcardSetById(token || '', numericId);
            setSetData(data);
            setLoading(false);
        };

        loadSet();
    }, [id, token]);

    if (loading) return <div>Загрузка...</div>;
    if (!setData) return <div>Набор не найден</div>;

    return (
        <div>
            <h2>{setData.name}</h2>
            {/* Здесь можно вывести карточки или другую информацию */}
        </div>
    );
};
