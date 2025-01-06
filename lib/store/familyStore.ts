import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Person, Relationship } from '@/types/family';
import { calculateNewRelationships, getReciprocalRelationType } from '@/lib/utils/familyRelationships';

interface FamilyState {
  people: Person[];
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addRelationship: (personId: string, relationship: Relationship) => void;
  calculateRelationships: (personId: string) => void;
  addPersonWithRelations: (
    person: Omit<Person, 'id'>, 
    relatedToId: string, 
    relationType: RelationType
  ) => void;
  syncToStorage: () => void;
  loadFromStorage: () => void;
}

// עדכון הנתונים ההתחלתיים של זאב אבינר
const initialPerson: Person = {
  id: 'zeev-aviner',
  fullName: 'זאב אבינר',
  birthDateHebrew: 'כ"ח באייר תש"ם',
  birthDateGregorian: '1980-05-14',
  email: 'zeev@example.com',
  phone: '050-1234567',
  marriageStatus: 'married',
  relationships: []
};

export const useFamilyStore = create(
  persist<FamilyState>(
    (set, get) => ({
      people: [initialPerson],
      
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
    
      calculateRelationships: (personId: string) => {
        const state = get();
        const person = state.people.find(p => p.id === personId);
        if (!person) return;
    
        // עדכון קשרים אוטומטיים
        state.people.forEach(otherPerson => {
          if (otherPerson.id === personId) return;
          
          // חישוב קשרים עקיפים
          const indirectRelations = calculateIndirectRelations(
            person,
            otherPerson,
            state.people
          );
    
          if (indirectRelations.length > 0) {
            set(state => ({
              people: state.people.map(p => 
                p.id === otherPerson.id 
                  ? { ...p, relationships: [...p.relationships, ...indirectRelations] }
                  : p
              )
            }));
          }
        });
      },
    
      addPersonWithRelations: (personData, relatedToId, relationType) => {
        const newId = crypto.randomUUID();
        const state = get();
        const relatedPerson = state.people.find(p => p.id === relatedToId);
        
        if (!relatedPerson) return;

        const newPerson: Person = {
          ...personData,
          id: newId,
          relationships: [{
            relatedPersonId: relatedToId,
            type: relationType
          }]
        };

        // חישוב כל הקשרים החדשים
        const newRelationships = calculateNewRelationships(
          newPerson,
          relatedPerson,
          state.people,
          relationType
        );

        // הוספת כל הקשרים החדשים
        newPerson.relationships = [...newPerson.relationships, ...newRelationships];

        // עדכון הקשרים ההדדיים
        const updatedPeople = state.people.map(person => {
          const reciprocalRelations = newRelationships
            .filter(rel => rel.relatedPersonId === person.id)
            .map(rel => ({
              relatedPersonId: newId,
              type: getReciprocalRelationType(rel.type) || rel.type
            }));

          if (reciprocalRelations.length > 0) {
            return {
              ...person,
              relationships: [...person.relationships, ...reciprocalRelations]
            };
          }
          return person;
        });

        set({
          people: [...updatedPeople, newPerson]
        });
      },

      // הוספת פונקציונליות סנכרון
      syncToStorage: () => {
        const state = get();
        localStorage.setItem('familyTree', JSON.stringify(state.people));
      },

      loadFromStorage: () => {
        const stored = localStorage.getItem('familyTree');
        if (stored) {
          set({ people: JSON.parse(stored) });
        }
      }
    }),
    {
      name: 'family-tree-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
