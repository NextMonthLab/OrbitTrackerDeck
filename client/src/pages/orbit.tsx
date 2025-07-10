import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContentItem } from "@/lib/types";
import { useDeckLoader } from "@/hooks/use-deck-loader";
import { GravityEngine } from "@/components/orbit/gravity-engine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crosshair, 
  ArrowLeft, 
  FileText, 
  Search, 
  Route, 
  Target,
  ChevronRight,
  Zap,
  Compass,
  Brain
} from "lucide-react";

// Dynamic icon mapping based on content tags and titles
const getIconForContent = (content: ContentItem) => {
  const title = content.title.toLowerCase();
  const tags = content.tags.join(' ').toLowerCase();
  
  if (title.includes('brief') || tags.includes('briefing') || tags.includes('intro')) return FileText;
  if (title.includes('intel') || tags.includes('surveillance') || tags.includes('data')) return Search;
  if (title.includes('extraction') || title.includes('plan') || tags.includes('strategy')) return Route;
  if (title.includes('equipment') || tags.includes('gear') || tags.includes('tactical')) return Target;
  if (title.includes('communication') || tags.includes('radio') || tags.includes('protocol')) return Zap;
  if (title.includes('rules') || tags.includes('engagement') || tags.includes('roe')) return Target;
  
  return Target; // Default icon
};

interface OrbitNodeProps {
  content: ContentItem;
  position: { x: number; y: number };
  isActive: boolean;
  onClick: () => void;
  index: number;
}

