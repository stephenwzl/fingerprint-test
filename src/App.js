
import { useEffect, useState } from 'react';
import { getCanvasFingerPrint, getDeviceInfo, getWebGLFingerPrint } from './fingerprint';
import WebGLInfo from './fingerprint/webgl';

function App() {
  const [canvasFinger, _] = useState(getCanvasFingerPrint());
  const [deviceInfo, __] = useState(getDeviceInfo());
  const [webglInfo, setWebGLInfo] = useState({});
  useEffect(() => {
    getWebGLFingerPrint().then((res) => {
      setWebGLInfo(res);
    });
  }, []);
  return (
    <div className="App" style={{width:'100%', overflow:'hidden'}}>
      <h1>{navigator.getBattery()}</h1>
      <pre style={{ overflow: 'auto', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
        {JSON.stringify({
          canvasFinger, deviceInfo, webglInfo
        }, null, 4)}
      </pre>
    </div>
  );
}

export default App;
