export const NotificationManager = {
  requestPermission: async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    try {
      const res = await Notification.requestPermission();
      return res === 'granted';
    } catch (e) {
      console.warn('Notification permission request failed:', e);
      return false;
    }
  },

  showNotification: (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Failed to display browser notification:', e);
      }
    }
  },

  scheduleReminders: (settings: {
    remindPeriodEnabled: boolean;
    remindOvulationEnabled: boolean;
    remindPillEnabled: boolean;
    remindWaterEnabled: boolean;
  }) => {
    if (typeof window === 'undefined') return;
    NotificationManager.requestPermission().then((granted) => {
      if (!granted) return;
      if (settings.remindPillEnabled) {
        NotificationManager.showNotification(
          '💊 Aura Pill Reminder',
          'Alarm active: Time to take your daily contraceptive or vitamin pill!'
        );
      }
      if (settings.remindWaterEnabled) {
        NotificationManager.showNotification(
          '💧 Aura Hydration Reminder',
          'Alarm active: Stay hydrated and drink a glass of water!'
        );
      }
    });
  },
};
