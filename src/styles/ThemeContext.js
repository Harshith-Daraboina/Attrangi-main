import React, { createContext, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isLargeText, setIsLargeText] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [role, setRole] = useState(null); // 'patient' | 'caregiver' | 'doctor'
  const [patientLowAttention, setPatientLowAttention] = useState(false);

  const palette = useMemo(() => {
    if (role === 'doctor') {
      return { primary: '#2a7f62', background: '#f7fbf9', text: '#143d33', accent: '#3dbb8c' };
    }
    if (role === 'caregiver') {
      return { primary: '#5267df', background: '#f7f8ff', text: '#1f2a68', accent: '#7b8cff' };
    }
    // default patient palette
    return { primary: '#6c63ff', background: '#f9f9ff', text: '#1f1f3a', accent: '#9aa0ff' };
  }, [role]);

  const value = useMemo(
    () => ({
      isLargeText,
      setIsLargeText,
      focusMode,
      setFocusMode,
      role,
      setRole,
      patientLowAttention,
      setPatientLowAttention,
      palette,
    }),
    [isLargeText, focusMode, role, patientLowAttention, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeSettings() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeSettings must be used within ThemeProvider');
  return ctx;
}

 