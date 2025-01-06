import { Person } from '@/types/family';
import { useState } from 'react';

interface PersonCardProps {
  person: Person;
  onEdit?: () => void;
  onAddRelative?: () => void;
}

export const PersonCard = ({ person, onEdit, onAddRelative }: PersonCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{person.fullName}</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p>תאריך לידה: {person.birthDateHebrew}</p>
          {person.email && <p>אימייל: {person.email}</p>}
          {person.phone && <p>טלפון: {person.phone}</p>}
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={onEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              עריכה
            </button>
            <button 
              onClick={onAddRelative}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              הוסף קרוב משפחה
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
