import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios'; // import your Axios instance

// const token = localStorage.getItem('token');
// const user = localStorage.getItem('user');
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
};

// LOGIN API
export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const res = await api.post('/auth/login', userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// REGISTER API
export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await api.post('/auth/register', userData);
    // localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// LOGOUT (clears local)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    // ✅ clear localStorage ONLY here
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return true;
  }
);


export const getDashboard = createAsyncThunk(
  'auth/dashboard',
  async (_, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().auth.token ||
        localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue("No token found");
      }

      const res = await api.get('/auth/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Unauthorized'
      );
    }
  }
);


// add subject API
export const addsubject = createAsyncThunk('auth/add-subject', async (userData, thunkAPI) => {
  try {
    const res = await api.post('/auth/add-subject', userData);
    // localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const getsubject = createAsyncThunk('auth/get-subject', async (userData, thunkAPI) => {
  try {
    const res = await api.get('/auth/get-subject', userData);
    // localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateSubject = createAsyncThunk('auth/update-subject',async ({subjectid, name, userData}, thunkAPI) => {
  try {
      // Validate inputs
      if (!subjectid) {
        return rejectWithValue('Subject ID are required');
      }
      const response = await api.patch(`/auth/update-subject/${subjectid}`,{"name": name});      
      return response.data; // Return the updated subject
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to update subject';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletesubject = createAsyncThunk('auth/delete-subject', async (id,userData,thunkAPI) => {
  if (!id) {
    return rejectWithValue('Subject ID is required');
  }

  try {
    // Ensure subjectId is properly encoded in URL
    const encodedSubjectId = encodeURIComponent(id);
    // console.log(69,encodedSubjectId)
    const response = await api.delete(`auth/delete-subject/${encodedSubjectId}`);

    // console.log(72,response)
   
    return response.data;
  } catch (err) {
    // Enhanced error handling
    return ({message: err.response.data.message});
  }
});

export const addNewquestion = createAsyncThunk('auth/add-question', async (userData, thunkAPI) => {
  // console.log(52, userData)
  try {
    const res = await api.post('/auth/add-question', userData);
    // localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateQuestion = createAsyncThunk('auth/update-question', async (userData, thunkAPI) => {
  try {
    const { id } = userData;

    if (!id) {
      return thunkAPI.rejectWithValue('Question ID is required');
    }

    const res = await api.patch(`/auth/update-question/${id}`, userData);
    // localStorage.setItem('token', res.data.token);
    return res.data;

  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || 'Failed to update question';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const deletequestion = createAsyncThunk('auth/delete-question', async (id,userData,thunkAPI) => {
  if (!id) {
    return rejectWithValue('Subject ID is required');
  }
  try {
    // Ensure subjectId is properly encoded in URL
    const encodedQuestionId = encodeURIComponent(id);
    // console.log(69,encodedSubjectId)
    const response = await api.delete(`auth/delete-question/${encodedQuestionId}`);
    // console.log(72,response)
    return response.data;
  } catch (err) {
    // Enhanced error handling
    return ({message: err.response.data.message});
  }
});

export const addExam = createAsyncThunk('auth/add-exam', async (userData, thunkAPI) => {
  console.log(182, userData)
  try {
    const token = thunkAPI.getState().auth.token;
    console.log(185, token)
    const res = await api.post('/auth/add-exam', userData);
    // localStorage.setItem('token', res.data.token);
    res.token = token
    
    return res.data;

  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});





const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ SAVE TO LOCAL STORAGE
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      state.isLoading = false;
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(getDashboard.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        // Look at your network response. 
        // If it's { user: { id: "..." } }, you need action.payload.user
        const userData = action.payload.user || action.payload;

        // Normalize id vs _id right here so the frontend doesn't break
        if (userData) {
            if (userData.id && !userData._id) {
                userData._id = userData.id;
            }
            state.user = userData;
            state.isAuthenticated = true;
        }
    })
    .addCase(getDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
      .addCase(addNewquestion.fulfilled,(state,action) =>{
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addExam.fulfilled,(state,action) =>{
        state.user = action.payload.user;
        state.isLoading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled,(state,action) =>{
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
     
      .addCase(deletesubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletesubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
