import React, { useState, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { getCandidates, clearState, setCurrentPage, setItemsPerPage, setSortConfig, setSelectedOption, setFinalSearchString } from "@/redux/slices/candidates";
import { useDispatch, useSelector } from 'react-redux';
import DataTable from "@/components/manageAssessments/candidates/DataTable";
import columns from "@/components/manageAssessments/candidates/Columns";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/lib/ui/alert"

const AssessmentDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const candidateDetails = useSelector((state) => state.candidates.candidateDetails);
  const { assessmentDetails } = location.state || {};
  const testUrl = `${window.location.protocol}//${window.location.host}/assessment/${assessmentDetails?.id}`;

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  useEffect(() => {
    // dispatch(clearState());
    dispatch(getCandidates({
      assessmentId: assessmentDetails.id,
      currentPage: candidateDetails.currentPage,
      itemsPerPage: candidateDetails.itemsPerPage,
      sortConfig: candidateDetails.sortConfig,
      selectedOption: candidateDetails.selectedOption,
      finalSearchString: candidateDetails.finalSearchString,
      totalItems: candidateDetails.totalItems
    }));
}, [
    dispatch,
    candidateDetails.currentPage,
    candidateDetails.itemsPerPage,
    candidateDetails.sortConfig,
    candidateDetails.selectedOption,
    candidateDetails.finalSearchString,
    candidateDetails.totalItems,
]);

  const handleCopyAssessmentClick = async () => {
    try {
      await navigator.clipboard.writeText(testUrl);
      setIsAlertOpen(true);
      setTimeout(() => setIsAlertOpen(false),[1000]);
    } catch (err) {
      console.log("Error in copying to clipboard", err);
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className="hover:bg-slate-50 text-primary pl-0"
        onClick={() => {
          navigate("/dashboard/manage-assessment");
        }}
      >
        <MoveLeft className="mr-2 h-5 w-6 mt-1"  />
        <p> Manage Assessment Page </p>
      </Button>
      <div className="flex flex-row align-center justify-between">
        <h2 className="text-black-500 font-semibold text-2xl">
          {assessmentDetails.title || "Hello"} Candidates Score
        </h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-primary"
            onClick={handleCopyAssessmentClick}
          >
            Copy Assessment Link
          </Button>
          <Button
            variant="outline"
            className="text-primary"
          >
            Edit Assessment
          </Button>
        </div>
      </div>
      <h2 className="text-gray-500 text-xl">{assessmentDetails.designation}</h2>
      {isAlertOpen && <div className="absolute top-20 right-40 mx-4 p-0">
        <Alert className="p-3 bg-slate-600 text-white">
          <AlertDescription>
            Link copied!!
          </AlertDescription>
        </Alert>
      </div>}
      <DataTable columns={columns} data={candidateDetails?.reports} candidateDetails={candidateDetails}/>
      
    </div>
  );
};
export default AssessmentDetails;
