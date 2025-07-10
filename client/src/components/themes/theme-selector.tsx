import { THEMES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Shield, Atom, Cpu } from "lucide-react";

const iconMap = {
  'shield-alt': Shield,
  'atom': Atom,
  'microchip': Cpu
};

export default function ThemeSelector() {
  return (
    <section className="tactical-border rounded-xl p-6 bg-nextm-gray/50">
      <h3 className="text-lg font-bold military-stencil text-military-amber mb-4">Visual Theme</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {THEMES.map((theme) => {
          const IconComponent = iconMap[theme.icon as keyof typeof iconMap];
          
          return (
            <div 
              key={theme.id}
              className={`border-2 rounded-lg p-4 relative cursor-pointer transition-all hover:scale-105 ${
                theme.active 
                  ? 'border-military-khaki bg-military-dark' 
                  : 'border-gray-600 hover:border-neon-blue opacity-60'
              }`}
            >
              {theme.active && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-neon-green text-nextm-dark text-xs px-2 py-1 font-mono font-bold">
                    ACTIVE
                  </Badge>
                </div>
              )}
              
              <div className={`h-24 rounded-lg mb-3 flex items-center justify-center ${
                theme.id === 'military' ? 'bg-military-gradient' :
                theme.id === 'ultra-modern' ? 'bg-gradient-to-br from-gray-900 to-black' :
                'bg-gradient-to-br from-blue-900 to-cyan-900'
              }`}>
                {IconComponent && (
                  <IconComponent className={`h-6 w-6 ${
                    theme.active ? 'text-military-khaki' : 'text-gray-400'
                  }`} />
                )}
              </div>
              
              <h4 className={`font-bold ${theme.active ? 'military-stencil text-military-khaki' : 'text-gray-400'}`}>
                {theme.name}
              </h4>
              <p className={`text-xs mt-1 ${theme.active ? 'text-gray-400' : 'text-gray-500'}`}>
                {theme.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
