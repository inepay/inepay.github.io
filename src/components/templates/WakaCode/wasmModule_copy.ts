// wasmModule.ts
import { instantiate } from '@assemblyscript/loader';
(window as any).Module = {
  arguments: [],
  onRuntimeInitialized: function() {
      console.log('WebAssembly module is initialized and ready to use.');
  }
};

export async function initWasm() {
    // URL to your hosted 'video_processor.js' which should load the WASM file
    const wasmUrl = '/wasm/build/video_processor.js';

    // // Ensure Module is defined in the global scope
    // if (typeof Module === 'undefined') {
    //     (window as any).Module = {
    //         arguments: [],
    //         onRuntimeInitialized: function() {
    //             console.log('WebAssembly module is initialized and ready to use.');
    //         }
    //     };
    // }

    // Dynamically load the "glue" code that initializes the WASM module
    try {
        //const wasmModule = await import(wasmUrl);
        const wasmModule = await instantiate(fetch('/wasm/build/video_processor.wasm'));
        console.log('Module loaded successfully:', wasmModule);
        return wasmModule;
    } catch (error) {
        console.error('Failed to load the WASM module:', error);
        throw error;  // Rethrow the error to handle it in the calling code if necessary
    }
}
