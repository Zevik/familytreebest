import { Person, Relationship, RelationType } from '@/types/family';

export function calculateIndirectRelations(
  person1: Person,
  person2: Person,
  allPeople: Person[]
): Relationship[] {
  const relations: Relationship[] = [];

  // מצא הורים משותפים (אחים)
  const person1Parents = findParents(person1, allPeople);
  const person2Parents = findParents(person2, allPeople);
  
  const commonParents = person1Parents.filter(p1 => 
    person2Parents.some(p2 => p1.id === p2.id)
  );

  if (commonParents.length > 0) {
    relations.push({
      relatedPersonId: person2.id,
      type: 'sibling'
    });
  }

  // חישוב דודים
  const person1Grandparents = person1Parents.flatMap(p => findParents(p, allPeople));
  const person2IsUncle = person1Grandparents.some(gp => 
    findChildren(gp, allPeople).some(child => child.id === person2.id)
  );

  if (person2IsUncle) {
    relations.push({
      relatedPersonId: person2.id,
      type: 'uncle-aunt'
    });
  }

  // המשך חישובים לפי האפיון...

  return relations;
}

// פונקציות עזר
function findParents(person: Person, allPeople: Person[]): Person[] {
  return allPeople.filter(p => 
    person.relationships.some(r => 
      r.relatedPersonId === p.id && r.type === 'parent'
    )
  );
}

function findChildren(person: Person, allPeople: Person[]): Person[] {
  return allPeople.filter(p => 
    person.relationships.some(r => 
      r.relatedPersonId === p.id && r.type === 'child'
    )
  );
}

// הוספת פונקציות חדשות לחישוב קשרים
function calculateFamilyRelations(
  person1: Person,
  person2: Person,
  allPeople: Person[]
): Relationship[] {
  const relations: Relationship[] = [];
  
  // בדיקת קשר הורים
  if (isParentChild(person1, person2)) {
    relations.push({ relatedPersonId: person2.id, type: 'parent' });
  }

  // בדיקת קשר סבים
  if (isGrandparent(person1, person2, allPeople)) {
    relations.push({ relatedPersonId: person2.id, type: 'grandparent' });
  }

  // בדיקת בני דודים
  if (areCousins(person1, person2, allPeople)) {
    relations.push({ relatedPersonId: person2.id, type: 'cousin' });
  }

  // בדיקת דודים
  if (isUncleAunt(person1, person2, allPeople)) {
    relations.push({ relatedPersonId: person2.id, type: 'uncle-aunt' });
  }

  // בדיקת גיסים
  if (isSiblingInLaw(person1, person2, allPeople)) {
    relations.push({ relatedPersonId: person2.id, type: 'sibling-in-law' });
  }

  // בדיקת חמים
  if (isParentInLaw(person1, person2, allPeople)) {
    relations.push({ relatedPersonId: person2.id, type: 'parent-in-law' });
  }

  return relations;
}

// פונקציות עזר חדשות
function isParentChild(person1: Person, person2: Person): boolean {
  return person1.relationships.some(rel => 
    rel.relatedPersonId === person2.id && rel.type === 'parent'
  );
}

function isGrandparent(person1: Person, person2: Person, allPeople: Person[]): boolean {
  const parents = findParents(person1, allPeople);
  return parents.some(parent => isParentChild(parent, person2));
}

function areCousins(person1: Person, person2: Person, allPeople: Person[]): boolean {
  const person1Parents = findParents(person1, allPeople);
  const person2Parents = findParents(person2, allPeople);
  
  return person1Parents.some(parent1 => 
    person2Parents.some(parent2 => 
      areSiblings(parent1, parent2, allPeople)
    )
  );
}

// ...המשך הפונקציות
