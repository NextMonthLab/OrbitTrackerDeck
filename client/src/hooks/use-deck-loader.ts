import { useState, useEffect } from 'react';
import { ContentItem } from '@/lib/types';
import { MOCK_CONTENT } from '@/lib/constants';

export function useDeckLoader() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeck = async (source?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Default to public deck.json
      const url = source || '/deck.json';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load deck: ${response.statusText}`);
      }
      
      const responseText = await response.text();
      
      // Check if response is HTML (indicating routing issue)
      if (responseText.trim().startsWith('<!DOCTYPE html>')) {
        console.warn('Received HTML instead of JSON, using mock data');
        setContent(MOCK_CONTENT);
        return;
      }
      
      const data = JSON.parse(responseText);
      
      // Validate content structure
      if (!Array.isArray(data)) {
        throw new Error('Deck must be an array of content items');
      }
      
      // Validate each item has required fields
      for (const item of data) {
        if (!item.title || !item.content || !Array.isArray(item.tags)) {
          throw new Error('Each content item must have title, content, and tags array');
        }
      }
      
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
      console.error('Deck loading error:', err);
      // Fallback to mock data on error
      setContent(MOCK_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  const loadFromJSON = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      setContent(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const loadFromFile = async (file: File) => {
    try {
      setLoading(true);
      const text = await file.text();
      
      if (file.name.endsWith('.json')) {
        loadFromJSON(text);
      } else if (file.name.endsWith('.pptx')) {
        // TODO: Implement PowerPoint parsing
        setError('PowerPoint parsing not yet implemented');
      } else {
        setError('Unsupported file format');
      }
    } catch (err) {
      setError('Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  // Load default deck on mount
  useEffect(() => {
    loadDeck();
  }, []);

  const loadFromParsedContent = (parsedContent: ContentItem[]) => {
    try {
      setLoading(true);
      setContent(parsedContent);
      setError(null);
    } catch (err) {
      setError('Failed to load parsed content');
    } finally {
      setLoading(false);
    }
  };

  return {
    content,
    loading,
    error,
    loadDeck,
    loadFromJSON,
    loadFromFile,
    loadFromParsedContent,
    reload: () => loadDeck()
  };
}