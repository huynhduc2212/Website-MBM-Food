"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryServices from "../../services/CategoryServices";
import { Editor } from "@tinymce/tinymce-react";
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

const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

// Định nghĩa schema cho một variant
const variantSchema = z.object({
  option: z.string().optional(),
  image: z.string().optional(),
  price: z.string().optional(),
  sale_price: z.string().optional(),
  _id: z.string().optional(), // Thêm _id để lưu ID của variant
});

const formSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  slug: z.string().optional(),
  idcate: z.string().optional(),
  hot: z.number().optional(),
  variants: z.array(variantSchema),
});

function ProductUpdate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<(string | null)[]>([null]);
  const [files, setFiles] = useState<(File | null)[]>([null]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const editorRef = useRef<Editor | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [editorContent, setEditorContent] = useState("");

  // Khởi tạo form với defaultValues
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // Lấy dữ liệu sản phẩm và danh mục
  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;

      setIsLoading(true);
      try {
        const categoryData = await CategoryServices.getAllCategories();
        setCategories(categoryData);

        const productData = await ProductServices.getProductBySlug(slug);

        if (!productData) {
          toast.error("Không tìm thấy thông tin sản phẩm");
          router.push("/admin/manage/products");
          return;
        }

        console.log("Product data fetched:", productData);
        setProductId(productData._id);
        setEditorContent(productData.description || "");

        const initialExistingImages =
          productData.variants?.map((variant) => variant.image || "") || [];

        setExistingImages(initialExistingImages);
        // setPreviewImages(initialExistingImages); 

        // Reset form với dữ liệu sản phẩm
        form.reset({
          name: productData.name || "",
          description: productData.description || "",
          slug: productData.slug || "",
          hot: productData.hot || 0,
          idcate: productData.idcate || "",
          variants:
            productData.variants?.length > 0
              ? productData.variants.map((variant) => ({
                  _id: variant._id || "",
                  option: variant.option || "",
                  price: variant.price ? variant.price.toString() : "0",
                  sale_price: variant.sale_price
                    ? variant.sale_price.toString()
                    : "0",
                  image: variant.image || "",
                }))
              : [{ option: "", price: "", sale_price: "", image: "" }],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [slug, form, router]);

  // Tự động tạo slug từ tên sản phẩm
  const watchedName = form.watch("name");
  useEffect(() => {
    if (watchedName) {
      form.setValue(
        "slug",
        slugify(watchedName, { lower: true, locale: "vi" })
      );
    }
  }, [watchedName, form]);

  const handleImageChange = (index: number, file: File) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    const newPreviewImages = [...previewImages];
    newPreviewImages[index] = URL.createObjectURL(file);
    setPreviewImages(newPreviewImages);
  };

  const addVariant = () => {
    append({ option: "", price: "", sale_price: "", image: "" });
    setFiles([...files, null]);
    setPreviewImages([...previewImages, null]);
    setExistingImages([...existingImages, ""]);
  };

  const removeVariant = (index: number) => {
    remove(index);
    const newFiles = [...files];
    const newPreviewImages = [...previewImages];
    const newExistingImages = [...existingImages];
    newFiles.splice(index, 1);
    newPreviewImages.splice(index, 1);
    newExistingImages.splice(index, 1);
    setFiles(newFiles);
    setPreviewImages(newPreviewImages);
    setExistingImages(newExistingImages);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!productId) {
      toast.error("Không tìm thấy ID sản phẩm");
      return;
    }

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
          _id: variant._id, // Thêm _id của variant nếu có
          option: variant.option || "",
          price: parseFloat(variant.price || "0"),
          sale_price: parseFloat(variant.sale_price || "0"),
          image: files[index]
            ? (files[index] as File).name
            : existingImages[index], // Giữ ảnh cũ nếu không có tệp mới
        })),
      };

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("slug", productData.slug);
      formData.append("hot", String(productData.hot));
      formData.append("idcate", productData.idcate);

      // Thêm dữ liệu biến thể vào FormData
      productData.variants.forEach((variant, index) => {
        if (variant._id) {
          formData.append(`variants[${index}][_id]`, variant._id as string);
        }
        formData.append(`variants[${index}][option]`, variant.option);
        formData.append(`variants[${index}][price]`, String(variant.price));
        formData.append(
          `variants[${index}][sale_price]`,
          String(variant.sale_price)
        );

        // Thêm tệp hình ảnh mới nếu có
        if (files[index]) {
          formData.append(`variants[${index}][image]`, files[index] as File);
        } else if (existingImages[index]) {
          formData.append(`variants[${index}][image]`, existingImages[index]);
        }
      });

      console.log("Submitting form data:", productData);

      // Gọi API cập nhật sản phẩm sử dụng productId
      const response = await ProductServices.updateProduct(productId, formData);

      if (response.success) {
        toast.success("Cập nhật sản phẩm thành công");
        router.push("/admin/manage/products");
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-10 text-center">Đang tải dữ liệu sản phẩm...</div>
    );
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
                  <Input placeholder="slug-san-pham" {...field} />
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
                  <Input
                    placeholder=""
                    type="number"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(value);
                    }}
                  />
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                  >
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

            {fields.length > 0 &&
              fields.map((field, index) => (
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
                        {previewImages[index] ? (
                          <Image
                            src={previewImages[index]!}
                            alt="Ảnh mới"
                            width={250}
                            height={250}
                            className="h-[200px] w-auto rounded-lg object-cover mt-2"
                            unoptimized
                          />
                        ) : existingImages[index] ? (
                          <Image
                            src={`${API_URL}/images/${existingImages[index]}`}
                            alt="Ảnh cũ"
                            width={250}
                            height={250}
                            className="h-[200px] w-auto rounded-lg object-cover mt-2"
                          />
                        ) : null}
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
                      editorRef.current = editor;
                      if (editorContent) {
                        editor.setContent(editorContent);
                      }
                    }}
                    initialValue={editorContent}
                    init={editorOptions}
                    onEditorChange={(content: string) => {
                      field.onChange(content);
                    }}
                  />
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

export default ProductUpdate;
