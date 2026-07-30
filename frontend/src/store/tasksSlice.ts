import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';
import type { Task, TaskCreatePayload, TaskUpdatePayload, FilterType } from '../types';

interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    activeFilter: FilterType;
    searchQuery: string;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null,
    activeFilter: 'ALL',
    searchQuery: '',
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get<Task[]>('/rest/api/tasks/get-all-tasks');
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Görevler yüklenirken hata oluştu.');
    }
});

export const fetchTasksByStatus = createAsyncThunk(
    'tasks/fetchTasksByStatus',
    async (isFinished: boolean, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get<Task[]>(`/rest/api/tasks/get-tasks-by-status?isFinished=${isFinished}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Görevler yüklenirken hata oluştu.');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: TaskCreatePayload, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post<Task>('/rest/api/tasks/create-new-tasks', taskData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Görev eklenirken hata oluştu.');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, taskData }: { id: number; taskData: TaskUpdatePayload }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put<Task>(`/rest/api/tasks/update-tasks/${id}`, taskData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Görev güncellenirken hata oluştu.');
        }
    }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number, { rejectWithValue }) => {
    try {
        await axiosClient.delete(`/rest/api/tasks/del-tasks/${id}`);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Görev silinirken hata oluştu.');
    }
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<FilterType>) => {
            state.activeFilter = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearTaskError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(fetchTasks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload || [];
        });
        builder.addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });


        builder.addCase(fetchTasksByStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTasksByStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload || [];
        });
        builder.addCase(fetchTasksByStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });


        builder.addCase(createTask.fulfilled, (state, action) => {
            state.tasks.unshift(action.payload);
        });


        builder.addCase(updateTask.fulfilled, (state, action) => {
            const index = state.tasks.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        });


        builder.addCase(deleteTask.fulfilled, (state, action) => {
            state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        });
    },
});

export const { setFilter, setSearchQuery, clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
