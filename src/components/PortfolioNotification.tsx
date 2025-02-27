import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import AddToPortfolioToast from './AddToPortfolioToast';

interface PortfolioNotificationProps {
  onViewPortfolio: () => void;
}

export type NotificationType = {
  id: string;
  property: Property;
  type: 'add' | 'remove' | 'update';
  timestamp: Date;
};

// Create a singleton notification manager
class NotificationManager {
  private static instance: NotificationManager;
  private listeners: ((notifications: NotificationType[]) => void)[] = [];
  private notifications: NotificationType[] = [];

  private constructor() {}

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public addNotification(notification: Omit<NotificationType, 'id' | 'timestamp'>): void {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date()
    };
    this.notifications = [newNotification, ...this.notifications].slice(0, 5); // Keep only the 5 most recent
    this.notifyListeners();
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  public getNotifications(): NotificationType[] {
    return [...this.notifications];
  }

  public subscribe(listener: (notifications: NotificationType[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }
}

export const notificationManager = NotificationManager.getInstance();

const PortfolioNotification: React.FC<PortfolioNotificationProps> = ({ onViewPortfolio }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    notificationManager.removeNotification(id);
  };

  return (
    <>
      {notifications.map(notification => (
        <AddToPortfolioToast
          key={notification.id}
          property={notification.property}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </>
  );
};

export default PortfolioNotification;
