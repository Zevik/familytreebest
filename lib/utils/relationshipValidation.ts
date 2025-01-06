import { Person, RelationType } from '@/types/family';

export function validateNewRelationship(
  person: Person,
  relatedPerson: Person,
  relationType: RelationType,
  allPeople: Person[]
): string | null {
  // לא ניתן להוסיף קשר לאותו אדם
  if (person.id === relatedPerson.id) {
    return 'לא ניתן להוסיף קשר לאותו אדם';
  }

  // בדיקת קשר כפול
  if (person.relationships.some(r => 
    r.relatedPersonId === relatedPerson.id && r.type === relationType
  )) {
    return 'קשר זה כבר קיים';
  }

  // בדיקות ספציפיות לפי סוג הקשר
  switch (relationType) {
    case 'spouse':
      if (person.relationships.some(r => r.type === 'spouse')) {
        return 'כבר קיים בן/בת זוג';
      }
      break;

    case 'parent':
      const existingParents = person.relationships.filter(r => r.type === 'parent');
      if (existingParents.length >= 2) {
        return 'כבר קיימים שני הורים';
      }
      break;

    case 'child':
      if (isAncestor(relatedPerson, person, allPeople)) {
        return 'לא ניתן להוסיף הורה כילד';
      }
      break;
  }

  return null;
}

function isAncestor(
  potentialAncestor: Person,
  person: Person,
  allPeople: Person[],
  visited = new Set<string>()
): boolean {
  if (visited.has(person.id)) return false;
  visited.add(person.id);

  const parents = person.relationships
    .filter(r => r.type === 'parent')
    .map(r => allPeople.find(p => p.id === r.relatedPersonId))
    .filter((p): p is Person => p !== undefined);

  return parents.some(parent => 
    parent.id === potentialAncestor.id || 
    isAncestor(potentialAncestor, parent, allPeople, visited)
  );
}
