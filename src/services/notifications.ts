// Notification Service for Trineo Tasks
// Handles browser push notifications

export class NotificationService {
  private static permission: NotificationPermission = 'default';

  // Request notification permission
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    }

    return 'denied';
  }

  // Check if notifications are supported
  static isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Check current permission status
  static getPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  // Show a notification
  static async showNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }
    }

    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        await registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
          ...options,
        });
      } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to regular notification if service worker fails
        new Notification(title, {
          icon: '/icon-192.png',
          ...options,
        });
      }
    }
  }

  // Schedule notification for overdue tasks
  static async notifyOverdueTask(taskTitle: string, taskId: string): Promise<void> {
    await this.showNotification('Task Overdue', {
      body: `"${taskTitle}" is overdue. Tap to view.`,
      tag: `overdue-${taskId}`,
      data: {
        url: '/',
        taskId: taskId,
        type: 'overdue'
      },
      requireInteraction: true,
    });
  }

  // Schedule notification for tasks due today
  static async notifyTaskDueToday(taskTitle: string, taskId: string): Promise<void> {
    await this.showNotification('Task Due Today', {
      body: `"${taskTitle}" is due today. Don't forget!`,
      tag: `due-today-${taskId}`,
      data: {
        url: '/',
        taskId: taskId,
        type: 'due-today'
      },
    });
  }

  // Schedule daily reminder notification
  static async scheduleDailyReminder(): Promise<void> {
    // Check if we should show daily reminder (once per day)
    const lastReminder = localStorage.getItem('lastDailyReminder');
    const today = new Date().toDateString();
    
    if (lastReminder === today) {
      return; // Already shown today
    }

    await this.showNotification('Daily Reminder', {
      body: 'Check your tasks for today!',
      tag: 'daily-reminder',
      data: {
        url: '/',
        type: 'reminder'
      },
    });

    localStorage.setItem('lastDailyReminder', today);
  }

  // Clear all notifications
  static async clearAll(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const notifications = await registration.getNotifications();
        notifications.forEach(notification => notification.close());
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
  }
}


