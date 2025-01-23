  import { Button } from "@/lib/ui/button";
  import {  ArrowUpDown } from "lucide-react/dist/cjs/lucide-react";
  import { useNavigate, useLocation } from "react-router-dom";
  
  const columns = [
      {
        id: "candidateName",
        name: "candidateName",
        // accessorKey: "name",
        accessorFn: row => {
            return row.candidate?.name || 'N/A'
        },
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
            //   onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
            >
              Candidate Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        enableSorting: true,
      },
      {
        id: "candidateEmail",
        name: "candidateEmail",
        // accessorKey: `candidates.email`,
        accessorFn: row => row.candidate?.email || 'N/A',
        header: "Candidate Email",
      },
      {
        name: "percentage",
        accessorKey: "percentage",
        // header: "Percentage",
        header: ({ column }) => (
            <Button
              variant="ghost"
            //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Percentage
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
      },
      {
        name: "timeTaken",
        accessorKey: "timeTaken",
        header: "Time Taken",
        cell: ({row}) => {
            let ms = row.getValue("timeTaken");
            ms = ms < 0 ? 0 : ms;
            let totalSeconds = Math.floor(ms / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;

            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      },
      {
        id: "submittedOn",
        name: "submittedOn",
        accessorKey: "submittedAt",
        // header: "Create Date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submitted On
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({row}) => {
          const value = row.original.submittedAt;
          return new Date(value).toISOString().split('T')[0]
        }
      },
      {
        id: "action",
        name: "action",
        accessorKey: "",
        header: () => {
            return <div className="items-center bg-black-500">Action</div>
        },
        cell: ({row}) => {
          const navigate = useNavigate();
          const location = useLocation();
          const { assessmentDetails } = location.state || {};
          return (
            <div className="py-2 px-4 flex align-center justify-center">
                <Button
                    variant="link" 
                    onClick={() => {
                        navigate(`/report/${row.original.candidateId}`, {
                          state: {
                            reportDetails: row.original,
                            assessmentDetails: assessmentDetails,
                          },
                        });
                    }}
                >
                    Report
                </Button>
            </div>
          )
        }
      },
    ];
  
    export default columns;