"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as api from "@/lib/api";
import { useActors } from "@/context/ActorsContext";
import type { Director, Genre, PrizeInput } from "@/types/movie";

const emptyMovie = {
  title: "",
  poster: "",
  duration: "",
  country: "",
  releaseDate: "",
  popularity: "",
  genreId: "",
  directorId: "",
};
const emptyTrailer = { name: "", url: "", duration: "", channel: "" };
const emptyPrize = { name: "", category: "", year: "", status: "won" as PrizeInput["status"] };

const inputClass = "w-full border rounded px-3 py-2";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

function bind<T>(setter: Setter<T>) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border rounded p-4 space-y-3">
      <legend className="px-2 font-semibold text-lg">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function CrearPeliculaPage() {
  const { actors } = useActors();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [movie, setMovie] = useState(emptyMovie);
  const [trailer, setTrailer] = useState(emptyTrailer);
  const [actorId, setActorId] = useState("");
  const [prize, setPrize] = useState(emptyPrize);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getGenres().then(setGenres);
    api.getDirectors().then(setDirectors);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setCreated("");
    try {
      setStatus("Creando tráiler...");
      const newTrailer = await api.createTrailer({ ...trailer, duration: Number(trailer.duration) });

      setStatus("Creando película...");
      const newMovie = await api.createMovie({
        title: movie.title,
        poster: movie.poster,
        duration: Number(movie.duration),
        country: movie.country,
        releaseDate: movie.releaseDate,
        popularity: Number(movie.popularity),
        genre: { id: movie.genreId },
        director: { id: movie.directorId },
        youtubeTrailer: { id: newTrailer.id },
      });

      setStatus("Asignando película al actor...");
      await api.addMovieToActor(actorId, newMovie.id);

      setStatus("Creando premio...");
      const newPrize = await api.createPrize({ ...prize, year: Number(prize.year) });

      setStatus("Asignando premio a la película...");
      await api.addPrizeToMovie(newMovie.id, newPrize.id);

      setCreated(newMovie.title);
      setMovie(emptyMovie);
      setTrailer(emptyTrailer);
      setActorId("");
      setPrize(emptyPrize);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setStatus("");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Película</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {created && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          Se creó &quot;{created}&quot; con su actor principal y su premio.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Película">
          <input name="title" placeholder="Título" value={movie.title} onChange={bind(setMovie)} required className={inputClass} />
          <input type="url" name="poster" placeholder="URL del póster (ej. https://picsum.photos/300)" value={movie.poster} onChange={bind(setMovie)} required className={inputClass} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="number" min={1} name="duration" placeholder="Duración (minutos)" value={movie.duration} onChange={bind(setMovie)} required className={inputClass} />
            <input name="country" placeholder="País" value={movie.country} onChange={bind(setMovie)} required className={inputClass} />
            <label className="text-sm text-gray-600">
              Fecha de lanzamiento
              <input type="date" name="releaseDate" value={movie.releaseDate} onChange={bind(setMovie)} required className={inputClass} />
            </label>
            <label className="text-sm text-gray-600">
              Popularidad (1-5)
              <input type="number" min={1} max={5} name="popularity" value={movie.popularity} onChange={bind(setMovie)} required className={inputClass} />
            </label>
            <select name="genreId" value={movie.genreId} onChange={bind(setMovie)} required className={inputClass}>
              <option value="">Género...</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.type}</option>)}
            </select>
            <select name="directorId" value={movie.directorId} onChange={bind(setMovie)} required className={inputClass}>
              <option value="">Director...</option>
              {directors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </Section>

        <Section title="Tráiler de YouTube">
          <input name="name" placeholder="Nombre del tráiler" value={trailer.name} onChange={bind(setTrailer)} required className={inputClass} />
          <input type="url" name="url" placeholder="URL (ej. https://www.youtube.com/watch?v=...)" value={trailer.url} onChange={bind(setTrailer)} required className={inputClass} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="number" min={1} name="duration" placeholder="Duración (minutos)" value={trailer.duration} onChange={bind(setTrailer)} required className={inputClass} />
            <input name="channel" placeholder="Canal" value={trailer.channel} onChange={bind(setTrailer)} required className={inputClass} />
          </div>
        </Section>

        <Section title="Actor principal">
          <select value={actorId} onChange={(e) => setActorId(e.target.value)} required className={inputClass}>
            <option value="">Selecciona un actor...</option>
            {[...actors].sort((a, b) => a.name.localeCompare(b.name)).map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.nationality})</option>
            ))}
          </select>
          <p className="text-sm text-gray-600">
            ¿No está en la lista? <Link href="/crear" className="text-blue-600 underline">Crea el actor primero</Link>.
          </p>
        </Section>

        <Section title="Premio">
          <input name="name" placeholder="Nombre del premio (ej. Oscar)" value={prize.name} onChange={bind(setPrize)} required className={inputClass} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input name="category" placeholder="Categoría" value={prize.category} onChange={bind(setPrize)} required className={inputClass} />
            <input type="number" name="year" placeholder="Año" value={prize.year} onChange={bind(setPrize)} required className={inputClass} />
            <select name="status" value={prize.status} onChange={bind(setPrize)} className={inputClass}>
              <option value="won">Ganado</option>
              <option value="nominated">Nominado</option>
            </select>
          </div>
        </Section>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {saving ? "Guardando..." : "Crear película"}
          </button>
          <Link href="/actors" className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</Link>
          {status && <span className="text-sm text-gray-600">{status}</span>}
        </div>
      </form>
    </div>
  );
}
