import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Trash2,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { ru, de, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

interface TasksViewProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export const TasksView = ({ onAddTask, onEditTask }: TasksViewProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const getLocale = () => {
    switch (language) {
      case 'de': return de;
      case 'en': return enUS;
      default: return ru;
    }
  };

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

    const channel = supabase
      .channel("tasks-view")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, fetchTasks)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleComplete = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorUpdateTask'),
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorDeleteTask'),
      });
    } else {
      toast({ title: t('taskDeleted') });
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      className={cn(
        "p-4 rounded-lg border bg-card transition-all hover:shadow-md",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 mt-0.5"
          onClick={() => handleToggleComplete(task)}
        >
          <CheckCircle2
            className={cn(
              "h-5 w-5",
              task.completed ? "text-green-500" : "text-muted-foreground"
            )}
          />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium",
            task.completed && "line-through"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {task.due_date && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.due_date), "d MMM", { locale: getLocale() })}
              </Badge>
            )}
            {task.reminder_time && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(task.reminder_time), "HH:mm")}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEditTask(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => handleDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{t('tasks')}</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchTasks')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={onAddTask}>
              <Plus className="h-4 w-4 mr-1" />
              {t('addTask')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">
              {t('active')} ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t('completed')} ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <ScrollArea className="h-[calc(100vh-350px)] min-h-[300px]">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">{t('loading')}</div>
              ) : activeTasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="mb-4">{t('noActiveTasks')}</p>
                  <Button variant="outline" onClick={onAddTask}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('addTask')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {activeTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="completed">
            <ScrollArea className="h-[calc(100vh-350px)] min-h-[300px]">
              {completedTasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t('noCompletedTasks')}
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {completedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
