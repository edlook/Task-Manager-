import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList = ({ onEditTask }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorLoadTasks'),
      });
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorDeleteTask'),
      });
    } else {
      toast({
        title: t('taskDeleted'),
      });
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">{t('active')} ({activeTasks.length})</TabsTrigger>
        <TabsTrigger value="completed">{t('completed')} ({completedTasks.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {activeTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('noActiveTasks')}</p>
            ) : (
              activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="completed">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('noCompletedTasks')}</p>
            ) : (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
