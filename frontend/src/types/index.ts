export interface User {
    id?: number;
    username: string;
    email?: string;
}

export interface AuthRequest {
    username: string;
    password: string;
    email?: string;
}

export interface AuthResponse {
    accessToken: string;
}

export interface Task {
    id?: number;
    header: string;
    description: string;
    isFinished: boolean;
}

export interface TaskCreatePayload {
    header: string;
    description: string;
}

export interface TaskUpdatePayload {
    header: string;
    description: string;
    isFinished: boolean;
}

export type FilterType = 'ALL' | 'COMPLETED' | 'UNCOMPLETED';
