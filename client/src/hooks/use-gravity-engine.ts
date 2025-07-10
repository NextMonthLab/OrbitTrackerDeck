import { useState, useEffect } from "react";
import { ContentItem } from "@/lib/types";

export interface GravitySlide extends ContentItem {
  relevance?: number;
  gravityRank?: number;
}

export function useGravityEngine(currentSlide: ContentItem | null, allSlides: ContentItem[]) {
  const [suggestedNext, setSuggestedNext] = useState<ContentItem[]>([]);
  const [reorderedSlides, setReorderedSlides] = useState<GravitySlide[]>([]);

  useEffect(() => {
    if (!currentSlide || allSlides.length === 0) {
      setSuggestedNext([]);
      setReorderedSlides(allSlides);
      return;
    }

    const suggestions = getSuggestedNext(currentSlide, allSlides);
    const reordered = reorderSlidesByGravity(currentSlide, allSlides);
    
    setSuggestedNext(suggestions);
    setReorderedSlides(reordered);
  }, [currentSlide, allSlides]);

  return {
    suggestedNext,
    reorderedSlides,
    getSuggestedNext: (slide: ContentItem) => getSuggestedNext(slide, allSlides),
    reorderSlidesByGravity: (slide: ContentItem) => reorderSlidesByGravity(slide, allSlides)
  };
}

function getSuggestedNext(current: ContentItem, all: ContentItem[]): ContentItem[] {
  // Use gravity.related if available
  if (current.gravity?.related?.length) {
    return all.filter(slide =>
      current.gravity!.related!.includes(slide.title)
    ).slice(0, 3);
  }

  // Fallback to tag-based matching
  return all
    .filter(slide => slide.title !== current.title)
    .map(slide => ({
      ...slide,
      relevance: slide.tags.filter(tag =>
        current.tags.includes(tag)
      ).length
    }))
    .sort((a: any, b: any) => b.relevance - a.relevance)
    .slice(0, 3)
    .map(({ relevance, ...slide }) => slide as ContentItem);
}

function reorderSlidesByGravity(current: ContentItem, all: ContentItem[]): GravitySlide[] {
  const otherSlides = all.filter(slide => slide.title !== current.title);
  
  // Calculate gravity rank for each slide
  const rankedSlides = otherSlides.map((slide, index) => {
    let gravityRank = 0;
    
    // Higher rank for gravity.related matches
    if (current.gravity?.related?.includes(slide.title)) {
      gravityRank = 10;
    } else {
      // Tag-based relevance
      const sharedTags = slide.tags.filter(tag => current.tags.includes(tag)).length;
      gravityRank = sharedTags * 2;
    }
    
    return {
      ...slide,
      gravityRank,
      relevance: gravityRank
    };
  });

  // Sort by gravity rank (highest first)
  return rankedSlides.sort((a, b) => b.gravityRank - a.gravityRank);
}