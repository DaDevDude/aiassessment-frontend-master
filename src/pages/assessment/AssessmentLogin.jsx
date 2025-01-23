import { Button } from "@/lib/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import { assessmentRegisterSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import LoginBannerSVG from "@/assets/login_banner.svg";

const AssessmentLoginForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(assessmentRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (value) => {
    navigate(`/assessment/upload/resume/${id}`, {
      state: {
        ...value,
      },
    });
  };

  return (
    <div className="w-full h-full flex">
      <div className="w-[55%] p-28 flex justify-center items-center bg-gray-100">
        <img src={LoginBannerSVG} alt="login banner svg" />
      </div>
      <div className="bg-white w-[45%] p-28 flex flex-col justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 text-primary">Login</h1>
              <p className="">
                Welcome to the Assessment prepared by Onelab Ventures
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button>Next</Button>
          </form>
        </Form>
        <img alt="Step1" src="/Step1.svg" className="mt-5 w-[42px] h-[10px]" />
      </div>
    </div>
  );
};

export default AssessmentLoginForm;
