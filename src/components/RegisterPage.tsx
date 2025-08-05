import {useNavigate} from 'react-router-dom';
import {RegisterForm} from './RegisterForm';
import {Box} from '@mui/material';

/**
 * Страница регистрации пользователя.
 *
 * Отображает форму регистрации. После успешной регистрации выполняется переход на главную страницу.
 */
export const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <RegisterForm onSuccess={() => navigate('/')}/>
        </Box>
    );
};
