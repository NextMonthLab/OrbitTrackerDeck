import { useState, useEffect } from "react";
import { ContentItem } from "@/lib/types";

interface OnboardingState {
  currentStep: number;
  content: ContentItem[];
  selectedTemplate: string;
  selectedTheme: string;
  isClassified: boolean;
  isPublished: boolean;
}

const STORAGE_KEY = 'orbitdeck-onboarding';

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    content: [],
    selectedTemplate: "orbit",
    selectedTheme: "military",
    isClassified: false,
    isPublished: false
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only restore if the session is recent (last 24 hours)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setState(prev => ({ ...prev, ...parsed.state }));
        }
      }
    } catch (error) {
      console.warn('Failed to load onboarding state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        state,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save onboarding state:', error);
    }
  }, [state]);

  const updateState = (updates: Partial<OnboardingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState({
      currentStep: 1,
      content: [],
      selectedTemplate: "orbit",
      selectedTheme: "military",
      isClassified: false,
      isPublished: false
    });
    localStorage.removeItem(STORAGE_KEY);
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

  return {
    state,
    updateState,
    resetState,
    canProceed
  };
}