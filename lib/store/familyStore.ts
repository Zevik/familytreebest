import { create } from 'zustand';
import { Person, Relationship } from '@/types/family';

interface FamilyState {
  people: Person[];
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addRelationship: (personId: string, relationship: Relationship) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  people: [],
  
  addPerson: (personData) => set((state) => ({
    people: [...state.people, { ...personData, id: crypto.randomUUID() }]
  })),

  updatePerson: (id, updates) => set((state) => ({
    people: state.people.map(person => 
      person.id === id ? { ...person, ...updates } : person
    )
  })),

  addRelationship: (personId, relationship) => set((state) => ({
    people: state.people.map(person => 
      person.id === personId 
        ? { ...person, relationships: [...person.relationships, relationship] }
        : person
    )
  })),
}));
