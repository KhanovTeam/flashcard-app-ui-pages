import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useGetFlashcardById } from "../hooks/UseFlashcardFetch";

type Mode = "definitionToTerm" | "termToDefinition";

export const MultipleChoice = () => {
    const { id } = useParams<{ id: string }>(); // Получаем ID набора из URL
    const navigate = useNavigate();
    const { data, loading, error } = useGetFlashcardById(id || ""); // Получаем данные набора с сервера
    const cards = useMemo(() => data?.cards || [], [data?.cards]); // Мемоизированный массив карточек (устраняет лишние срабатывания useEffect)
    const [mode, setMode] = useState<Mode | null>(null); // Режим теста, выбранный пользователем
    const [errors, setErrors] = useState(0); //Счётчик ошибок
    const [index, setIndex] = useState(0); //Индекс текущей карточки
    const [message, setMessage] = useState<"correct" | "incorrect" | null>(null); //Сообщение о результате клика
    const [completed, setCompleted] = useState(false); //Флаг завершения теста
    const [options, setOptions] = useState<string[]>([]); //Варианты ответа для текущей карточки
    const currentCard = cards[index]; //Текущая карточка

    //Генерация вариантов ответа при смене карточки
    useEffect(() => {
        if (!currentCard || !mode) return;

        // Правильный ответ
        const correctAnswer = mode === "definitionToTerm"
            ? currentCard.term
            : currentCard.definition;

        // Три неправильных варианта
        const wrong = cards
            .filter(c => mode === "definitionToTerm"
                ? c.term !== currentCard.term
                : c.definition !== currentCard.definition
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Преобразуем их в нужный формат (term или definition)
        const wrongMapped = wrong.map(c =>
            mode === "definitionToTerm" ? c.term : c.definition
        );

        // Объединяем правильный и неправильные варианты, перемешиваем
        setOptions([...wrongMapped, correctAnswer].sort(() => Math.random() - 0.5));
    }, [currentCard, cards, mode]);

    //Обработка выбора варианта ответа
    const handleAnswer = (answer: string) => {
        if (!currentCard || !mode) return;

        // Определяем правильный ответ
        const correctAnswer = mode === "definitionToTerm"
            ? currentCard.term
            : currentCard.definition;

        if (answer === correctAnswer) {
            // Пользователь ответил правильно
            setMessage("correct");

            setTimeout(() => {
                setMessage(null);

                // Переходим к следующей карточке или завершаем тест
                if (index + 1 < cards.length) {
                    setIndex(prev => prev + 1);
                } else {
                    setCompleted(true);
                }
            }, 1000);
        } else {
            // Пользователь ответил неправильно
            setMessage("incorrect");
            setErrors(prev => prev + 1); // увеличиваем счётчик ошибок
            setTimeout(() => setMessage(null), 1000);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
            {!id && (<Typography color="error">ID набора не найден в URL</Typography>)}
            {loading && <Typography>Загрузка...</Typography>}
            {error && (<Typography color="error">{error.message}</Typography>)}
            {!loading && !error && !data && (<Typography>Набор не найден</Typography>)}
            {!loading && !error && data && cards.length === 0 && (<Typography>Карточки отсутствуют</Typography>)}

            {/* Выбор режима */}
            {!loading && !error && data && cards.length > 0 && !mode && (
                <><Typography variant="h4" gutterBottom>{data.name}</Typography>
                    <Typography>Выберите режим тренировки</Typography>

                    <Box display="flex" flexDirection="column" gap={2} width="300px">
                        <Button variant="contained" onClick={() => setMode("definitionToTerm")}>Определение → Термин</Button>
                        <Button variant="contained" onClick={() => setMode("termToDefinition")}>Термин → Определение</Button>
                    </Box>

                    <Button onClick={() => navigate(`/flashcard-set/${id}`)}>Назад</Button></>)}

            {/* Основной тест */}
            {!loading && !error && data && cards.length > 0 && mode && currentCard && (<>
                    <Typography variant="h4">{data.name}</Typography>
                    <Typography>{index + 1} / {cards.length}</Typography>

            {/* Блок с вопросом */}
            <Box mt={4} p={3} border="1px solid #ccc" borderRadius="8px">
                <Typography variant="h6">
                    {mode === "definitionToTerm" ? currentCard.definition : currentCard.term}
                </Typography>
            </Box>

            {/* Варианты ответа */}
            <Box
                mt={4}
                display="grid"
                gridTemplateColumns="1fr 1fr"
                gap={2}
                width="400px"
                margin="0 auto"
            >
                {options.map((opt, i) => (
                    <Button key={i} variant="contained" onClick={() => handleAnswer(opt)}>
                        {opt}
                    </Button>
                ))}
            </Box>

            {/* Сообщения */}
            {message === "correct" && <Typography mt={3} color="green">Правильный ответ!</Typography>}
            {message === "incorrect" && <Typography mt={3} color="red">Неправильный ответ</Typography>}

            {/* Финальный popup */}
            <Dialog open={completed}>
                <DialogTitle>Поздравляем!</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы выполнили упражнение!<br />
                        Ошибок: {errors}<br /><br />
                        Нажмите, чтобы вернуться к набору карточек "{data.name}".
                    </Typography>
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => navigate(`/flashcard-set/${id}`)}>
                        Вернуться
                    </Button>
                </DialogContent>
            </Dialog></>)}
        </Box>
    );
};
