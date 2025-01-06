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

function addChildRelationships(
  newPerson: Person,
  parent: Person,
  allPeople: Person[],
  relationships: Relationship[]
) {
  // קשר עם ההורה השני (אם קיים)
  const otherParent = findOtherParent(parent, allPeople);
  if (otherParent) {
    relationships.push({
      relatedPersonId: otherParent.id,
      type: 'parent'
    });
  }

  // קשר עם האחים
  const siblings = findSiblings(parent, allPeople);
  siblings.forEach(sibling => {
    relationships.push({
      relatedPersonId: sibling.id,
      type: 'sibling'
    });
  });

  // קשר עם הסבים
  const grandparents = findGrandparents(newPerson, parent, allPeople);
  grandparents.forEach(gp => {
    relationships.push({
      relatedPersonId: gp.id,
      type: 'grandparent'
    });
  });
}

function addParentRelationships(
  newPerson: Person,
  child: Person,
  allPeople: Person[],
  relationships: Relationship[]
) {
  // קשר עם בן/בת הזוג (אם יש)
  const spouse = findSpouse(newPerson, allPeople);
  if (spouse) {
    child.relationships.push({
      relatedPersonId: spouse.id,
      type: 'parent'
    });
  }

  // קשר עם הנכדים (ילדי הילד)
  const grandchildren = findChildren(child, allPeople);
  grandchildren.forEach(gc => {
    relationships.push({
      relatedPersonId: gc.id,
      type: 'grandchild'
    });
  });
}

function addSiblingRelationships(
  newPerson: Person,
  sibling: Person,
  allPeople: Person[],
  relationships: Relationship[]
) {
  // קשר עם ההורים המשותפים
  const parents = findParents(sibling, allPeople);
  parents.forEach(parent => {
    relationships.push({
      relatedPersonId: parent.id,
      type: 'parent'
    });
  });

  // קשר עם האחיינים (ילדי האח)
  const nephewsNieces = findChildren(sibling, allPeople);
  nephewsNieces.forEach(nn => {
    relationships.push({
      relatedPersonId: nn.id,
      type: 'nephew-niece'
    });
  });
}

function findOtherParent(person: Person, allPeople: Person[]): Person | null {
  const spouses = allPeople.filter(p => 
    person.relationships.some(r => 
      r.relatedPersonId === p.id && 
      (r.type === 'spouse' || r.type === 'ex-spouse')
    )
  );
  return spouses[0] || null;
}

function findGrandparents(person: Person, parent: Person, allPeople: Person[]): Person[] {
  return findParents(parent, allPeople);
}

function findSiblings(person: Person, allPeople: Person[]): Person[] {
  const parents = findParents(person, allPeople);
  if (parents.length === 0) return [];

  return allPeople.filter(p => 
    p.id !== person.id &&
    parents.some(parent =>
      p.relationships.some(r =>
        r.relatedPersonId === parent.id && r.type === 'parent'
      )
    )
  );
}

function findSpouse(person: Person, allPeople: Person[]): Person | null {
  return allPeople.find(p =>
    person.relationships.some(r =>
      r.relatedPersonId === p.id && r.type === 'spouse'
    )
  ) || null;
}

// ...המשך פונקציות עזר נוספות
