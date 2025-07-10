import Sidebar from "@/components/layout/sidebar";
import FileUploader from "@/components/upload/file-uploader";
import TemplateSelector from "@/components/templates/template-selector";
import ThemeSelector from "@/components/themes/theme-selector";
import OrbitPreview from "@/components/orbit/orbit-preview";
import LaunchPanel from "@/components/launch/launch-panel";
import { Satellite, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-nextm-gradient">
      {/* Cinematic Overlay */}
      <div className="fixed inset-0 cinematic-overlay pointer-events-none z-0"></div>
      
      <Sidebar />
      
      {/* Main Content */}
      <main className="ml-80 min-h-screen relative z-5">
        {/* Top Bar */}
        <header className="bg-nextm-darker/80 backdrop-blur-sm border-b border-military-tactical p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold military-stencil text-military-khaki">Mission Builder</h2>
              <p className="text-gray-400 font-mono">Configure your tactical presentation experience</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="font-mono text-neon-green">SYSTEM ONLINE</span>
              </div>
              <button className="p-2 hover:bg-nextm-light rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="p-6 space-y-8">
          <FileUploader />
          <TemplateSelector />
          <ThemeSelector />
          <OrbitPreview />
          <LaunchPanel />
        </div>
      </main>
    </div>
  );
}
