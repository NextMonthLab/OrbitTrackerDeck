import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_CONTENT } from "@/lib/constants";
import { ContentItem } from "@/lib/types";
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
  Zap
} from "lucide-react";

const iconMap = {
  "Mission Brief": FileText,
  "Intel Report": Search,
  "Extraction Plan": Route
};

interface OrbitNodeProps {
  content: ContentItem;
  position: { x: number; y: number };
  isActive: boolean;
  onClick: () => void;
  index: number;
}

function OrbitNode({ content, position, isActive, onClick, index }: OrbitNodeProps) {
  const IconComponent = iconMap[content.title as keyof typeof iconMap] || Target;
  
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
  const IconComponent = iconMap[content.title as keyof typeof iconMap] || Target;
  
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
  // Find related content based on shared tags
  const suggested = allContent
    .filter(item => 
      item.title !== currentContent.title && 
      item.tags.some(tag => currentContent.tags.includes(tag))
    )
    .slice(0, 3);
  
  if (suggested.length === 0) {
    // If no related content, show other items
    const others = allContent.filter(item => item.title !== currentContent.title).slice(0, 3);
    suggested.push(...others);
  }
  
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-military-amber font-bold text-sm uppercase tracking-wide flex items-center">
        <Zap className="h-4 w-4 mr-2" />
        Tactical Suggestions
      </h4>
      {suggested.map((item, index) => {
        const IconComponent = iconMap[item.title as keyof typeof iconMap] || Target;
        
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
  const [activeContent, setActiveContent] = useState<ContentItem>(MOCK_CONTENT[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate orbital positions for nodes
  const getOrbitPositions = (count: number, excludeActive: boolean = true) => {
    const positions = [];
    const radius = 35; // Percentage from center
    const centerX = 50;
    const centerY = 50;
    
    const availableContent = excludeActive 
      ? MOCK_CONTENT.filter(item => item.title !== activeContent.title)
      : MOCK_CONTENT;
    
    for (let i = 0; i < availableContent.length; i++) {
      const angle = (i / availableContent.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    
    return positions;
  };

  const handleNodeClick = async (content: ContentItem) => {
    if (content.title === activeContent.title) return;
    
    setIsLoading(true);
    // Simulate loading delay for tactical feel
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveContent(content);
    setIsLoading(false);
  };

  const orbitPositions = getOrbitPositions(MOCK_CONTENT.length - 1);
  const orbitContent = MOCK_CONTENT.filter(item => item.title !== activeContent.title);

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
                <span className="text-military-khaki font-mono">{activeContent.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Nodes:</span>
                <span className="text-neon-green font-mono">{MOCK_CONTENT.length}</span>
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
                allContent={MOCK_CONTENT}
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