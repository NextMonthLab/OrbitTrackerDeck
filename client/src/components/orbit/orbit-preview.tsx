import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crosshair, FileText, Search, Route, Eye, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useDeckLoader } from "@/hooks/use-deck-loader";
import { ContentItem } from "@/lib/types";

// Dynamic icon mapping based on content tags and titles
const getIconForContent = (content: ContentItem) => {
  const title = content.title.toLowerCase();
  const tags = content.tags.join(' ').toLowerCase();
  
  if (title.includes('brief') || tags.includes('briefing') || tags.includes('intro')) return FileText;
  if (title.includes('intel') || tags.includes('surveillance') || tags.includes('data')) return Search;
  if (title.includes('extraction') || title.includes('plan') || tags.includes('strategy')) return Route;
  if (title.includes('equipment') || tags.includes('gear') || tags.includes('tactical')) return Target;
  
  return Target; // Default icon
};

export default function OrbitPreview() {
  const { content, loading, error } = useDeckLoader();

  return (
    <section className="tactical-border rounded-xl p-6 bg-nextm-gray/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold military-stencil text-military-amber">Orbit Preview</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-mono text-gray-400">{content.length} Content Nodes</span>
          <Button 
            className="px-4 py-2 bg-military-gradient text-nextm-dark font-bold text-sm hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/orbit'}
          >
            <Eye className="h-4 w-4 mr-2" />
            Launch Preview
          </Button>
        </div>
      </div>
      
      {/* Orbit Container */}
      <div className="relative h-96 bg-nextm-darker rounded-xl overflow-hidden border border-military-tactical">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--military-olive)) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        ></div>
        
        {/* Central Command Node */}
        <motion.div 
          className="absolute top-1/2 left-1/2 orbit-center w-20 h-20 bg-military-gradient rounded-full border-2 border-military-khaki flex items-center justify-center cursor-pointer z-10"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Crosshair className="h-8 w-8 text-nextm-dark" />
        </motion.div>
        
        {/* Content Orbit Nodes */}
        {content.slice(0, 6).map((item, index) => {
          const IconComponent = getIconForContent(item);
          const positions = [
            { top: '25%', left: '70%' },
            { top: '75%', left: '30%' },
            { top: '20%', left: '25%' },
            { top: '60%', left: '75%' },
            { top: '80%', left: '60%' },
            { top: '15%', left: '45%' }
          ];
          const position = positions[index];
          
          return (
            <motion.div 
              key={index}
              className="absolute cursor-pointer group"
              style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-military-dark border-2 border-military-tactical rounded-lg flex flex-col items-center justify-center p-2 hover:border-military-khaki transition-colors">
                {IconComponent && <IconComponent className="h-4 w-4 text-military-khaki mb-1" />}
                <span className="text-xs font-mono text-gray-300 text-center leading-tight">
                  {item.title.replace(' Plan', ' Pl.')}
                </span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-military-dark px-2 py-1 rounded text-xs font-mono text-military-khaki whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {item.content}
              </div>
            </motion.div>
          );
        })}
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <line x1="50%" y1="50%" x2="70%" y2="25%" stroke="hsl(var(--military-olive))" strokeWidth="2" strokeDasharray="5,5"/>
          <line x1="50%" y1="50%" x2="30%" y2="75%" stroke="hsl(var(--military-olive))" strokeWidth="2" strokeDasharray="5,5"/>
          <line x1="50%" y1="50%" x2="25%" y2="20%" stroke="hsl(var(--military-olive))" strokeWidth="2" strokeDasharray="5,5"/>
        </svg>
      </div>
      
      {/* Content Details Panel */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.slice(0, 3).map((item, index) => {
          const IconComponent = getIconForContent(item);
          
          return (
            <Card key={index} className="bg-military-dark border-military-tactical p-4">
              <div className="flex items-center space-x-2 mb-2">
                {IconComponent && <IconComponent className="h-4 w-4 text-military-khaki" />}
                <h4 className="font-mono text-sm text-military-khaki font-bold">{item.title}</h4>
              </div>
              <p className="text-xs text-gray-400 mb-2">{item.content}</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <Badge key={tag} className="px-2 py-1 bg-military-tactical text-xs font-mono text-military-khaki">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
