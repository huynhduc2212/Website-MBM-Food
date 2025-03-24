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

const formSchema = z.object({
  name: z.string().min(3, "Tên bàn phải có ít nhất 3 ký tự"),
  position: z.string().min(3, "Vị trí phải có ít nhất 3 ký tự"),
});

function TableUpdate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
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

        setTableId(res.data._id);
        form.reset({
          name: res.data.name,
          position: res.data.position,
        });
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
        position: values.position,
      };

      if (!tableId) {
        toast.error("Không tìm thấy bàn");
        return;
      }
      const res = await TableServices.updateTable(tableId, tableData);

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
        <div className="grid grid-cols-2 gap-8 mt-10 mb-8">
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