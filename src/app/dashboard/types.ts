export type RentItem = {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  likedByMe: boolean;
};

export type SortOption = "recent" | "popular";
