"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_FILE_SIZE,
} from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatVideoDuration } from "@/lib/utils";
import { userStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { ApiResponse, Video } from "@/interfaces";
import { uploadVideo } from "@/api/videos/uploadVideo";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters",
  }),
  isPublished: z.boolean(),
  thumbnail: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  video: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      "Only .mp4, .mkv formats are supported."
    ),
});

const VideoForm = () => {
  const { user } = userStore();
  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: true,
      thumbnail: null,
      video: null,
    },
  });

  const { isPending, mutate: uploadMutation } = useMutation<
    ApiResponse<Video>,
    unknown,
    FormData,
    unknown
  >({
    mutationFn: (formData: FormData) => {
      return uploadVideo(formData);
    },
    onSuccess: (data) => {
      toast({ title: `Video uploaded` });
      push(`/video/${data.data._id}`);
    },
    onError: (error: any) => {
      toast({
        title: error?.message || "Failed to login",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { title, description, isPublished, thumbnail, video } = values;
    console.log({ title, description, isPublished, thumbnail, video });

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPublished", `${isPublished}`);
    formData.append("thumbnailFile", thumbnail[0]);
    formData.append("videoFile", video[0]);
    uploadMutation(formData);
  };

  return (
    <div className="w-full md:flex justify-start gap-4">
      <div className="w-full flex-grow p-4 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="text-3xl font-bold">Upload Video</h1>
            <FormField
              control={form.control}
              name="title"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        className="w-full rounded-lg"
                        placeholder="Enter your title"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        cols={10}
                        id="description"
                        className="w-full rounded-lg"
                        placeholder="Enter your description"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="published">Published</Label>
                      <Select
                        value={field.value ? "public" : "private"}
                        onValueChange={(val) => {
                          form.setValue("isPublished", val === "public");
                        }}
                      >
                        <SelectTrigger id="published" className="w-[180px]">
                          <SelectValue placeholder="Published" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="thumbnail">Thumbnail</Label>
                      <Input
                        type="file"
                        multiple={false}
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        id="thumbnail"
                        className="w-full rounded-lg"
                        placeholder="Enter your thumbnail"
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="video"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="video">Video</Label>
                      <Input
                        type="file"
                        multiple={false}
                        accept={ACCEPTED_VIDEO_TYPES.join(",")}
                        id="video"
                        className="w-full rounded-lg"
                        placeholder="Enter your video"
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "Uploading video" : "Upload Video"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-full md:max-w-md p-4 space-y-4">
        <h2 className="text-lg">Preview</h2>
        {form.getValues().thumbnail && (
          <div className="w-full space-y-2 mb-4 group">
            <div className="relative block aspect-video w-full rounded-lg overflow-hidden border group-hover:rounded-none transition-all">
              <Image
                src={URL.createObjectURL(form.getValues().thumbnail[0])}
                alt={form.getValues().title}
                height={500}
                width={600}
                className="w-full h-full object-cover hover:scale-105 transition-all"
              />
            </div>

            <div className="flex flex-grow gap-2">
              <Image
                src={user?.avatar ? user?.avatar.url : "/default-user.png"}
                height={70}
                width={70}
                alt={user?.fullName as string}
                className="h-10 w-10 aspect-square rounded-full object-cover"
              />

              <div className="flex-grow flex flex-col w-full">
                <p className="font-semibold text-foreground">
                  {form.getValues()?.title}
                </p>
                <p className="text-xs font-medium text-secondary-foreground">
                  {user?.fullName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoForm;
