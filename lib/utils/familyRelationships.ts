import { Person, Relationship, RelationType } from '@/types/family';

export function getReciprocalRelationType(type: RelationType): RelationType | null {
  const reciprocalMap: Record<RelationType, RelationType> = {
    'parent': 'child',
    'child': 'parent',
    'spouse': 'spouse',
    'sibling': 'sibling',
    'uncle-aunt': 'nephew-niece',
    'nephew-niece': 'uncle-aunt',
    'cousin': 'cousin',
    'grandparent': 'grandchild',
    'grandchild': 'grandparent',
    'parent-in-law': 'child-in-law',
    'child-in-law': 'parent-in-law',
    'sibling-in-law': 'sibling-in-law',
    'step-parent': 'step-child',
    'step-child': 'step-parent',
    'step-sibling': 'step-sibling',
    'ex-spouse': 'ex-spouse'
  };

  return reciprocalMap[type] || null;
}

export function calculateNewRelationships(
  newPerson: Person,
  existingPerson: Person,
  allPeople: Person[],
  relationType: RelationType
): Relationship[] {
  const relationships: Relationship[] = [];

  switch (relationType) {
    case 'spouse':
      // הוסף קשרים עם המשפחה של בן/בת הזוג
      addSpouseRelationships(newPerson, existingPerson, allPeople, relationships);
      break;
    
    case 'child':
      // הוסף קשרים עם האחים ובני הדודים
      addChildRelationships(newPerson, existingPerson, allPeople, relationships);
      break;
    
    case 'parent':
      // הוסף קשרים עם הדודים והסבים
      addParentRelationships(newPerson, existingPerson, allPeople, relationships);
      break;
    
    case 'sibling':
      // הוסף קשרים עם ההורים והאחים האחרים
      addSiblingRelationships(newPerson, existingPerson, allPeople, relationships);
      break;
  }

  return relationships;
}

function addSpouseRelationships(
  newPerson: Person,
  spouse: Person,
  allPeople: Person[],
  relationships: Relationship[]
) {
  // הוסף קשר עם ההורים של בן/בת הזוג
  const spouseParents = findRelatives(spouse, allPeople, 'parent');
  spouseParents.forEach(parent => {
    relationships.push({
      relatedPersonId: parent.id,
      type: 'parent-in-law'
    });
  });

  // הוסף קשר עם האחים של בן/בת הזוג
  const spouseSiblings = findRelatives(spouse, allPeople, 'sibling');
  spouseSiblings.forEach(sibling => {
    relationships.push({
      relatedPersonId: sibling.id,
      type: 'sibling-in-law'
    });
  });
}

// ...המשך פונקציות עזר נוספות
