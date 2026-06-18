export interface SizeOption {
  size: string;
  quantity: number;
}

// Nueva estructura jerárquica para la interfaz visual
export interface ProductVariant {
  id: string;
  colorName: string;
  imageUrl: string;
  hexColor: string;
  sizes: SizeOption[];
  selected?: boolean;
  isSuede?: boolean;
}

export interface ProductStyle {
  styleName: string;
  price: number;
  variants: ProductVariant[];
}

export interface ProductCategory {
  categoryName: string;
  description: string;
  styles: ProductStyle[];
}

export interface CustomerInfo {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  billingAddress: string;
  shippingAddress: string;
}

// La estructura plana que espera enviar tu GoogleSheetsService
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sizes: SizeOption[];
}