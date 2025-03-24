"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CouponServices from "../../services/CouponServices";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TCreateCouponParams } from "../../types";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  code: z.string().min(3, "Mã giảm giá phải có ít nhất 3 ký tự"),
  discount: z.string().optional(),
  type: z.enum(["Amount", "Shipping"]),
  start_date: z.date(),
  end_date: z.date(),
  quantity: z.string().optional(),
  description: z.string().optional(),
});

function CouponAddNew() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discount: "0",
      type: "Amount",
      start_date: new Date(),
      end_date: new Date(),
      quantity: "0",
      description:"",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const couponData: TCreateCouponParams = {
        code: values.code,
        discount: parseFloat(values.discount || "0"),
        type: values.type,
        start_date: values.start_date,
        end_date: values.end_date,
        quantity: parseFloat(values.quantity || "0"),
        description: values.description || "",
      };
  
      const res = await CouponServices.createCoupon(couponData);
      
      if (!res?.success) {
        toast.error(res?.message || "Có lỗi xảy ra");
        return;
      }
      toast.success("Tạo mã giảm giá thành công");
      router.push("/admin/manage/coupon");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo mã giảm giá");
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã giảm giá *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập mã giảm giá" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá trị giảm *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số tiền hoặc %" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giảm giá *</FormLabel>
                <FormControl>
                  <select {...field} className="border rounded-md p-2 w-full">
                    <option value="Amount">Giảm theo số tiền</option>
                    <option value="Shipping">Giảm phí vận chuyển</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="size-5 mr-3" />
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 shadow-lg bg-white border rounded-md" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Ngày kết thúc *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon  className="size-5 mr-3" />
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 shadow-lg bg-white border rounded-md" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng mã *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số lượng" {...field} />
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
                <FormLabel>Mô tả mã giảm giá</FormLabel>
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
        </div>
        <Button isLoading={isSubmitting} variant="primary" type="submit" className="w-[120px]" disabled={isSubmitting}>
          Tạo mã
        </Button>
      </form>
    </Form>
  );
}

export default CouponAddNew;
