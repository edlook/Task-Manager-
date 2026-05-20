import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { TasksView } from "@/components/tasks/TasksView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { SettingsView } from "@/components/settings/SettingsView";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

const IndexContent = () => {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'settings'>('tasks');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setShowAuth(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setShowAuth(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Notification system
  useEffect(() => {
    if (!user) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const notificationSound = new Audio('data:audio/wav;base64,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');

    const checkReminders = async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("completed", false)
        .not("reminder_time", "is", null);

      if (error || !tasks) return;

      const now = new Date();
      const shownReminders = localStorage.getItem('shownReminders');
      const shownData = shownReminders ? JSON.parse(shownReminders) : {};
      const oneHourAgo = now.getTime() - 3600000;
      
      Object.keys(shownData).forEach(id => {
        if (shownData[id] < oneHourAgo) delete shownData[id];
      });

      tasks.forEach((task) => {
        if (!task.reminder_time) return;
        
        const reminderTime = new Date(task.reminder_time);
        const timeDiff = reminderTime.getTime() - now.getTime();
        const shouldNotify = timeDiff <= 1800000 && timeDiff > -3600000 && !shownData[task.id];

        if (shouldNotify) {
          notificationSound.play().catch(() => {});
          
          // In-app notification
          toast({
            title: t('reminderTitle'),
            description: task.title,
          });

          // Browser notification
          if (Notification.permission === "granted") {
            try {
              const notification = new Notification(t('reminderTitle'), {
                body: task.title,
                icon: "/icon-192.png",
                badge: "/icon-192.png",
                requireInteraction: true,
                tag: task.id,
              });
              notification.onclick = () => {
                window.focus();
                notification.close();
              };
            } catch (e) {}
          }

          shownData[task.id] = now.getTime();
          localStorage.setItem('shownReminders', JSON.stringify(shownData));
        }
      });
    };

    const interval = setInterval(checkReminders, 30000);
    checkReminders();

    return () => clearInterval(interval);
  }, [user, t, toast]);

  const handleAddTask = useCallback((date?: Date) => {
    setEditingTask(null);
    setDefaultDate(date);
    setTaskDialogOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultDate(undefined);
    setTaskDialogOpen(true);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('appDescriptionShort')}
          </p>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      </div>
    );
  }

  return (
    <>
      <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'tasks' && (
          <TasksView onAddTask={() => handleAddTask()} onEditTask={handleEditTask} />
        )}
        {activeTab === 'calendar' && (
          <CalendarView onAddTask={handleAddTask} onEditTask={handleEditTask} />
        )}
        {activeTab === 'settings' && <SettingsView />}
      </AppLayout>
      
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
        defaultDate={defaultDate}
      />
    </>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
