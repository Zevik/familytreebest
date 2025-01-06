'use client';

import { useState } from 'react';
import { Person } from '@/types/family';
import { useFamilyStore } from '@/lib/store/familyStore';
import { HebrewDatePicker } from './HebrewDatePicker';

interface EditPersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person;
}

export const EditPersonDialog = ({ isOpen, onClose, person }: EditPersonDialogProps) => {
  const [formData, setFormData] = useState({
    ...person,
    deathDateHebrew: person.deathDateHebrew || '',
    deathDateGregorian: person.deathDateGregorian || ''
  });

  const updatePerson = useFamilyStore(state => state.updatePerson);
  const addRelationship = useFamilyStore(state => state.addRelationship);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // אם שינוי סטטוס נישואין מ-'married' ל-'divorced'
    if (person.marriageStatus === 'married' && formData.marriageStatus === 'divorced') {
      const spouse = person.relationships.find(r => r.type === 'spouse');
      if (spouse) {
        // עדכון הקשר להיות ex-spouse
        addRelationship(person.id, {
          relatedPersonId: spouse.relatedPersonId,
          type: 'ex-spouse'
        });
      }
    }

    await updatePerson(person.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">עריכת פרטי אדם</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* שדות בסיסיים */}
          <div>
            <label className="block text-sm font-medium mb-1">שם מלא</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* סטטוס נישואין */}
          <div>
            <label className="block text-sm font-medium mb-1">סטטוס נישואין</label>
            <select
              value={formData.marriageStatus}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                marriageStatus: e.target.value as Person['marriageStatus']
              }))}
              className="w-full p-2 border rounded"
            >
              <option value="single">רווק/ה</option>
              <option value="married">נשוי/אה</option>
              <option value="divorced">גרוש/ה</option>
            </select>
          </div>

          {/* תאריך פטירה (אופציונלי) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              תאריך פטירה
              <span className="text-gray-500 text-sm"> (אופציונלי)</span>
            </label>
            <HebrewDatePicker
              value={formData.deathDateHebrew}
              onChange={(hebrew, gregorian) => 
                setFormData(prev => ({
                  ...prev,
                  deathDateHebrew: hebrew,
                  deathDateGregorian: gregorian
                }))
              }
            />
          </div>

          {/* כפתורים */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              שמור שינויים
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
