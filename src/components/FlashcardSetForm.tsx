import {useState} from 'react';
import {useAuth} from '../hooks/UseAuth';
import {useLocation, useNavigate} from 'react-router-dom';
import {Box, Button, Container, IconButton, TextField, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type {Card, FlashcardSet} from '../types/flashcardSetTypes';
import {createFlashcardSet, updateFlashcardSet} from "../api/flashcardSet.ts";

export const FlashcardSetForm = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const propData = location.state?.data;
    const isEditMode = !!propData; // режим редактирования
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>(() => {
        if (propData) {
            return {
                id: propData.id,
                name: propData.name,
                description: propData.description,
                cards: propData.cards?.map((c: Card) => ({
                    term: c.term,
                    definition: c.definition
                })) || [],
                userId: propData.userId || user?.id
            };
        }
        return {
            name: '',
            description: '',
            cards: [
                {term: '', definition: ''},
                {term: '', definition: ''}
            ],
            userId: user?.id
        };
    });

    const handleCardChange = (index: number, field: keyof Card, value: string) => {
        const newCards = [...flashcardSet.cards];
        newCards[index][field] = value;
        setFlashcardSet({...flashcardSet, cards: newCards});
    };

    const addCard = () => {
        setFlashcardSet({...flashcardSet, cards: [...flashcardSet.cards, {term: '', definition: ''}]});
    };

    const deleteCard = (index: number) => {
        setFlashcardSet({...flashcardSet, cards: flashcardSet.cards.filter((_, i) => i !== index)});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!user?.id) {
            setError('Пользователь не авторизован');
            return;
        }

        if (!flashcardSet.name || !flashcardSet.description || !flashcardSet.cards.every(card => card.term && card.definition)) {
            setError('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode && flashcardSet.id) {
                await updateFlashcardSet(flashcardSet);
            } else {
                await createFlashcardSet(flashcardSet);
            }
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении набора');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {isEditMode ? 'Редактировать набор карточек' : 'Создать новый набор карточек'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                {error && (
                    <Typography color="error" sx={{mb: 2}}>
                        {error}
                    </Typography>
                )}
                <TextField
                    label="Название"
                    value={flashcardSet.name}
                    onChange={e => setFlashcardSet({...flashcardSet, name: e.target.value})}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Описание"
                    value={flashcardSet.description}
                    onChange={e => setFlashcardSet({...flashcardSet, description: e.target.value})}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />
                <Typography variant="h6" gutterBottom mt={2}>
                    Карточки
                </Typography>
                {flashcardSet.cards.map((card, i) => (
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Сохранение...' : isEditMode ? 'Сохранить изменения' : 'Создать набор'}
                </Button>
            </Box>
        </Container>
    );
};
