import { ContentItem, Template, Theme } from './types';

export const MOCK_CONTENT: ContentItem[] = [
  { 
    title: "Mission Brief", 
    content: "Overview of the operation", 
    tags: ["intro", "context"] 
  },
  { 
    title: "Intel Report", 
    content: "Enemy movements and terrain", 
    tags: ["data", "threats"] 
  },
  { 
    title: "Extraction Plan", 
    content: "Steps for success", 
    tags: ["strategy", "action"] 
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'orbit',
    name: 'ORBIT',
    description: 'Radial UI with branching interactions',
    icon: 'crosshairs',
    active: true
  },
  {
    id: 'slidestory',
    name: 'SlideStory',
    description: 'Non-linear cinematic slides',
    icon: 'film'
  },
  {
    id: 'immersiondeck',
    name: 'ImmersionDeck',
    description: 'Scroll-based journey',
    icon: 'scroll'
  }
];

export const THEMES: Theme[] = [
  {
    id: 'military',
    name: 'MILITARY',
    description: 'Khaki, olive, tactical aesthetics',
    icon: 'shield-alt',
    colors: {
      primary: '#556B2F',
      secondary: '#F0E68C',
      accent: '#FFB000'
    },
    active: true
  },
  {
    id: 'ultra-modern',
    name: 'Ultra-Modern',
    description: 'Black/white/silver minimalism',
    icon: 'atom',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#C0C0C0'
    }
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Neon blues, matrix overlays',
    icon: 'microchip',
    colors: {
      primary: '#0080FF',
      secondary: '#00F5FF',
      accent: '#39FF14'
    }
  }
];
