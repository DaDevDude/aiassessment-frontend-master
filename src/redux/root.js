import { combineReducers } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import assessment from "./slices/assessment";
import manageAssessment from "./slices/manageAssessment";
import candidates from "./slices/candidates";
import reports from "./slices/reports";

export const rootReducer = combineReducers({
  auth,
  assessment,
  manageAssessment,
  candidates,
  reports
});
