// ModelContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';

interface ModelContextType {
  model: facemesh.FaceMesh | null;
}

interface ModelProviderProps {
  children: ReactNode;  // Define children here
}
const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const [model, setModel] = useState<facemesh.FaceMesh | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        const loadedModel = await facemesh.load();
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load the FaceMesh model:", error);
      }
    };

    loadModel();
  }, []);

  return (
    <ModelContext.Provider value={{ model }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context.model;
};
