export type PropertyCategory = "NHA_PHO" | "CAN_HO" | "BIET_THU" | "DAT_NEN";

export interface Property {
  id: string;
  title: string;
  description: string | null;
  category: PropertyCategory;
  price: number;
  address: string;
  width: number | null;
  length: number | null;
  floors: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  images: string[];
  contact: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyInput {
  title: string;
  description?: string;
  category: PropertyCategory;
  price: number;
  address: string;
  width: number;
  length: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  images?: string[];
  contact?: string;
}

export interface PaginatedProperties {
  data: Property[];
  total: number;
  page: number;
  lastPage: number;
}

export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
