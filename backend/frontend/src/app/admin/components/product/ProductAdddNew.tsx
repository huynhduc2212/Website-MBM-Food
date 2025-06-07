"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CategoryServices from "../../services/CategoryServices";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { Plus, Trash2 } from "lucide-react";

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
import { TCreateProductParams } from "../../types";
import { editorOptions } from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductServices from "../../services/ProductServices";

// Định nghĩa schema cho một variant
const variantSchema = z.object({
  _id: z.string().optional(),
  option: z.string().optional(),
  image: z.string().optional(),
  price: z
    .string()
    .nonempty("Giá không được bỏ trống")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Giá sản phẩm phải là số và lớn hơn 0",
    }),
  sale_price: z.string().optional(),
});

const formSchema = z.object({
  name: z
    .string()
    .nonempty("Tên sản phẩm không được bỏ trống")
    .min(12, "Tên sản phẩm phải có ít nhất 12 ký tự"),
  description: z.string().optional(),
  slug: z.string().optional(),
  idcate: z.string().nonempty("Tên danh mục không được bỏ trống"),
  hot: z.number().optional(),
  variants: z.array(variantSchema),
});

function ProductAddNew() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<(string | null)[]>([null]);
  const [files, setFiles] = useState<(File | null)[]>([null]);
  const editorRef = useRef<Editor | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      hot: 0,
      idcate: "",
      variants: [
        {
          option: "",
          price: "",
          sale_price: "",
          image: "",
        },
      ],
    },
  });

  // const { fields, append, remove } = form.useFieldArray({
  //   name: "variants",
  // });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await CategoryServices.getAllCategories();
      setCategories(categoryData);
    };

    fetchData();
  }, []);

  const handleImageChange = (index: number, file: File) => {
    const newFiles = [...files];
    newFiles[index] = file; // Lưu tệp thực tế
    setFiles(newFiles);

    const newPreviewImages = [...previewImages];
    newPreviewImages[index] = URL.createObjectURL(file); // Chỉ để xem trước
    setPreviewImages(newPreviewImages);
  };

  const addVariant = () => {
    append({ option: "", price: "", sale_price: "", image: "" });
    setFiles([...files, null]);
    setPreviewImages([...previewImages, null]);
  };

  const removeVariant = (index: number) => {
    remove(index);
    const newFiles = [...files];
    const newPreviewImages = [...previewImages];
    newFiles.splice(index, 1);
    newPreviewImages.splice(index, 1);
    setFiles(newFiles);
    setPreviewImages(newPreviewImages);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    setIsSubmitting(true);
    try {
      const productData: TCreateProductParams = {
        name: values.name,
        description: values.description || "",
        slug:
          values.slug || slugify(values.name, { lower: true, locale: "vi" }),
        idcate: values.idcate || "",
        hot: values.hot || 0,
        variants: values.variants.map((variant, index) => ({
          _id: variant._id || "",
          option: variant.option || "",
          price: parseFloat(variant.price || "0"),
          sale_price: parseFloat(variant.sale_price || "0"),
          image: files[index] ? (files[index] as File).name : "", // Để trống ban đầu, sẽ cập nhật sau khi upload
        })),
      };

      console.log("🚀 ~ onSubmit ~ productData:", productData);

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("slug", productData.slug);
      formData.append("hot", String(productData.hot));
      formData.append("idcate", productData.idcate);

      // Thêm dữ liệu biến thể vào FormData
      productData.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][option]`, variant.option);
        formData.append(`variants[${index}][price]`, String(variant.price));
        formData.append(
          `variants[${index}][sale_price]`,
          String(variant.sale_price)
        );

        // Thêm tệp hình ảnh nếu có
        if (files[index]) {
          formData.append(`variants[${index}][image]`, files[index] as File);
        }
      });

      // Gửi formData đến server
      const response = await ProductServices.createProduct(formData);
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (response.success) {
        toast.success("Tạo sản phẩm thành công");
        router.push("/admin/manage/products");
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo sản phẩm");
    } finally {
      setIsSubmitting(false);
      form.reset();
      setFiles([null]);
      setPreviewImages([null]);
    }
  }
  const { theme } = useTheme();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-8 mt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sản phẩm</FormLabel>
                <FormControl>
                  <Input placeholder="Tên sản phẩm" {...field} />
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
                <FormLabel>Đường dẫn sản phẩm</FormLabel>
                <FormControl>
                  <Input placeholder="slug-danh-muc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idcate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem value={category._id} key={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Mô tả sản phẩm</FormLabel>
                <FormControl>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(_evt, editor) => {
                      (editorRef.current = editor).setContent(
                        field.value || ""
                      );
                    }}
                    value={field.value}
                    {...editorOptions(field, theme)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Biến thể sản phẩm</h3>
              <Button
                type="button"
                onClick={addVariant}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm biến thể
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 gap-8 p-4 mb-4 border rounded-lg"
              >
                <FormField
                  control={form.control}
                  name={`variants.${index}.option`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhỏ 6 inch..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá khuyến mãi</FormLabel>
                      <FormControl>
                        <Input placeholder="299.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`variants.${index}.sale_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá gốc</FormLabel>
                      <FormControl>
                        <Input placeholder="399.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Ảnh biến thể</FormLabel>
                  <FormControl>
                    <div className="border border-gray-300 p-2 rounded-md h-[250px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageChange(index, file);
                          }
                        }}
                      />
                      {previewImages[index] && (
                        <img
                          src={previewImages[index]!}
                          alt="Ảnh biến thể"
                          width={250}
                          height={250}
                          className="h-[200px] w-auto rounded-lg object-cover mt-2"
                        />
                      )}
                    </div>
                  </FormControl>
                </FormItem>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeVariant(index)}
                    className="col-span-2 w-fit"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa biến thể
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          isLoading={isSubmitting}
          variant="primary"
          type="submit"
          className="w-[120px]"
          disabled={isSubmitting}
        >
          Tạo sản phẩm
        </Button>
      </form>
    </Form>
  );
}

export default ProductAddNew;
