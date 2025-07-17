import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Palette, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { themes, ThemeId } from "@/lib/themes";

export default function ThemeSelector() {
  const { themeId, setTheme, currentTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleThemeSelect = (newThemeId: ThemeId) => {
    setTheme(newThemeId);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-[var(--theme-accent)]" />
          <h3 className="font-bold text-sm text-[var(--theme-text)]" style={{ fontFamily: 'var(--theme-font-display)' }}>
            Visual Theme
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)]"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Current Theme Display */}
      <Card 
        className="p-4 border transition-all duration-300"
        style={{ 
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: 'var(--theme-shadow)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--theme-font)' }}>
              {currentTheme.name}
            </h4>
            <p className="text-xs text-[var(--theme-text-muted)] mt-1">
              {currentTheme.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <div 
              className="w-4 h-4 rounded-full border-2"
              style={{ 
                backgroundColor: currentTheme.primary,
                borderColor: 'var(--theme-border)'
              }}
            />
            <div 
              className="w-4 h-4 rounded-full border-2"
              style={{ 
                backgroundColor: currentTheme.accent,
                borderColor: 'var(--theme-border)'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Theme Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {Object.entries(themes).map(([id, theme]) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * Object.keys(themes).indexOf(id) }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    themeId === id ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: themeId === id ? theme.accent : theme.effects.border,
                    boxShadow: themeId === id ? theme.effects.glow : theme.effects.shadow
                  }}
                  onClick={() => handleThemeSelect(id as ThemeId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 
                          className="font-semibold"
                          style={{ 
                            color: theme.text,
                            fontFamily: theme.fontDisplay
                          }}
                        >
                          {theme.name}
                        </h4>
                        {themeId === id && (
                          <Badge 
                            className="text-xs px-2 py-1"
                            style={{ 
                              backgroundColor: theme.accent,
                              color: theme.background
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p 
                        className="text-xs leading-relaxed"
                        style={{ color: theme.textMuted }}
                      >
                        {theme.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span 
                          className="text-xs"
                          style={{ 
                            color: theme.textMuted,
                            fontFamily: theme.font
                          }}
                        >
                          {theme.font}
                        </span>
                        <div className="flex space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ 
                              backgroundColor: theme.primary,
                              borderColor: theme.effects.border
                            }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ 
                              backgroundColor: theme.secondary,
                              borderColor: theme.effects.border
                            }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ 
                              backgroundColor: theme.accent,
                              borderColor: theme.effects.border
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {themeId === id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.accent }}
                      >
                        <Check className="h-4 w-4" style={{ color: theme.background }} />
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}