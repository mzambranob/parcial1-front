export interface Genre {
  id: string;
  type: string;
}

export interface Director {
  id: string;
  name: string;
}

export interface MovieInput {
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  genre: { id: string };
  director: { id: string };
  youtubeTrailer: { id: string };
}

export interface Movie extends Omit<MovieInput, "genre" | "director" | "youtubeTrailer"> {
  id: string;
}

export interface MovieSummary extends Movie {
  actors: { id: string; name: string }[];
}

export interface MovieDetail extends Movie {
  genre: Genre;
  director: Director;
  youtubeTrailer: TrailerInput & { id: string };
  actors: { id: string; name: string; photo: string; nationality: string }[];
  platforms: { id: string; name: string; url: string }[];
  reviews: { id: string; text: string; score: number; creator: string }[];
}

export interface Prize {
  id: string;
  name: string;
  category: string;
  year: number;
  status: "won" | "nominated";
  movies: { id: string }[];
}

export interface TrailerInput {
  name: string;
  url: string;
  duration: number;
  channel: string;
}

export interface PrizeInput {
  name: string;
  category: string;
  year: number;
  status: "won" | "nominated";
}
