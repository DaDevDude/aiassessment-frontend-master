import { axiosServerInstance } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      await axiosServerInstance.post(serverRoutes.register, data);
      return { message: "🚀 Registered successfully" };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axiosServerInstance.post(serverRoutes.login, data);
    return {
      user: response.data,
      message: `👋 Welcome! You're now logged in.`,
    };
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Internal server error";
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (data, thunkAPI) => {
    try {
      await axiosServerInstance.get(serverRoutes.logout);
      return {
        message: `🔓 You have successfully logged out. See you next time!`,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.get(serverRoutes.getProfile);
      return {
        user: response.data,
        message: `👋 Welcome! You're now logged in.`,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
