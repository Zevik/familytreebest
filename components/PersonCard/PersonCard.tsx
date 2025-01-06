'use client';

import { Person, RelationType } from '@/types/family';
import { useState } from 'react';

interface PersonCardProps {
  person: Person;
  onEdit: () => void;
  onAddRelative: (type: RelationType) => void;
}

export const PersonCard = ({ person, onEdit, onAddRelative }: PersonCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{person.fullName}</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddOptions(!showAddOptions)}
            className="text-blue-500 hover:text-blue-700 text-xl font-bold"
          >
            +
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '−' : '⋮'}
          </button>
        </div>
      </div>

      {/* תפריט הוספת בן משפחה */}
      {showAddOptions && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onAddRelative('parent');
                setShowAddOptions(false);
              }}
              className="p-2 text-sm bg-blue-100 hover:bg-blue-200 rounded"
            >
              הוסף הורה
            </button>
            <button
              onClick={() => {
                onAddRelative('sibling');
                setShowAddOptions(false);
              }}
              className="p-2 text-sm bg-green-100 hover:bg-green-200 rounded"
            >
              הוסף אח/ות
            </button>
            <button
              onClick={() => {
                onAddRelative('spouse');
                setShowAddOptions(false);
              }}
              className="p-2 text-sm bg-purple-100 hover:bg-purple-200 rounded"
            >
              הוסף בן/בת זוג
            </button>
            <button
              onClick={() => {
                onAddRelative('child');
                setShowAddOptions(false);
              }}
              className="p-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
            >
              הוסף ילד/ה
            </button>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p>תאריך לידה: {person.birthDateHebrew}</p>
          {person.email && <p>אימייל: {person.email}</p>}
          {person.phone && <p>טלפון: {person.phone}</p>}
          <p>סטטוס: {getMarriageStatusLabel(person.marriageStatus)}</p>
          
          <button 
            onClick={onEdit}
            className="mt-2 w-full px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            ערוך פרטים
          </button>
        </div>
      )}
    </div>
  );
};

function getMarriageStatusLabel(status: Person['marriageStatus']): string {
  const labels = {
    single: 'רווק/ה',
    married: 'נשוי/אה',
    divorced: 'גרוש/ה'
  };
  return labels[status];
}
