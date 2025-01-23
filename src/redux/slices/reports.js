import { axiosGptInstance, axiosServerInstance } from "@/utils/api/instances";
import { gptRoutes, serverRoutes } from "@/utils/api/routes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
};

const initialState = {
    ...apiState,
    resumeDetails: {
        ...apiState,
        url: "",
    },
    reportDataDetails: {
      ...apiState,
      data: {},
    },
    validateSubjectiveAnswersDetails: {
      ...apiState,
      feedbacks:[],
    }
};

export const downloadResume = createAsyncThunk(
  "reports/downloadResume",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.get(
        serverRoutes.downloadResume + "?fileUrl=" + data
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getReport = createAsyncThunk(
  "reports/getReport",
  async (data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.get(
        serverRoutes.getReport + data.candiateId + "/" + data.reportId
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const validateSubjectiveAnswers = createAsyncThunk(
  "reports/validateSubjectiveAnswers",
  async (data, thunkAPI) => {
    try {
      const response = await axiosGptInstance.post(gptRoutes.validateSubjectiveAnswers, {
        question: data.question,
        answer: data.answer,
        marks_out_of: data.marksOutOf,
        id: data.id,
      });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
const reports = createSlice({
    name: "reports",
    initialState,
    reducers: {
        clearResumeDetailsState: (state) => {
          return {
            ...apiState,
            resumeDetails: {
              ...state.resumeDetails,
              ...apiState,
            },
          };
        },
        clearreportDataDetailsState: (state) => {
          return {
            ...state,
            reportDataDetails: {
              ...state.reportDataDetails,
              ...apiState,
              // data:[],
            },
          };
        },
        clearValidateSubjectiveAnswerDetailsState: (state) => {
          return {
            ...state,
            validateSubjectiveAnswersDetails: {
              ...state.validateSubjectiveAnswersDetails,
              ...apiState,
              // feedbacks: [],
            },
          };
        },
        // updateFeedback: (state, action) => {
        //   const {  feedback } = action.payload;
        //   console.log("here inside the candidateTestReport", feedback, score);
        //   state.validateSubjectiveAnswersDetails.feedbacks.push(feedback);
        // },
        updateFeedback: (state, action) => {
          const { index, feedback } = action.payload;
          state.validateSubjectiveAnswersDetails.feedbacks[index - 1] = feedback || state.validateSubjectiveAnswersDetails.feedbacks.push(feedback);
        },      
      },
      extraReducers: (builder) => {
        //Download Resume case
        builder
          .addCase(downloadResume.pending, (state) => {
            state.resumeDetails.isLoading = true;
            state.resumeDetails.isSuccess = false;
            state.resumeDetails.isError = false;
            state.resumeDetails.message = "";
          })
          .addCase(downloadResume.fulfilled, (state, action) => {
            state.resumeDetails.isLoading = false;
            state.resumeDetails.isSuccess = true;
            state.resumeDetails.isError = false;
            state.resumeDetails.message = "";
            state.resumeDetails.url = action.payload.data;

          })
          .addCase(downloadResume.rejected, (state, action) => {
            state.resumeDetails.isLoading = false;
            state.resumeDetails.isSuccess = false;
            state.resumeDetails.isError = true;
            state.resumeDetails.message = action.payload;
          });

          //get Report Case
        builder
          .addCase(getReport.pending, (state) => {
            state.reportDataDetails.isLoading = true;
            state.reportDataDetails.isSuccess = false;
            state.reportDataDetails.isError = false;
            state.reportDataDetails.message = "";
          })
          .addCase(getReport.fulfilled, (state, action) => {
            console.log("action.payload",action.payload.report);
            state.reportDataDetails.isLoading = false;
            state.reportDataDetails.isSuccess = true;
            state.reportDataDetails.isError = false;
            state.reportDataDetails.message = "";
            // state.reportDataDetails.data = [];
            state.reportDataDetails.data = action.payload.report;

          })
          .addCase(getReport.rejected, (state, action) => {
            state.reportDataDetails.isLoading = false;
            state.reportDataDetails.isSuccess = false;
            state.reportDataDetails.isError = true;
            state.reportDataDetails.message = action.payload;
          });

        //valid subjective answers case
        builder
          .addCase(validateSubjectiveAnswers.pending, (state) => {
            state.validateSubjectiveAnswersDetails.isLoading = true;
            state.validateSubjectiveAnswersDetails.isSuccess = false;
            state.validateSubjectiveAnswersDetails.isError = false;
            state.validateSubjectiveAnswersDetails.message = "";
          })
          .addCase(validateSubjectiveAnswers.fulfilled, (state, action) => {
            console.log("action.payload ==>", action.payload);
            let index = action.payload.id;
            let newFeedbacks = {feedback: action.payload.feedback, score: action.payload.score};
            // newFeedbacks.push(action.payload.data);
            state.validateSubjectiveAnswersDetails.isLoading = false;
            state.validateSubjectiveAnswersDetails.isSuccess = true;
            state.validateSubjectiveAnswersDetails.isError = false;
            state.validateSubjectiveAnswersDetails.message = "";
            // state.validateSubjectiveAnswersDetails.feedbacks.push(action.payload);
            state.validateSubjectiveAnswersDetails.feedbacks[index - 1] = newFeedbacks || state.validateSubjectiveAnswersDetails.feedbacks.push(newFeedbacks);
          })
          .addCase(validateSubjectiveAnswers.rejected, (state, action) => {
            state.validateSubjectiveAnswersDetails.isLoading = false;
            state.validateSubjectiveAnswersDetails.isSuccess = false;
            state.validateSubjectiveAnswersDetails.isError = true;
            state.validateSubjectiveAnswersDetails.message = action.payload;
          });
      },
});

export const { clearResumeDetailsState, clearreportDataDetailsState, clearValidateSubjectiveAnswerDetailsState, updateFeedback } = reports.actions;
export default reports.reducer;
