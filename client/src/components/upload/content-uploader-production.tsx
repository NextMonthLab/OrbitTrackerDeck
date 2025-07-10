import { useState, useRef } from "react";
import { RawSlide } from "@/lib/claude-classifier";
import ClaudeClassifierPanel from "./claude-classifier-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Video, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";
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
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['.pptx', '.zip'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: 'Please upload .pptx or .zip files only'
      }));
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: 'File size must be less than 50MB'
      }));
      return;
    }

    setUploadState({
      file,
      status: 'uploading',
      progress: 0
    });

    // Simulate upload progress
    const uploadProgress = setInterval(() => {
      setUploadState(prev => {
        const newProgress = Math.min(prev.progress + 15, 100);
        if (newProgress >= 100) {
          clearInterval(uploadProgress);
          parseFile(file);
          return { ...prev, status: 'parsing', progress: 100 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 150);
  };

  const parseFile = async (file: File) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate parsing time

      let rawSlides: RawSlide[] = [];

      if (file.name.endsWith('.pptx')) {
        rawSlides = await parsePowerPointToRaw(file);
      } else if (file.name.endsWith('.zip')) {
        rawSlides = await parseZipFolderToRaw(file);
      } else {
        throw new Error('Unsupported file format');
      }

      if (rawSlides.length === 0) {
        throw new Error('No content found in the uploaded file');
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
    return [
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
  };

  const parseZipFolderToRaw = async (file: File): Promise<RawSlide[]> => {
    // Simulated ZIP parsing - in production would extract and parse contents
    return [
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
        <Card className="bg-gray-900/50 border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">File Parsed Successfully</h3>
              <p className="text-sm text-gray-400 mt-1">
                Ready for intelligent classification with Claude
              </p>
            </div>
            <Button
              variant="outline" 
              size="sm"
              onClick={resetUpload}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Start Over
            </Button>
          </div>
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
    <Card className="bg-gray-900/50 border-gray-700 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Content Upload</h3>
          {uploadState.status === 'success' && (
            <Button
              variant="outline" 
              size="sm"
              onClick={resetUpload}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-sm mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-gray-400 text-xs">
                Supports .pptx (PowerPoint) and .zip (Markdown + Media) • Max 50MB
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
                      return <IconComponent className="h-5 w-5 text-gray-300" />;
                    })()}
                    <span className="text-sm text-gray-300">
                      {uploadState.file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(uploadState.file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {uploadState.status === 'uploading' ? 'Uploading...' : 'Parsing content...'}
                  </span>
                  <span className="text-xs text-gray-300">
                    {uploadState.progress}%
                  </span>
                </div>
                <Progress 
                  value={uploadState.progress} 
                  className="h-2"
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
                <span className="text-sm">Upload and classification complete!</span>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Processed Content</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    {uploadState.parsedContent.length} slides
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadState.parsedContent.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300 truncate">
                        {item.title}
                      </span>
                      <div className="flex gap-1">
                        {item.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {uploadState.parsedContent.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{uploadState.parsedContent.length - 3} more slides...
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
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Upload failed</span>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{uploadState.error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetUpload}
                  className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}