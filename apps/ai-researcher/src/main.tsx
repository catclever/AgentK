import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Renderer } from '@agent-k/core';
import { SearchPanel, InfiniteBoard } from './components';
import { initMockData } from './mockData';
import homePageSpec from './pages/home.json';
import './index.css';

async function bootstrap() {
  await initMockData();
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  
  const App = () => {
    const [page] = useState<any>(homePageSpec);

    const context = {
      routeParams: {},
      global: {},
      state: {},
      navigate: (path: string) => console.log('Navigate to', path),
      // updateComponent is no longer needed here, as InfiniteBoard handles its own dynamic state.
    };

    return (
      <div className="w-full h-screen bg-[#0b1120] overflow-hidden">
        <Renderer 
          page={page} 
          components={{ SearchPanel, InfiniteBoard }} 
          context={context} 
          className="flex flex-col w-full h-full"
        />
      </div>
    );
  };

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
