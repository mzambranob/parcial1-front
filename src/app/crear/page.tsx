"use client";

import { ActorForm } from "@/components/ActorForm";
import { useActors } from "@/context/ActorsContext";

export default function CrearPage() {
  const { addActor } = useActors();
  return <ActorForm onSave={addActor} title="Crear Actor" />;
}
