import { axiosServerInstance } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
        currentPage: 1,
        itemsPerPage: 10,
        sortConfig: { direction: 'DESC', key: 'TestName' },
        selectedOption: 'createdAt',
        finalSearchString: '',
        assessments: [],
        totalItems: 0,
    },
};

//Thunk
export const getAssessments = createAsyncThunk(
    'assessment/getAssessments',
    async({ currentPage, itemsPerPage, sortConfig, selectedOption, finalSearchString }, thunkAPI) => {
        const url = `/api/assessment/?page=${currentPage}&limit=${itemsPerPage}&sortOrder=${sortConfig.direction}&sortBy=${selectedOption}&searchBy=${finalSearchString}`;
        try {
            const response = await axiosServerInstance.get(url);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Internal server error";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteAssessment = createAsyncThunk(
  'assessment/deleteAssessment',
  async(data, thunkAPI) => {
    try {
      const response = await axiosServerInstance.delete(
        serverRoutes.deleteAssessment + data.id
      );
      return response.data;
    } catch (error) {
      const message = err.response?.data?.message || err.message || "Internal server error";
      return thunkAPI.rejectWithValue(message);
    }
  }
)

const manageAssessment = createSlice({
    name: "manageAssessment",
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
          state.assessmentDetails.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
          state.assessmentDetails.itemsPerPage = action.payload;
        },
        setSortConfig: (state, action) => {
          state.assessmentDetails.sortConfig = action.payload;
        },
        setSelectedOption: (state, action) => {
          state.assessmentDetails.selectedOption = action.payload;
        },
        setFinalSearchString: (state, action) => {
          state.assessmentDetails.finalSearchString = action.payload;
        },
        setTotalItems: (state, action) => {
          state.assessmentDetails.totalItems = action.payload;
        },
        clearState: (state) => {
          return {
            ...apiState,
            assessmentDetails: {
              ...apiState,
              currentPage: 1,
              itemsPerPage: 10,
              sortConfig: { direction: 'ASC', key: 'TestName' },
              finalSearchString: '',
              assessments: [],
              totalItems: 0,
            },
          };
        },
      },
      extraReducers: (builder) => {
        //Get Assessments case
        builder
          .addCase(getAssessments.pending, (state) => {
            state.assessmentDetails.isLoading = true;
            state.assessmentDetails.isSuccess = false;
            state.assessmentDetails.isError = false;
            state.assessmentDetails.message = "";
          })
          .addCase(getAssessments.fulfilled, (state, action) => {
            state.assessmentDetails.isLoading = false;
            state.assessmentDetails.isSuccess = true;
            state.assessmentDetails.isError = false;
            state.assessmentDetails.message = "";
            state.assessmentDetails.assessments = action.payload.result.assessments;
            state.assessmentDetails.totalItems = action.payload.result.totalItems;
            console.log("getAssesements", action.payload.result.assessments)
          })
          .addCase(getAssessments.rejected, (state, action) => {
            state.assessmentDetails.isLoading = false;
            state.assessmentDetails.isSuccess = false;
            state.assessmentDetails.isError = true;
            state.assessmentDetails.message = action.payload;
          });
          
          //Delete Assessment Case
          builder
          .addCase(deleteAssessment.pending, (state) => {
            state.assessmentDetails.isLoading = true;
            state.assessmentDetails.isSuccess = false;
            state.assessmentDetails.isError = false;
            state.assessmentDetails.message = "";
          })
          .addCase(deleteAssessment.fulfilled, (state, action) => {
            console.log("state",state.assessmentDetails.assessments)
            console.log("payload",action.payload.result)
            state.assessmentDetails.isLoading = false;
            state.assessmentDetails.isSuccess = true;
            state.assessmentDetails.isError = false;
            state.assessmentDetails.message = "";
            // state.assessmentDetails.assessments = action.payload.result.assessments;
            // state.assessmentDetails.totalItems = action.payload.result.totalItems;

            // Assuming action.payload.result contains the ID of the deleted assessment
            const deletedAssessmentId = action.payload.result.id;

            // Filter out the deleted assessment from the assessments array
            state.assessmentDetails.assessments.filter(
              (assessment) => assessment.id !== deletedAssessmentId
            );

            // If needed, update the totalItems count as well
            state.assessmentDetails.totalItems--;
          })
          .addCase(deleteAssessment.rejected, (state, action) => {
            state.assessmentDetails.isLoading = false;
            state.assessmentDetails.isSuccess = false;
            state.assessmentDetails.isError = true;
            state.assessmentDetails.message = action.payload;
          });
      },
});

export const { setCurrentPage, setItemsPerPage, setSortConfig, setSelectedOption, setFinalSearchString, clearState, setTotalItems } = manageAssessment.actions;
export default manageAssessment.reducer;