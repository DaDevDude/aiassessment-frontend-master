import React, { useState, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { axiosServerInstance } from "@/utils/api/instances";
import { Trash2 } from "lucide-react"
import { useDispatch, useSelector } from 'react-redux';
import { getAssessments, setCurrentPage, setItemsPerPage, setSortConfig, setSelectedOption, setFinalSearchString } from "@/redux/slices/manageAssessment";
import columns from "@/components/manageAssessments/assessments/Columns";
import DataTable from "@/components/manageAssessments/assessments/DataTable";

const ManageAssessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const assessmentDetails = useSelector((state) => state.manageAssessment.assessmentDetails);
  const [searchTerm, setSearchTerm] = useState('');
      
    useEffect(() => {
        dispatch(getAssessments({
            currentPage: assessmentDetails.currentPage,
            itemsPerPage: assessmentDetails.itemsPerPage,
            sortConfig: assessmentDetails.sortConfig,
            selectedOption: assessmentDetails.selectedOption,
            finalSearchString: assessmentDetails.finalSearchString,
            totalItems: assessmentDetails.totalItems
        }));
    }, [
        dispatch,
        assessmentDetails.currentPage,
        assessmentDetails.itemsPerPage,
        assessmentDetails.sortConfig,
        assessmentDetails.selectedOption,
        assessmentDetails.finalSearchString,
        assessmentDetails.totalItems,
    ]);

    const handleSort = (key) => {
        let direction = 'ASC';
        if (assessmentDetails.sortConfig.key === key && assessmentDetails.sortConfig.direction === 'ASC') {
          direction = 'DESC';
        }
        dispatch(setSortConfig({ key, direction }));
    };

    // const sortedData = [...filteredData].sort((a, b) => {
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //         return sortConfig.direction === 'ASC' ? -1 : 1;
    //     }
    //     if (a[sortConfig.key] > b[sortConfig.key]) {
    //         return sortConfig.direction === 'ASC' ? 1 : -1;
    //     }
    //     return 0;
    // });

    const sortedData = assessmentDetails.assessments;

    // const handlePageClick = (event) => {
    //     setCurrentPage(event.selected);
    // };

    const handlePageClick = (event) => {
        dispatch(setCurrentPage(event.selected + 1)); // react-paginate uses zero-based index
    };

    const handleSearch = () => {
        dispatch(setFinalSearchString(searchTerm));
    };

    // const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    return (
        <div>
            <h2 className="text-black-500 font-semibold text-2xl">Manage Assessment</h2>
            <DataTable columns={columns} data={assessmentDetails.assessments} finalSearchString={assessmentDetails.finalSearchString} assessmentDetails={assessmentDetails} />
        </div>
    );
};
export default ManageAssessment;
