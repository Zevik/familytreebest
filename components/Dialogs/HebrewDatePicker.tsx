'use client';

import { useState } from 'react';
import { HDate } from '@hebcal/core';

interface HebrewDatePickerProps {
  value: string;
  onChange: (hebrewDate: string, gregorianDate: string) => void;
}

// Define Hebrew months
const HEBREW_MONTHS = [
  { name: 'תשרי', value: 1 },
  { name: 'חשון', value: 2 },
  { name: 'כסלו', value: 3 },
  { name: 'טבת', value: 4 },
  { name: 'שבט', value: 5 },
  { name: 'אדר', value: 6 },
  { name: 'ניסן', value: 7 },
  { name: 'אייר', value: 8 },
  { name: 'סיון', value: 9 },
  { name: 'תמוז', value: 10 },
  { name: 'אב', value: 11 },
  { name: 'אלול', value: 12 }
];

export const HebrewDatePicker = ({ value, onChange }: HebrewDatePickerProps) => {
  const [year, setYear] = useState(5784);
  const [month, setMonth] = useState(1);  // תשרי
  const [day, setDay] = useState(1);

  const updateDate = (y: number, m: number, d: number) => {
    const hDate = new HDate(d, m, y);
    const greg = hDate.greg();
    const hebString = hDate.toString('h');
    const gregString = `${greg.getFullYear()}-${(greg.getMonth() + 1).toString().padStart(2, '0')}-${greg.getDate().toString().padStart(2, '0')}`;
    
    onChange(hebString, gregString);
  };

  return (
    <div className="flex gap-4">
      <select 
        value={day}
        onChange={(e) => {
          const newDay = parseInt(e.target.value);
          setDay(newDay);
          updateDate(year, month, newDay);
        }}
        className="p-2 border rounded"
      >
        {Array.from({length: 30}, (_, i) => i + 1).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select 
        value={month}
        onChange={(e) => {
          const newMonth = parseInt(e.target.value);
          setMonth(newMonth);
          updateDate(year, newMonth, day);
        }}
        className="p-2 border rounded"
      >
        {HEBREW_MONTHS.map(({ name, value }) => (
          <option key={value} value={value}>{name}</option>
        ))}
      </select>

      <select 
        value={year}
        onChange={(e) => {
          const newYear = parseInt(e.target.value);
          setYear(newYear);
          updateDate(newYear, month, day);
        }}
        className="p-2 border rounded"
      >
        {Array.from({length: 100}, (_, i) => 5784 - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};
