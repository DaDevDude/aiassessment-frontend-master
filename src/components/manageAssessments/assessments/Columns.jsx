import { Button } from "@/lib/ui/button";
import { Trash2, MoreHorizontal, ArrowUpDown } from "lucide-react/dist/cjs/lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/ui/dialog"
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { useNavigate } from "react-router-dom";
import { deleteAssessment } from "@/redux/slices/manageAssessment";
import {  useDispatch } from "react-redux";

const columns = [
    {
      name: "testName",
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "desc" ? "asc": "desc");
            }}
          >
            Test Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      enableSorting: true,
    },
    {
      name: "jobRole",
      accessorKey: "designation",
      header: "Job Role",
    },
    {
      name: "candidateCount",
      accessorKey: "candidateCount",
      header: "Candidate Count",
    },
    {
      name: "createDate",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Create Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({row}) => {
        const value = row.getValue("createdAt");
        return new Date(value).toISOString().split('T')[0]
      }
    },
    {
      name: "actions",
      accessorKey: "",
      header: "Actions",
      cell: ({row}) => {
        const navigate = useNavigate();
        const dispatch = useDispatch();
        return (
          <div className="py-2 space-x-2 flex align-center justify-center">
              <Button
                variant="link" 
                onClick={() => {
                    navigate("/dashboard/assessment-details", { state: { assessmentDetails: row.original } })
                }}
              >
                  View Report
              </Button>
              <Dialog className="rounded-md">
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost"
                    className="pl-0 hover:bg-slate-50"
                    onClick={() => {}}
                  >
                      <Trash2 className="text-red-800 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader >
                    <div className="flex align-center justify-center">
                      <div className=" bg-orange-200 mt-4 rounded-full p-5">
                        <div className=" bg-orange-600 rounded-full p-3">
                          <Trash2 className="text-white h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <DialogTitle>Are you sure you want to delete this?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-row align-center justify-center gap-4 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button 
                        type="submit"
                        onClick={async () => {
                          try {
                            console.log("before");
                            const response = await dispatch(deleteAssessment(row.original));
                            console.log("after", response);
                          } catch (error) {
                            console.log("errroor here", error);
                          }
                        }}
                      >Delete</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
        )
      }
    },
  ];

  export default columns;