import UploadResumeBannerSVG from "@/assets/upload_banner.svg";
import { Input } from "@/lib/ui/input";
import { File, FileUp, X } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Progress } from "@/lib/ui/progress";
import { useEffect, useState } from "react";
import { axiosServerInstance } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { toast } from "@/lib/ui/use-toast";
import { formatFileSize } from "@/utils/methods";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoadingSpinner from "@/components/shared/LoaderSpinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { useForm } from "react-hook-form";
import { linkedInSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";

const UploadResumeForm = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(linkedInSchema),
    defaultValues: {
      linkedin: "",
    },
  });

  const handleUploadResume = async (file) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosServerInstance.post(
        serverRoutes.uploadResume,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      const url = response.data.url;
      setResumeUrl(url);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Internal server error";
      toast({
        title: "Upload Resume",
        variant: "destructive",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const size = formatFileSize(selectedFile.size);
      if (size > 3) {
        toast({
          title: "File Size Error",
          variant: "destructive",
          description: "File size should be less than 3 MB",
        });
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const removeResume = () => {
    setFile(null);
    setResumeUrl("");
  };

  const handleSubmit = (data) => {
    if (!resumeUrl) return;
    navigate(`/assessment/instruction/${id}`, {
      state: {
        ...state,
        resume: resumeUrl,
        linkedin: data.linkedin, // Add LinkedIn URL to state
      },
    });
  };

  useEffect(() => {
    if (file) {
      handleUploadResume(file);
    }
  }, [file]);

  const size = file && formatFileSize(file.size);
  const name =
    file && file.name.slice(0, 10) + file.name.slice(file.name.length - 4);

  if (!state?.name || !state?.email) {
    return <Navigate to={`/assessment/login/${id}`} />;
  }

  return (
    <div className="w-full h-full flex">
      <div className="w-[55%] p-28 flex justify-center items-center bg-gray-100">
        <img src={UploadResumeBannerSVG} alt="login banner svg" />
      </div>
      <div className="w-[45%] p-28 flex flex-col justify-center items-center">
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold mb-2 text-primary">
            Personal Details
          </h1>
          <p className="">
            Provide us your personal information to begin with the test
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <h1 className="text-xl font-bold mt-2 mb-2 text-primary">
                    LinkedIn
                  </h1>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your LinkedIn profile URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-start">
              <h1 className="text-xl font-bold mb-1 text-primary">
                Upload Resume
              </h1>
              <p className="">Upload your resume to begin with the Test</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative border border-dashed rounded-xl overflow-hidden">
                <Input
                  disabled={isLoading}
                  className="relative w-full h-40 opacity-0 z-10"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
                <div className="bg-gray-100 absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className="bg-white p-2 rounded-lg">
                    <FileUp />
                  </span>
                  <span className="text-center text-sm">
                    <p>Drag and Drop or Choose File to Upload</p>
                    <p>PDF Max 3.0MB</p>
                  </span>
                </div>
              </div>
              {file && (
                <div className="bg-gray-100 flex flex-col gap-3 p-3 rounded-xl border border-dashed">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <span className="bg-white p-2 rounded-lg">
                        <File size="18" />
                      </span>
                      <p className="line-clamp-1 font-medium">{name}</p>
                    </span>
                    <span className="flex items-center gap-1">
                      <p className="font-medium">{size} MB</p>
                      <X
                        size="18"
                        className="cursor-pointer"
                        onClick={removeResume}
                      />
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="w-full h-1" />
                </div>
              )}
            </div>
            <Button disabled={isLoading} type="submit">
              {isLoading ? <LoadingSpinner /> : "Proceed"}
            </Button>
          </form>
        </Form>
        <img alt="Step1" src="/Step2.svg" className="mt-5 w-[42px] h-[10px]" />
      </div>
    </div>
  );
};

export default UploadResumeForm;
