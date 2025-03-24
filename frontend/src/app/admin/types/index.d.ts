export type TCreateCategoryParams = {
  name: string;
  slug: string;
  image: string;
  description: string;
};

export type TCreateProductParams = {
  name: string;
  description: string;
  variants: {
    option: string;
    image: string;
    price: number;
    sale_price: number;
  }[];
  slug: string;
  idcate: string;
  hot: number;
};

export type TCreateCouponParams = {
  code: string;
  discount: number;
  type: "Amount" | "Shipping";
  start_date: Date;
  end_date: Date;
  status?: "Active" | "Expired" | "Used_up";
  quantity: number;
  description:string;
};

export type TCreateTableParams = {
  name: string;
  status?: "Available" | "Reserved";
  position:string;
};
