import type { Actor, ActorInput } from "@/types/actor";
import type { Director, Genre, Movie, MovieDetail, MovieInput, MovieSummary, Prize, PrizeInput, TrailerInput } from "@/types/movie";

export const API_URL = "http://localhost:3000/api/v1";

const headers = { "Content-Type": "application/json" };

const messageTranslations: Record<string, string> = {
  "photo must be an URL address": "La foto debe ser una URL válida (ej. https://picsum.photos/200)",
  "photo should not be empty": "La foto es obligatoria",
  "poster must be an URL address": "El póster debe ser una URL válida",
  "url must be an URL address": "La URL del tráiler debe ser válida",
};

async function errorFrom(res: Response, fallback: string): Promise<Error> {
  try {
    const body = await res.json();
    const messages: string[] = Array.isArray(body.message) ? body.message : [body.message];
    const text = messages.filter(Boolean).map((m) => messageTranslations[m] ?? m).join(". ");
    return new Error(text ? `${fallback}: ${text}` : fallback);
  } catch {
    return new Error(fallback);
  }
}

export async function getActors(): Promise<Actor[]> {
  const res = await fetch(`${API_URL}/actors`);
  return res.json();
}

export async function getActor(id: string): Promise<Actor> {
  const res = await fetch(`${API_URL}/actors/${id}`);
  return res.json();
}

export async function createActor(actor: ActorInput): Promise<Actor> {
  const res = await fetch(`${API_URL}/actors`, {
    method: "POST",
    headers,
    body: JSON.stringify(actor),
  });
  if (!res.ok) throw await errorFrom(res, "No se pudo crear el actor");
  return res.json();
}

export async function updateActor(id: string, actor: ActorInput): Promise<Actor> {
  const res = await fetch(`${API_URL}/actors/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(actor),
  });
  if (!res.ok) throw await errorFrom(res, "No se pudo actualizar el actor");
  return res.json();
}

// DELETE responde 204 sin cuerpo, por eso no se hace res.json()
export async function deleteActor(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/actors/${id}`, { method: "DELETE" });
  if (!res.ok) throw await errorFrom(res, "No se pudo eliminar el actor");
}

async function post<T>(path: string, fallback: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw await errorFrom(res, fallback);
  return res.json();
}

export async function getMovies(): Promise<MovieSummary[]> {
  const res = await fetch(`${API_URL}/movies`);
  return res.json();
}

export async function getMovie(id: string): Promise<MovieDetail> {
  const res = await fetch(`${API_URL}/movies/${id}`);
  if (!res.ok) throw await errorFrom(res, "No se pudo cargar la película");
  return res.json();
}

export async function getPrizes(): Promise<Prize[]> {
  const res = await fetch(`${API_URL}/prizes`);
  return res.json();
}

export async function getGenres(): Promise<Genre[]> {
  const res = await fetch(`${API_URL}/genres`);
  return res.json();
}

export async function getDirectors(): Promise<Director[]> {
  const res = await fetch(`${API_URL}/directors`);
  return res.json();
}

export const createTrailer = (trailer: TrailerInput) =>
  post<{ id: string }>("/youtube-trailers", "No se pudo crear el tráiler", trailer);

export const createMovie = (movie: MovieInput) =>
  post<Movie>("/movies", "No se pudo crear la película", movie);

export const createPrize = (prize: PrizeInput) =>
  post<{ id: string }>("/prizes", "No se pudo crear el premio", prize);

export const addMovieToActor = (actorId: string, movieId: string) =>
  post(`/actors/${actorId}/movies/${movieId}`, "No se pudo asignar la película al actor");

export const addPrizeToMovie = (movieId: string, prizeId: string) =>
  post(`/movies/${movieId}/prizes/${prizeId}`, "No se pudo asignar el premio a la película");
