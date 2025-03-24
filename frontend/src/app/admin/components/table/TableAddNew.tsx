"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TableServices from "../../services/TableServices";

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
import { TCreateTableParams } from "../../types";

const formSchema = z.object({
  name: z.string().min(3, "Tên bàn phải có ít nhất 3 ký tự"),
  position: z.string().min(3, "Vị trí phải có ít nhất 3 ký tự"),
});

function TableAddNew() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const tableData: TCreateTableParams = {
        name: values.name,
        position: values.position,
      };
      const res = await TableServices.createTable(tableData);

      if (!res?.success) {
        toast.error(res?.message || "Có lỗi xảy ra");
        return;
      }
      toast.success("Tạo bàn thành công");
      router.push("/admin/manage/table");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo bàn");
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
                  <Input placeholder="Nhập vị trí bàn" {...field} />
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
          Tạo bàn
        </Button>
      </form>
    </Form>
  );
}

export default TableAddNew;
