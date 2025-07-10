import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Paintbrush } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const availableFonts = [
  { id: "JetBrains Mono", name: "JetBrains Mono", category: "Monospace" },
  { id: "Inter", name: "Inter", category: "Sans-serif" },
  { id: "Orbitron", name: "Orbitron", category: "Display" },
  { id: "Space Grotesk", name: "Space Grotesk", category: "Sans-serif" },
  { id: "Fira Code", name: "Fira Code", category: "Monospace" },
  { id: "Poppins", name: "Poppins", category: "Sans-serif" }
];

export default function BrandCustomizer() {
  const { currentTheme, customColors, updateCustomColors, resetTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleColorChange = (colorType: 'primary' | 'accent', color: string) => {
    updateCustomColors({ [colorType]: color });
  };

  const handleFontChange = (font: string) => {
    updateCustomColors({ font });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Paintbrush className="h-4 w-4 text-[var(--theme-accent)]" />
          <h3 className="font-bold text-sm text-[var(--theme-text)]" style={{ fontFamily: 'var(--theme-font-display)' }}>
            Brand Customizer
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)]"
        >
          {isExpanded ? 'Collapse' : 'Customize'}
        </Button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            className="p-6 space-y-6 border transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            {/* Color Customization */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--theme-font)' }}>
                Colors
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label className="text-xs text-[var(--theme-text-muted)]">Primary</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customColors.primary || currentTheme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ borderColor: 'var(--theme-border)' }}
                    />
                    <div 
                      className="flex-1 h-8 rounded border flex items-center px-3 text-xs font-mono"
                      style={{ 
                        backgroundColor: customColors.primary || currentTheme.primary,
                        borderColor: 'var(--theme-border)',
                        color: currentTheme.background
                      }}
                    >
                      {customColors.primary || currentTheme.primary}
                    </div>
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <Label className="text-xs text-[var(--theme-text-muted)]">Accent</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customColors.accent || currentTheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ borderColor: 'var(--theme-border)' }}
                    />
                    <div 
                      className="flex-1 h-8 rounded border flex items-center px-3 text-xs font-mono"
                      style={{ 
                        backgroundColor: customColors.accent || currentTheme.accent,
                        borderColor: 'var(--theme-border)',
                        color: currentTheme.background
                      }}
                    >
                      {customColors.accent || currentTheme.accent}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Font Customization */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--theme-font)' }}>
                Typography
              </h4>
              
              <div className="space-y-2">
                <Label className="text-xs text-[var(--theme-text-muted)]">Primary Font</Label>
                <Select
                  value={customColors.font || currentTheme.font}
                  onValueChange={handleFontChange}
                >
                  <SelectTrigger 
                    className="border"
                    style={{ 
                      backgroundColor: 'var(--theme-background)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      borderColor: 'var(--theme-border)'
                    }}
                  >
                    {availableFonts.map((font) => (
                      <SelectItem 
                        key={font.id} 
                        value={font.id}
                        className="hover:bg-[var(--theme-hover)] text-[var(--theme-text)]"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span style={{ fontFamily: font.id }}>{font.name}</span>
                          <span className="text-xs text-[var(--theme-text-muted)] ml-2">
                            {font.category}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Preview */}
              <div 
                className="p-3 rounded border"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  borderColor: 'var(--theme-border)',
                  fontFamily: customColors.font || currentTheme.font
                }}
              >
                <p className="text-sm text-[var(--theme-text)]">
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--theme-border)' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTheme}
                className="text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              
              <div className="text-xs text-[var(--theme-text-muted)]">
                Changes apply instantly
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}