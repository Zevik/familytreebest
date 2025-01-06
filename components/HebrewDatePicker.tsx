'use client';

import { useState } from 'react';
import { HDate, months } from '@hebcal/core';

interface HebrewDatePickerProps {
  onChange: (hebrewDate: string, gregorianDate: string) => void;
  initialDate?: string;
}

export const HebrewDatePicker = ({ onChange, initialDate }: HebrewDatePickerProps) => {
  // ...existing code...
};
