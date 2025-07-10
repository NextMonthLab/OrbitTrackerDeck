import { TEMPLATES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crosshair, Film, Scroll } from "lucide-react";

const iconMap = {
  crosshairs: Crosshair,
  film: Film,
  scroll: Scroll
};

export default function TemplateSelector() {
  return (
    <section className="tactical-border rounded-xl p-6 bg-nextm-gray/50">
      <h3 className="text-lg font-bold military-stencil text-military-amber mb-4">Presentation Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => {
          const IconComponent = iconMap[template.icon as keyof typeof iconMap];
          
          return (
            <div 
              key={template.id}
              className={`border-2 rounded-lg p-4 relative cursor-pointer transition-all hover:scale-105 ${
                template.active 
                  ? 'border-military-khaki bg-military-dark' 
                  : 'border-gray-600 hover:border-military-tactical opacity-60'
              }`}
            >
              {template.active && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-neon-green text-nextm-dark text-xs px-2 py-1 font-mono font-bold">
                    ACTIVE
                  </Badge>
                </div>
              )}
              
              <div className="h-32 bg-nextm-darker rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
                {template.id === 'orbit' && (
                  <>
                    {/* Central node */}
                    <div className="absolute top-1/2 left-1/2 orbit-center w-8 h-8 bg-military-gradient rounded-full"></div>
                    {/* Orbit nodes */}
                    <div className="absolute top-1/4 left-1/2 orbit-center w-4 h-4 bg-military-khaki rounded-full"></div>
                    <div className="absolute top-3/4 left-1/4 orbit-center w-3 h-3 bg-military-tactical rounded-full"></div>
                    <div className="absolute top-3/4 right-1/4 orbit-center w-3 h-3 bg-military-tactical rounded-full"></div>
                  </>
                )}
                {template.id === 'slidestory' && (
                  <>
                    <div className="absolute inset-4 border border-gray-600 rounded"></div>
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-600 rounded"></div>
                  </>
                )}
                {template.id === 'immersiondeck' && (
                  <div className="absolute inset-2 space-y-2">
                    <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-600 rounded w-5/6"></div>
                  </div>
                )}
              </div>
              
              <h4 className={`font-bold ${template.active ? 'military-stencil text-military-khaki' : 'text-gray-400'}`}>
                {template.name}
              </h4>
              <p className={`text-xs mt-1 ${template.active ? 'text-gray-400' : 'text-gray-500'}`}>
                {template.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
