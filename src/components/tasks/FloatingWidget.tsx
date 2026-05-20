import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, LogOut } from "lucide-react";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

export const FloatingWidget = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t('logoutSuccess'),
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-[400px] max-h-[600px] glass shadow-elegant z-50 flex flex-col">
        <div className="p-2 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">TM</span>
            </div>
            <h2 className="font-bold text-sm">{t('appName')}</h2>
          </div>
          <div className="flex gap-0.5">
            <LanguageSelector />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExpanded ? t('collapseWidget') : t('expandWidget')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('logoutTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      {isExpanded && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-2 flex-shrink-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-8 text-xs" size="sm">
                <Plus className="h-3 w-3 mr-1.5" />
                {t('addTask')}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? t('editTask') : t('newTask')}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                task={editingTask}
                onSuccess={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
          </div>
          
          <div className="overflow-y-auto flex-1 min-h-0 px-2 pb-2">
            <TaskList onEditTask={handleEditTask} />
          </div>
        </div>
      )}
      </Card>
  );
};
