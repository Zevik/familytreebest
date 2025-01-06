'use client';

import { useState, useEffect } from 'react';
import { HDate, months } from '@hebcal/core';

interface HebrewDatePickerProps {
  onChange: (hebrewDate: string, gregorianDate: string) => void;
  value?: string;  // הפיכת value לאופציונלי
}

export const HebrewDatePicker = ({ onChange, value = '' }: HebrewDatePickerProps) => {
  // ...existing code...
  
  // הוספת useEffect לטיפול בערך התחלתי
  useEffect(() => {
    if (value) {
      // Parse value and set initial state
      // This is a placeholder - implement actual parsing logic
      updateDate(year, month, day);
    }
  }, [value]);

  // ...rest of the code...
};
