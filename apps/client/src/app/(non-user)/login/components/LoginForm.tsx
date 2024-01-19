"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
// components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

// icons
import { CgSpinner as SpinnerIcon } from "react-icons/cg";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth/user/login";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse, User } from "@/interfaces";
import { userStore } from "@/store";
// import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string(),
  // .min(8, {
  //   message: "Password must be at least 8 characters.",
  // }),
});

const LoginForm = () => {
  const { login } = userStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutate: loginMutation } = useMutation<
    ApiResponse<{
      user: User;
      refreshToken: string;
    }>,
    unknown,
    { email: string; password: string },
    unknown
  >({
    mutationFn: ({ email, password }) =>
      loginUser({
        email,
        password,
      }),
    onSuccess: (data) => {
      console.log(data);
      toast({ title: `Welcome ${data?.data?.user?.fullName}` });
      login(data.data.user);
      // redirect("/");
    },
    onError: (error: any) => {
      toast({
        title: error?.message || "Failed to login",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const { email, password } = form.getValues();
    loginMutation({ email, password });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        className="w-full rounded-lg"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        className="w-full rounded-lg"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              Don't have account?{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                Create new account
              </Link>
              .
            </p>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending && <SpinnerIcon className="animate-spin text-xl" />}
              Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
