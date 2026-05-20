import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { ru, de, enUS } from "date-fns/locale";
import { CalendarIcon, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  completed: boolean;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultDate?: Date;
}

export const TaskDialog = ({ open, onOpenChange, task, defaultDate }: TaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const getLocale = () => {
    switch (language) {
      case 'de': return de;
      case 'en': return enUS;
      default: return ru;
    }
  };

  const getRecognitionLang = () => {
    switch (language) {
      case 'de': return 'de-DE';
      case 'en': return 'en-US';
      default: return 'ru-RU';
    }
  };

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        if (task.due_date) setDueDate(new Date(task.due_date));
        if (task.reminder_time) {
          setReminderTime(format(new Date(task.reminder_time), "HH:mm"));
        }
      } else {
        setTitle("");
        setDescription("");
        setDueDate(defaultDate);
        setReminderTime("");
      }
    }
  }, [open, task, defaultDate]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = getRecognitionLang();

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTitle(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('errorVoiceRecognition'),
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, t, toast]);

  const toggleVoiceInput = () => {
    if (!recognition) {
      toast({
        variant: "destructive",
        title: t('voiceNotSupported'),
        description: t('errorVoiceNotSupported'),
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let reminderDateTime = null;
    if (dueDate && reminderTime) {
      const [hours, minutes] = reminderTime.split(":");
      const reminder = new Date(dueDate);
      reminder.setHours(parseInt(hours), parseInt(minutes));
      reminderDateTime = reminder.toISOString();
    }

    const taskData = {
      title,
      description: description || null,
      due_date: dueDate?.toISOString() || null,
      reminder_time: reminderDateTime,
      user_id: user.id,
    };

    let error;
    if (task) {
      ({ error } = await supabase
        .from("tasks")
        .update(taskData)
        .eq("id", task.id));
    } else {
      ({ error } = await supabase.from("tasks").insert(taskData));
    }

    if (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t(task ? 'errorUpdateTask' : 'errorCreateTask'),
      });
    } else {
      toast({
        title: t(task ? 'taskUpdated' : 'taskCreated'),
      });
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task ? t('editTask') : t('newTask')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('taskTitle')}</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={t('taskTitlePlaceholder')}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                title={t('voiceInput')}
                onClick={toggleVoiceInput}
                className={isListening ? "bg-primary text-primary-foreground" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('taskDescription')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('taskDescriptionPlaceholder')}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('dueDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "d MMM", { locale: getLocale() }) : t('selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    locale={getLocale()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminderTime">{t('reminderTime')}</Label>
              <Input
                id="reminderTime"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                disabled={!dueDate}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('saving') : task ? t('updateTask') : t('createTask')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
