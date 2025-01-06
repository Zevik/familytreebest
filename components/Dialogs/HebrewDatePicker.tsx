'use client';

import { useState } from 'react';
import { HDate, months } from '@hebcal/core';

interface HebrewDatePickerProps {
  value: string;
  onChange: (hebrewDate: string, gregorianDate: string) => void;
}

export const HebrewDatePicker = ({ onChange }: HebrewDatePickerProps) => {
  const [year, setYear] = useState(5784);
  const [month, setMonth] = useState(months.TISHREI);
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
        {Object.entries(months).map(([name, value]) => (
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
