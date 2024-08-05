// src/WasmContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initWasm, WasmModule } from './wasmModule';

interface WasmContextProps {
  wasmModule?: WasmModule; // This matches the context's expected structure
}

// const WasmContext = createContext<WasmContextProps>({}); // Default context value
const WasmContext = createContext<any>({}); // Default context value

interface WasmProviderProps {
  children: React.ReactNode;
}

export const WasmProvider: React.FC<WasmProviderProps> = ({ children }) => {
  const [wasmModule, setWasmModule] = useState<WasmModule | undefined>(undefined);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const module = await initWasm();
        setWasmModule(module);
      } catch (error) {
        console.error('Error loading WASM module:', error);
      }
    };

    loadWasm();
  }, []);

  // Ensure that the context value matches WasmContextProps
  return (
    <WasmContext.Provider value={{ wasmModule }}> {/* Wrap wasmModule in an object */}
      {children}
    </WasmContext.Provider>
  );
};

export default WasmProvider;
export const useWasm = () => useContext(WasmContext);
