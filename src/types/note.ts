export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  tags: string[];
  isPinned: boolean;
}

export enum NoteFilter {
  ALL = "all",
  RECENT = "recent",
  FAVORITES = "favorites",
}

export const NoteFilters = {
  ALL: NoteFilter.ALL,
  RECENT: NoteFilter.RECENT,
  FAVORITES: NoteFilter.FAVORITES,
};
