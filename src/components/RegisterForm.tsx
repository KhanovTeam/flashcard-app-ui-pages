import {useState} from 'react';
import {createUser} from '../api/user'; // проверь, что путь правильный
import {login} from '../api/auth'; // импорт функции логина
import type {CreateUserDto} from '../types/User';
import {useAuth} from "../hooks/UseAuth.ts";
import axios from 'axios';
import {Box, Button, TextField, Typography, Alert, Stack} from '@mui/material';

interface RegisterFormProps {
    onSuccess?: () => void; // например, переход на главную страницу
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [form, setForm] = useState<CreateUserDto>({
        name: '',
        surname: '',
        login: '',
        password: '',
    });

    const [error, setError] = useState('');
    const {login: saveToken} = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // сбрасываем ошибку перед отправкой

        const isFormValid = Object.values(form).every(value => value.trim() !== '');
        if (!isFormValid) {
            setError('Не все обязательные поля заполнены');
            return;
        }

        try {
            // 1. Создаем пользователя
            await createUser(form);

            // 2. Логинимся с тем же логином и паролем
            const res = await login(form.login, form.password);

            if (res.token) {
                saveToken(res.token);  // сохраняем токен в контекст и localStorage
                onSuccess?.();         // вызываем callback (например, переход)
            } else {
                setError(res.errorMessage || 'Ошибка при входе после регистрации');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const rawMessage = error.response?.data;
                const message = typeof rawMessage === 'string'
                    ? rawMessage
                    : rawMessage?.message || '';

                if (message.includes('already exists') || message.includes('unique constraint') || message.includes('уже существует')) {
                    setError(`Пользователь с логином ${form.login} уже существует`);
                } else if (message) {
                    setError(message);
                } else {
                    setError('Ошибка при регистрации');
                }
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    };

    const isFieldEmpty = (field: string) => form[field as keyof CreateUserDto].trim() === '' && error !== '';

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
                mt: 2,
                width: '100%',
                maxWidth: 450,
                mx: 'auto',
                px: 2,
                boxSizing: 'border-box',
            }}
        >
            <Stack spacing={2}>
                <Typography variant="h5" align="center">
                    Регистрация
                </Typography>

                <TextField
                    label="Имя"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={isFieldEmpty('name')}
                />
                <TextField
                    label="Фамилия"
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={isFieldEmpty('surname')}
                />
                <TextField
                    label="Логин"
                    name="login"
                    value={form.login}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={isFieldEmpty('login')}
                />
                <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={isFieldEmpty('password')}
                />

                {/* Резервируем место под ошибку */}
                <Box sx={{ minHeight: 52, overflow: 'hidden' }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            title={error}
                        >
                            {error}
                        </Alert>
                    )}
                </Box>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Зарегистрироваться
                </Button>
            </Stack>
        </Box>
    );

}
export default RegisterForm;
