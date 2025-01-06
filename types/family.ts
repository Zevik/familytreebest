export interface Person {
  id: string;
  fullName: string;
  birthDateHebrew: string;
  birthDateGregorian: string;
  deathDateHebrew?: string;
  deathDateGregorian?: string;
  email?: string;
  phone?: string;
  marriageStatus: 'single' | 'married' | 'divorced';
  relationships: Relationship[];
}

export interface Relationship {
  relatedPersonId: string;
  type: RelationType;
}

export type RelationType = 
  | 'parent'
  | 'child'
  | 'spouse'
  | 'sibling'
  | 'ex-spouse';

export interface FamilyNode {
  person: Person;
  children: FamilyNode[];
  spouses: FamilyNode[];
  parents: FamilyNode[];
  siblings: FamilyNode[];
}
