import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import {
  Profile,
  Experience,
  Education,
  GitHubRepo,
  ErrorResponse,
  ProfileFormData,
} from "../../types";

interface ProfileState {
  profile: Profile | null;
  profiles: Profile[];
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: null,
};

// Async thunks
export const getCurrentProfile = createAsyncThunk(
  "profile/getCurrentProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/profile/me");
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const getProfiles = createAsyncThunk(
  "profile/getProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/profile");
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const getProfileById = createAsyncThunk(
  "profile/getProfileById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/profile/user/${userId}`);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const getGithubRepos = createAsyncThunk(
  "profile/getGithubRepos",
  async (username: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/profile/github/${username}`);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (formData: ProfileFormData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axiosInstance.post("/profile", formData, config);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const addExperience = createAsyncThunk(
  "profile/addExperience",
  async (formData: Omit<Experience, "_id">, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axiosInstance.put(
        "/profile/experience",
        formData,
        config
      );
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const addEducation = createAsyncThunk(
  "profile/addEducation",
  async (formData: Omit<Education, "_id">, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axiosInstance.put(
        "/profile/education",
        formData,
        config
      );
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "profile/deleteExperience",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/profile/experience/${id}`);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "profile/deleteEducation",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/profile/education/${id}`);
      return res.data;
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/profile");
    } catch (error: unknown) {
      const errorResponse = error as { response: { data: ErrorResponse } };
      return rejectWithValue(errorResponse.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.repos = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "An error occurred";
        state.profile = null;
      })
      .addCase(getProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "An error occurred";
      })
      .addCase(getProfileById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "An error occurred";
        state.profile = null;
      })
      .addCase(getGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
      })
      .addCase(getGithubRepos.rejected, (state) => {
        state.repos = [];
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
