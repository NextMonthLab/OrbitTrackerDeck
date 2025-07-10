import { ContentItem } from "@/lib/types";

export interface GravityResult {
  reorderedContent: ContentItem[];
  suggestedNext: ContentItem[];
}

export class GravityEngine {
  /**
   * Analyzes content relationships and returns gravity-ordered suggestions
   */
  static getSuggestedNext(currentContent: ContentItem, allContent: ContentItem[]): ContentItem[] {
    // First try to use gravity.related if available
    if (currentContent.gravity?.related) {
      const relatedByGravity = currentContent.gravity.related
        .map(title => allContent.find(item => item.title === title))
        .filter(Boolean) as ContentItem[];
      
      if (relatedByGravity.length > 0) {
        return relatedByGravity.slice(0, 3);
      }
    }

    // Fallback to tag-based matching
    return this.getTagBasedSuggestions(currentContent, allContent);
  }

  /**
   * Reorders orbit content based on gravity relationships
   */
  static reorderByGravity(currentContent: ContentItem, allContent: ContentItem[]): ContentItem[] {
    const suggested = this.getSuggestedNext(currentContent, allContent);
    const suggestedTitles = suggested.map(item => item.title);
    
    // Separate content into gravity-related and others
    const gravityRelated = allContent.filter(item => 
      suggestedTitles.includes(item.title) && item.title !== currentContent.title
    );
    
    const others = allContent.filter(item => 
      !suggestedTitles.includes(item.title) && item.title !== currentContent.title
    );

    // Return reordered: current, then gravity-related, then others
    return [currentContent, ...gravityRelated, ...others];
  }

  /**
   * Tag-based fallback logic
   */
  private static getTagBasedSuggestions(currentContent: ContentItem, allContent: ContentItem[]): ContentItem[] {
    return allContent
      .filter(item => item.title !== currentContent.title)
      .map(item => ({
        ...item,
        relevance: this.calculateTagRelevance(currentContent.tags, item.tags)
      }))
      .sort((a: any, b: any) => b.relevance - a.relevance)
      .slice(0, 3)
      .map(({ relevance, ...item }) => item as ContentItem);
  }

  /**
   * Calculate relevance score based on tag overlap
   */
  private static calculateTagRelevance(currentTags: string[], itemTags: string[]): number {
    const overlap = itemTags.filter(tag => currentTags.includes(tag)).length;
    const totalUnique = new Set([...currentTags, ...itemTags]).size;
    
    // Weighted score: overlap importance + inverse total diversity
    return overlap * 2 + (overlap / totalUnique);
  }

  /**
   * Generate Claude-enhanced gravity data for content
   * This would typically call an AI service to analyze content relationships
   */
  static async enhanceWithClaudeGravity(content: ContentItem[]): Promise<ContentItem[]> {
    // For now, return smart fallback relationships based on domain knowledge
    return content.map(item => ({
      ...item,
      gravity: this.generateSmartGravity(item, content)
    }));
  }

  /**
   * Smart gravity generation based on content analysis
   */
  private static generateSmartGravity(item: ContentItem, allContent: ContentItem[]): { related: string[]; intensity: number } {
    const title = item.title.toLowerCase();
    const tags = item.tags.join(' ').toLowerCase();
    
    // Domain-specific relationship rules for military/tactical content
    const relationshipRules: Record<string, string[]> = {
      'mission brief': ['Intel Report', 'Equipment Loadout', 'Communication Protocol'],
      'intel report': ['Extraction Plan', 'Equipment Loadout', 'Rules of Engagement'],
      'extraction plan': ['Communication Protocol', 'Equipment Loadout', 'Intel Report'],
      'equipment loadout': ['Mission Brief', 'Rules of Engagement', 'Communication Protocol'],
      'communication protocol': ['Mission Brief', 'Extraction Plan', 'Rules of Engagement'],
      'rules of engagement': ['Intel Report', 'Equipment Loadout', 'Communication Protocol']
    };

    // Find matching rule or use tag-based relationships
    const related = relationshipRules[title] || 
      allContent
        .filter(other => other.title !== item.title)
        .filter(other => other.tags.some(tag => item.tags.includes(tag)))
        .map(other => other.title)
        .slice(0, 3);

    // Calculate intensity based on tag density and content length
    const intensity = Math.min(0.9, (item.tags.length * 0.2) + (item.content.length / 1000 * 0.3) + 0.3);

    return {
      related: related.slice(0, 3),
      intensity
    };
  }
}