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
    candidateDetails: {
        ...apiState,
        currentPage: 1,
        itemsPerPage: 10,
        sortConfig: { direction: 'ASC', key: 'candidatName' },
        selectedOption: 'createdAt',
        finalSearchString: '',
        reports: [],
        totalItems: 0,
    },
};

//Thunk
export const getCandidates = createAsyncThunk(
    'candidates/getCandidates',
    async({ assessmentId, currentPage, itemsPerPage, sortConfig, selectedOption, finalSearchString }, thunkAPI) => {
        const url = `/api/report/${assessmentId}?page=${currentPage}&limit=${itemsPerPage}&sortOrder=${sortConfig.direction}&sortBy=${selectedOption}&searchBy=${finalSearchString}`;
        // const url = `/api/assessment/?page=${currentPage}&limit=${itemsPerPage}&sortOrder=${sortConfig.direction}&sortBy=${selectedOption}&searchBy=${finalSearchString}`;
        try {
            const response = await axiosServerInstance.get(url);
            console.log("response.data", response.data);
            return response.data;
        } catch (err) {
          console.log("Error here",err);
            // if(err.response.status === 409) {

            // } else {
              const message = err.response?.data?.message || err.message || "Internal server error";
              return thunkAPI.rejectWithValue(message);
            // }
        }
    }
)

const candidates = createSlice({
    name: "candidates",
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
          state.candidateDetails.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
          state.candidateDetails.itemsPerPage = action.payload;
        },
        setSortConfig: (state, action) => {
          state.candidateDetails.sortConfig = action.payload;
        },
        setSelectedOption: (state, action) => {
          state.candidateDetails.selectedOption = action.payload;
        },
        setFinalSearchString: (state, action) => {
          state.candidateDetails.finalSearchString = action.payload;
        },
        setTotalItems: (state, action) => {
          state.candidateDetails.totalItems = action.payload;
        },
        clearState: (state) => {
          return {
            ...apiState,
            candidateDetails: {
              ...apiState,
              currentPage: 1,
              itemsPerPage: 10,
              sortConfig: { direction: 'ASC', key: 'TestName' },
              finalSearchString: '',
              reports: [],
              totalItems: 0,
            },
          };
        },
      },
      extraReducers: (builder) => {
        builder
          .addCase(getCandidates.pending, (state) => {
            state.candidateDetails.isLoading = true;
            state.candidateDetails.isSuccess = false;
            state.candidateDetails.isError = false;
            state.candidateDetails.message = "";
          })
          .addCase(getCandidates.fulfilled, (state, action) => {
            state.candidateDetails.isLoading = false;
            state.candidateDetails.isSuccess = true;
            state.candidateDetails.isError = false;
            state.candidateDetails.message = "";
            state.candidateDetails.reports = action.payload.result.reports;
            state.candidateDetails.totalItems = action.payload.result.totalItems;
            state.candidateDetails.currentPage = action.payload.result.currentPage;

          })
          .addCase(getCandidates.rejected, (state, action) => {
            console.log("here", action.payload);
            state.candidateDetails.isLoading = false;
            state.candidateDetails.isSuccess = false;
            state.candidateDetails.isError = true;
            state.candidateDetails.message = action.payload;
          });
      },
});

export const { setCurrentPage, setItemsPerPage, setSortConfig, setSelectedOption, setFinalSearchString, clearState, setTotalItems } = candidates.actions;
export default candidates.reducer;
