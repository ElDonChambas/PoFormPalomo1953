export interface SizeOption {
  size: string;
  quantity: number;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  imageUrl: string;
  hexColor: string;
  sizes: SizeOption[];
  selected?: boolean;
  isSuede?: boolean;
  swatchUrl?: string;
}

export interface ProductStyle {
  styleName: string;
  price: number;
  description: string;
  variants: ProductVariant[];
}

export interface ProductCategory {
  categoryName: string;
  description: string;
  styles: ProductStyle[];
  isExpanded?: boolean;
}

export interface CustomerInfo {
  // Billing
  billingCompany: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
  taxId: string;

  // Control del Checkbox
  sameAsBilling: boolean;

  // Shipping
  shippingCompany: string;
  shippingAddress: string;
  shippingEmail: string;
  shippingPhone: string;
  deliveryDetails: string;

  // Extras
  additionalComments: string;
  earliestDelivery: string;
  latestDelivery: string;
}

// La estructura plana que espera enviar tu GoogleSheetsService
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sizes: SizeOption[];
}