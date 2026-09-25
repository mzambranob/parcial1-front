"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as api from "@/lib/api";
import type { MovieSummary } from "@/types/movie";

interface MovieRow extends MovieSummary {
  prizeName?: string;
}

export default function PeliculasPage() {
  const [movies, setMovies] = useState<MovieRow[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // /movies no incluye los premios; se obtienen de /prizes, que sí lista sus películas
    Promise.all([api.getMovies(), api.getPrizes()])
      .then(([movies, prizes]) => {
        const prizeByMovie = new Map<string, string>();
        for (const prize of prizes) {
          for (const m of prize.movies) {
            if (!prizeByMovie.has(m.id)) prizeByMovie.set(m.id, prize.name);
          }
        }
        setMovies(movies.map((m) => ({ ...m, prizeName: prizeByMovie.get(m.id) })));
      })
      .catch(() => setError("No se pudieron cargar las películas"));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Películas</h1>
        <Link href="/peliculas/crear" className="bg-green-600 text-white px-4 py-2 rounded">
          + Crear Película
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {movies === null && !error ? (
        <p className="text-gray-500">Cargando películas...</p>
      ) : movies?.length === 0 ? (
        <p className="text-gray-500">No hay películas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies?.map((movie) => (
            <Link
              key={movie.id}
              href={`/peliculas/${movie.id}`}
              className="border rounded overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover bg-gray-200" />
              <div className="p-4 space-y-1">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-sm text-gray-600">
                  Lanzamiento: {new Date(movie.releaseDate).toLocaleDateString("es-CO", { timeZone: "UTC" })}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Actor:</span>{" "}
                  {movie.actors[0]?.name ?? <span className="text-gray-400">Sin actor</span>}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Premio:</span>{" "}
                  {movie.prizeName ?? <span className="text-gray-400">Sin premio</span>}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
