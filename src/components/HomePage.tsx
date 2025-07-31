import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchflashcardSet, flashcardSet } from '../api/flashcardSet.ts';
import { useAuth } from "../hooks/UseAuth.ts";
import * as styles from './HomePage.module.css.ts';

export const HomePage = () => {
    const { logout } = useAuth();
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
        <div className={styles.layout}>
            <aside className={styles.sidebar}>Sidebar</aside>

            <div className={styles.main}>
                <header className={styles.header}>
                    <h3>Header</h3>
                    <button onClick={logout}>Выйти</button>
                </header>

                <main className={styles.content}>
                    <h2>Ваши списки слов:</h2>
                    <ul>
                        {flashcardSet.map(list => (
                            <li key={list.id}>
                                <Link to={`/flashcard-set/${list.id}`}>{list.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Кнопка для перехода на страницу создания набора */}
                    <button onClick={() => navigate('/add-flashcard-set')} style={{ marginTop: 20 }}>
                        Добавить новый набор
                    </button>
                </main>
            </div>
        </div>
    );
};
