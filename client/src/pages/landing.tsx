import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import { 
  Upload, 
  Brain, 
  Palette, 
  Rocket,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <OnboardingWizard onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 px-4 py-2 text-sm bg-purple-500/20 text-purple-300 border-purple-500/30">
              ✨ AI-Powered Presentation Builder
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Transform Static Slides into 
              <span className="block text-purple-400">Smart, Cinematic Stories</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              OrbitDeck makes your pitch unforgettable with interactive web experiences 
              powered by AI and design logic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
                onClick={() => setShowOnboarding(true)}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See OrbitDeck in Action
            </h2>
            <p className="text-gray-400 text-lg">
              Experience the interactive orbit template with real content
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <Card className="bg-gray-900/50 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-lg">Interactive Demo Coming Soon</p>
                  <p className="text-gray-500 text-sm mt-2">Live orbit experience with military theme</p>
                </div>
              </div>
              
              <div className="p-6 bg-gray-900/80 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Military Mission Briefing</h3>
                    <p className="text-gray-400 text-sm">6 interactive nodes • Gravity-based navigation</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Play className="h-4 w-4 mr-1" />
                    Launch
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Create Magic
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features that make professional presentations effortless
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Upload,
                title: "Drag & Drop Upload",
                description: "Upload PowerPoint, ZIP folders, or create from scratch",
                color: "blue"
              },
              {
                icon: Brain,
                title: "Claude-Powered Logic",
                description: "AI automatically creates tags, titles, and story flow",
                color: "purple"
              },
              {
                icon: Palette,
                title: "3 Premium Themes",
                description: "Military, Ultra-Modern, and Technology designs",
                color: "green"
              },
              {
                icon: Rocket,
                title: "Ready in Minutes",
                description: "Share links instantly or embed anywhere",
                color: "orange"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-700 p-6 h-full hover:bg-gray-800/50 transition-colors">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                    feature.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, upgrade when you need more power
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                features: [
                  "3 presentations per month",
                  "All templates & themes",
                  "Claude AI classification",
                  "OrbitDeck watermark"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Starter",
                price: "$19",
                features: [
                  "Unlimited presentations",
                  "Remove watermarks",
                  "Custom branding",
                  "Priority support"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Pro",
                price: "$49",
                features: [
                  "Everything in Starter",
                  "White-label export",
                  "Custom domains",
                  "Analytics dashboard"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <Card className={`p-6 h-full relative ${
                  plan.popular 
                    ? 'bg-purple-900/20 border-purple-500' 
                    : 'bg-gray-900/50 border-gray-700'
                }`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white">
                      {plan.price}<span className="text-lg text-gray-400">/month</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setShowOnboarding(true)}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Presentations?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of creators making unforgettable experiences with OrbitDeck
            </p>
            
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-xl"
              onClick={() => setShowOnboarding(true)}
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Start Building Now
            </Button>
            
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • 3 free presentations
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}