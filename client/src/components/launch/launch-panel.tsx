import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, Eye, Share2, Copy } from "lucide-react";

export default function LaunchPanel() {
  return (
    <section className="tactical-border rounded-xl p-6 bg-nextm-gray/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold military-stencil text-military-amber">Deploy Mission</h3>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <span className="font-mono text-neon-green">READY TO DEPLOY</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="bg-military-dark border-military-tactical p-4">
            <h4 className="font-mono text-military-khaki font-bold mb-2">Experience URL</h4>
            <div className="flex items-center space-x-2">
              <Input 
                value="https://orbitdeck.app/mission/alpha-7" 
                readOnly 
                className="flex-1 bg-nextm-dark border-military-tactical text-gray-300 font-mono text-sm"
              />
              <Button size="sm" className="px-3 py-2 bg-military-tactical hover:bg-military-khaki hover:text-nextm-dark">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="bg-military-dark border-military-tactical p-4">
            <h4 className="font-mono text-military-khaki font-bold mb-2">Embed Code</h4>
            <Textarea 
              readOnly 
              value='<iframe src="https://orbitdeck.app/embed/mission-alpha-7" width="100%" height="600"></iframe>'
              className="w-full bg-nextm-dark border-military-tactical text-gray-300 font-mono text-xs h-20 resize-none"
            />
          </Card>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full p-4 bg-military-gradient text-nextm-dark font-bold military-stencil text-lg hover:scale-105 transition-transform neon-glow"
            onClick={() => window.location.href = '/orbit'}
          >
            <Rocket className="h-5 w-5 mr-2" />
            Begin Experience
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="p-3 border-military-tactical text-military-khaki hover:bg-military-dark">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" className="p-3 border-military-tactical text-military-khaki hover:bg-military-dark">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <Card className="bg-military-dark border-military-tactical p-4">
            <p className="text-xs text-gray-400 font-mono mb-2">BRANDING TIER: FREE</p>
            <p className="text-xs text-gray-500">OrbitDeck watermark will be displayed</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
