"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import TableServices from "../../services/TableServices";
import { TCreateTableParams } from "../../types";
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

const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

const formSchema = z.object({
  name: z.string().nonempty("Tên bàn không được bỏ trống").min(3, "Tên bàn phải có ít nhất 3 ký tự"),
  position: z.string().optional(),
  image: z.string().optional(),
});

function TableUpdate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
      image: "",
    },
  });

  useEffect(() => {
    async function fetchTableDetails() {
      if (!id) return;

      try {
        const res = await TableServices.getTableById(id);

        if (!res?.data) {
          toast.error(res?.message || "Không thể tải thông tin bàn");
          return;
        }

        form.reset({
          name: res.data.name,
          position: res.data.position,
        });
        setPreviewImage(
          res.data.image.startsWith("http")
            ? res.data.image
            : `${API_URL}/images/${res.data.image}`
        );
        setTableId(res.data._id);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải thông tin bàn");
        router.push("/admin/manage/table");
      }
    }
    fetchTableDetails();
  }, [id, router, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const tableData: TCreateTableParams = {
        name: values.name,
        position: values.position || "",
        image: file ? URL.createObjectURL(file) : "",
      };

      const formData = new FormData();
      formData.append("name", tableData.name);
      formData.append("position", tableData.position);
      if (file) {
        formData.append("image", file);
      }

      if (!tableId) {
        toast.error("Không tìm thấy bàn");
        return;
      }
      const res = await TableServices.updateTable(tableId, formData);

      if (!res?.success) {
        toast.error(res?.message || "Có lỗi xảy ra");
        return;
      }
      toast.success("Cập nhật bàn thành công");
      router.push("/admin/manage/table");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật bàn");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-8 mt-6 mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bàn *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên bàn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vị trí *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập vị trí" {...field} />
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
                      <img
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

export default TableUpdate;
