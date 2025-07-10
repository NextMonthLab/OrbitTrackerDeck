export interface ContentItem {
  title: string;
  content: string;
  tags: string[];
  media?: string;
  gravity?: {
    related: string[];
    intensity: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  active?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  active?: boolean;
}

export interface OrbitNode {
  id: string;
  content: ContentItem;
  position: {
    x: number;
    y: number;
  };
  icon: string;
}
