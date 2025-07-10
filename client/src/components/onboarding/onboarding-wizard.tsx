import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/lib/types";
import ContentUploader from "@/components/upload/content-uploader";
import TemplateSelector from "@/components/templates/template-selector";
import ThemeSelector from "@/components/themes/theme-selector";
import BrandCustomizer from "@/components/themes/brand-customizer";
import StepCard from "./step-card";
import LivePreviewPanel from "./live-preview-panel";
import { 
  Upload, 
  Layout, 
  Palette, 
  Brain, 
  Rocket,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Share,
  Download
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete: () => void;
}

interface OnboardingState {
  currentStep: number;
  content: ContentItem[];
  selectedTemplate: string;
  selectedTheme: string;
  isClassified: boolean;
  isPublished: boolean;
}

const steps = [
  {
    id: 1,
    title: "Upload Your Deck",
    description: "Accept .pptx, .zip, or manual entry",
    icon: Upload
  },
  {
    id: 2,
    title: "Choose Your Template",
    description: "Orbit (default), SlideStory, ImmersionDeck",
    icon: Layout
  },
  {
    id: 3,
    title: "Choose Your Theme",
    description: "Military, Ultra-Modern, Technology",
    icon: Palette
  },
  {
    id: 4,
    title: "Add Intelligence",
    description: "Run Claude Classifier to enrich slides",
    icon: Brain
  },
  {
    id: 5,
    title: "Preview & Publish",
    description: "Share link or upgrade for white-label",
    icon: Rocket
  }
];

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    content: [],
    selectedTemplate: "orbit",
    selectedTheme: "military",
    isClassified: false,
    isPublished: false
  });

  const currentStepData = steps.find(step => step.id === state.currentStep);
  const progress = ((state.currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (state.currentStep < steps.length) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handlePrevious = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleContentUploaded = (content: ContentItem[]) => {
    setState(prev => ({ ...prev, content, isClassified: true }));
  };

  const handleTemplateSelected = (template: string) => {
    setState(prev => ({ ...prev, selectedTemplate: template }));
  };

  const handleThemeSelected = (theme: string) => {
    setState(prev => ({ ...prev, selectedTheme: theme }));
  };

  const handlePublish = () => {
    setState(prev => ({ ...prev, isPublished: true }));
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 1: return state.content.length > 0;
      case 2: return state.selectedTemplate !== "";
      case 3: return state.selectedTheme !== "";
      case 4: return state.isClassified;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onComplete}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-700" />
              <h1 className="text-xl font-semibold text-white">OrbitDeck Setup</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Step {state.currentStep} of {steps.length}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Header */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {currentStepData && (
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <currentStepData.icon className="h-6 w-6 text-purple-400" />
                  </div>
                )}
                <div>
                  <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                    Step {state.currentStep}
                  </Badge>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentStepData?.title}
              </h2>
              <p className="text-gray-400">{currentStepData?.description}</p>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {state.currentStep === 1 && (
                  <StepCard title="Upload Content">
                    <ContentUploader
                      onContentParsed={handleContentUploaded}
                      onError={(error) => console.error(error)}
                    />
                  </StepCard>
                )}

                {state.currentStep === 2 && (
                  <StepCard title="Select Template">
                    <TemplateSelector />
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      {["orbit", "slidestory", "immersiondeck"].map((template) => (
                        <Card 
                          key={template}
                          className={`p-4 cursor-pointer transition-colors ${
                            state.selectedTemplate === template 
                              ? 'bg-purple-500/20 border-purple-500' 
                              : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                          }`}
                          onClick={() => handleTemplateSelected(template)}
                        >
                          <div className="aspect-video bg-gray-900 rounded mb-3 flex items-center justify-center">
                            <Layout className="h-8 w-8 text-gray-500" />
                          </div>
                          <h3 className="font-medium text-white capitalize">{template}</h3>
                          <p className="text-sm text-gray-400">
                            {template === "orbit" ? "Interactive radial layout" :
                             template === "slidestory" ? "Cinematic progression" :
                             "Scroll-based journey"}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </StepCard>
                )}

                {state.currentStep === 3 && (
                  <StepCard title="Choose Theme">
                    <ThemeSelector />
                    <div className="mt-6">
                      <BrandCustomizer />
                    </div>
                  </StepCard>
                )}

                {state.currentStep === 4 && (
                  <StepCard title="AI Enhancement">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Claude Classification Complete
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Your content has been enhanced with AI-generated tags, titles, and gravity relationships.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-400">{state.content.length}</div>
                          <div className="text-sm text-gray-400">Slides Processed</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-400">
                            {state.content.reduce((acc, item) => acc + item.tags.length, 0)}
                          </div>
                          <div className="text-sm text-gray-400">Tags Generated</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-400">
                            {state.content.filter(item => item.gravity?.related?.length).length}
                          </div>
                          <div className="text-sm text-gray-400">Gravity Links</div>
                        </div>
                      </div>
                    </div>
                  </StepCard>
                )}

                {state.currentStep === 5 && (
                  <StepCard title="Publish Your Experience">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-white mb-2">
                          Your OrbitDeck is Ready!
                        </h3>
                        <p className="text-gray-400 mb-6">
                          Share your interactive experience or upgrade for advanced features.
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={handlePublish}
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share Link
                        </Button>
                        <Button variant="outline" className="border-gray-600">
                          <Download className="h-4 w-4 mr-2" />
                          Export (Pro)
                        </Button>
                      </div>
                      
                      {state.isPublished && (
                        <Card className="bg-green-500/10 border-green-500/30 p-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div>
                              <p className="text-green-400 font-medium">Published Successfully!</p>
                              <p className="text-sm text-gray-400">
                                Your OrbitDeck is live at: orbitdeck.app/experience/abc123
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}
                      
                      <Card className="bg-purple-500/10 border-purple-500/30 p-4">
                        <h4 className="font-medium text-purple-400 mb-2">Upgrade to Remove Watermark</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Get custom branding, analytics, and white-label export with Starter plan.
                        </p>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Upgrade Now - $19/month
                        </Button>
                      </Card>
                    </div>
                  </StepCard>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={state.currentStep === 1}
                className="border-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed() || state.currentStep === steps.length}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {state.currentStep === steps.length ? "Complete" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Step Progress */}
            <Card className="bg-gray-900/50 border-gray-700 p-6">
              <h3 className="font-medium text-white mb-4">Setup Progress</h3>
              <div className="space-y-3">
                {steps.map((step) => {
                  const isCompleted = step.id < state.currentStep;
                  const isCurrent = step.id === state.currentStep;
                  
                  return (
                    <div 
                      key={step.id}
                      className={`flex items-center space-x-3 p-2 rounded ${
                        isCurrent ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-purple-500 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : step.id}
                      </div>
                      <span className={`text-sm ${
                        isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Live Preview */}
            {state.content.length > 0 && (
              <LivePreviewPanel 
                content={state.content}
                template={state.selectedTemplate}
                theme={state.selectedTheme}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}