import { useCallback, useState, type SetStateAction } from 'react';

import type { LayerKey } from '../types/map.types';

const DEFAULT_LAYERS: LayerKey[] = ['areaRatings'];

export function useMapLayers() {
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    () => new Set(DEFAULT_LAYERS)
  );

  const toggleLayer = useCallback((layer: LayerKey) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  }, []);

  const setLayers = useCallback((update: SetStateAction<Set<LayerKey>>) => {
    setActiveLayers(update);
  }, []);

  return { activeLayers, toggleLayer, setLayers };
}
