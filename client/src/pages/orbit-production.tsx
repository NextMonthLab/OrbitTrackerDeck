import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/lib/types";
import { MOCK_CONTENT } from "@/lib/constants";
import { useGravityEngine, GravitySlide } from "@/hooks/use-gravity-engine";
import { 
  Brain, 
  ChevronRight, 
  Compass, 
  Home, 
  Target, 
  Zap, 
  FileText, 
  Presentation, 
  Video, 
  Image, 
  Settings, 
  Users, 
  BarChart3,
  Shield,
  Database,
  Loader2,
  ArrowLeft
} from "lucide-react";

const getIconForContent = (content: ContentItem) => {
  const title = content.title.toLowerCase();
  const tags = content.tags.join(' ').toLowerCase();
  const combined = `${title} ${tags}`;

  if (combined.match(/overview|introduction|welcome|start|home/)) return Home;
  if (combined.match(/mission|objective|goal|target/)) return Target;
  if (combined.match(/process|workflow|action|execution/)) return Zap;
  if (combined.match(/document|file|report|manual/)) return FileText;
  if (combined.match(/presentation|demo|showcase/)) return Presentation;
  if (combined.match(/video|media|visual/)) return Video;
  if (combined.match(/image|photo|graphic/)) return Image;
  if (combined.match(/settings|config|setup/)) return Settings;
  if (combined.match(/team|people|user|personnel/)) return Users;
  if (combined.match(/analytics|data|metric|chart/)) return BarChart3;
  if (combined.match(/security|protection|safety/)) return Shield;
  if (combined.match(/database|storage|system/)) return Database;
  
  return FileText;
};

interface OrbitNodeProps {
  content: ContentItem;
  position: { x: number; y: number };
  isActive: boolean;
  onClick: () => void;
  index: number;
  gravityRank?: number;
}

