export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  categories?: string[];
}

export const NoteFilters = {
  ALL: "all",
  RECENT: "recent",
  FAVORITES: "favorites",
} as const;

export type NoteFilter = (typeof NoteFilters)[keyof typeof NoteFilters];