function OrbitNode({ content, position, isActive, onClick, index }: OrbitNodeProps) {
  const IconComponent = getIconForContent(content);
  
  return (
    <motion.div
      className={`absolute cursor-pointer group ${isActive ? 'z-20' : 'z-10'}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.2 : 1, 
        opacity: 1,
        rotate: isActive ? 0 : index * 45
      }}
      whileHover={{ scale: isActive ? 1.2 : 1.1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: index * 0.1
      }}
      onClick={onClick}
    >
      <div className={`
        w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center p-2 transition-all duration-300
        ${isActive 
          ? 'bg-military-gradient border-military-amber shadow-lg neon-glow animate-orbit-pulse' 
          : 'bg-military-dark border-military-tactical hover:border-military-khaki hover:animate-orbit-pulse'
        }
      `}>
        <IconComponent className={`h-4 w-4 mb-1 ${
          isActive ? 'text-nextm-dark' : 'text-military-khaki'
        }`} />
        <span className={`text-xs font-mono text-center leading-tight ${
          isActive ? 'text-nextm-dark font-bold' : 'text-gray-300'
        }`}>
          {content.title.split(' ').map(word => word.slice(0, 3)).join(' ')}
        </span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-military-dark px-3 py-2 rounded-lg text-xs font-mono text-military-khaki whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-military-tactical">
        {content.title}
      </div>
    </motion.div>
  );
}

interface CentralDisplayProps {
  content: ContentItem;
}

function CentralDisplay({ content }: CentralDisplayProps) {
  const IconComponent = getIconForContent(content);
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="w-full h-full bg-military-dark border-2 border-military-amber p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-military-gradient rounded-full flex items-center justify-center mb-4">
          <IconComponent className="h-8 w-8 text-nextm-dark" />
        </div>
        <h3 className="font-bold military-stencil text-military-khaki text-lg mb-2">
          {content.title}
        </h3>
        <p className="text-sm text-gray-300 font-mono mb-4 leading-relaxed">
          {content.content}
        </p>
        
        {/* Media Display */}
        {content.media && (
          <div className="w-full h-32 bg-nextm-darker rounded border border-military-tactical mb-4 flex items-center justify-center">
            <span className="text-xs text-gray-500 font-mono">MEDIA: {content.media.split('/').pop()}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1 justify-center">
          {content.tags.map((tag) => (
            <Badge key={tag} className="px-2 py-1 bg-military-tactical text-xs font-mono text-military-khaki">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

interface SuggestedNextProps {
  currentContent: ContentItem;
  allContent: ContentItem[];
  onSelect: (content: ContentItem) => void;
}

function SuggestedNext({ currentContent, allContent, onSelect }: SuggestedNextProps) {
  // Use Gravity Engine for intelligent suggestions
  const suggested = GravityEngine.getSuggestedNext(currentContent, allContent);
  
  if (suggested.length === 0) {
    // If no related content, show other items
    const others = allContent.filter(item => item.title !== currentContent.title).slice(0, 3);
    suggested.push(...others);
  }

  // Check if suggestions are gravity-based or tag-based
  const hasGravityData = currentContent.gravity?.related && currentContent.gravity.related.length > 0;
  
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-military-amber font-bold text-sm uppercase tracking-wide flex items-center">
        {hasGravityData ? (
          <Brain className="h-4 w-4 mr-2" />
        ) : (
          <Compass className="h-4 w-4 mr-2" />
        )}
        {hasGravityData ? 'AI Gravity' : 'Tactical Suggestions'}
      </h4>
      {hasGravityData && (
        <div className="text-xs text-gray-400 font-mono mb-2 flex items-center">
          <div className="w-2 h-2 bg-military-amber rounded-full mr-2 animate-pulse"></div>
          Powered by story intelligence
        </div>
      )}
      {suggested.map((item, index) => {
        const IconComponent = getIconForContent(item);
        
        return (
          <motion.div
            key={item.title}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="bg-military-dark border-military-tactical p-3 cursor-pointer hover:border-military-khaki transition-colors group"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-military-tactical rounded flex items-center justify-center group-hover:bg-military-khaki transition-colors">
                  <IconComponent className="h-4 w-4 text-military-khaki group-hover:text-nextm-dark" />
                </div>
                <div className="flex-1">
                  <h5 className="font-mono text-military-khaki text-sm font-bold">
                    {item.title}
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">{item.content.slice(0, 40)}...</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-military-khaki" />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function OrbitPage() {
  const { content, loading: deckLoading, error } = useDeckLoader();
  const [activeContent, setActiveContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial active content when deck loads
  useEffect(() => {
    if (content.length > 0 && !activeContent) {
      setActiveContent(content[0]);
    }
  }, [content, activeContent]);

  // Calculate orbital positions for nodes with gravity-based ordering
  const getOrbitPositions = (count: number, excludeActive: boolean = true) => {
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    
    let availableContent = excludeActive && activeContent
      ? content.filter(item => item.title !== activeContent.title)
      : content;
    
    // Use gravity engine to reorder content if we have an active content
    if (activeContent && excludeActive) {
      const reordered = GravityEngine.reorderByGravity(activeContent, content);
      availableContent = reordered.filter(item => item.title !== activeContent.title);
    }
    
    for (let i = 0; i < availableContent.length; i++) {
      const angle = (i / availableContent.length) * 2 * Math.PI;
      // Vary radius based on gravity relationship - closer for related content
      const isGravityRelated = activeContent?.gravity?.related?.includes(availableContent[i].title);
      const radius = isGravityRelated ? 30 : 40; // Closer orbit for related content
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    
    return { positions, orderedContent: availableContent };
  };

  const handleNodeClick = async (newContent: ContentItem) => {
    if (!activeContent || newContent.title === activeContent.title) return;
    
    setIsLoading(true);
    // Simulate loading delay for tactical feel
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveContent(newContent);
    setIsLoading(false);
  };

  // Handle loading states
  if (deckLoading) {
    return (
      <div className="min-h-screen bg-nextm-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-military-amber border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-military-amber">LOADING MISSION DATA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-nextm-gradient flex items-center justify-center">
        <div className="text-center tactical-border rounded-xl p-8 bg-military-dark">
          <p className="font-mono text-red-400 mb-4">MISSION DATA ERROR</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-military-gradient text-nextm-dark font-bold">
            Retry Mission Load
          </Button>
        </div>
      </div>
    );
  }

  if (content.length === 0 || !activeContent) {
    return (
      <div className="min-h-screen bg-nextm-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-military-amber">NO MISSION DATA AVAILABLE</p>
        </div>
      </div>
    );
  }

  const { positions: orbitPositions, orderedContent: orbitContent } = getOrbitPositions(content.length - 1);

  return (
    <div className="min-h-screen bg-nextm-gradient" data-theme="military">
      {/* Cinematic Overlay */}
      <div className="fixed inset-0 cinematic-overlay pointer-events-none z-0"></div>
      
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-80 bg-nextm-darker border-r border-military-tactical z-10">
        <div className="p-6 border-b border-military-tactical">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-military-gradient rounded-lg flex items-center justify-center">
              <Crosshair className="h-6 w-6 text-nextm-dark" />
            </div>
            <div>
              <h1 className="text-xl font-bold military-stencil text-military-khaki">OrbitDeck</h1>
              <p className="text-xs text-gray-400 font-mono">ORBIT EXPERIENCE</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <Button 
            variant="outline" 
            className="w-full border-military-tactical text-military-khaki hover:bg-military-dark"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Builder
          </Button>
          
          <div className="tactical-border rounded-lg p-4 bg-military-dark/50">
            <h4 className="text-sm font-mono text-military-amber uppercase mb-3">Mission Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Node:</span>
                <span className="text-military-khaki font-mono">{activeContent.title.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Nodes:</span>
                <span className="text-neon-green font-mono">{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Theme:</span>
                <span className="text-military-khaki font-mono">MILITARY</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Orbit View */}
      <main className="ml-80 flex-1 flex">
        {/* Center Orbit Area */}
        <div className="flex-1 relative min-h-screen">
          {/* Grid Background with Tactical Scan */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--military-olive)) 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          ></div>
          
          {/* Tactical Scan Overlay */}
          <div className="absolute inset-0 animate-tactical-scan pointer-events-none"></div>
          
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-military-dark/80 flex items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-military-amber border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="font-mono text-military-amber text-sm">ACQUIRING TARGET</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Central Display */}
          <CentralDisplay content={activeContent} />
          
          {/* Orbit Nodes */}
          {orbitContent.map((content, index) => (
            <OrbitNode
              key={content.title}
              content={content}
              position={orbitPositions[index]}
              isActive={false}
              onClick={() => handleNodeClick(content)}
              index={index}
            />
          ))}
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-5">
            {orbitPositions.map((pos, index) => (
              <motion.line
                key={index}
                x1="50%"
                y1="50%"
                x2={`${pos.x}%`}
                y2={`${pos.y}%`}
                stroke="hsl(var(--military-olive))"
                strokeWidth="1"
                strokeDasharray="3,3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            ))}
          </svg>
        </div>
        
        {/* Right Panel */}
        <aside className="w-80 bg-nextm-darker border-l border-military-tactical p-6 min-h-screen">
          <div className="space-y-6">
            {/* Active Content Details */}
            <div>
              <h3 className="text-lg font-bold military-stencil text-military-khaki mb-4">
                {activeContent.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {activeContent.content}
              </p>
              <div className="flex flex-wrap gap-2">
                {activeContent.tags.map((tag) => (
                  <Badge key={tag} className="px-3 py-1 bg-military-tactical text-military-khaki font-mono">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Suggested Next */}
            <div>
              <SuggestedNext 
                currentContent={activeContent}
                allContent={content}
                onSelect={handleNodeClick}
              />
            </div>
            
            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-military-tactical">
              <Button className="w-full bg-military-gradient text-nextm-dark font-bold military-stencil">
                Deploy Mission
              </Button>
              <Button variant="outline" className="w-full border-military-tactical text-military-khaki hover:bg-military-dark">
                Share Orbit
              </Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}