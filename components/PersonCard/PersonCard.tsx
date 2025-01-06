'use client';

import { Person, RelationType } from '@/types/family';
import { useState, useEffect } from 'react';

interface PersonCardProps {
  person: Person;
  onEdit: () => void;
  onAddRelative: (type: RelationType) => void;
}

export const PersonCard = ({ person, onEdit, onAddRelative }: PersonCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // מונע סגירה של התפריט בלחיצה
    setShowAddOptions(!showAddOptions);
  };

  // סוגר את התפריט כשלוחצים מחוץ לכרטיס
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.person-card')) {
        setShowAddOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="person-card relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{person.fullName}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? '−' : '⋮'}
          </button>
        </div>
      </div>

      {/* תפריט הוספת בן משפחה */}
      {showAddOptions && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-10">
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'parent', label: 'הורה', color: 'blue' },
              { type: 'sibling', label: 'אח/ות', color: 'green' },
              { type: 'spouse', label: 'בן/בת זוג', color: 'purple' },
              { type: 'child', label: 'ילד/ה', color: 'yellow' },
            ].map(({ type, label, color }) => (
              <button
                key={type}
                onClick={() => {
                  onAddRelative(type as RelationType);
                  setShowAddOptions(false);
                }}
                className={`p-2 text-sm rounded-md transition-colors
                  bg-${color}-50 hover:bg-${color}-100 
                  text-${color}-700 hover:text-${color}-800`}
              >
                {label}
              </button>
            ))}
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
