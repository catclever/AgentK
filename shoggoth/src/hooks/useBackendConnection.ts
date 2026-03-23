import { useState, useEffect } from 'react';

// Maps project names to their expected local dev server ports
// Since demo-app usually occupies 5174 when shoggoth takes 5173
const APP_PORTS: Record<string, string> = {
  'demo-app': '5174',
  'todo-app': '5175'
};

export function useBackendConnection(projectName: string, terminal: any) {
  const [serverUrl, setServerUrl] = useState<string>('');
  
  useEffect(() => {
    // 1. Establish the connection URL to the local dev server
    const port = APP_PORTS[projectName] || '5174';
    const url = `http://localhost:${port}`;
    setServerUrl(url);

    if (terminal) {
      terminal.write(`\\r\\n[Agent K Bridge] Connected to local environment: ${url}\\r\\n`);
      terminal.write(`[Agent K Bridge] Assuming \`npm run dev:demo\` is running...\\r\\n`);
    }

    // 2. Here we could hook up a WebSocket to receive terminal logs from 
    // the local dev server, but for Phase 1 we just assume it's running.

  }, [projectName, terminal]);

  return { serverUrl };
}
