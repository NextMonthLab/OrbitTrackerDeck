import { lazy } from 'react';

// Lazy load pages for better performance
export const LazyHome = lazy(() => import('./home'));
export const LazyLanding = lazy(() => import('./landing'));
export const LazyOrbit = lazy(() => import('./orbit'));
export const LazyOrbitProduction = lazy(() => import('./orbit-production'));
export const LazyNotFound = lazy(() => import('./not-found'));