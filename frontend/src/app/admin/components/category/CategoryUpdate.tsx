"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";
import { toast } from "react-toastify";
import CategoryServices from "../../services/CategoryServices";

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
  name: z.string().min(3, "Tên danh mục phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  slug: z.string().optional(),
  image: z.string().optional(),
});

function CategoryUpdate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      image: "",
    },
  });

  useEffect(() => {
    async function fetchCategory() {
      if (!slug) return;
      try {
        const res = await CategoryServices.getCategoryBySlug(slug);
        if (res?.data) {
          form.reset(res.data);
          setPreviewImage(
            res.data.image.startsWith("http")
              ? res.data.image
              : `${API_URL}/images/${res.data.image}`
          );
          setCategoryId(res.data._id);
        } else {
          toast.error("Không tìm thấy danh mục");
          router.push("/admin/manage/category");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu danh mục");
      }
    }
    fetchCategory();
  }, [slug, form, router]);

  useEffect(() => {
    const name = form.watch("name");
    if (name) {
      form.setValue("slug", slugify(name, { lower: true, locale: "vi" }));
    }
  }, [form]);

  const watchedName = form.watch("name");
  useEffect(() => {
    if (watchedName) {
      form.setValue(
        "slug",
        slugify(watchedName, { lower: true, locale: "vi" })
      );
    }
  }, [watchedName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!categoryId) {
        toast.error("Không tìm thấy ID danh mục");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append(
        "slug",
        values.slug || slugify(values.name, { lower: true, locale: "vi" })
      );

      // Xử lý ảnh đơn giản như file add new
      if (file) {
        formData.append("image", file);
      } else if (values.image) {
        formData.append("image", values.image);
      }

      const res = await CategoryServices.updateCategory(categoryId, formData);

      if (!res) {
        toast.error("Không nhận được phản hồi từ server");
        return;
      }

      if (res.data || res.success) {
        toast.success("Cập nhật danh mục thành công");
        router.push("/admin/manage/category");
      } else {
        toast.error(res.message || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật danh mục");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên danh mục *</FormLabel>
                <FormControl>
                  <Input placeholder="Tên danh mục" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đường dẫn danh mục</FormLabel>
                <FormControl>
                  <Input placeholder="slug-danh-muc" {...field} />
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
              <FormLabel>Mô tả danh mục</FormLabel>
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
              <FormLabel>Ảnh đại diện</FormLabel>
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
                      alt="Ảnh danh mục"
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

export default CategoryUpdate;
