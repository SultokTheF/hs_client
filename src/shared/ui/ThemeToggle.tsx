import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { GlassButton } from "@/shared/ui/GlassButton";

export const ThemeToggle: React.FC = () => {
  const [theme, , toggle] = useTheme();
  return (
    <GlassButton variant="ghost" onClick={toggle} aria-label="Toggle theme" title="Сменить тему">
      {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </GlassButton>
  );
};
