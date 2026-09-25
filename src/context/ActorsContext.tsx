"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Actor, ActorInput } from "@/types/actor";
import * as api from "@/lib/api";

interface ActorsContextValue {
  actors: Actor[];
  addActor: (actor: ActorInput) => Promise<Actor>;
  editActor: (id: string, actor: ActorInput) => Promise<void>;
  removeActor: (id: string) => Promise<void>;
}

const ActorsContext = createContext<ActorsContextValue | null>(null);

// Vive en el layout, así que la lista se conserva al navegar entre páginas
export function ActorsProvider({ children }: { children: React.ReactNode }) {
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    api.getActors().then(setActors);
  }, []);

  const addActor = async (actor: ActorInput) => {
    const created = await api.createActor(actor);
    setActors((prev) => [...prev, created]);
    return created;
  };

  const editActor = async (id: string, actor: ActorInput) => {
    const updated = await api.updateActor(id, actor);
    setActors(actors.map((a) => (a.id === id ? updated : a)));
  };

  const removeActor = async (id: string) => {
    await api.deleteActor(id);
    setActors(actors.filter((a) => a.id !== id));
  };

  return (
    <ActorsContext.Provider value={{ actors, addActor, editActor, removeActor }}>
      {children}
    </ActorsContext.Provider>
  );
}

export function useActors() {
  return useContext(ActorsContext)!;
}
