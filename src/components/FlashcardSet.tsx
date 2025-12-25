import {useParams, useNavigate} from 'react-router-dom';
import {useState, useCallback, useEffect} from 'react';
import {useGetFlashcardById} from "../hooks/UseFlashcardFetch.ts";
import {CardFlipper} from "./CardFlipper";
import {Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";
import {KeyboardButtons} from "../Constants/KeyboardButtons.ts";
import {deleteFlashcardSet} from "../api/flashcardSet.ts";
import {speakText} from "../services/textToSpeech";
import {getTermVoice, getDefVoice} from "../utils/voiceCookies";
import {getFlashcardMode, setFlashcardMode} from "../utils/flashcardModeCookie";

export const FlashcardSet = () => {
    const {id} = useParams<{ id: string }>();
    const {data, loading, error} = useGetFlashcardById(id || '');
    const navigate = useNavigate();
    const [flipped, setFlipped] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting] = useState(false);
    const [mode, setMode] = useState<'term' | 'definition'>('term');
    const [animating, setAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const cardsLength = data?.cards?.length || 0;
    const currentCard = data?.cards?.[displayedIndex];

    useEffect(() => {
        if (!id) return;
        setMode(getFlashcardMode(id));
    }, [id]);

    useEffect(() => {
        setFlipped(mode === 'definition');
    }, [mode]);

    const goNext = useCallback(() => {
        if (!cardsLength || animating) return;

        setAnimating(true);
        setSlideDirection('next');

        // Анимация выезда
        setTimeout(() => {
            // Меняем индекс на следующий
            setDisplayedIndex((prev) => (prev + 1) % cardsLength);
            // Переключаем направление для анимации заезда
            setSlideDirection('prev');

            // Анимация заезда
            setTimeout(() => {
                setSlideDirection(null);
                setAnimating(false);
                setFlipped(mode === 'definition');
            }, 200); // длительность анимации заезда
        }, 150); // длительность анимации выезда
    }, [cardsLength, animating, mode]);

    const goPrev = useCallback(() => {
        if (!cardsLength || animating) return;

        setAnimating(true);
        setSlideDirection('prev');

        setTimeout(() => {
            setDisplayedIndex((prev) => (prev === 0 ? cardsLength - 1 : prev - 1));
            setSlideDirection('next');

            setTimeout(() => {
                setSlideDirection(null);
                setAnimating(false);
                setFlipped(mode === 'definition');
            }, 200);
        }, 150);
    }, [cardsLength, animating, mode]);

    const toggleFlip = useCallback(() => setFlipped((prev) => !prev), []);

    const toggleMode = () => {
        if (!id) return;
        const newMode = mode === 'term' ? 'definition' : 'term';
        setMode(newMode);
        setFlashcardMode(id, newMode);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === KeyboardButtons.ARROW_RIGHT ||
                e.key === KeyboardButtons.ARROW_LEFT ||
                e.key === KeyboardButtons.SPACE ||
                e.key === KeyboardButtons.ARROW_UP
            ) e.preventDefault();

            if (e.key === KeyboardButtons.ARROW_RIGHT) goNext();
            else if (e.key === KeyboardButtons.ARROW_LEFT) goPrev();
            else if (e.key === KeyboardButtons.SPACE || e.key === KeyboardButtons.ARROW_UP) toggleFlip();
        };

        window.addEventListener("keydown", handleKeyDown, {passive: false});
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev, toggleFlip]);

    useEffect(() => {
        if (!currentCard || !id) return;

        if (!flipped && getTermVoice(id)) {
            speakText(currentCard.term);
        }

        if (flipped && getDefVoice(id)) {
            speakText(currentCard.definition);
        }
    }, [currentCard, flipped, id, displayedIndex]);

    const handleDelete = async () => {
        if (!id) return;
        try {
            await deleteFlashcardSet(id);
            navigate('/');
        } catch {
            alert('Не удалось удалить набор');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
            {!id && <Typography color="error">ID набора не найден в URL</Typography>}
            {loading && <Typography>Загрузка...</Typography>}
            {error && <Typography color="error">{error.message}</Typography>}
            {!loading && !error && !data && <Typography>Набор не найден</Typography>}
            {!loading && !error && data && cardsLength === 0 && <Typography>Карточки отсутствуют</Typography>}

            {!loading && !error && data && cardsLength > 0 && currentCard && (
                <>
                    <Typography variant="h4" gutterBottom>{data.name}</Typography>
                    <Typography>{displayedIndex + 1} / {cardsLength}</Typography>

                    <Box display="flex" gap={2} mt={2}>
                        <Button variant="outlined" onClick={() => navigate(`/flashcard-set/${id}/written`)}>Written</Button>
                        <Button variant="outlined" onClick={() => navigate(`/flashcard-set/${id}/learn`)}>Multiple Choice</Button>
                        <Button variant="contained" color="primary" onClick={() =>
                            navigate(`/flashcard-set/${id}/edit`, { state: { data } })}>Edit</Button>
                        <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
                    </Box>

                    <Box>
                        <CardFlipper
                            term={currentCard.term}
                            definition={currentCard.definition}
                            flipped={flipped}
                            onFlip={toggleFlip}
                            // Если карточка перевернута, инвертируем направление
                            slideDirection={
                                slideDirection && flipped
                                    ? slideDirection === 'next' ? 'prev' : 'next'
                                    : slideDirection
                            }
                        />
                    </Box>

                    <Box display="flex" gap={2} mt={2}>
                        <Button variant="outlined" onClick={goPrev}>Предыдущая</Button>
                        <Button variant="outlined" onClick={goNext}>Следующая</Button>
                        <Button variant="outlined" onClick={toggleMode}>{mode === 'term' ? 'to Def' : 'to Term'}</Button>
                        <Button variant="contained" color="secondary" onClick={() =>
                            speakText(flipped ? currentCard.definition : currentCard.term)}>🔊 Voice</Button>
                    </Box>

                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Подтверждение удаления</DialogTitle>
                        <DialogContent>
                            Вы действительно хотите удалить набор карточек "{data.name}"?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDelete} color="error" disabled={isDeleting}>
                                {isDeleting ? 'Удаление...' : 'Да'}
                            </Button>
                            <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>Нет</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};
