import axios from 'axios';
import type { CreateUserDto, User } from '../types/User';
import { API_BASE_URL } from './config';

export const createUser = (data: CreateUserDto): Promise<User> =>
    axios.post<User>(`${API_BASE_URL}/auth/registration`, data).then(res => res.data);
