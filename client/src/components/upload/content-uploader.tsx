import { useState, useRef } from "react";
import { RawSlide } from "@/lib/claude-classifier";
import ClaudeClassifierPanel from "./claude-classifier-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Video, CheckCircle, AlertCircle, X } from "lucide-react";
import { ContentItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface ContentUploaderProps {
  onContentParsed: (content: ContentItem[]) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  file: File | null;
  status: 'idle' | 'uploading' | 'parsing' | 'classifying' | 'success' | 'error';
  progress: number;
  error?: string;
  parsedContent?: ContentItem[];
  rawSlides?: RawSlide[];
}

export default function ContentUploader({ onContentParsed, onError }: ContentUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    status: 'idle',
    progress: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setUploadState({
      file,
      status: 'uploading',
      progress: 0
    });

    // Simulate upload progress
    const uploadProgress = setInterval(() => {
      setUploadState(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(uploadProgress);
          parseFile(file);
          return { ...prev, status: 'parsing', progress: 100 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 100);
  };

  const parseFile = async (file: File) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate parsing time

      let rawSlides: RawSlide[] = [];

      if (file.name.endsWith('.pptx')) {
        rawSlides = await parsePowerPointToRaw(file);
      } else if (file.name.endsWith('.zip')) {
        rawSlides = await parseZipFolderToRaw(file);
      } else {
        throw new Error('Unsupported file format. Please upload .pptx or .zip files.');
      }

      setUploadState(prev => ({
        ...prev,
        status: 'classifying',
        rawSlides
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }));
      onError?.(errorMessage);
    }
  };

  const parsePowerPointToRaw = async (file: File): Promise<RawSlide[]> => {
    // Simulated PowerPoint parsing - in production would use pptx parser
    const simulatedSlides: RawSlide[] = [
      {
        slideTitle: "Mission Overview",
        slideText: "Strategic objectives and operational parameters for the deployment phase. This briefing covers essential tactical considerations and resource allocation."
      },
      {
        slideTitle: "Intelligence Assessment", 
        slideText: "Current threat analysis and situational awareness data. Includes enemy positions, terrain analysis, and communication protocols."
      },
      {
        slideTitle: "Equipment Manifest",
        slideText: "Required gear and tactical equipment for mission success. Standard loadout includes communications, navigation, and defensive systems."
      },
      {
        slideTitle: "Extraction Protocol",
        slideText: "Emergency procedures and fallback positions. Multiple extraction points identified with contingency routes for mission completion."
      },
      {
        slideTitle: "Communications Plan",
        slideText: "Radio frequencies, call signs, and secure communication procedures. Includes backup channels and emergency signals."
      }
    ];

    return simulatedSlides;
  };

  const parseZipFolderToRaw = async (file: File): Promise<RawSlide[]> => {
    // Simulated ZIP parsing - in production would extract and parse contents
    const simulatedContent: RawSlide[] = [
      {
        slideTitle: "Project Alpha Documentation",
        slideText: "Comprehensive project documentation extracted from markdown files. Includes technical specifications and implementation details."
      },
      {
        slideTitle: "System Architecture",
        slideText: "Detailed system architecture overview with component relationships and data flow patterns."
      },
      {
        slideTitle: "User Interface Mockups",
        slideText: "UI/UX design mockups and wireframes showing the proposed user experience flow."
      }
    ];

    return simulatedContent;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.name.endsWith('.pptx') || file.name.endsWith('.zip')
    );

    if (validFile) {
      handleFileSelect(validFile);
    } else {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: 'Please upload .pptx or .zip files only'
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetUpload = () => {
    setUploadState({
      file: null,
      status: 'idle',
      progress: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pptx')) return FileText;
    if (filename.endsWith('.zip')) return Image;
    return FileText;
  };

  const handleClassificationComplete = (classifiedContent: ContentItem[]) => {
    setUploadState(prev => ({
      ...prev,
      status: 'success',
      parsedContent: classifiedContent
    }));
    onContentParsed(classifiedContent);
  };

  const handleClassificationError = (error: string) => {
    setUploadState(prev => ({
      ...prev,
      status: 'error',
      error
    }));
    onError?.(error);
  };

  // Show classifier panel if we have raw slides
  if (uploadState.status === 'classifying' && uploadState.rawSlides) {
    return (
      <div className="space-y-6">
        <Card className="bg-military-dark border-military-tactical p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold military-stencil text-military-amber">File Parsed Successfully</h3>
            <Button
              variant="outline" 
              size="sm"
              onClick={resetUpload}
              className="border-military-tactical text-military-khaki hover:bg-military-tactical"
            >
              <X className="h-4 w-4 mr-1" />
              Start Over
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Ready for intelligent classification with Claude
          </p>
        </Card>
        
        <ClaudeClassifierPanel
          rawSlides={uploadState.rawSlides}
          onClassified={handleClassificationComplete}
          onError={handleClassificationError}
        />
      </div>
    );
  }

  return (
    <Card className="bg-military-dark border-military-tactical p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold military-stencil text-military-amber">Content Upload</h3>
          {uploadState.status === 'success' && (
            <Button
              variant="outline" 
              size="sm"
              onClick={resetUpload}
              className="border-military-tactical text-military-khaki hover:bg-military-tactical"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {uploadState.status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-2 border-dashed border-military-tactical rounded-lg p-8 text-center hover:border-military-khaki transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-military-olive mx-auto mb-4" />
              <p className="text-military-khaki font-mono text-sm mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-gray-400 text-xs">
                Supports .pptx (PowerPoint) and .zip (Markdown + Media)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pptx,.zip"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </motion.div>
          )}

          {(uploadState.status === 'uploading' || uploadState.status === 'parsing') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                {uploadState.file && (
                  <>
                    {(() => {
                      const IconComponent = getFileIcon(uploadState.file.name);
                      return <IconComponent className="h-5 w-5 text-military-khaki" />;
                    })()}
                    <span className="font-mono text-sm text-military-khaki">
                      {uploadState.file.name}
                    </span>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-400">
                    {uploadState.status === 'uploading' ? 'Uploading...' : 'Parsing content...'}
                  </span>
                  <span className="text-xs font-mono text-military-khaki">
                    {uploadState.progress}%
                  </span>
                </div>
                <Progress 
                  value={uploadState.progress} 
                  className="bg-military-tactical"
                />
              </div>
            </motion.div>
          )}

          {uploadState.status === 'success' && uploadState.parsedContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-mono text-sm">Parsing complete!</span>
              </div>

              <div className="bg-nextm-darker rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">Extracted Content</span>
                  <Badge className="bg-military-tactical text-military-khaki">
                    {uploadState.parsedContent.length} items
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadState.parsedContent.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-military-amber rounded-full"></div>
                      <span className="text-military-khaki font-mono truncate">
                        {item.title}
                      </span>
                    </div>
                  ))}
                  {uploadState.parsedContent.length > 3 && (
                    <div className="text-xs text-gray-400 font-mono">
                      +{uploadState.parsedContent.length - 3} more items...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {uploadState.status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-mono text-sm">Upload failed</span>
              </div>
              
              <p className="text-xs text-gray-400 bg-red-950/20 rounded p-2 border border-red-900/30">
                {uploadState.error}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={resetUpload}
                className="w-full border-military-tactical text-military-khaki hover:bg-military-tactical"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}