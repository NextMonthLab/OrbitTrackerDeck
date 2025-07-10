import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/lib/types";
import { 
  Eye, 
  Play, 
  Maximize2,
  Sparkles,
  MousePointer
} from "lucide-react";

interface LivePreviewPanelProps {
  content: ContentItem[];
  template: string;
  theme: string;
}

export default function LivePreviewPanel({ content, template, theme }: LivePreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeNode, setActiveNode] = useState(0);

  const getThemeColors = (themeId: string) => {
    switch (themeId) {
      case 'military':
        return {
          bg: 'from-green-900 to-gray-900',
          accent: 'text-green-400',
          border: 'border-green-500/30'
        };
      case 'ultramodern':
        return {
          bg: 'from-gray-900 to-black',
          accent: 'text-blue-400',
          border: 'border-blue-500/30'
        };
      case 'technology':
        return {
          bg: 'from-blue-900 to-gray-900',
          accent: 'text-cyan-400',
          border: 'border-cyan-500/30'
        };
      default:
        return {
          bg: 'from-gray-900 to-black',
          accent: 'text-purple-400',
          border: 'border-purple-500/30'
        };
    }
  };

  const themeColors = getThemeColors(theme);

  const renderOrbitPreview = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 80;

    return (
      <div className={`relative w-full h-64 bg-gradient-to-br ${themeColors.bg} rounded-lg overflow-hidden`}>
        <svg className="absolute inset-0 w-full h-full">
          {/* Connection lines */}
          {content.slice(0, 6).map((_, index) => {
            const angle = (index * 2 * Math.PI) / 6;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            return (
              <line
                key={`line-${index}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgb(75, 85, 99)"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
          
          {/* Orbit nodes */}
          {content.slice(0, 6).map((item, index) => {
            const angle = (index * 2 * Math.PI) / 6;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isActive = index === activeNode;
            
            return (
              <motion.circle
                key={`node-${index}`}
                cx={x}
                cy={y}
                r={isActive ? "12" : "8"}
                fill={isActive ? "rgb(147, 51, 234)" : "rgb(75, 85, 99)"}
                stroke={isActive ? "rgb(196, 181, 253)" : "rgb(156, 163, 175)"}
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => setActiveNode(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            );
          })}
          
          {/* Central node */}
          <circle
            cx={centerX}
            cy={centerY}
            r="16"
            fill="rgb(147, 51, 234)"
            stroke="rgb(196, 181, 253)"
            strokeWidth="3"
          />
        </svg>
        
        {/* Active content overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/80 backdrop-blur rounded p-3">
            <h4 className={`font-medium ${themeColors.accent} text-sm mb-1`}>
              {content[activeNode]?.title || "Content Node"}
            </h4>
            <p className="text-gray-300 text-xs line-clamp-2">
              {content[activeNode]?.content?.slice(0, 80) || "Interactive content preview"}...
            </p>
            {content[activeNode]?.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content[activeNode].tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTemplatePreview = () => {
    switch (template) {
      case 'orbit':
        return renderOrbitPreview();
      case 'slidestory':
        return (
          <div className={`w-full h-64 bg-gradient-to-br ${themeColors.bg} rounded-lg flex items-center justify-center`}>
            <div className="text-center">
              <Play className={`h-12 w-12 ${themeColors.accent} mx-auto mb-2`} />
              <p className="text-gray-400 text-sm">SlideStory Preview</p>
              <p className="text-gray-500 text-xs">Cinematic progression</p>
            </div>
          </div>
        );
      case 'immersiondeck':
        return (
          <div className={`w-full h-64 bg-gradient-to-br ${themeColors.bg} rounded-lg flex items-center justify-center`}>
            <div className="text-center">
              <Maximize2 className={`h-12 w-12 ${themeColors.accent} mx-auto mb-2`} />
              <p className="text-gray-400 text-sm">ImmersionDeck Preview</p>
              <p className="text-gray-500 text-xs">Scroll-based journey</p>
            </div>
          </div>
        );
      default:
        return renderOrbitPreview();
    }
  };

  return (
    <Card className={`bg-gray-900/50 border-gray-700 overflow-hidden ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-purple-400" />
            <h3 className="font-medium text-white">Live Preview</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs capitalize">
              {template}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {theme}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {content.length > 0 ? (
          <div className="space-y-4">
            {renderTemplatePreview()}
            
            <div className="text-center">
              <Button size="sm" variant="outline" className="border-gray-600">
                <MousePointer className="h-3 w-3 mr-1" />
                Interactive Preview
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Upload content to see preview</p>
          </div>
        )}
        
        {content.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Content nodes:</span>
                <span>{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Theme:</span>
                <span className="capitalize">{theme}</span>
              </div>
              <div className="flex justify-between">
                <span>Template:</span>
                <span className="capitalize">{template}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}