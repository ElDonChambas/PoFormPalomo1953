export interface SizeOption {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  sizes: SizeOption[];
  selected?: boolean; // <-- Nueva propiedad
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