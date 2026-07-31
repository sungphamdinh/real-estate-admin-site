export type PropertyCategory = "MAT_TIEN" | "HEM" | "CAN_HO" | "DAT_NEN";

export type PropertyStatus = "DANG_BAN" | "DANG_GIAO_DICH" | "DA_COC" | "DA_BAN";

export type LegalDocument = "SO_DO_SO_HONG" | "HOP_DONG_MUA_BAN" | "DANG_CHO_SO";

export type HouseDirection =
  | "DONG"
  | "TAY"
  | "NAM"
  | "BAC"
  | "DONG_BAC"
  | "TAY_BAC"
  | "TAY_NAM"
  | "DONG_NAM";

export interface Property {
  id: string;
  title: string;
  description: string | null;
  category: PropertyCategory;
  status: PropertyStatus;
  price: number;
  address: string;
  width: number | null;
  length: number | null;
  floors: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  images: string[];
  legalDocument: LegalDocument | null;
  direction: HouseDirection | null;
  recognizedArea: number | null;
  floorArea: number | null;
  legalVerified: boolean;
  completionVerified: boolean;
  bankSupport: boolean;
  isFeatured: boolean;
  contact: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyInput {
  title: string;
  description?: string;
  category: PropertyCategory;
  status?: PropertyStatus;
  price: number;
  address: string;
  width: number;
  length: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  images?: string[];
  legalDocument?: LegalDocument;
  direction?: HouseDirection;
  recognizedArea?: number;
  floorArea?: number;
  legalVerified?: boolean;
  completionVerified?: boolean;
  bankSupport?: boolean;
  isFeatured?: boolean;
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
