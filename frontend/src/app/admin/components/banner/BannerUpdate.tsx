/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import BannerServices from "../../services/BannerServices";

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

const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

const formSchema = z.object({
  title: z.string().min(3, "Tên banner phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  image: z.string().optional(),
});

function BannerUpdate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [bannerId, setBannerId] = useState<string | null>(null);
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

  useEffect(() => {
    async function fetchBanner() {
      if (!id) return;
      try {
        const res = await BannerServices.getByIdBanner(id);
        if (res?.data) {
          form.reset(res.data);
          setPreviewImage(
            res.data.image.startsWith("http")
              ? res.data.image
              : `${API_URL}/images/${res.data.image}`
          );
          setBannerId(res.data._id);
        } else {
          toast.error("Không tìm thấy banner");
          router.push("/admin/manage/banner");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu banner");
      }
    }
    fetchBanner();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!bannerId) {
        toast.error("Không tìm thấy ID banner");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.title);
      formData.append("description", values.description || "");

      if (file) {
        formData.append("image", file);
      } else if (values.image) {
        formData.append("image", values.image);
      }

      const res = await BannerServices.updateBanner(bannerId, formData);

      if (!res) {
        toast.error("Không nhận được phản hồi từ server");
        return;
      }

      if (res.data || res.success) {
        toast.success("Cập nhật banner thành công");
        router.push("/admin/manage/banner");
      } else {
        toast.error(res.message || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật banner");
    } finally {
      setIsSubmitting(false);
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
                <FormLabel>Tên banner *</FormLabel>
                <FormControl>
                  <Input placeholder="Tên banner" {...field} />
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
            render={() => (
              <FormItem>
                <FormLabel>Ảnh banner</FormLabel>
                <FormControl>
                  <div className="border border-gray-300 p-2 rounded-md h-[250px]">
                    <input
                      type="file"
                      accept="images/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {previewImage && (
                      <Image
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
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}

export default BannerUpdate;