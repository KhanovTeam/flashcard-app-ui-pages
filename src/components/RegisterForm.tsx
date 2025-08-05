import {useState} from 'react';
import {createUser, getCurrentUser} from '../api/user';
import {login} from '../api/auth';
import type {CreateUserDto} from '../types/UserTypes';
import {useAuth} from '../hooks/UseAuth';
import axios from 'axios';
import {Box, Button, TextField, Typography, Alert, Stack} from '@mui/material';

/**
 * Свойства формы регистрации.
 *
 * @property onSuccess Функция, вызываемая при успешной регистрации и входе в систему.
 */
interface RegisterFormProps {
    onSuccess?: () => void;
}

/**
 * Компонент формы регистрации нового пользователя.
 *
 * Выполняет создание пользователя, авторизацию, сохранение токена и информации о пользователе.
 * Обрабатывает ошибки регистрации и входа.
 *
 * @param onSuccess Функция, вызываемая при успешной регистрации и авторизации.
 */
export const RegisterForm = ({onSuccess}: RegisterFormProps) => {
    const [form, setForm] = useState<CreateUserDto>({
        name: '',
        surname: '',
        login: '',
        password: '',
    });

    const [error, setError] = useState('');
    const {login: saveAuth} = useAuth(); // сохраняем и токен, и пользователя

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const isFormValid = Object.values(form).every(value => value.trim() !== '');
        if (!isFormValid) {
            setError('Не все обязательные поля заполнены');
            return;
        }

        try {
            await createUser(form);
            const res = await login(form.login, form.password);

            if (res.token) {
                const user = await getCurrentUser(res.token);
                saveAuth(res.token, user);
                onSuccess?.();
            } else {
                setError(res.errorMessage || 'Ошибка при входе после регистрации');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const rawMessage = error.response?.data;
                const message = typeof rawMessage === 'string'
                    ? rawMessage
                    : rawMessage?.message || '';

                if (
                    message.includes('already exists') ||
                    message.includes('unique constraint') ||
                    message.includes('уже существует')
                ) {
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

    const isFieldEmpty = (field: string) =>
        form[field as keyof CreateUserDto].trim() === '' && error !== '';

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

                {/* Ошибка */}
                <Box sx={{minHeight: 52}}>
                    {error && (
                        <Alert severity="error">{error}</Alert>
                    )}
                </Box>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Зарегистрироваться
                </Button>
            </Stack>
        </Box>
    );
};
