import { useState, useCallback, useEffect } from 'react';
import { NotificationState } from '../types';

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    isVisible: false,
    duration: 5000,
  });

  const showNotification = useCallback((
    message: string,
    type: NotificationState['type'] = 'info',
    duration: number = 5000
  ) => {
    setNotification({
      message,
      type,
      isVisible: true,
      duration,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  // Auto-hide notification after duration
  useEffect(() => {
    if (notification.isVisible && notification.duration) {
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.isVisible, notification.duration, hideNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
