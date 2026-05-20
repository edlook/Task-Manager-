import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Calendar, Download, Smartphone } from "lucide-react";

export const SettingsView = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(isStandalone);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('notificationsNotSupported'),
      });
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    setNotificationsEnabled(permission === 'granted');

    if (permission === 'granted') {
      toast({
        title: t('notificationsEnabled'),
        description: t('notificationsEnabledDesc'),
      });
      
      // Show test notification
      new Notification(t('appName'), {
        body: t('testNotification'),
        icon: '/icon-192.png',
      });
    } else if (permission === 'denied') {
      toast({
        variant: "destructive",
        title: t('notificationsDenied'),
        description: t('notificationsDeniedDesc'),
      });
    }
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      toast({
        title: t('installPWA'),
        description: t('installPWAInstructions'),
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: t('appInstalled'),
        description: t('appInstalledDesc'),
      });
    }
    setDeferredPrompt(null);
  };

  const connectGoogleCalendar = () => {
    toast({
      title: t('comingSoon'),
      description: t('googleCalendarComingSoon'),
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications')}
          </CardTitle>
          <CardDescription>{t('notificationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('pushNotifications')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('pushNotificationsDesc')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {notificationPermission === 'denied' && (
                <Badge variant="destructive">{t('blocked')}</Badge>
              )}
              {notificationPermission === 'granted' && (
                <Badge variant="default">{t('enabled')}</Badge>
              )}
              {notificationPermission === 'default' && (
                <Button onClick={requestNotificationPermission}>
                  {t('enable')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Install App */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t('installApp')}
          </CardTitle>
          <CardDescription>{t('installAppDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isPWA ? (
            <div className="flex items-center gap-2 text-green-600">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {t('appInstalled')}
              </Badge>
            </div>
          ) : (
            <Button onClick={handleInstallPWA} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t('installOnDevice')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Google Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('googleCalendar')}
          </CardTitle>
          <CardDescription>{t('googleCalendarDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectGoogleCalendar} variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t('connectGoogleCalendar')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
