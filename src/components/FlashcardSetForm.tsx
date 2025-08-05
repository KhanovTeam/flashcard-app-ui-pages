import {useState, useEffect} from 'react';
import {useAuth} from '../hooks/UseAuth';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, TextField, Typography, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {createFlashcardSet} from '../api/flashcardSet';
import {getCurrentUser} from '../api/user';
import type {Card} from '../types/flashcardSetTypes';


/**
 * Компонент формы для создания нового набора карточек.
 *
 * Позволяет ввести название, описание и добавить/удалить карточки.
 * Загружает текущего пользователя для присвоения набора.
 * Выполняет валидацию и отправляет данные на сервер.
 *
 * @returns JSX элемент с формой создания набора карточек.
 */
export const FlashcardSetForm = () => {
    const {token} = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState<Card[]>([
        {term: '', definition: ''},
        {term: '', definition: ''},
        {term: '', definition: ''},
        {term: '', definition: ''},
    ]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;
            try {
                const user = await getCurrentUser(token);
                setUserId(user.id);
            } catch (error) {
                alert('Ошибка при получении пользователя');
                console.error(error);
            }
        };
        loadUser();
    }, [token]);

    /**
     * Обновляет данные конкретной карточки.
     *
     * @param index Индекс карточки в списке.
     * @param field Поле карточки для обновления ('term' или 'definition').
     * @param value Новое значение для поля.
     */
    const handleCardChange = (index: number, field: keyof Card, value: string) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    /** Добавляет пустую карточку в список */
    const addCard = () => {
        setCards([...cards, {term: '', definition: ''}]);
    };

    /**
     * Удаляет карточку по индексу.
     *
     * @param index Индекс карточки, которую нужно удалить.
     */
    const deleteCard = (index: number) => {
        setCards(cards.filter((_, i) => i !== index));
    };

    /**
     * Обрабатывает отправку формы создания набора.
     *
     * Выполняет валидацию и вызывает API для создания набора.
     *
     * @param e Событие отправки формы.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || userId === null) {
            alert('Ошибка: пользователь не найден');
            return;
        }

        if (!name.trim()) {
            alert('Введите название набора');
            return;
        }

        if (cards.length === 0 || cards.some(card => !card.term.trim() || !card.definition.trim())) {
            alert('Все карточки должны содержать термин и определение');
            return;
        }
        const payload = {
            name, description, cards, userId,
        };

        try {
            await createFlashcardSet(token, payload);
            alert('Набор создан!');
            navigate('/');
        } catch (error) {
            alert('Ошибка при создании набора');
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Создать новый набор карточек
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Название"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />

                <TextField
                    label="Описание"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />

                <Typography variant="h6" gutterBottom mt={2}>
                    Карточки
                </Typography>

                {cards.map((card, i) => (
                    <Box key={i} display="flex" gap={2} alignItems="center" mb={2}>
                        <TextField
                            label="Термин"
                            value={card.term}
                            onChange={e => handleCardChange(i, 'term', e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Определение"
                            value={card.definition}
                            onChange={e => handleCardChange(i, 'definition', e.target.value)}
                            fullWidth
                            required
                        />
                        <IconButton onClick={() => deleteCard(i)} color="error">
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                ))}

                <Button onClick={addCard} variant="outlined" sx={{mt: 1, mb: 2}}>
                    Добавить карточку
                </Button>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Создать набор
                </Button>
            </Box>
        </Container>
    );
};
