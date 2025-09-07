import React, { createContext, useContext, ReactNode } from 'react';
import { useNotification } from '../hooks/useNotification';
import { NotificationState } from '../types';
import { NotificationToast } from './NotificationToast';

interface NotificationContextType {
  notification: NotificationState;
  showNotification: (message: string, type?: NotificationState['type'], duration?: number) => void;
  hideNotification: () => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notification = useNotification();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
      <NotificationToast />
    </NotificationContext.Provider>
  );
}