function OrbitNode({ content, position, isActive, onClick, index, gravityRank = 0 }: OrbitNodeProps) {
  const IconComponent = getIconForContent(content);
  
  // Determine gravity level for visual styling
  const isHighGravity = gravityRank >= 8;
  const isMediumGravity = gravityRank >= 4 && gravityRank < 8;
  
  return (
    <motion.div
      className="absolute group cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1
      }}
      onClick={onClick}
    >
      <div className={`
        w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 backdrop-blur-sm
        ${isActive 
          ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/30 animate-pulse' 
          : isHighGravity
          ? 'bg-gray-800/80 border-green-400 hover:border-green-300 hover:shadow-md hover:shadow-green-400/20'
          : isMediumGravity
          ? 'bg-gray-800/80 border-blue-400 hover:border-blue-300 hover:shadow-md hover:shadow-blue-400/20'
          : 'bg-gray-800/80 border-gray-600 hover:border-gray-400 hover:shadow-md'
        }
      `}>
        {/* Gravity indicator */}
        {isHighGravity && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        )}
        {isMediumGravity && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
        )}
        
        <IconComponent className={`h-5 w-5 mb-1 ${
          isActive ? 'text-white' : isHighGravity ? 'text-green-300' : isMediumGravity ? 'text-blue-300' : 'text-gray-300'
        }`} />
        <span className={`text-[10px] text-center leading-tight ${
          isActive ? 'text-white font-bold' : 'text-gray-300'
        }`}>
          {content.title.split(' ').slice(0, 2).map(word => word.slice(0, 4)).join(' ')}
        </span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700 pointer-events-none z-10">
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
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      key={content.title}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="w-full h-full bg-gray-900/80 backdrop-blur-sm border-gray-700 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
          <IconComponent className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="font-bold text-white text-xl mb-3 leading-tight">
          {content.title}
        </h3>
        
        <p className="text-sm text-gray-300 mb-4 leading-relaxed max-h-24 overflow-y-auto">
          {content.content}
        </p>
        
        {/* Media Display */}
        {content.media && (
          <div className="w-full h-20 bg-gray-800 rounded border border-gray-600 mb-4 flex items-center justify-center">
            <span className="text-xs text-gray-400">Media: {content.media.split('/').pop()}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 justify-center max-w-full">
          {content.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
              {tag}
            </Badge>
          ))}
          {content.tags.length > 4 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{content.tags.length - 4}
            </Badge>
          )}
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
  const { getSuggestedNext } = useGravityEngine(currentContent, allContent);
  const suggestedNext = getSuggestedNext(currentContent);
  
  // Check if suggestions are gravity-based or tag-based
  const hasGravityData = currentContent.gravity?.related && currentContent.gravity.related.length > 0;
  
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-white text-sm uppercase tracking-wide flex items-center">
        {hasGravityData ? (
          <Brain className="h-4 w-4 mr-2 text-purple-400" />
        ) : (
          <Compass className="h-4 w-4 mr-2 text-blue-400" />
        )}
        {hasGravityData ? 'AI Suggestions' : 'Related Content'}
      </h4>
      
      {hasGravityData && (
        <div className="text-xs text-gray-400 mb-2 flex items-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
          Powered by story intelligence
        </div>
      )}
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {suggestedNext.map((item, index) => {
          const IconComponent = getIconForContent(item);
          
          return (
            <motion.div
              key={item.title}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="bg-gray-800/50 border-gray-700 p-3 cursor-pointer hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-200 group"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                    <IconComponent className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h5>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {item.content.slice(0, 60)}...
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrbitPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [activeContent, setActiveContent] = useState<ContentItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from localStorage or use mock data
  useEffect(() => {
    const loadContent = () => {
      try {
        const savedSetup = localStorage.getItem('orbitdeck-setup');
        if (savedSetup) {
          const setup = JSON.parse(savedSetup);
          if (setup.content && setup.content.length > 0) {
            setContent(setup.content);
            setActiveContent(setup.content[0]);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to load saved content:', error);
      }
      
      // Fallback to mock content
      setContent(MOCK_CONTENT);
      setActiveContent(MOCK_CONTENT[0]);
      setIsLoading(false);
    };

    loadContent();
  }, []);

  const { reorderSlidesByGravity } = useGravityEngine(activeContent, content);

  // Calculate orbital positions for nodes with gravity-based ordering
  const getOrbitPositions = (slides: GravitySlide[]) => {
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    
    for (let i = 0; i < slides.length; i++) {
      const angle = (i / slides.length) * 2 * Math.PI;
      const slide = slides[i];
      
      // Vary radius based on gravity rank - closer for high gravity content
      let radius = 35; // Default radius
      if (slide.gravityRank && slide.gravityRank >= 8) {
        radius = 28; // Very close for high gravity
      } else if (slide.gravityRank && slide.gravityRank >= 4) {
        radius = 32; // Medium distance for medium gravity
      }
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    
    return positions;
  };

  const handleNodeClick = async (newContent: ContentItem) => {
    if (!activeContent || newContent.title === activeContent.title || isTransitioning) return;
    
    setIsTransitioning(true);
    // Smooth transition delay
    await new Promise(resolve => setTimeout(resolve, 200));
    setActiveContent(newContent);
    setIsTransitioning(false);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading OrbitDeck...</p>
        </div>
      </div>
    );
  }

  if (content.length === 0 || !activeContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No content available</p>
          <Button onClick={() => window.location.href = '/'} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Builder
          </Button>
        </div>
      </div>
    );
  }

  const reorderedSlides = reorderSlidesByGravity(activeContent);
  const orbitPositions = getOrbitPositions(reorderedSlides);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Builder
            </Button>
            <div className="h-6 w-px bg-gray-600" />
            <h1 className="text-xl font-semibold text-white">OrbitDeck Experience</h1>
          </div>
          
          <div className="text-sm text-gray-400">
            {content.length} slides • Orbit template
          </div>
        </div>
      </div>

      {/* Main Orbit Container */}
      <div className="absolute inset-0 pt-20">
        <div className="relative w-full h-full">
          {/* Central Display */}
          <AnimatePresence mode="wait">
            {activeContent && (
              <CentralDisplay key={activeContent.title} content={activeContent} />
            )}
          </AnimatePresence>

          {/* Orbit Nodes */}
          <AnimatePresence>
            {reorderedSlides.map((slide, index) => {
              const position = orbitPositions[index];
              if (!position) return null;

              return (
                <OrbitNode
                  key={slide.title}
                  content={slide}
                  position={position}
                  isActive={activeContent?.title === slide.title}
                  onClick={() => handleNodeClick(slide)}
                  index={index}
                  gravityRank={slide.gravityRank}
                />
              );
            })}
          </AnimatePresence>

          {/* Transition Overlay */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar with Suggestions */}
      <div className="absolute top-20 right-0 w-80 h-full bg-gray-900/80 backdrop-blur-sm border-l border-gray-700 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-400" />
              Current Focus
            </h3>
            <div className="text-sm text-gray-400">
              {activeContent?.title || 'No content selected'}
            </div>
          </div>

          {activeContent && (
            <SuggestedNext
              currentContent={activeContent}
              allContent={content}
              onSelect={handleNodeClick}
            />
          )}

          <div className="pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                High gravity content
              </div>
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Medium gravity content
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                Standard content
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}