import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

// 1. Fetch all active exams for the user list
export const getAllExams = createAsyncThunk('userExam/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/auth/get-exam');
        return response.data; // Assuming this returns the array of exams
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch exams");
    }
});

// 2. Fetch specific questions (Secure version)
export const getQuestionsForExam = createAsyncThunk('userExam/getQuestions', async (examId, thunkAPI) => {
    try {
        const response = await api.post('/auth/get-exam-questions', { examId });
        return response.data.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch questions");
    }
});

// 3. Submit Exam
export const submitExam = createAsyncThunk('userExam/submit', async (payload, thunkAPI) => {
    console.log(26, payload)
    try {
        const response = await api.post('/auth/submit-exam', payload);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Submission failed");
    }
});

export const getUserReports = createAsyncThunk('userExam/getReports', async (userId, thunkAPI) => {
    try {
        const response = await api.post('/auth/get-reports-by-user', { userId });
        return response.data.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch reports");
    }
});

const userExamSlice = createSlice({
    name: 'userExam',
    initialState: {
        allExams: [],
        currentExamQuestions: [],
        userReports: [],
        isLoading: false,
        error: null,
        lastResult: null
    },
    reducers: {
        clearExamState: (state) => {
            state.currentExamQuestions = [];
            state.lastResult = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Exams
            .addCase(getAllExams.pending, (state) => { state.isLoading = true; })
            .addCase(getAllExams.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allExams = action.payload;
            })
            // Get Questions
            .addCase(getQuestionsForExam.fulfilled, (state, action) => {
                state.currentExamQuestions = action.payload.data || action.payload;
                state.isLoading = false;
            })
            // Submit Exam
            .addCase(submitExam.fulfilled, (state, action) => {
                state.lastResult = action.payload;
                state.isLoading = false;
            })
            .addCase(getUserReports.pending, (state) => { 
                state.isLoading = true;
            })
            .addCase(getUserReports.fulfilled, (state, action) => {
                state.isLoading = false;
                // Check if your API sends { data: [...] } or just [...]
                state.userReports = action.payload; 
                state.error = null;
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                }
            );
            
    }
});

export const { clearExamState } = userExamSlice.actions;
export default userExamSlice.reducer;