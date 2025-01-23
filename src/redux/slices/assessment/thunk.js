import { axiosServerInstance } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAssessmentReportByCookie = createAsyncThunk(
  "assessment/getAssessmentReportByCookie",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.get(
        serverRoutes.getAssessmentReportByCookie
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAssessmentDetails = createAsyncThunk(
  "assessment/getAssessmentDetails",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.get(
        serverRoutes.getAssessmentDetails + data.id
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const generateAssessment = createAsyncThunk(
  "assessment/generateAssessment",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.post(
        serverRoutes.generateAssessment + data.id,
        data.values
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const saveAnswer = createAsyncThunk(
  "assessment/saveAnswer",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.put(
        serverRoutes.saveAnswer + data.answerId,
        data.answer
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const submitAssessment = createAsyncThunk(
  "assessment/submitAssessment",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.post(
        serverRoutes.submitAssessment
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changeProctoringStatus = createAsyncThunk(
  "assessment/changeProctoringStatus",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.put(
        serverRoutes.changeProctoringStatus,
        data
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
