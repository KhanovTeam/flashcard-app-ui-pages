import {useParams, useNavigate} from 'react-router-dom';
import {useState, useCallback, useEffect} from 'react';
import {useGetFlashcardById} from "../hooks/UseFlashcardFetch.ts";
import {CardFlipper} from "./CardFlipper";
import {Box, Typography, Button} from "@mui/material";
import {KeyboardButtons} from "../Constants/KeyboardButtons.ts";

export const FlashcardSet = () => {
    const {id} = useParams<{ id: string }>();
    const {data, loading, error} = useGetFlashcardById(id || '');
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const cardsLength = data?.cards?.length || 0;
    const currentCard = data?.cards?.[currentIndex];

    const goNext = useCallback(() => {
        if (!cardsLength) return;
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cardsLength);
    }, [cardsLength]);

    const goPrev = useCallback(() => {
        if (!cardsLength) return;
        setFlipped(false);
        setCurrentIndex((prev) => (prev === 0 ? cardsLength - 1 : prev - 1));
    }, [cardsLength]);

    const toggleFlip = useCallback(() => setFlipped((prev) => !prev), []);

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
                    <Typography>{currentIndex + 1} / {cardsLength}</Typography>

                    <Box display="flex" gap={2} mt={2}>
                        {/* Заглушки */}
                        <Button variant="outlined" onClick={() => {}}>Learn</Button>
                        <Button variant="outlined" onClick={() => {}}>Test</Button>
                        {/* Edit */}
                        <Button variant="contained" color="primary" onClick={() => navigate(`/flashcard-set/${id}/edit`, { state: { data } })}>Edit</Button>
                    </Box>

                    <Box>
                        <CardFlipper
                            term={currentCard.term}
                            definition={currentCard.definition}
                            flipped={flipped}
                            onFlip={toggleFlip}
                        />
                    </Box>

                    <Box display="flex" gap={2} mt={2}>
                        <Button variant="outlined" onClick={goPrev}>Предыдущая</Button>
                        <Button variant="outlined" onClick={goNext}>Следующая</Button>
                    </Box>
                </>
            )}
        </Box>
    );
};
