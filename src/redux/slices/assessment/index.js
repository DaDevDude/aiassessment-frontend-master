import { createSlice } from "@reduxjs/toolkit";
import {
  generateAssessment,
  getAssessmentReportByCookie,
  getAssessmentDetails,
  saveAnswer,
  submitAssessment,
  changeProctoringStatus,
} from "./thunk";

const apiState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const initialState = {
  ...apiState,
  assessmentDetails: {
    ...apiState,
  },
  assessmentTestData: {
    ...apiState,
    report: {
      ...apiState,
      proctor: {
        ...apiState,
      },
    },
  },
};

const assessment = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    clearAssessmentTestReportProctorState: (state) => {
      return {
        ...state,
        assessmentTestData: {
          ...state.assessmentTestData,
          report: {
            ...state.assessmentTestData.report,
            proctor: {
              ...state.assessmentTestData.report.proctor,
              ...apiState,
            },
          },
        },
      };
    },
    clearAssessmentDetailsState: (state) => {
      return {
        ...state,
        assessmentDetails: { ...state.assessmentDetails, ...apiState },
      };
    },
    clearAssessmentTestDataState: (state) => {
      return {
        ...state,
        assessmentTestData: { ...state.assessmentTestData, ...apiState },
      };
    },
    clearAssessmentTestReportState: (state) => {
      return {
        ...state,
        assessmentTestData: {
          ...state.assessmentTestData,
          report: { ...state.assessmentTestData.report, ...apiState },
        },
      };
    },
    clearAssessmentState: (state) => {
      return {
        ...state,
        ...apiState,
      };
    },
  },
  extraReducers: (builder) => {
    // Get Assessment details case
    builder
      .addCase(getAssessmentDetails.pending, (state) => {
        state.assessmentDetails.isLoading = true;
        state.assessmentDetails.isSuccess = false;
        state.assessmentDetails.isError = false;
        state.assessmentDetails.message = "";
      })
      .addCase(getAssessmentDetails.fulfilled, (state, action) => {
        state.assessmentDetails.isLoading = false;
        state.assessmentDetails.isSuccess = true;
        state.assessmentDetails.isError = false;
        state.assessmentDetails.message = "";
        state.assessmentDetails = {
          ...state.assessmentDetails,
          ...action.payload.result,
        };
      })
      .addCase(getAssessmentDetails.rejected, (state, action) => {
        state.assessmentDetails.isLoading = false;
        state.assessmentDetails.isSuccess = false;
        state.assessmentDetails.isError = true;
        state.assessmentDetails.message = action.payload;
      });
    // Get Assessment Profile
    builder
      .addCase(getAssessmentReportByCookie.pending, (state) => {
        state.assessmentTestData.isLoading = true;
        state.assessmentTestData.isSuccess = false;
        state.assessmentTestData.isError = false;
        state.assessmentTestData.message = "";
      })
      .addCase(getAssessmentReportByCookie.fulfilled, (state, action) => {
        state.assessmentTestData.isLoading = false;
        state.assessmentTestData.isSuccess = true;
        state.assessmentTestData.isError = false;
        state.assessmentTestData.message = "";
        state.assessmentTestData.report = action.payload.report;
      })
      .addCase(getAssessmentReportByCookie.rejected, (state, action) => {
        state.assessmentTestData.isLoading = false;
        state.assessmentTestData.isSuccess = false;
        state.assessmentTestData.isError = true;
        state.assessmentTestData.message = action.payload;
      });
    // Generate Assessment Report/Test
    builder
      .addCase(generateAssessment.pending, (state) => {
        state.assessmentTestData.report.isLoading = true;
        state.assessmentTestData.report.isSuccess = false;
        state.assessmentTestData.report.isError = false;
        state.assessmentTestData.report.message = "";
      })
      .addCase(generateAssessment.fulfilled, (state, action) => {
        state.assessmentTestData.report.isLoading = false;
        state.assessmentTestData.report.isSuccess = true;
        state.assessmentTestData.report.isError = false;
        state.assessmentTestData.report.message = "";
        state.assessmentTestData.report = {
          ...state.assessmentTestData,
          ...action.payload.report,
        };
      })
      .addCase(generateAssessment.rejected, (state, action) => {
        state.assessmentTestData.report.isLoading = false;
        state.assessmentTestData.report.isSuccess = false;
        state.assessmentTestData.report.isError = true;
        state.assessmentTestData.report.message = action.payload;
      });
    // Submit assessment case
    builder
      .addCase(submitAssessment.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.assessmentTestData.report.status = action.payload.result.status;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
    // save answer cases
    builder
      .addCase(saveAnswer.pending, (state) => {
        state.assessmentTestData.report.isLoading = true;
        state.assessmentTestData.report.isSuccess = false;
        state.assessmentTestData.report.isError = false;
        state.assessmentTestData.report.message = "";
      })
      .addCase(saveAnswer.fulfilled, (state, action) => {
        const newAnswers = state.assessmentTestData.report.answers.map(
          (answer) => {
            if (answer.id === action.payload.result.id) {
              const { selectedOptionId, markedForReview, providedAnswer } =
                action.payload.result;
              return {
                ...answer,
                selectedOptionId,
                markedForReview,
                providedAnswer,
              };
            }
            return { ...answer };
          }
        );
        state.assessmentTestData.report.isLoading = false;
        state.assessmentTestData.report.isSuccess = true;
        state.assessmentTestData.report.isError = false;
        state.assessmentTestData.report.message = "";
        state.assessmentTestData.report.answers = newAnswers;
      })
      .addCase(saveAnswer.rejected, (state, action) => {
        state.assessmentTestData.report.isLoading = false;
        state.assessmentTestData.report.isSuccess = false;
        state.assessmentTestData.report.isError = true;
        state.assessmentTestData.report.message = action.payload;
      });
    // Proctor Status case
    builder
      .addCase(changeProctoringStatus.pending, (state) => {
        state.assessmentTestData.report.proctor.isLoading = true;
        state.assessmentTestData.report.proctor.isSuccess = false;
        state.assessmentTestData.report.proctor.isError = false;
        state.assessmentTestData.report.proctor.message = "";
      })
      .addCase(changeProctoringStatus.fulfilled, (state, action) => {
        state.assessmentTestData.report.proctor.isLoading = false;
        state.assessmentTestData.report.proctor.isSuccess = true;
        state.assessmentTestData.report.proctor.isError = false;
        state.assessmentTestData.report.proctor.message = "";
        state.assessmentTestData.report.proctor = action.payload.result;
      })
      .addCase(changeProctoringStatus.rejected, (state, action) => {
        state.assessmentTestData.report.proctor.isLoading = false;
        state.assessmentTestData.report.proctor.isSuccess = false;
        state.assessmentTestData.report.proctor.isError = true;
        state.assessmentTestData.report.proctor.message = action.payload;
      });
  },
});

export const {
  clearAssessmentState,
  clearAssessmentDetailsState,
  clearAssessmentTestDataState,
  clearAssessmentTestReportState,
  clearAssessmentTestReportProctorState,
} = assessment.actions;
export default assessment.reducer;
