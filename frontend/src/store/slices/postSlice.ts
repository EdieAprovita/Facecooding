import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { 
  PostState, 
  ErrorResponse 
} from '../../types';

const initialState: PostState = {
  posts: [],
  post: null,
  loading: true,
  error: null,
};

// Async thunks
export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/posts');
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const getPost = createAsyncThunk(
  'post/getPost',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const addLike = createAsyncThunk(
  'post/addLike',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/posts/like/${id}`);
      return { id, likes: res.data };
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const removeLike = createAsyncThunk(
  'post/removeLike',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/posts/unlike/${id}`);
      return { id, likes: res.data };
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      return id;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const addPost = createAsyncThunk(
  'post/addPost',
  async (formData: { text: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post('/api/posts', formData, config);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'post/addComment',
  async ({ postId, formData }: { postId: string; formData: { text: string } }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'post/deleteComment',
  async ({ postId, commentId }: { postId: string; commentId: string }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })
      .addCase(getPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })
      .addCase(addLike.fulfilled, (state, action) => {
        const post = state.posts.find(post => post._id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
        }
      })
      .addCase(removeLike.fulfilled, (state, action) => {
        const post = state.posts.find(post => post._id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
        state.loading = false;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
        state.loading = false;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      });
  },
});

export default postSlice.reducer;
