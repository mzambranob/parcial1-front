export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
}

// Campos que acepta el backend en POST y PUT
export type ActorInput = Omit<Actor, "id">;
