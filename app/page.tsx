'use client';

import { PersonCard } from '@/components/PersonCard/PersonCard';
import { TreeVisualization } from '@/components/TreeView/TreeVisualization';
import { EditPersonDialog } from '@/components/Dialogs/EditPersonDialog';
import { AddRelativeDialog } from '@/components/Dialogs/AddRelativeDialog'; // הוספת import חסר
import { useFamilyStore } from '@/lib/store/familyStore';
import { RelationType, Person } from '@/types/family'; // הוספת Person לimport
import { useState } from 'react';

export default function Home() {
  const people = useFamilyStore(state => state.people);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [treeLayout, setTreeLayout] = useState<'vertical' | 'horizontal' | 'network'>('vertical');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRelative, setIsAddingRelative] = useState(false);
  const [addRelativeData, setAddRelativeData] = useState<{
    personId: string;
    type: RelationType;
  } | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleAddRelative = (personId: string, type: RelationType) => {
    setAddRelativeData({ personId, type });
    setIsAddingRelative(true);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">עץ המשפחה שלי</h1>
          
          {/* Search and Layout Controls */}
          <div className="flex gap-4 justify-center mb-4">
            <input
              type="search"
              placeholder="חיפוש בן משפחה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <select 
              value={treeLayout}
              onChange={(e) => setTreeLayout(e.target.value as any)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="vertical">עץ אנכי</option>
              <option value="horizontal">עץ אופקי</option>
              <option value="network">רשת</option>
            </select>
          </div>
        </header>

        {/* Tree Visualization */}
        <TreeVisualization
          people={people.filter(p => 
            searchQuery ? p.fullName.includes(searchQuery) : true
          )}
          layout={treeLayout}
          onPersonClick={(person) => setSelectedPerson(person.id)}
        />

        {/* Existing PersonCard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {people.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onAddRelative={(type) => handleAddRelative(person.id, type)}
              onEdit={() => setEditingPerson(person)}
            />
          ))}
        </div>
      </div>

      {/* הוספת הדיאלוג */}
      {isAddingRelative && addRelativeData && (
        <AddRelativeDialog
          isOpen={isAddingRelative}
          onClose={() => setIsAddingRelative(false)}
          relatedToId={addRelativeData.personId}
          relationType={addRelativeData.type}
        />
      )}

      {/* Edit Dialog */}
      {editingPerson && (
        <EditPersonDialog
          isOpen={!!editingPerson}
          onClose={() => setEditingPerson(null)}
          person={editingPerson}
        />
      )}
    </main>
  );
}
