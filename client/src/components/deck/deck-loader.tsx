import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Folder,
  Link
} from "lucide-react";
import { ContentItem } from "@/lib/types";

interface DeckLoaderProps {
  onLoad: (content: ContentItem[]) => void;
  loading?: boolean;
  error?: string | null;
  currentCount?: number;
}

export default function DeckLoader({ onLoad, loading, error, currentCount }: DeckLoaderProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        onLoad(data);
      } else if (file.name.endsWith('.pptx')) {
        // Simulate PowerPoint parsing for now
        const mockContent: ContentItem[] = [
          {
            title: "Slide 1: Introduction",
            content: "Content parsed from PowerPoint slide 1",
            tags: ["intro", "presentation"]
          },
          {
            title: "Slide 2: Main Content", 
            content: "Content parsed from PowerPoint slide 2",
            tags: ["content", "main"]
          }
        ];
        onLoad(mockContent);
      }
    } catch (err) {
      console.error('File parsing error:', err);
    }
  };

  const handleJSONLoad = () => {
    try {
      const data = JSON.parse(jsonInput);
      onLoad(data);
      setJsonInput("");
    } catch (err) {
      console.error('JSON parsing error:', err);
    }
  };

  const handleURLLoad = async () => {
    if (!urlInput.trim()) return;
    
    try {
      // Simulate Google Slides API call
      const mockContent: ContentItem[] = [
        {
          title: "Slide from Google Slides",
          content: "Content imported from Google Slides URL",
          tags: ["google", "slides", "import"]
        }
      ];
      onLoad(mockContent);
      setUrlInput("");
    } catch (err) {
      console.error('URL loading error:', err);
    }
  };

  return (
    <section className="tactical-border rounded-xl p-6 bg-nextm-gray/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold military-stencil text-military-amber">Content Injection</h3>
        {currentCount !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span className="font-mono text-neon-green text-sm">{currentCount} ITEMS LOADED</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span className="text-red-300 text-sm font-mono">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* JSON Upload */}
        <Card className="bg-military-dark border-military-tactical p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="h-5 w-5 text-military-khaki" />
            <h4 className="font-mono text-military-khaki font-bold">JSON Deck</h4>
          </div>
          <Textarea
            placeholder='[{"title": "Mission Brief", "content": "...", "tags": ["intro"]}]'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-20 bg-nextm-dark border-military-tactical text-gray-300 font-mono text-xs mb-3"
          />
          <Button 
            onClick={handleJSONLoad}
            disabled={!jsonInput.trim() || loading}
            className="w-full bg-military-tactical hover:bg-military-khaki hover:text-nextm-dark text-sm"
          >
            Load JSON
          </Button>
        </Card>

        {/* File Upload */}
        <Card className="bg-military-dark border-military-tactical p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Upload className="h-5 w-5 text-military-khaki" />
            <h4 className="font-mono text-military-khaki font-bold">File Upload</h4>
          </div>
          <div className="border-2 border-dashed border-military-tactical rounded-lg p-4 text-center mb-3 hover:border-military-khaki transition-colors cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <Folder className="h-6 w-6 text-military-khaki mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-mono">
              Drop .json or .pptx files
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.pptx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex space-x-1">
            <Badge className="bg-military-tactical text-xs">JSON</Badge>
            <Badge className="bg-military-tactical text-xs">PPTX</Badge>
          </div>
        </Card>

        {/* URL Import */}
        <Card className="bg-military-dark border-military-tactical p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Link className="h-5 w-5 text-military-khaki" />
            <h4 className="font-mono text-military-khaki font-bold">URL Import</h4>
          </div>
          <Input
            placeholder="https://docs.google.com/presentation/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-nextm-dark border-military-tactical text-gray-300 font-mono text-xs mb-3"
          />
          <Button 
            onClick={handleURLLoad}
            disabled={!urlInput.trim() || loading}
            className="w-full bg-military-tactical hover:bg-military-khaki hover:text-nextm-dark text-sm"
          >
            Import Slides
          </Button>
        </Card>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 text-military-amber animate-spin" />
              <span className="font-mono text-military-amber text-sm">PROCESSING...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-neon-green" />
              <span className="font-mono text-neon-green text-sm">SYSTEM READY</span>
            </>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          className="border-military-tactical text-military-khaki hover:bg-military-dark"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reload Default
        </Button>
      </div>
    </section>
  );
}