"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as api from "@/lib/api";
import type { MovieDetail, Prize } from "@/types/movie";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

export default function PeliculaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMovie(id).then(setMovie).catch((e) => setError(e.message));
    // /movies/{id} no incluye los premios; se buscan en /prizes
    api.getPrizes().then((all) => setPrizes(all.filter((p) => p.movies.some((m) => m.id === id))));
  }, [id]);

  if (error) return <div className="p-6 text-red-700">{error}</div>;
  if (!movie) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Link href="/peliculas" className="text-blue-600 underline">← Volver a películas</Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={movie.poster} alt={movie.title} className="w-full md:w-64 h-80 object-cover rounded bg-gray-200" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Fecha de lanzamiento">
              {new Date(movie.releaseDate).toLocaleDateString("es-CO", { timeZone: "UTC" })}
            </Field>
            <Field label="Duración">{movie.duration} min</Field>
            <Field label="País">{movie.country}</Field>
            <Field label="Popularidad">{movie.popularity} / 5</Field>
            <Field label="Género">{movie.genre?.type ?? "—"}</Field>
            <Field label="Director">{movie.director?.name ?? "—"}</Field>
            {movie.youtubeTrailer && (
              <Field label="Tráiler">
                <a href={movie.youtubeTrailer.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {movie.youtubeTrailer.name}
                </a>{" "}
                <span className="text-sm text-gray-500">({movie.youtubeTrailer.channel}, {movie.youtubeTrailer.duration} min)</span>
              </Field>
            )}
          </dl>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-3">Actores</h2>
        {movie.actors.length === 0 ? (
          <p className="text-gray-500">Sin actores.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {movie.actors.map((a) => (
              <li key={a.id} className="border rounded p-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.photo} alt={a.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm text-gray-600">{a.nationality}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Premios</h2>
        {prizes.length === 0 ? (
          <p className="text-gray-500">Sin premios.</p>
        ) : (
          <ul className="space-y-1">
            {prizes.map((p) => (
              <li key={p.id}>
                <span className="font-semibold">{p.name}</span> · {p.category} · {p.year} ·{" "}
                {p.status === "won" ? "Ganado" : "Nominado"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Plataformas</h2>
        {movie.platforms.length === 0 ? (
          <p className="text-gray-500">Sin plataformas.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {movie.platforms.map((p) => (
              <li key={p.id} className="bg-gray-100 rounded px-3 py-1">{p.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Reseñas</h2>
        {movie.reviews.length === 0 ? (
          <p className="text-gray-500">Sin reseñas.</p>
        ) : (
          <ul className="space-y-3">
            {movie.reviews.map((r) => (
              <li key={r.id} className="border rounded p-3">
                <p className="text-sm text-gray-600">{r.creator} · {r.score}/5</p>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
