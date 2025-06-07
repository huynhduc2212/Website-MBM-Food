export interface Variant {
    option: string;
    price: number;
    sale_price: number;
    image: string;
    _id: string;
  }
  
  export interface Product {
    _id: string;
    name: string;
    slug: string;
    idcate: string;
    variants: Variant[];
    matchedVariant?: Variant; 
  }
  