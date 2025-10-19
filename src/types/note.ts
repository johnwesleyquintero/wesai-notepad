export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

export type NoteFilter = 'all' | 'recent' | 'favorites';
