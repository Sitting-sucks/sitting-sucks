import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Hook for accessing native device features via Capacitor
 */
export const useNative = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    setIsNative(native);
    setPlatform(Capacitor.getPlatform() as 'ios' | 'android' | 'web');

    // Hide splash screen when app is ready
    if (native) {
      SplashScreen.hide();
    }
  }, []);

  // Haptic feedback
  const hapticImpact = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isNative) return;

    const impactStyle = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }[style];

    await Haptics.impact({ style: impactStyle });
  }, [isNative]);

  const hapticNotification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (!isNative) return;

    const notificationType = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    }[type];

    await Haptics.notification({ type: notificationType });
  }, [isNative]);

  const hapticVibrate = useCallback(async (duration = 300) => {
    if (!isNative) return;
    await Haptics.vibrate({ duration });
  }, [isNative]);

  // Status bar
  const setStatusBarStyle = useCallback(async (style: 'dark' | 'light') => {
    if (!isNative) return;
    await StatusBar.setStyle({ style: style === 'dark' ? Style.Dark : Style.Light });
  }, [isNative]);

  const setStatusBarColor = useCallback(async (color: string) => {
    if (!isNative || platform !== 'android') return;
    await StatusBar.setBackgroundColor({ color });
  }, [isNative, platform]);

  // Local notifications
  const scheduleNotification = useCallback(async (options: {
    title: string;
    body: string;
    scheduleAt?: Date;
    id?: number;
  }) => {
    if (!isNative) return;

    const { title, body, scheduleAt, id = Date.now() } = options;

    // Request permission first
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    if (scheduleAt) {
      await LocalNotifications.schedule({
        notifications: [{
          id,
          title,
          body,
          schedule: { at: scheduleAt },
        }],
      });
    } else {
      await LocalNotifications.schedule({
        notifications: [{
          id,
          title,
          body,
        }],
      });
    }

    return id;
  }, [isNative]);

  const cancelNotification = useCallback(async (id: number) => {
    if (!isNative) return;
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }, [isNative]);

  // Schedule workout reminder
  const scheduleWorkoutReminder = useCallback(async (reminderTime: Date) => {
    return scheduleNotification({
      title: 'Time to Move!',
      body: "You've been sitting for a while. Let's do some anti-sitting exercises!",
      scheduleAt: reminderTime,
      id: 1001, // Fixed ID for workout reminders
    });
  }, [scheduleNotification]);

  // App lifecycle
  useEffect(() => {
    if (!isNative) return;

    // Listen for app state changes
    const stateListener = App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
    });

    // Listen for back button (Android)
    const backListener = App.addListener('backButton', () => {
      // Handle back button - can prevent default or navigate
      console.log('Back button pressed');
    });

    return () => {
      stateListener.then(l => l.remove());
      backListener.then(l => l.remove());
    };
  }, [isNative]);

  return {
    isNative,
    platform,
    haptics: {
      impact: hapticImpact,
      notification: hapticNotification,
      vibrate: hapticVibrate,
    },
    statusBar: {
      setStyle: setStatusBarStyle,
      setColor: setStatusBarColor,
    },
    notifications: {
      schedule: scheduleNotification,
      cancel: cancelNotification,
      scheduleWorkoutReminder,
    },
  };
};

/**
 * Simple hook to check if running on native platform
 */
export const useIsNative = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  return isNative;
};

/**
 * Hook for haptic feedback (no-op on web)
 */
export const useHaptics = () => {
  const isNative = useIsNative();

  const impact = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isNative) return;

    const impactStyle = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }[style];

    await Haptics.impact({ style: impactStyle });
  }, [isNative]);

  const success = useCallback(async () => {
    if (!isNative) return;
    await Haptics.notification({ type: NotificationType.Success });
  }, [isNative]);

  const error = useCallback(async () => {
    if (!isNative) return;
    await Haptics.notification({ type: NotificationType.Error });
  }, [isNative]);

  return { impact, success, error };
};
