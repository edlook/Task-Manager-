import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const languages = [
  { code: 'ru' as const, name: 'Русский', flag: '🇷🇺' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const currentLang = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Languages className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{t('changeLanguage')}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="z-[100]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
