import { useState } from 'react';
import { Person, RelationType } from '@/types/family';
import { useFamilyStore } from '@/lib/store/familyStore';

interface AddPersonFormProps {
  relatedToId: string;
  relationType: RelationType;
  onComplete: () => void;
}

export const AddPersonForm = ({ relatedToId, relationType, onComplete }: AddPersonFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDateHebrew: '',
    birthDateGregorian: '',
    email: '',
    phone: '',
    marriageStatus: 'single' as const
  });

  const addPerson = useFamilyStore(state => state.addPerson);
  const addRelationship = useFamilyStore(state => state.addRelationship);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPerson: Omit<Person, 'id'> = {
      ...formData,
      relationships: [{
        relatedPersonId: relatedToId,
        type: relationType
      }]
    };

    addPerson(newPerson);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">שם מלא</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      {/* Add more form fields here */}
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white rounded-md py-2"
      >
        הוסף לעץ המשפחה
      </button>
    </form>
  );
};
