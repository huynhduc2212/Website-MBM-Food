"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import BannerServices from "../../services/BannerServices"; // Thay đổi từ CategoryServices

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z
    .string()
    .nonempty("Tên banner không được bỏ trống")
    .min(6, "Tiêu đề phải có ít nhất 6 ký tự"),
  description: z.string().optional(),
  image: z.string(),
});

function BannerAddNew() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("Ảnh không được để trống");
      return;
    }

    setIsSubmitting(true);
    try {
      const bannerData = {
        title: values.title,
        description: values.description || "",
        image: file ? URL.createObjectURL(file) : "",
      };

      const formData = new FormData();
      formData.append("title", bannerData.title);
      formData.append("description", bannerData.description);
      if (file) {
        formData.append("image", file);
      }

      const res = await BannerServices.createBanner(formData);
      if (!res?.success) {
        toast.error(res?.message || "Có lỗi xảy ra");
        return;
      }
      toast.success("Tạo banner thành công");
      router.push("/admin/manage/banner");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo banner");
    } finally {
      setIsSubmitting(false);
      form.reset();
      setPreviewImage(null);
      setFile(null);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-8 mt-10 mb-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề banner *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề banner" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả banner</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả..."
                    {...field}
                    className="h-[250px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh banner</FormLabel>
                <FormControl>
                  <div className="border border-gray-300 p-2 rounded-md h-[250px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Ảnh banner"
                        width={250}
                        height={250}
                        className="h-[200px] w-auto rounded-lg object-cover mt-2"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          isLoading={isSubmitting}
          variant="primary"
          type="submit"
          className="w-[120px]"
          disabled={isSubmitting}
        >
          Tạo banner
        </Button>
      </form>
    </Form>
  );
}
export default BannerAddNew;
