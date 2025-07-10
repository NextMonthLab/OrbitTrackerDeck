import { ContentItem } from "./types";

export interface RawSlide {
  slideTitle: string;
  slideText: string;
}

export interface ClassificationResult {
  success: boolean;
  data?: ContentItem[];
  error?: string;
}

/**
 * Claude-powered slide classifier that transforms raw slide content
 * into OrbitDeck-ready JSON with titles, tags, and gravity relationships
 */
export class ClaudeSlideClassifier {
  
  /**
   * Main classification function that processes raw slides through Claude
   */
  static async classifySlidesWithClaude(slides: RawSlide[]): Promise<ClassificationResult> {
    try {
      // For now, we'll use a smart fallback classifier until Claude API is integrated
      const classifiedSlides = await this.smartFallbackClassifier(slides);
      
      return {
        success: true,
        data: classifiedSlides
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Classification failed'
      };
    }
  }

  /**
   * Smart fallback classifier that uses domain knowledge to generate
   * titles, tags, and gravity relationships
   */
  private static async smartFallbackClassifier(slides: RawSlide[]): Promise<ContentItem[]> {
    const classified: ContentItem[] = [];
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const cleanTitle = this.cleanTitle(slide.slideTitle);
      const tags = this.generateTags(slide.slideText, cleanTitle);
      const gravity = this.generateGravityRelationships(slide, slides, i);
      
      classified.push({
        title: cleanTitle,
        content: slide.slideText,
        tags,
        gravity
      });
    }
    
    return classified;
  }

  /**
   * Clean and improve slide titles
   */
  private static cleanTitle(title: string): string {
    // Remove common prefixes and clean up
    let cleaned = title
      .replace(/^slide\s*\d+:?\s*/i, '')
      .replace(/^\d+\.?\s*/, '')
      .replace(/^-\s*/, '')
      .trim();
    
    // If title is generic or empty, generate a descriptive one
    if (!cleaned || cleaned.length < 3 || /^(slide|page|section)$/i.test(cleaned)) {
      cleaned = 'Content Section';
    }
    
    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    
    return cleaned;
  }

  /**
   * Generate relevant tags based on content analysis
   */
  private static generateTags(content: string, title: string): string[] {
    const text = (content + ' ' + title).toLowerCase();
    const tags: string[] = [];
    
    // Business/Product tags
    if (text.match(/product|demo|feature|solution|platform/)) tags.push('product');
    if (text.match(/pricing|price|cost|plan|tier|subscription/)) tags.push('pricing');
    if (text.match(/customer|client|user|testimonial|review/)) tags.push('customer');
    if (text.match(/contact|support|help|question|email|phone/)) tags.push('contact');
    if (text.match(/about|company|team|history|mission|vision/)) tags.push('company');
    if (text.match(/service|offering|solution|capability/)) tags.push('service');
    
    // Content type tags
    if (text.match(/overview|introduction|welcome|start|begin/)) tags.push('overview');
    if (text.match(/conclusion|summary|end|final|wrap/)) tags.push('conclusion');
    if (text.match(/demo|example|showcase|illustration/)) tags.push('demo');
    if (text.match(/benefit|advantage|value|why|reason/)) tags.push('benefits');
    if (text.match(/feature|capability|function|tool|option/)) tags.push('features');
    if (text.match(/how|process|step|guide|tutorial/)) tags.push('process');
    
    // Technical tags
    if (text.match(/api|integration|technical|development|code/)) tags.push('technical');
    if (text.match(/security|privacy|compliance|safe|protect/)) tags.push('security');
    if (text.match(/analytics|data|report|metric|insight/)) tags.push('analytics');
    
    // Ensure we have at least 2 tags
    if (tags.length === 0) {
      tags.push('content', 'information');
    } else if (tags.length === 1) {
      tags.push('information');
    }
    
    return tags.slice(0, 5); // Max 5 tags
  }

  /**
   * Generate gravity relationships based on content flow and logical connections
   */
  private static generateGravityRelationships(
    currentSlide: RawSlide, 
    allSlides: RawSlide[], 
    currentIndex: number
  ): { related: string[]; intensity: number } {
    const related: string[] = [];
    const currentContent = (currentSlide.slideText + ' ' + currentSlide.slideTitle).toLowerCase();
    
    // Score all other slides for relevance
    const scores = allSlides.map((slide, index) => {
      if (index === currentIndex) return { index, score: 0, title: slide.slideTitle };
      
      const slideContent = (slide.slideText + ' ' + slide.slideTitle).toLowerCase();
      let score = 0;
      
      // Logical flow patterns
      if (currentContent.match(/introduction|overview|welcome/) && 
          slideContent.match(/feature|product|demo|benefit/)) score += 3;
      
      if (currentContent.match(/feature|product|demo/) && 
          slideContent.match(/pricing|cost|plan/)) score += 3;
      
      if (currentContent.match(/pricing|cost/) && 
          slideContent.match(/contact|support|question/)) score += 3;
      
      if (currentContent.match(/benefit|advantage/) && 
          slideContent.match(/demo|example|how/)) score += 2;
      
      // Sequential flow bonus
      if (Math.abs(index - currentIndex) === 1) score += 1;
      
      // Content similarity
      const currentTags = this.generateTags(currentSlide.slideText, currentSlide.slideTitle);
      const slideTags = this.generateTags(slide.slideText, slide.slideTitle);
      const sharedTags = currentTags.filter(tag => slideTags.includes(tag));
      score += sharedTags.length;
      
      return { index, score, title: this.cleanTitle(slide.slideTitle) };
    });
    
    // Get top 3 related slides
    const topRelated = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(item => item.score > 0);
    
    related.push(...topRelated.map(item => item.title));
    
    // Calculate intensity based on content richness and relationships
    const intensity = Math.min(0.9, 
      (currentSlide.slideText.length / 500) * 0.3 + 
      (related.length / 3) * 0.4 + 
      0.3
    );
    
    return { related, intensity };
  }

  /**
   * Generate Claude prompt for manual classification
   */
  static generateClaudePrompt(slides: RawSlide[]): string {
    const slidesText = slides.map((slide, i) => 
      `Slide ${i + 1}: ${slide.slideTitle}\n${slide.slideText}`
    ).join('\n\n---\n\n');
    
    return `Please analyze these slides and return a JSON array with enhanced metadata for each slide.

For each slide, provide:
- title: Clean, descriptive title (improve if needed)
- content: The original slide text
- tags: 2-5 relevant tags
- gravity: object with "related" array of 3 slide titles that would logically follow this slide, and "intensity" score (0-1)

Slides to analyze:
${slidesText}

Return only the JSON array, no other text.`;
  }
}

/**
 * Hook for using the Claude classifier in React components
 */
export function useClaudeClassifier() {
  const classifySlides = async (slides: RawSlide[]) => {
    return await ClaudeSlideClassifier.classifySlidesWithClaude(slides);
  };

  const generatePrompt = (slides: RawSlide[]) => {
    return ClaudeSlideClassifier.generateClaudePrompt(slides);
  };

  return {
    classifySlides,
    generatePrompt
  };
}