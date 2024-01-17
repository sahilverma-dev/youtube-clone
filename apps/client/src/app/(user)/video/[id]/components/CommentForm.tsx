"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  videoId: string;
}

const formSchema = z.object({
  comment: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

const CommentForm: FC<Props> = ({ videoId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    queryClient.refetchQueries({
      queryKey: ["comments", videoId],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-full flex items-center gap-2">
                  <Image
                    src={
                      "http://res.cloudinary.com/sahilverma-dev/image/upload/v1705473235/awcgnoebkjhpnoiyfv5n.png"
                    }
                    alt={"sahil"}
                    height={50}
                    width={50}
                    className="h-10 w-10 aspect-square rounded-full object-cover"
                  />
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
          <Button type="submit" className="rounded-full" variant={"secondary"}>
            Comment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
