import { validateNewRelationship } from '@/lib/utils/relationshipValidation';
import { useFamilyStore } from '@/lib/store/familyStore';

export const useRelationships = () => {
  const addPersonWithRelations = useFamilyStore(state => state.addPersonWithRelations);
  const people = useFamilyStore(state => state.people);

  const addNewRelative = async (
    personData: Omit<Person, 'id'>,
    relatedToId: string,
    relationType: RelationType
  ) => {
    const relatedPerson = people.find(p => p.id === relatedToId);
    if (!relatedPerson) {
      throw new Error('לא נמצא האדם המקושר');
    }

    // בדיקת תקינות הקשר
    const validationError = validateNewRelationship(
      { ...personData, id: '', relationships: [] },
      relatedPerson,
      relationType,
      people
    );

    if (validationError) {
      throw new Error(validationError);
    }

    return await addPersonWithRelations(personData, relatedToId, relationType);
  };

  return { addNewRelative };
};
