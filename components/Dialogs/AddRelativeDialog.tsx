import { useState } from 'react';
import { Person, RelationType } from '@/types/family';
import { useFamilyStore } from '@/lib/store/familyStore';
import { HebrewDatePicker } from './HebrewDatePicker';

interface AddRelativeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  relatedToId: string;
  relationType: RelationType;
}

export const AddRelativeDialog = ({ isOpen, onClose, relatedToId, relationType }: AddRelativeDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDateHebrew: '',
    birthDateGregorian: '',
    email: '',
    phone: '',
    marriageStatus: 'single' as const
  });

  const addPersonWithRelations = useFamilyStore(state => state.addPersonWithRelations);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPersonWithRelations(formData, relatedToId, relationType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">הוספת {getRelativeTypeLabel(relationType)}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* שם מלא */}
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

          {/* תאריך לידה */}
          <div>
            <label className="block text-sm font-medium mb-1">תאריך לידה</label>
            <HebrewDatePicker
              value={formData.birthDateHebrew}
              onChange={(hebrew, gregorian) => 
                setFormData(prev => ({
                  ...prev,
                  birthDateHebrew: hebrew,
                  birthDateGregorian: gregorian
                }))
              }
            />
          </div>

          {/* יתר השדות... */}

          <div className="flex gap-2 justify-end mt-6">
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
              הוסף
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function getRelativeTypeLabel(type: RelationType): string {
  const labels: Record<RelationType, string> = {
    parent: 'הורה',
    child: 'ילד/ה',
    spouse: 'בן/בת זוג',
    sibling: 'אח/ות',
    'ex-spouse': 'בן/בת זוג לשעבר',
    // ...יתר הטיפוסים
  };
  return labels[type] || type;
}
