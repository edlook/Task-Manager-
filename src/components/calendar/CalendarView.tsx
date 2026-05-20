import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { ru, de, enUS } from "date-fns/locale";
import { Plus, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

interface CalendarViewProps {
  onAddTask: (date: Date) => void;
  onEditTask: (task: Task) => void;
}

export const CalendarView = ({ onAddTask, onEditTask }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
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

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .gte("due_date", monthStart.toISOString())
      .lte("due_date", monthEnd.toISOString())
      .order("due_date", { ascending: true });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("calendar-tasks")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, fetchTasks)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const tasksForSelectedDate = tasks.filter(
    (task) => task.due_date && isSameDay(new Date(task.due_date), selectedDate)
  );

  const getDayTasks = (date: Date) => {
    return tasks.filter((task) => task.due_date && isSameDay(new Date(task.due_date), date));
  };

  const handleToggleComplete = async (task: Task) => {
    await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('calendar')}</span>
            <Button size="sm" onClick={() => onAddTask(selectedDate)}>
              <Plus className="h-4 w-4 mr-1" />
              {t('addTask')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={getLocale()}
            className="w-full"
            modifiers={{
              hasTasks: (date) => getDayTasks(date).length > 0,
            }}
            modifiersClassNames={{
              hasTasks: "bg-primary/20 font-bold",
            }}
            components={{
              DayContent: ({ date }) => {
                const dayTasks = getDayTasks(date);
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{date.getDate()}</span>
                    {dayTasks.length > 0 && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tasks for selected date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {format(selectedDate, "d MMMM yyyy", { locale: getLocale() })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">{t('loading')}</div>
            ) : tasksForSelectedDate.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="mb-4">{t('noTasksForDate')}</p>
                <Button variant="outline" onClick={() => onAddTask(selectedDate)}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('addTask')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50",
                      task.completed && "opacity-60"
                    )}
                    onClick={() => onEditTask(task)}
                  >
                    <div className="flex items-start gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 mt-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(task);
                        }}
                      >
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4",
                            task.completed ? "text-green-500" : "text-muted-foreground"
                          )}
                        />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium truncate",
                          task.completed && "line-through"
                        )}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {task.description}
                          </p>
                        )}
                        {task.reminder_time && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(new Date(task.reminder_time), "HH:mm")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
