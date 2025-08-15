import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import WasmProvider from './components/templates/WakaCode';
//import App from './App';
import reportWebVitals from './reportWebVitals';
//import { ModelProvider } from './poc/ModelContext'
//import VideoCanvasProvider from './components/templates/VideoCanvasProvider';
//import HolisticDrawing from './components/organisms/HolisticDrawing';
import Scene from './components/molecules/Scene';
import HatModel from './components/organisms/HatModel';

import VideoCanvasProvider from './components/templates/VideoCanvasProviderFaceMesh';
import HolisticDrawing from './components/organisms/FaceMeshDrawing';
 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <ModelProvider>
      <App />
    </ModelProvider> */}
    <WasmProvider>
      <VideoCanvasProvider>
      {({ videoRef, canvasRef, subscribe, unsubscribe }) => (
          <div className="holistic-container">
            <video ref={videoRef} className="input_video" autoPlay muted playsInline></video>
            <canvas ref={canvasRef} className="output_canvas" width={640} height={480}></canvas>
            <Scene videoRef={videoRef} className="three-canvas" style={{ width: '640px', height: '480px', border: '1px solid black' }}>
              <HatModel videoRef={videoRef} subscribe={subscribe} unsubscribe={unsubscribe} />
            </Scene>
            <HolisticDrawing videoRef={videoRef} canvasRef={canvasRef} subscribe={subscribe} unsubscribe={unsubscribe} />
          </div>
        )}
      </VideoCanvasProvider>
    </WasmProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
