// wasmModule.ts

export interface WasmExports {
  processVideoFrame?: (input: Uint8Array) => Uint8Array;
  logPixelData?: (input: Uint8Array) => void;
  waka?: (message: string) => void;
}

export interface WasmModule {
  instance: WebAssembly.Instance;
  module: WebAssembly.Module;
  exports: WasmExports; // Ensure this matches the expected type
}

export async function initWasm(): Promise<WasmModule> {
  try {
    // Check if the glue JS file is already present
    let script = document.getElementById('wasm-glue-script') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.src = 'http://localhost:3002/video_processor.js'; // Adjust the path as necessary
      script.async = true;
      script.id = 'wasm-glue-script'; // Set an ID to identify the script element
      document.body.appendChild(script);

      // Wait for the glue JS file to load
      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log("Glue JS loaded");
          //resolve();
          setTimeout(resolve,0);
        };
        script.onerror = () => reject(new Error('Failed to load glue JS file'));
      });
    } else {
      // Ensure the script has loaded if it already exists
      await new Promise<void>((resolve) => {
        script.onload = () => {
          console.log("Glue JS already present, ensuring it's loaded");
          //resolve();
          setTimeout(resolve,0);
        };
      });
    }

    // Check if the Module object is defined
    if (typeof (window as any).Module === 'undefined') {
      throw new Error('Glue JS file did not define the expected Module object');
    }

    const Module = (window as any).Module;

    // Log the Module object to inspect its structure
    console.log("Module object:", Module);

    // Define default exports
    //const exports: WasmExports = {
    const exports: any = {
      processVideoFrame: typeof Module.processVideoFrame === 'function' ? Module.processVideoFrame : undefined,
      logPixelData: typeof Module.logPixelData === 'function' ? Module.logPixelData : undefined,
      waka: typeof Module.waka === 'function' ? Module.waka : undefined,
      myFunction: typeof Module._myFunction === 'function' ? Module._myFunction : undefined,
      main: typeof Module._main === 'function' ? Module._main : undefined,
    };

    // Return the WASM module with default values
    return {
      instance: Module as any,
      module: Module as any,
      exports,
    };
  } catch (error) {
    console.error('Failed to load or initialize WASM module:', error);
    throw error;
  }
}
