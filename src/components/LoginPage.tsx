import { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../hooks/UseAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Link,
    Stack
} from '@mui/material';

export const LoginPage = () => {
    const [form, setForm] = useState({ login: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState({ login: false, password: false });
    const { login: saveToken } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const hasLogin = form.login.trim() !== '';
        const hasPassword = form.password.trim() !== '';

        // Отметить поля с ошибками
        setFieldErrors({
            login: !hasLogin,
            password: !hasPassword
        });

        if (!hasLogin || !hasPassword) {
            setError('Обязательные поля не заполнены');
            return;
        }

        try {
            const res = await login(form.login, form.password);
            if (res.token) {
                saveToken(res.token);
                navigate('/');
            } else {
                setError(res.errorMessage || 'Ошибка входа');
            }
        } catch {
            setError('Неверный логин или пароль');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Убираем ошибку при вводе
        setFieldErrors((prev) => ({ ...prev, [name]: false }));
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ p: 4, width: 360 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Вход
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            name="login"
                            label="Логин"
                            value={form.login}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={fieldErrors.login}
                            helperText={fieldErrors.login ? 'Введите логин' : ''}
                        />
                        <TextField
                            name="password"
                            label="Пароль"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={fieldErrors.password}
                            helperText={fieldErrors.password ? 'Введите пароль' : ''}
                        />
                        <Typography
                            color="error"
                            sx={{
                                minHeight: '20px',
                                visibility: error ? 'visible' : 'hidden'
                            }}
                        >
                            {error || 'placeholder'}
                        </Typography>
                        <Button type="submit" variant="contained" fullWidth>
                            Войти
                        </Button>
                    </Stack>
                </form>

                <Typography variant="body2" align="center" mt={2}>
                    Нет аккаунта?{' '}
                    <Link component={RouterLink} to="/register">
                        Зарегистрироваться
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};
