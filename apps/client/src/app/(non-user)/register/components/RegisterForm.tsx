"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
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
import {
  AiOutlineEye as ShowIcon,
  AiOutlineEyeInvisible as HideIcon,
} from "react-icons/ai";
import { BiArrowBack as BackIcon } from "react-icons/bi";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth/user/login";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse, User } from "@/interfaces";
import { userStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { registerUser } from "@/api/auth/user/register";
// import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const RegisterForm = () => {
  const { login } = userStore();
  const { replace } = useRouter();

  // state
  const [slide, setSlide] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isPending, mutate: registerMutation } = useMutation<
    ApiResponse<User>,
    unknown,
    FormData,
    unknown
  >({
    mutationFn: (data) => registerUser(data),
    onSuccess: (data) => {
      replace("/");
      toast({
        title: `Welcome ${data.data.fullName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: error?.message || "Failed to login",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { email, password, confirmPassword, username, fullName } = values;

    if (slide === 2) {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);

      // Uncomment the line below if registerMutation is the function handling form data
      registerMutation(formData);
    } else if (password !== confirmPassword) {
      toast({
        title: "Password should be the same",
      });
    } else {
      setSlide((state) => state + 1);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          {slide === 2 && (
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => {
                setSlide(1);
              }}
            >
              <BackIcon />
            </Button>
          )}
          Register
        </CardTitle>
        <CardDescription>
          {slide === 1 &&
            "Enter your information below to create your account."}
          {slide === 2 && "Upload your avatar and cover image (Not required)."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {slide === 1 && (
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
                          type="email"
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          className="w-full rounded-lg"
                          placeholder="Enter your full name"
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          className="w-full rounded-lg"
                          placeholder="Enter your username"
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
                        <div
                          className={cn([
                            "flex items-center h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ",
                          ])}
                        >
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className=" px-3 py-2  h-full w-full outline-none bg-transparent"
                            placeholder="Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            size={"icon"}
                            variant={"ghost"}
                            className="aspect-square"
                            onClick={() => {
                              setShowPassword((state) => !state);
                            }}
                          >
                            {showPassword ? <HideIcon /> : <ShowIcon />}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isPending}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <div
                          className={cn([
                            "flex items-center h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ",
                          ])}
                        >
                          <input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            className=" px-3 py-2  h-full w-full outline-none bg-transparent"
                            placeholder="Confirm your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            size={"icon"}
                            variant={"ghost"}
                            className="aspect-square"
                            onClick={() => {
                              setShowPassword((state) => !state);
                            }}
                          >
                            {showPassword ? <HideIcon /> : <ShowIcon />}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground">
                Already have account?{" "}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
                </Link>
                .
              </p>
            </CardContent>
          )}

          {slide === 2 && (
            <CardContent className="grid gap-4">
              <Label htmlFor="avatar">Avatar File</Label>
              <Input
                id="avatar"
                type="file"
                className="w-full rounded-lg"
                placeholder="Select avatar file"
                accept="image/*"
                multiple={false}
              />
              <Label htmlFor="cover">Cover File</Label>
              <Input
                id="cover"
                type="file"
                className="w-full rounded-lg"
                placeholder="Select cover image file"
                accept="image/*"
                multiple={false}
              />
            </CardContent>
          )}

          <CardFooter>
            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending && <SpinnerIcon className="animate-spin text-xl" />}
              {slide === 1 && "Next"}
              {slide === 2 && "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RegisterForm;
