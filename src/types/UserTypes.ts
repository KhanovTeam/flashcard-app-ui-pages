export interface UserTypes {
    id: number;
    name: string;
    surname: string;
    login: string;
}

export interface CreateUserDto {
    name: string;
    surname: string;
    login: string;
    password: string;
}