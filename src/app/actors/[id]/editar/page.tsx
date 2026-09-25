"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ActorForm } from "@/components/ActorForm";
import { useActors } from "@/context/ActorsContext";
import * as api from "@/lib/api";
import type { Actor } from "@/types/actor";

export default function EditarPage() {
  const { id } = useParams();
  const { editActor } = useActors();
  const [actor, setActor] = useState<Actor | null>(null);

  useEffect(() => {
    if (id) api.getActor(id as string).then(setActor);
  }, [id]);

  if (!actor) return <div className="p-6">Cargando...</div>;
  return <ActorForm actor={actor} onSave={(data) => editActor(id as string, data)} title="Editar Actor" />;
}
