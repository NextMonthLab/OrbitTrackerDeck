import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RawSlide, useClaudeClassifier } from "@/lib/claude-classifier";
import { ContentItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle,
  Loader2,
  Eye
} from "lucide-react";

interface ClaudeClassifierPanelProps {
  rawSlides: RawSlide[];
  onClassified: (classified: ContentItem[]) => void;
  onError?: (error: string) => void;
}

export default function ClaudeClassifierPanel({ 
  rawSlides, 
  onClassified, 
  onError 
}: ClaudeClassifierPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [manualResult, setManualResult] = useState('');
  const [previewData, setPreviewData] = useState<ContentItem[] | null>(null);
  
  const { classifySlides, generatePrompt } = useClaudeClassifier();

  const handleAutoClassify = async () => {
    setIsProcessing(true);
    try {
      const result = await classifySlides(rawSlides);
      if (result.success && result.data) {
        setPreviewData(result.data);
      } else {
        onError?.(result.error || 'Classification failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Classification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPrompt = async () => {
    const prompt = generatePrompt(rawSlides);
    await navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleManualProcess = () => {
    try {
      const parsed = JSON.parse(manualResult);
      if (Array.isArray(parsed)) {
        setPreviewData(parsed);
      } else {
        onError?.('Invalid JSON format - expected array');
      }
    } catch (error) {
      onError?.('Invalid JSON format');
    }
  };

  const handleConfirmClassification = () => {
    if (previewData) {
      onClassified(previewData);
    }
  };

  if (rawSlides.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">No slides to classify</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Claude Slide Classifier</h3>
            <p className="text-sm text-gray-600">
              Transform raw slides into intelligent OrbitDeck content
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Raw Slides Detected</span>
            <Badge variant="outline">{rawSlides.length} slides</Badge>
          </div>
          <div className="text-xs text-gray-500">
            Ready to generate titles, tags, and gravity relationships
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleAutoClassify}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Auto-Classify
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowPrompt(!showPrompt)}
          >
            Use Claude Manually
          </Button>
        </div>
      </Card>

      {/* Manual Claude Integration */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <h4 className="font-medium mb-4 flex items-center">
                <Copy className="h-4 w-4 mr-2" />
                Manual Claude Integration
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    1. Copy this prompt to Claude
                  </label>
                  <div className="relative">
                    <Textarea 
                      value={generatePrompt(rawSlides)}
                      readOnly
                      className="min-h-[200px] font-mono text-xs"
                    />
                    <Button 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={handleCopyPrompt}
                    >
                      {promptCopied ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    2. Paste Claude's JSON response here
                  </label>
                  <Textarea 
                    value={manualResult}
                    onChange={(e) => setManualResult(e.target.value)}
                    placeholder="Paste the JSON array from Claude here..."
                    className="min-h-[150px] font-mono text-xs"
                  />
                </div>

                <Button 
                  onClick={handleManualProcess}
                  disabled={!manualResult.trim()}
                  className="w-full"
                >
                  Process Manual Result
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Results */}
      <AnimatePresence>
        {previewData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Classification Preview
                </h4>
                <Badge variant="outline" className="text-green-600">
                  {previewData.length} slides processed
                </Badge>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {previewData.map((slide, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium">{slide.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {slide.gravity?.intensity ? 
                          `${Math.round(slide.gravity.intensity * 100)}% intensity` : 
                          'No gravity'
                        }
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {slide.content.slice(0, 100)}...
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {slide.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {slide.gravity?.related && slide.gravity.related.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <strong>Related:</strong> {slide.gravity.related.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleConfirmClassification}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Use This Classification
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setPreviewData(null)}
                >
                  Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}