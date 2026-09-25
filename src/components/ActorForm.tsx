"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Actor, ActorInput } from "@/types/actor";

interface ActorFormProps {
  actor?: Actor;
  onSave: (data: ActorInput) => Promise<unknown>;
  title: string;
}

export function ActorForm({ actor, onSave, title }: ActorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ActorInput>({
    name: actor?.name ?? "",
    photo: actor?.photo ?? "",
    nationality: actor?.nationality ?? "",
    birthDate: actor?.birthDate ? actor.birthDate.split("T")[0] : "",
    biography: actor?.biography ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      router.push("/actors");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="url"
          name="photo"
          placeholder="URL de foto"
          value={form.photo}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="nationality"
          placeholder="Nacionalidad"
          value={form.nationality}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="biography"
          placeholder="Biografía"
          value={form.biography}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/actors")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
