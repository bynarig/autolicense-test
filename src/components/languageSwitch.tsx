"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ua", label: "Ukrainian", flag: "🇺🇦" },
  { value: "ru", label: "Russian", flag: "🇷🇺" },
];

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.language || "en");

  // Update current language when i18n.language changes
  React.useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  // Find the current language object
  const currentLang = languages.find(lang => lang.value === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-8 w-8 rounded-full"
        >
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Select language</span>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {currentLang.value.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => changeLanguage(lang.value)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentLanguage === lang.value && "bg-accent"
            )}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
            {currentLanguage === lang.value && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
