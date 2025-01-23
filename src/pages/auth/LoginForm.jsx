import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginSchema } from "@/utils/validations";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/auth/thunk";
import { useEffect } from "react";
import { toast } from "@/lib/ui/use-toast";
import { clearState } from "@/redux/slices/auth";
import LoadingSpinner from "@/components/shared/LoaderSpinner";

const LoginForm = () => {
  const dispatch = useDispatch();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    dispatch(login(values));
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Login",
        description: message,
        duration: 2000,
      });
    } else if (isError) {
      toast({
        title: "Login",
        description: message,
        duration: 2000,
      });
    }
    dispatch(clearState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, message]);

  return (
    <Card className="w-[400px] border-dashed rounded-2xl">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Please login your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="mt-6">
              {isLoading ? <LoadingSpinner /> : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm">
          Don&#39;t have an account ?{" "}
          <Link to="/auth/register" className="font-medium">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
