import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru, de, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const getLocale = () => {
    switch (language) {
      case 'de': return de;
      case 'en': return enUS;
      default: return ru;
    }
  };

  const handleToggleComplete = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <Card className={`p-4 glass glass-hover transition-all ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          disabled={loading}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), "d MMMM, yyyy", { locale: getLocale() })}</span>
              </div>
            )}
            {task.reminder_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(task.reminder_time), "HH:mm", { locale: getLocale() })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
