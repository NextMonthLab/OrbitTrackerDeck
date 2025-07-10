import { Satellite, Upload, Grid3X3, Palette, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeckLoader } from "@/hooks/use-deck-loader";
import ContentUploader from "@/components/upload/content-uploader";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Sidebar() {
  const { content, loading, error, loadFromParsedContent } = useDeckLoader();
  const { toast } = useToast();
  const [showUploader, setShowUploader] = useState(false);

  const handleContentParsed = (parsedContent: any[]) => {
    loadFromParsedContent(parsedContent);
    toast({
      title: "Content Uploaded",
      description: `Successfully parsed ${parsedContent.length} content items`,
    });
    setShowUploader(false);
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Upload Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-80 bg-nextm-darker border-r border-military-tactical z-10">
      {/* Header */}
      <div className="p-6 border-b border-military-tactical">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-military-gradient rounded-lg flex items-center justify-center">
            <Satellite className="h-6 w-6 text-military-khaki" />
          </div>
          <div>
            <h1 className="text-xl font-bold military-stencil text-military-khaki">OrbitDeck</h1>
            <p className="text-xs text-gray-400 font-mono">MISSION BUILDER v2.1</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-mono text-military-amber uppercase tracking-wide">Build Process</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setShowUploader(!showUploader)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-military-dark border border-military-tactical text-military-khaki hover:bg-military-tactical transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="font-medium">Upload Content</span>
              <span className="ml-auto w-2 h-2 bg-neon-green rounded-full animate-tactical-blink"></span>
            </button>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-nextm-light transition-colors text-gray-300">
              <Grid3X3 className="h-4 w-4" />
              <span>Select Template</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-nextm-light transition-colors text-gray-300">
              <Palette className="h-4 w-4" />
              <span>Choose Theme</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-nextm-light transition-colors text-gray-300">
              <Eye className="h-4 w-4" />
              <span>Preview & Launch</span>
            </a>
          </div>
        </div>

        {/* Upload Panel */}
        {showUploader && (
          <div className="mt-6">
            <ContentUploader 
              onContentParsed={handleContentParsed}
              onError={handleUploadError}
            />
          </div>
        )}
        
        {/* Current Configuration */}
        <div className="mt-8 p-4 tactical-border rounded-lg bg-military-dark/50">
          <h4 className="text-sm font-mono text-military-amber uppercase mb-3">Current Config</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Template:</span>
              <span className="text-military-khaki font-mono">ORBIT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Theme:</span>
              <span className="text-military-khaki font-mono">MILITARY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Content:</span>
              <span className="text-neon-green font-mono">{content.length} ITEMS</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-6 space-y-2">
          <Button 
            className="w-full p-3 bg-military-gradient text-nextm-dark font-bold military-stencil hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/orbit'}
          >
            {content.length > 0 ? 'Preview Orbit' : 'Begin Experience'}
          </Button>
          <Button variant="outline" className="w-full p-3 border-military-tactical text-military-khaki hover:bg-military-dark">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </nav>
    </aside>
  );
}
