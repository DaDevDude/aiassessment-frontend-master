import * as React from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
 } from "@/lib/ui/dropdown-menu";

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
 } from "@/lib/ui/table";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { getAssessments, setCurrentPage, setItemsPerPage, setSortConfig, setSelectedOption, setFinalSearchString, clearState  } from "@/redux/slices/manageAssessment";
import {  useDispatch } from "react-redux";
import { ArrowDown, ChevronDown, MoreHorizontal } from "lucide-react/dist/cjs/lucide-react";
import LoadingSpinner from "../../shared/LoaderSpinner";
import ReactPaginate from "react-paginate";

const DataTable = ({ columns, data, assessmentDetails }) => {
  const dispatch = useDispatch();
  // dispatch(clearState());
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [searchedString, setSearchedString] = React.useState("");

  React.useEffect(() => {
    setColumnFilters([
      { id: "testName", value: searchedString },
      { id: "jobRole", value: searchedString },
    ]);
  }, [searchedString]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    // onColumnFiltersChange: setFinalSearchString,
    // getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      // finalSearchString
    },
  });

  const handlePageClick = (event) => {
    dispatch(setCurrentPage(event.selected + 1));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchedString(event.target.value || "");
    if(searchedString === "") {
      dispatch(setFinalSearchString(searchedString));
    }
  };

  // Handle search on Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      dispatch(setFinalSearchString(searchedString));
    }
  };

  // Re-fetch data when final search string or pagination changes
  React.useEffect(() => {
    if (searchedString === "") {
      dispatch(setFinalSearchString(searchedString));
    }
  }, [searchedString]);
  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search by Test Name or Job Role"
          value={searchedString}
          // onChange={(event) => {
          //   table.getColumn("title")?.setFilterValue(event.target.value);
          //   setSearchedString(event.target.value);
          // }}
          // onKeyPress={(event) => {
          //   if (event.key === 'Enter') {
          //     setSearchedString("");
          //     dispatch(setFinalSearchString(searchedString));
          //   }}}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          className="w-4/6"
        />
        <Button 
          className="w-1/6"
          onClick={() => dispatch(setFinalSearchString(searchedString))}
        >
          Search
        </Button>
        <DropdownMenu className="w-1/6">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" 
              // className="h-8 flex justify-center items-center p-0"
              className="w-1/6 flex items-center justify-between"
            >
              <p>Sort By</p>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={assessmentDetails.selectedOption} onValueChange={(value) => {dispatch(setSelectedOption(value))}}>
              <DropdownMenuRadioItem value="createdAt">Recent Date</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title">Test Name</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {assessmentDetails.isLoading && <LoadingSpinner className="flex align-center justify-center"/>}
            { !assessmentDetails.isLoading && (assessmentDetails.isSuccess || assessmentDetails.isError) && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <ReactPaginate
            previousLabel={
            <span className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg border border border-gray-400">
                Prev
            </span>
            }
            nextLabel={
            <span className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg border border-gray-400">
                Next
            </span>
            }
            breakLabel={
            <span className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg border border-gray-400">
                ...
            </span>
            }
            pageCount={Math.ceil(assessmentDetails.totalItems / assessmentDetails.itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex justify-center items-center space-x-4 mt-4"
            previousClassName="flex items-center"
            nextClassName="flex items-center"
            pageClassName="flex items-center"
            activeClassName="bg-primary text-white rounded-lg px-5 py-2"
        /> 
      </div>
    </div>
  );
};

export default DataTable;
