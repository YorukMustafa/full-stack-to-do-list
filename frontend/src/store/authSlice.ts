import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';
import type { AuthRequest, AuthResponse, User } from '../types';

interface AuthState {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    registerSuccess: boolean;
}

const initialToken = localStorage.getItem('token');
const initialUsername = localStorage.getItem('username');

const initialState: AuthState = {
    token: initialToken,
    username: initialUsername,
    isAuthenticated: !!initialToken,
    loading: false,
    error: null,
    registerSuccess: false,
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async (credentials: AuthRequest, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<User>('/rest/api/auth/controller/register', credentials);
            return response.data;
        } catch (err: any) {
            const msg =
                typeof err.response?.data === 'string'
                    ? err.response.data
                    : err.response?.data?.message || 'Kayıt işlemi başarısız. Kullanıcı adı veya e-posta kullanılıyor olabilir.';
            return rejectWithValue(msg);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: AuthRequest, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<AuthResponse>('/rest/api/auth/controller/authenticate', credentials);
            return { token: response.data.accessToken, username: credentials.username };
        } catch (err: any) {
            const serverMsg = err.response?.data?.message || err.response?.data;
            if (serverMsg === 'Bad credentials' || err.response?.status === 401) {
                return rejectWithValue('Kullanıcı adı veya şifre hatalı!');
            }
            return rejectWithValue(
                typeof serverMsg === 'string' ? serverMsg : 'Giriş başarısız. Kullanıcı adı veya şifre hatalı!'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.username = null;
            state.isAuthenticated = false;
            state.error = null;
            state.registerSuccess = false;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
        clearAuthError: (state) => {
            state.error = null;
        },
        resetRegisterSuccess: (state) => {
            state.registerSuccess = false;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.registerSuccess = false;
        });
        builder.addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
            state.registerSuccess = true;
            state.error = null;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.registerSuccess = false;
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
        });
    },
});

export const { logout, clearAuthError, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
