import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchFlashcardSetById} from "../api/flashcardSet";
import {useAuth} from "../hooks/UseAuth";
import type {flashcardSet} from "../types/flashcardSetTypes";
import {CardFlipper} from "./CardFlipper";
import {Box, Typography, Button} from "@mui/material";
import {KeyboardButtons} from "../Constants/KeyboardButtons.ts";

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

    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (!id || !token) return;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchFlashcardSetById(token, Number(id));
                setSetData(data);
                setCurrentIndex(0);
                setFlipped(false);
            } catch {
                setError("Не удалось загрузить набор");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, token]);

    const cardsLength = setData?.cards?.length || 0;

    const goNext = () => {
        if (!cardsLength) return;
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cardsLength);
    };

    const goPrev = () => {
        if (!cardsLength) return;
        setFlipped(false);
        setCurrentIndex((prev) => (prev === 0 ? cardsLength - 1 : prev - 1));
    };

    const toggleFlip = () => setFlipped((prev) => !prev);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === KeyboardButtons.ARROW_RIGHT || e.key === KeyboardButtons.ARROW_LEFT ||
                e.key === KeyboardButtons.SPACE || e.key === KeyboardButtons.ARROW_UP
            ) {
                e.preventDefault();
            }
            if (e.key === KeyboardButtons.ARROW_RIGHT) {
                goNext();
            } else if (e.key === KeyboardButtons.ARROW_LEFT) {
                goPrev();
            } else if (e.key === KeyboardButtons.SPACE || e.key === KeyboardButtons.ARROW_UP) {
                toggleFlip();
            }
        };
        window.addEventListener("keydown", handleKeyDown, {passive: false});
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cardsLength]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{color: "red"}}>{error}</div>;
    if (!setData) return <div>Набор не найден</div>;
    if (!cardsLength)
        return <Typography>Карточки отсутствуют</Typography>;

    const currentCard = setData.cards![currentIndex];

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
            <Typography variant="h4" gutterBottom>
                {setData.name}
            </Typography>

            <Typography>
                {currentIndex + 1} / {cardsLength}
            </Typography>

            <Box>
                <CardFlipper
                    term={currentCard.term}
                    definition={currentCard.definition}
                    flipped={flipped}
                    onFlip={toggleFlip}
                />
            </Box>

            <Box display="flex" gap={2} mt={2}>
                <Button variant="outlined" onClick={goPrev}>
                    Предыдущая
                </Button>
                <Button variant="outlined" onClick={goNext}>
                    Следующая
                </Button>
            </Box>
        </Box>
    );
};
