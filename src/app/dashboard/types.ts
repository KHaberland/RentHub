export type PropertyType = "APARTMENT" | "HOUSE" | "ROOM" | "STUDIO" | "COMMERCIAL";

export type RentItem = {
  id: string;
  userId: string;
  title: string;
  content: string;
  price: number;
  propertyType: PropertyType;
  area: number;
  rooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  city: string;
  district: string | null;
  address: string;
  images: string[];
  contactPhone: string | null;
  contactEmail: string | null;
  showContacts: boolean;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  likedByMe: boolean;
};

export type SortOption = "recent" | "popular";
