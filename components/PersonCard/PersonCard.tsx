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
    e.preventDefault();
    e.stopPropagation();
    setShowAddOptions(prev => !prev);
  };

  const handleOptionClick = (type: RelationType) => {
    onAddRelative(type);
    setShowAddOptions(false);
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
            className="relative z-20 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
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
        <div 
          className="absolute right-0 top-12 w-48 bg-white shadow-xl rounded-lg border border-gray-200 p-2 z-30"
          onClick={(e) => e.stopPropagation()}
        >
          { [
            { type: 'parent', label: 'הוסף הורה', bgColor: 'bg-blue-50', hoverColor: 'hover:bg-blue-100' },
            { type: 'sibling', label: 'הוסף אח/ות', bgColor: 'bg-green-50', hoverColor: 'hover:bg-green-100' },
            { type: 'spouse', label: 'הוסף בן/בת זוג', bgColor: 'bg-purple-50', hoverColor: 'hover:bg-purple-100' },
            { type: 'child', label: 'הוסף ילד/ה', bgColor: 'bg-yellow-50', hoverColor: 'hover:bg-yellow-100' },
          ].map(({ type, label, bgColor, hoverColor }) => (
            <button
              key={type}
              onClick={() => handleOptionClick(type as RelationType)}
              className={`w-full text-right px-4 py-2 mb-1 rounded-md ${bgColor} ${hoverColor} transition-colors`}
            >
              {label}
            </button>
          ))}
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
