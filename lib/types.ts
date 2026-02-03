
export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface MovieCredits {
  cast: Member[];
  crew: Member[];
}

export interface Member {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'person' | 'tv';
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
}