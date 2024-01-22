"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userStore } from "@/store";
import Link from "next/link";

// icons
import { CgSpinner as SpinnerIcon } from "react-icons/cg";
import { ApiResponse, Comment } from "@/interfaces";
import { addVideoComment } from "@/api/comments/addVideoComment";
import { toast } from "@/components/ui/use-toast";

interface Props {
  videoId: string;
}

const formSchema = z.object({
  comment: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

const CommentForm: FC<Props> = ({ videoId }) => {
  const { user } = userStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const queryClient = useQueryClient();

  const { isPending, mutate: commentMutation } = useMutation<
    ApiResponse<Comment>,
    unknown,
    { content: string },
    unknown
  >({
    mutationFn: ({ content }) =>
      addVideoComment({
        content,
        videoId,
      }),
    onSuccess: () => {
      form.setValue("comment", "");
      queryClient.refetchQueries({
        queryKey: ["comments", videoId],
      });
    },
    onError: (error: any) => {
      toast({
        title: error?.message || "Failed to comment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    commentMutation({
      content: values.comment,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-full flex items-center gap-2">
                  {user ? (
                    <Link href={`/channel/${user.username}`}>
                      <Image
                        src={
                          user.avatar ? user.avatar.url : "/default-user.png"
                        }
                        alt={user.fullName}
                        height={50}
                        width={50}
                        className="h-10 w-10 aspect-square rounded-full object-cover"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={"/default-user.png"}
                      alt={"default user"}
                      height={50}
                      width={50}
                      className="h-10 w-10 aspect-square rounded-full object-cover"
                    />
                  )}

                  <Input
                    className="w-full rounded-lg"
                    placeholder="Add a comment..."
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end">
          <Button
            disabled={isPending}
            type="submit"
            className="rounded-full gap-2"
            variant={"secondary"}
          >
            {isPending && <SpinnerIcon className="animate-spin text-xl" />}
            Comment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
