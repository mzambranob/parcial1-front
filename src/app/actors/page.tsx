"use client";

import Link from "next/link";
import { useActors } from "@/context/ActorsContext";

export default function ActorsPage() {
  const { actors, removeActor } = useActors();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name}?`)) return;
    try {
      await removeActor(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Actores</h1>
        <Link href="/crear" className="bg-green-600 text-white px-4 py-2 rounded">
          + Crear Actor
        </Link>
      </div>

      {actors.length === 0 ? (
        <p className="text-gray-500">No hay actores. <Link href="/crear" className="text-blue-600 underline">Crear uno.</Link></p>
      ) : (
        <div className="grid gap-4">
          {actors.map((actor) => (
            <div key={actor.id} className="border rounded p-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{actor.name}</h2>
                <p className="text-sm text-gray-600">{actor.nationality} · {new Date(actor.birthDate).toLocaleDateString("es-CO")}</p>
                <p className="text-sm mt-2">{actor.biography}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/actors/${actor.id}/editar`}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(actor.id, actor.name)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
